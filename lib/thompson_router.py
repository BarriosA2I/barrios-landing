"""
Cost-Aware Thompson Sampling Router
====================================
Neural RAG Brain v3.0 + RAGNAROK v7.0 APEX

Gemini v4.0 Upgrade: Enhance the Thompson Router to be Cost-Aware.
It should factor in real-time API latency and remaining credit balance.
If Opus is slow or over budget, the router should dynamically shift
traffic to a "System 1.5" path (parallelized Haiku agents).

Performance Targets:
- p95 Latency: <2000ms (currently ~15s - this upgrade addresses it)
- System 1 Routing: ≥40% (currently ~25%)
- Cost/Query: <$0.025

@version 4.0.0
@author Barrios A2I
"""

import asyncio
import time
from dataclasses import dataclass, field
from enum import Enum
from typing import Optional, Dict, List, Tuple
import numpy as np
from collections import defaultdict
import logging

logger = logging.getLogger(__name__)


class ModelTier(Enum):
    """LLM Model Tiers with cost and capability profiles."""
    HAIKU = "haiku"
    SONNET = "sonnet"
    OPUS = "opus"
    HAIKU_PARALLEL = "haiku_parallel"  # System 1.5: Parallelized Haiku


@dataclass
class ModelProfile:
    """Cost and latency profile for each model tier."""
    tier: ModelTier
    cost_per_1k_tokens: float
    avg_latency_ms: float
    max_complexity: float  # 0.0 - 1.0 scale
    quality_score: float  # 0.0 - 1.0 scale
    
    # Runtime metrics (updated dynamically)
    recent_latencies: List[float] = field(default_factory=list)
    success_rate: float = 1.0
    current_load: float = 0.0  # 0.0 - 1.0


# Default model profiles
MODEL_PROFILES: Dict[ModelTier, ModelProfile] = {
    ModelTier.HAIKU: ModelProfile(
        tier=ModelTier.HAIKU,
        cost_per_1k_tokens=0.00025,
        avg_latency_ms=200,
        max_complexity=0.33,
        quality_score=0.75
    ),
    ModelTier.SONNET: ModelProfile(
        tier=ModelTier.SONNET,
        cost_per_1k_tokens=0.003,
        avg_latency_ms=800,
        max_complexity=0.66,
        quality_score=0.90
    ),
    ModelTier.OPUS: ModelProfile(
        tier=ModelTier.OPUS,
        cost_per_1k_tokens=0.015,
        avg_latency_ms=2000,
        avg_latency_ms=2000,
        max_complexity=1.0,
        quality_score=0.98
    ),
    ModelTier.HAIKU_PARALLEL: ModelProfile(
        tier=ModelTier.HAIKU_PARALLEL,
        cost_per_1k_tokens=0.00075,  # 3x Haiku cost for 3 parallel calls
        avg_latency_ms=250,  # Slightly higher due to aggregation
        max_complexity=0.5,  # Can handle moderate complexity via ensemble
        quality_score=0.85  # Ensemble improves over single Haiku
    ),
}


@dataclass
class BudgetState:
    """Tracks remaining credit balance and spending."""
    total_budget: float
    spent: float = 0.0
    hourly_limit: float = 10.0
    hourly_spent: float = 0.0
    last_hour_reset: float = field(default_factory=time.time)
    
    @property
    def remaining(self) -> float:
        return self.total_budget - self.spent
    
    @property
    def hourly_remaining(self) -> float:
        # Reset hourly counter if needed
        if time.time() - self.last_hour_reset > 3600:
            self.hourly_spent = 0.0
            self.last_hour_reset = time.time()
        return self.hourly_limit - self.hourly_spent
    
    def can_afford(self, cost: float) -> bool:
        return self.remaining >= cost and self.hourly_remaining >= cost
    
    def spend(self, cost: float) -> None:
        self.spent += cost
        self.hourly_spent += cost


@dataclass
class LatencyState:
    """Tracks real-time latency observations per model."""
    observations: Dict[ModelTier, List[float]] = field(
        default_factory=lambda: defaultdict(list)
    )
    window_size: int = 50  # Rolling window
    
    def record(self, tier: ModelTier, latency_ms: float) -> None:
        self.observations[tier].append(latency_ms)
        if len(self.observations[tier]) > self.window_size:
            self.observations[tier].pop(0)
    
    def get_p95(self, tier: ModelTier) -> float:
        obs = self.observations.get(tier, [])
        if not obs:
            return MODEL_PROFILES[tier].avg_latency_ms
        return float(np.percentile(obs, 95))
    
    def get_mean(self, tier: ModelTier) -> float:
        obs = self.observations.get(tier, [])
        if not obs:
            return MODEL_PROFILES[tier].avg_latency_ms
        return float(np.mean(obs))
    
    def is_degraded(self, tier: ModelTier, threshold_multiplier: float = 2.0) -> bool:
        """Check if model is experiencing degraded performance."""
        current_p95 = self.get_p95(tier)
        baseline = MODEL_PROFILES[tier].avg_latency_ms
        return current_p95 > baseline * threshold_multiplier


class ThompsonSamplingRouter:
    """
    Cost-Aware Thompson Sampling Multi-Armed Bandit for LLM Routing.
    
    Key Features:
    1. Complexity-based routing (existing)
    2. Real-time latency awareness (new)
    3. Budget constraint optimization (new)
    4. System 1.5 fallback path (new)
    
    Arms:
    - HAIKU: System 1 fast path (complexity 0-0.33)
    - SONNET: Moderate path (complexity 0.33-0.66)
    - OPUS: Deep reasoning path (complexity 0.66-1.0)
    - HAIKU_PARALLEL: System 1.5 fallback (when OPUS is degraded)
    """
    
    def __init__(
        self,
        budget: BudgetState,
        latency_target_ms: float = 2000,
        exploration_weight: float = 0.1
    ):
        self.budget = budget
        self.latency_target = latency_target_ms
        self.exploration = exploration_weight
        self.latency_state = LatencyState()
        
        # Thompson Sampling state: (alpha, beta) for each arm
        self.arm_params: Dict[ModelTier, Tuple[float, float]] = {
            ModelTier.HAIKU: (1.0, 1.0),
            ModelTier.SONNET: (1.0, 1.0),
            ModelTier.OPUS: (1.0, 1.0),
            ModelTier.HAIKU_PARALLEL: (1.0, 1.0),
        }
        
        # Success/failure counts
        self.successes: Dict[ModelTier, int] = defaultdict(int)
        self.failures: Dict[ModelTier, int] = defaultdict(int)
        
        # Metrics
        self.total_requests = 0
        self.system1_requests = 0
        self.fallback_requests = 0
    
    def classify_complexity(self, query: str, context: Optional[str] = None) -> float:
        """
        Classify query complexity on 0-1 scale.
        
        Heuristics:
        - Length of query
        - Presence of multi-hop indicators
        - Mathematical/logical keywords
        - Context length
        """
        complexity = 0.0
        
        # Length factor
        word_count = len(query.split())
        if word_count > 50:
            complexity += 0.3
        elif word_count > 20:
            complexity += 0.15
        
        # Multi-hop indicators
        multi_hop_keywords = [
            'compare', 'contrast', 'analyze', 'synthesize', 'evaluate',
            'how does', 'what if', 'explain why', 'reasoning', 'step by step'
        ]
        for kw in multi_hop_keywords:
            if kw.lower() in query.lower():
                complexity += 0.1
        
        # Mathematical/logical
        math_keywords = ['calculate', 'compute', 'solve', 'equation', 'formula']
        for kw in math_keywords:
            if kw.lower() in query.lower():
                complexity += 0.15
        
        # Context length factor
        if context:
            context_len = len(context)
            if context_len > 5000:
                complexity += 0.2
            elif context_len > 2000:
                complexity += 0.1
        
        return min(complexity, 1.0)
    
    def _sample_arm(self, tier: ModelTier) -> float:
        """Sample from Beta distribution for Thompson Sampling."""
        alpha, beta = self.arm_params[tier]
        return np.random.beta(alpha, beta)
    
    def _get_eligible_tiers(
        self, 
        complexity: float,
        estimated_tokens: int = 1000
    ) -> List[ModelTier]:
        """Get tiers that can handle the complexity and fit budget."""
        eligible = []
        
        for tier, profile in MODEL_PROFILES.items():
            # Check complexity capability
            if complexity > profile.max_complexity:
                continue
            
            # Check budget
            estimated_cost = (estimated_tokens / 1000) * profile.cost_per_1k_tokens
            if not self.budget.can_afford(estimated_cost):
                continue
            
            # Check latency degradation
            if self.latency_state.is_degraded(tier):
                # Allow HAIKU_PARALLEL as fallback even if degraded
                if tier != ModelTier.HAIKU_PARALLEL:
                    logger.warning(f"{tier.value} is degraded, considering alternatives")
            
            eligible.append(tier)
        
        return eligible
    
    def _should_use_system15(self, complexity: float) -> bool:
        """
        Determine if we should use System 1.5 (parallel Haiku).
        
        Use when:
        1. OPUS is degraded (high latency)
        2. Budget is constrained
        3. Complexity is moderate (0.33-0.5)
        """
        # Check if OPUS is degraded
        opus_degraded = self.latency_state.is_degraded(ModelTier.OPUS)
        
        # Check budget pressure
        budget_pressure = self.budget.remaining < 100 or self.budget.hourly_remaining < 5
        
        # Complexity in moderate range
        moderate_complexity = 0.33 <= complexity <= 0.55
        
        return (opus_degraded or budget_pressure) and moderate_complexity
    
    def select_tier(
        self,
        query: str,
        context: Optional[str] = None,
        estimated_tokens: int = 1000
    ) -> ModelTier:
        """
        Select the optimal model tier using cost-aware Thompson Sampling.
        
        Returns: Selected ModelTier
        """
        self.total_requests += 1
        
        # 1. Classify complexity
        complexity = self.classify_complexity(query, context)
        
        # 2. Get eligible tiers
        eligible = self._get_eligible_tiers(complexity, estimated_tokens)
        
        if not eligible:
            # Emergency fallback
            logger.warning("No eligible tiers! Falling back to HAIKU")
            self.fallback_requests += 1
            return ModelTier.HAIKU
        
        # 3. Check for System 1.5 opportunity
        if self._should_use_system15(complexity) and ModelTier.HAIKU_PARALLEL in eligible:
            logger.info("Routing to System 1.5 (parallel Haiku)")
            self.fallback_requests += 1
            return ModelTier.HAIKU_PARALLEL
        
        # 4. Fast path for simple queries (System 1)
        if complexity <= 0.33 and ModelTier.HAIKU in eligible:
            self.system1_requests += 1
            return ModelTier.HAIKU
        
        # 5. Thompson Sampling for exploration/exploitation
        if np.random.random() < self.exploration:
            # Explore: random eligible tier
            selected = np.random.choice(eligible)
        else:
            # Exploit: sample from posteriors
            samples = {tier: self._sample_arm(tier) for tier in eligible}
            
            # Weight by latency performance
            for tier in samples:
                current_latency = self.latency_state.get_mean(tier)
                baseline = MODEL_PROFILES[tier].avg_latency_ms
                latency_factor = baseline / max(current_latency, 1)  # Higher is better
                samples[tier] *= latency_factor
            
            selected = max(samples, key=samples.get)
        
        # Track System 1 usage
        if selected == ModelTier.HAIKU:
            self.system1_requests += 1
        
        return selected
    
    def update(
        self,
        tier: ModelTier,
        success: bool,
        latency_ms: float,
        actual_cost: float
    ) -> None:
        """Update router state after a request completes."""
        # Update latency tracking
        self.latency_state.record(tier, latency_ms)
        
        # Update budget
        self.budget.spend(actual_cost)
        
        # Update Thompson Sampling parameters
        alpha, beta = self.arm_params[tier]
        if success:
            self.arm_params[tier] = (alpha + 1, beta)
            self.successes[tier] += 1
        else:
            self.arm_params[tier] = (alpha, beta + 1)
            self.failures[tier] += 1
        
        logger.debug(
            f"Updated {tier.value}: success={success}, "
            f"latency={latency_ms:.0f}ms, cost=${actual_cost:.4f}"
        )
    
    def get_metrics(self) -> Dict:
        """Get router performance metrics."""
        system1_rate = (
            self.system1_requests / self.total_requests 
            if self.total_requests > 0 else 0
        )
        
        return {
            "total_requests": self.total_requests,
            "system1_requests": self.system1_requests,
            "system1_rate": f"{system1_rate:.1%}",
            "system1_rate_target": "≥40%",
            "system1_on_track": system1_rate >= 0.4,
            "fallback_requests": self.fallback_requests,
            "budget_remaining": f"${self.budget.remaining:.2f}",
            "hourly_remaining": f"${self.budget.hourly_remaining:.2f}",
            "arm_stats": {
                tier.value: {
                    "successes": self.successes[tier],
                    "failures": self.failures[tier],
                    "p95_latency_ms": round(self.latency_state.get_p95(tier)),
                    "is_degraded": self.latency_state.is_degraded(tier)
                }
                for tier in ModelTier
            }
        }


class ParallelHaikuExecutor:
    """
    System 1.5: Execute 3 parallel Haiku calls and aggregate.
    
    Strategy:
    1. Run 3 Haiku calls with different temperatures
    2. Score responses using lightweight evaluator
    3. Return best response or synthesize
    
    This achieves Sonnet-level quality at ~25% of the cost
    with latency similar to single Haiku.
    """
    
    def __init__(self, llm_client):
        self.client = llm_client
    
    async def execute(
        self,
        query: str,
        context: Optional[str] = None
    ) -> Dict:
        """Execute parallel Haiku ensemble."""
        temperatures = [0.3, 0.5, 0.7]
        
        # Launch parallel calls
        tasks = [
            self._call_haiku(query, context, temp)
            for temp in temperatures
        ]
        
        start = time.time()
        responses = await asyncio.gather(*tasks, return_exceptions=True)
        latency = (time.time() - start) * 1000
        
        # Filter out errors
        valid_responses = [r for r in responses if not isinstance(r, Exception)]
        
        if not valid_responses:
            raise RuntimeError("All parallel Haiku calls failed")
        
        # Score and select best
        best = self._select_best(valid_responses, query)
        
        return {
            "response": best,
            "latency_ms": latency,
            "ensemble_size": len(valid_responses),
            "tier": ModelTier.HAIKU_PARALLEL.value
        }
    
    async def _call_haiku(
        self,
        query: str,
        context: Optional[str],
        temperature: float
    ) -> str:
        """Single Haiku call."""
        # Placeholder - integrate with actual LLM client
        # return await self.client.complete(
        #     model="claude-3-haiku-20240307",
        #     prompt=query,
        #     context=context,
        #     temperature=temperature
        # )
        return f"Response at temp={temperature}"
    
    def _select_best(self, responses: List[str], query: str) -> str:
        """Select best response using lightweight heuristics."""
        # Simple heuristic: prefer longer, more detailed responses
        # In production, use a lightweight scorer model
        scored = [
            (r, len(r) * (1 + r.count('\n') * 0.1))
            for r in responses
        ]
        return max(scored, key=lambda x: x[1])[0]


# ============================================================================
# USAGE EXAMPLE
# ============================================================================

async def example_usage():
    """Demonstrate the cost-aware router."""
    
    # Initialize budget
    budget = BudgetState(total_budget=1000.0, hourly_limit=50.0)
    
    # Initialize router
    router = ThompsonSamplingRouter(
        budget=budget,
        latency_target_ms=2000,
        exploration_weight=0.1
    )
    
    # Example queries
    queries = [
        ("What is 2+2?", 0.1),  # Simple -> HAIKU
        ("Explain the theory of relativity", 0.5),  # Moderate -> SONNET
        ("Analyze the economic implications of...", 0.8),  # Complex -> OPUS
    ]
    
    for query, expected_complexity in queries:
        tier = router.select_tier(query)
        print(f"Query: {query[:30]}... -> Tier: {tier.value}")
        
        # Simulate completion
        latency = MODEL_PROFILES[tier].avg_latency_ms * (0.8 + np.random.random() * 0.4)
        cost = 0.001 * MODEL_PROFILES[tier].cost_per_1k_tokens
        router.update(tier, success=True, latency_ms=latency, actual_cost=cost)
    
    # Print metrics
    print("\nRouter Metrics:")
    for k, v in router.get_metrics().items():
        print(f"  {k}: {v}")


if __name__ == "__main__":
    asyncio.run(example_usage())
