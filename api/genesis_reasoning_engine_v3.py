"""
╔══════════════════════════════════════════════════════════════════════════════╗
║  RAGNAROK GENESIS - LEGENDARY REASONING ENGINE v3.0                         ║
║  Frontier Model Integration: Claude 4.5 + GPT-5.2 + Gemini 3.0              ║
║  Chief Systems Architect: Barrios A2I                                        ║
╚══════════════════════════════════════════════════════════════════════════════╝

FRONTIER MODELS INTEGRATED:
┌─────────────────┬──────────────────────────┬─────────────────────────────────┐
│ Engine ID       │ Model                    │ Primary Strength                │
├─────────────────┼──────────────────────────┼─────────────────────────────────┤
│ claude_sonnet_45│ Claude 4.5 Sonnet        │ Agentic workflows & coding      │
│ gpt52           │ ChatGPT 5.2 (Thinking)   │ SOTA knowledge work & logic     │
│ gemini_flash_30 │ Gemini 3.0 Flash         │ Ultra-low latency & multimodal  │
└─────────────────┴──────────────────────────┴─────────────────────────────────┘

UNIQUE CAPABILITIES:
- Claude 4.5: "effort" parameter (low/medium/high) for reasoning depth
- GPT-5.2: Enhanced tool-calling for long-running agents
- Gemini 3.0: "thinking_level" (MINIMAL/LOW/MEDIUM/HIGH) for PhD-level reasoning
"""

import os
import time
import uuid
import json
import asyncio
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Dict, Any, Optional, List, Literal, AsyncGenerator
from enum import Enum
import logging

# Third-party imports
from fastapi import FastAPI, HTTPException, Depends, Header, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field, validator
import httpx

# Observability
from opentelemetry import trace
from prometheus_client import Counter, Histogram, Gauge, generate_latest

logger = logging.getLogger(__name__)
tracer = trace.get_tracer(__name__)

# =============================================================================
# PROMETHEUS METRICS
# =============================================================================

REQUEST_COUNT = Counter(
    'genesis_v3_requests_total',
    'Total requests by engine and status',
    ['engine', 'status', 'task_type']
)

LATENCY_HISTOGRAM = Histogram(
    'genesis_v3_latency_seconds',
    'Request latency by engine',
    ['engine'],
    buckets=[0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0, 30.0]
)

COST_HISTOGRAM = Histogram(
    'genesis_v3_cost_usd',
    'Cost per request by engine',
    ['engine'],
    buckets=[0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25]
)

TOKEN_GAUGE = Gauge(
    'genesis_v3_tokens',
    'Tokens used per request',
    ['engine', 'direction']
)

THINKING_LEVEL_COUNTER = Counter(
    'genesis_v3_thinking_level',
    'Thinking level usage for Gemini 3.0',
    ['level']
)


# =============================================================================
# ENUMS & CONSTANTS
# =============================================================================

class EngineID(str, Enum):
    """Available reasoning engines - frontier models only"""
    CLAUDE_SONNET_45 = "claude_sonnet_45"
    GPT_52 = "gpt52"
    GEMINI_FLASH_30 = "gemini_flash_30"


class ClaudeEffort(str, Enum):
    """Claude 4.5 effort/reasoning depth parameter"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class GeminiThinkingLevel(str, Enum):
    """Gemini 3.0 thinking level for PhD-grade reasoning"""
    MINIMAL = "MINIMAL"
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class TaskType(str, Enum):
    """Task types with different compute requirements"""
    INTAKE = "intake"           # Quick Q&A
    ANALYSIS = "analysis"       # Brand/market analysis
    STRATEGY = "strategy"       # Full strategy synthesis
    CREATIVE = "creative"       # Script/storyboard generation
    AGENTIC = "agentic"         # Multi-step tool-calling


# =============================================================================
# MODEL CONFIGURATION - FRONTIER 2025/2026
# =============================================================================

@dataclass(frozen=True)
class FrontierModelConfig:
    """Configuration for frontier models with advanced capabilities"""
    model_id: str
    provider: str
    display_name: str
    
    # Token limits
    max_context_tokens: int
    max_output_tokens: int
    
    # Pricing (per 1M tokens)
    cost_per_1m_input: float
    cost_per_1m_output: float
    cost_cap_per_request: float
    
    # Special capabilities
    supports_effort: bool = False          # Claude 4.5
    supports_thinking_level: bool = False  # Gemini 3.0
    supports_tools: bool = False           # GPT-5.2 enhanced
    supports_vision: bool = False
    supports_streaming: bool = True
    
    # Performance characteristics
    typical_latency_ms: int = 1000
    strength: str = ""
    
    def estimate_cost(self, input_tokens: int, output_tokens: int) -> float:
        """Calculate cost in USD"""
        return (
            (input_tokens / 1_000_000) * self.cost_per_1m_input +
            (output_tokens / 1_000_000) * self.cost_per_1m_output
        )


# =============================================================================
# FRONTIER MODEL WHITELIST - SECURITY CRITICAL
# =============================================================================

MODEL_WHITELIST: Dict[EngineID, FrontierModelConfig] = {
    
    EngineID.CLAUDE_SONNET_45: FrontierModelConfig(
        model_id="claude-sonnet-4-5-20250929",
        provider="anthropic",
        display_name="Claude 4.5 Sonnet",
        max_context_tokens=200_000,
        max_output_tokens=64_000,  # Massive output for agentic
        cost_per_1m_input=3.00,
        cost_per_1m_output=15.00,
        cost_cap_per_request=0.10,
        supports_effort=True,
        supports_vision=True,
        supports_tools=True,
        typical_latency_ms=800,
        strength="Agentic workflows, coding, extended thinking"
    ),
    
    EngineID.GPT_52: FrontierModelConfig(
        model_id="gpt-5.2-thinking",
        provider="openai",
        display_name="ChatGPT 5.2 (Thinking)",
        max_context_tokens=400_000,  # Massive context
        max_output_tokens=32_000,
        cost_per_1m_input=5.00,
        cost_per_1m_output=20.00,
        cost_cap_per_request=0.15,
        supports_effort=False,
        supports_thinking_level=False,
        supports_tools=True,  # Enhanced tool-calling
        supports_vision=True,
        typical_latency_ms=1500,
        strength="SOTA knowledge work, professional reasoning, long-running agents"
    ),
    
    EngineID.GEMINI_FLASH_30: FrontierModelConfig(
        model_id="gemini-3.0-flash-preview",
        provider="google",
        display_name="Gemini 3.0 Flash",
        max_context_tokens=1_000_000,  # 1M context window
        max_output_tokens=65_536,
        cost_per_1m_input=0.10,   # Ultra-efficient
        cost_per_1m_output=0.40,
        cost_cap_per_request=0.005,  # Very cheap
        supports_thinking_level=True,  # PhD-level reasoning
        supports_vision=True,
        supports_tools=True,
        typical_latency_ms=300,  # Ultra-low latency
        strength="Ultra-low latency, multimodal, PhD-level reasoning with thinking levels"
    ),
}


# =============================================================================
# TASK → COMPUTE BUDGET MAPPING
# =============================================================================

def get_compute_budget(engine: EngineID, task: TaskType) -> Dict[str, Any]:
    """
    Determine compute budget based on engine and task type
    
    Returns optimal settings for:
    - max_tokens: Output limit
    - effort: Claude 4.5 reasoning depth
    - thinking_level: Gemini 3.0 reasoning mode
    - temperature: Creativity vs precision
    """
    config = MODEL_WHITELIST[engine]
    
    # Base budgets by task
    TASK_BUDGETS = {
        TaskType.INTAKE: {
            "max_tokens": 500,
            "effort": ClaudeEffort.LOW,
            "thinking_level": GeminiThinkingLevel.MINIMAL,
            "temperature": 0.3,
        },
        TaskType.ANALYSIS: {
            "max_tokens": 2000,
            "effort": ClaudeEffort.MEDIUM,
            "thinking_level": GeminiThinkingLevel.LOW,
            "temperature": 0.5,
        },
        TaskType.STRATEGY: {
            "max_tokens": 4000,
            "effort": ClaudeEffort.HIGH,
            "thinking_level": GeminiThinkingLevel.HIGH,
            "temperature": 0.7,
        },
        TaskType.CREATIVE: {
            "max_tokens": 6000,
            "effort": ClaudeEffort.HIGH,
            "thinking_level": GeminiThinkingLevel.MEDIUM,
            "temperature": 0.8,
        },
        TaskType.AGENTIC: {
            "max_tokens": 8000,
            "effort": ClaudeEffort.HIGH,
            "thinking_level": GeminiThinkingLevel.HIGH,
            "temperature": 0.4,
        },
    }
    
    budget = TASK_BUDGETS.get(task, TASK_BUDGETS[TaskType.STRATEGY])
    
    # Cap to model limits
    budget["max_tokens"] = min(budget["max_tokens"], config.max_output_tokens)
    
    return budget


# =============================================================================
# UNIFIED RESPONSE FORMAT
# =============================================================================

@dataclass
class LLMResponse:
    """Unified response from all frontier models"""
    content: str
    input_tokens: int
    output_tokens: int
    cost_usd: float
    latency_ms: float
    
    # Model info
    engine_id: str
    model_id: str
    provider: str
    
    # Advanced metrics
    finish_reason: str = "stop"
    thinking_tokens: int = 0  # For models with extended thinking
    effort_used: Optional[str] = None
    thinking_level_used: Optional[str] = None
    
    # Tool usage (GPT-5.2)
    tool_calls: List[Dict] = field(default_factory=list)
    
    metadata: Dict[str, Any] = field(default_factory=dict)


# =============================================================================
# ABSTRACT ADAPTER
# =============================================================================

class LLMAdapter(ABC):
    """Abstract base for frontier model adapters"""
    
    def __init__(self, config: FrontierModelConfig):
        self.config = config
        self._client: Optional[httpx.AsyncClient] = None
    
    async def _get_client(self) -> httpx.AsyncClient:
        if self._client is None:
            self._client = httpx.AsyncClient(timeout=120.0)
        return self._client
    
    @abstractmethod
    async def generate(
        self,
        messages: List[Dict[str, str]],
        system_prompt: str,
        max_tokens: int,
        temperature: float = 0.7,
        **kwargs
    ) -> LLMResponse:
        pass
    
    @abstractmethod
    async def stream(
        self,
        messages: List[Dict[str, str]],
        system_prompt: str,
        max_tokens: int,
        temperature: float = 0.7,
        **kwargs
    ) -> AsyncGenerator[str, None]:
        pass


# =============================================================================
# CLAUDE 4.5 ADAPTER - With "effort" Parameter
# =============================================================================

class Claude45Adapter(LLMAdapter):
    """
    Adapter for Claude 4.5 Sonnet with effort-based reasoning
    
    The "effort" parameter controls reasoning depth:
    - low: Quick responses, minimal reasoning
    - medium: Balanced reasoning and speed
    - high: Maximum reasoning depth, extended thinking
    """
    
    def __init__(self, config: FrontierModelConfig):
        super().__init__(config)
        self.api_key = os.environ.get("ANTHROPIC_API_KEY")
        self.base_url = "https://api.anthropic.com/v1"
    
    async def generate(
        self,
        messages: List[Dict[str, str]],
        system_prompt: str,
        max_tokens: int,
        temperature: float = 0.7,
        effort: ClaudeEffort = ClaudeEffort.MEDIUM,
        **kwargs
    ) -> LLMResponse:
        start = time.time()
        client = await self._get_client()
        
        headers = {
            "x-api-key": self.api_key,
            "anthropic-version": "2024-10-22",
            "content-type": "application/json"
        }
        
        # Build payload with effort parameter
        payload = {
            "model": self.config.model_id,
            "max_tokens": min(max_tokens, self.config.max_output_tokens),
            "temperature": temperature,
            "system": system_prompt,
            "messages": messages,
        }
        
        # Add effort parameter for Claude 4.5
        if self.config.supports_effort:
            payload["metadata"] = {
                "effort": effort.value
            }
            # Extended thinking for high effort
            if effort == ClaudeEffort.HIGH:
                payload["thinking"] = {
                    "type": "enabled",
                    "budget_tokens": 10000
                }
        
        response = await client.post(
            f"{self.base_url}/messages",
            headers=headers,
            json=payload
        )
        response.raise_for_status()
        data = response.json()
        
        latency_ms = (time.time() - start) * 1000
        input_tokens = data["usage"]["input_tokens"]
        output_tokens = data["usage"]["output_tokens"]
        
        # Extract thinking tokens if present
        thinking_tokens = 0
        content = ""
        for block in data.get("content", []):
            if block.get("type") == "thinking":
                thinking_tokens = len(block.get("thinking", "").split())
            elif block.get("type") == "text":
                content = block.get("text", "")
        
        if not content and data.get("content"):
            content = data["content"][0].get("text", "")
        
        cost = self.config.estimate_cost(input_tokens, output_tokens)
        
        return LLMResponse(
            content=content,
            input_tokens=input_tokens,
            output_tokens=output_tokens,
            cost_usd=cost,
            latency_ms=latency_ms,
            engine_id=EngineID.CLAUDE_SONNET_45.value,
            model_id=self.config.model_id,
            provider="anthropic",
            finish_reason=data.get("stop_reason", "stop"),
            thinking_tokens=thinking_tokens,
            effort_used=effort.value
        )
    
    async def stream(
        self,
        messages: List[Dict[str, str]],
        system_prompt: str,
        max_tokens: int,
        temperature: float = 0.7,
        effort: ClaudeEffort = ClaudeEffort.MEDIUM,
        **kwargs
    ) -> AsyncGenerator[str, None]:
        client = await self._get_client()
        
        headers = {
            "x-api-key": self.api_key,
            "anthropic-version": "2024-10-22",
            "content-type": "application/json"
        }
        
        payload = {
            "model": self.config.model_id,
            "max_tokens": min(max_tokens, self.config.max_output_tokens),
            "temperature": temperature,
            "system": system_prompt,
            "messages": messages,
            "stream": True
        }
        
        async with client.stream(
            "POST",
            f"{self.base_url}/messages",
            headers=headers,
            json=payload
        ) as response:
            async for line in response.aiter_lines():
                if line.startswith("data: "):
                    chunk = line[6:]
                    if chunk != "[DONE]":
                        try:
                            data = json.loads(chunk)
                            if data.get("type") == "content_block_delta":
                                delta = data.get("delta", {})
                                if delta.get("type") == "text_delta":
                                    yield delta.get("text", "")
                        except json.JSONDecodeError:
                            continue


# =============================================================================
# GPT-5.2 ADAPTER - Enhanced Tool-Calling
# =============================================================================

class GPT52Adapter(LLMAdapter):
    """
    Adapter for ChatGPT 5.2 with enhanced tool-calling
    
    Optimized for:
    - Long-running agentic workflows
    - Professional knowledge work
    - SOTA reasoning and logic
    """
    
    def __init__(self, config: FrontierModelConfig):
        super().__init__(config)
        self.api_key = os.environ.get("OPENAI_API_KEY")
        self.base_url = "https://api.openai.com/v1"
    
    async def generate(
        self,
        messages: List[Dict[str, str]],
        system_prompt: str,
        max_tokens: int,
        temperature: float = 0.7,
        tools: Optional[List[Dict]] = None,
        **kwargs
    ) -> LLMResponse:
        start = time.time()
        client = await self._get_client()
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        # GPT uses system message in messages array
        full_messages = [{"role": "system", "content": system_prompt}] + messages
        
        payload = {
            "model": self.config.model_id,
            "max_completion_tokens": min(max_tokens, self.config.max_output_tokens),
            "temperature": temperature,
            "messages": full_messages,
        }
        
        # Add tools for agentic workflows
        if tools and self.config.supports_tools:
            payload["tools"] = tools
            payload["tool_choice"] = "auto"
        
        response = await client.post(
            f"{self.base_url}/chat/completions",
            headers=headers,
            json=payload
        )
        response.raise_for_status()
        data = response.json()
        
        latency_ms = (time.time() - start) * 1000
        usage = data.get("usage", {})
        input_tokens = usage.get("prompt_tokens", 0)
        output_tokens = usage.get("completion_tokens", 0)
        
        choice = data["choices"][0]
        message = choice.get("message", {})
        content = message.get("content", "") or ""
        
        # Extract tool calls
        tool_calls = []
        if message.get("tool_calls"):
            for tc in message["tool_calls"]:
                tool_calls.append({
                    "id": tc.get("id"),
                    "type": tc.get("type"),
                    "function": tc.get("function", {})
                })
        
        cost = self.config.estimate_cost(input_tokens, output_tokens)
        
        return LLMResponse(
            content=content,
            input_tokens=input_tokens,
            output_tokens=output_tokens,
            cost_usd=cost,
            latency_ms=latency_ms,
            engine_id=EngineID.GPT_52.value,
            model_id=self.config.model_id,
            provider="openai",
            finish_reason=choice.get("finish_reason", "stop"),
            tool_calls=tool_calls
        )
    
    async def stream(
        self,
        messages: List[Dict[str, str]],
        system_prompt: str,
        max_tokens: int,
        temperature: float = 0.7,
        **kwargs
    ) -> AsyncGenerator[str, None]:
        client = await self._get_client()
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        full_messages = [{"role": "system", "content": system_prompt}] + messages
        
        payload = {
            "model": self.config.model_id,
            "max_completion_tokens": min(max_tokens, self.config.max_output_tokens),
            "temperature": temperature,
            "messages": full_messages,
            "stream": True
        }
        
        async with client.stream(
            "POST",
            f"{self.base_url}/chat/completions",
            headers=headers,
            json=payload
        ) as response:
            async for line in response.aiter_lines():
                if line.startswith("data: "):
                    chunk = line[6:]
                    if chunk != "[DONE]":
                        try:
                            data = json.loads(chunk)
                            delta = data["choices"][0].get("delta", {})
                            if "content" in delta and delta["content"]:
                                yield delta["content"]
                        except (json.JSONDecodeError, KeyError, IndexError):
                            continue


# =============================================================================
# GEMINI 3.0 FLASH ADAPTER - Thinking Levels
# =============================================================================

class Gemini30Adapter(LLMAdapter):
    """
    Adapter for Gemini 3.0 Flash with thinking_level parameter
    
    Thinking Levels:
    - MINIMAL: Fastest, basic reasoning
    - LOW: Quick analysis
    - MEDIUM: Balanced (default)
    - HIGH: PhD-level deep reasoning
    """
    
    def __init__(self, config: FrontierModelConfig):
        super().__init__(config)
        self.api_key = os.environ.get("GOOGLE_API_KEY")
        self.base_url = "https://generativelanguage.googleapis.com/v1beta"
    
    async def generate(
        self,
        messages: List[Dict[str, str]],
        system_prompt: str,
        max_tokens: int,
        temperature: float = 0.7,
        thinking_level: GeminiThinkingLevel = GeminiThinkingLevel.MEDIUM,
        **kwargs
    ) -> LLMResponse:
        start = time.time()
        client = await self._get_client()
        
        # Convert to Gemini format
        contents = []
        for msg in messages:
            role = "user" if msg["role"] == "user" else "model"
            contents.append({
                "role": role,
                "parts": [{"text": msg["content"]}]
            })
        
        payload = {
            "contents": contents,
            "systemInstruction": {
                "parts": [{"text": system_prompt}]
            },
            "generationConfig": {
                "maxOutputTokens": min(max_tokens, self.config.max_output_tokens),
                "temperature": temperature,
                "topP": 0.95,
                "topK": 40,
            }
        }
        
        # Add thinking level for Gemini 3.0
        if self.config.supports_thinking_level:
            payload["generationConfig"]["thinkingConfig"] = {
                "thinkingLevel": thinking_level.value
            }
            THINKING_LEVEL_COUNTER.labels(level=thinking_level.value).inc()
        
        url = f"{self.base_url}/models/{self.config.model_id}:generateContent"
        response = await client.post(
            url,
            params={"key": self.api_key},
            json=payload
        )
        response.raise_for_status()
        data = response.json()
        
        latency_ms = (time.time() - start) * 1000
        
        # Token counting
        usage = data.get("usageMetadata", {})
        input_tokens = usage.get("promptTokenCount", 0)
        output_tokens = usage.get("candidatesTokenCount", 0)
        thinking_tokens = usage.get("thinkingTokenCount", 0)
        
        # Extract content
        candidates = data.get("candidates", [])
        content = ""
        if candidates:
            parts = candidates[0].get("content", {}).get("parts", [])
            content = "".join(p.get("text", "") for p in parts)
        
        cost = self.config.estimate_cost(input_tokens, output_tokens)
        
        return LLMResponse(
            content=content,
            input_tokens=input_tokens,
            output_tokens=output_tokens,
            cost_usd=cost,
            latency_ms=latency_ms,
            engine_id=EngineID.GEMINI_FLASH_30.value,
            model_id=self.config.model_id,
            provider="google",
            finish_reason=candidates[0].get("finishReason", "STOP") if candidates else "STOP",
            thinking_tokens=thinking_tokens,
            thinking_level_used=thinking_level.value
        )
    
    async def stream(
        self,
        messages: List[Dict[str, str]],
        system_prompt: str,
        max_tokens: int,
        temperature: float = 0.7,
        thinking_level: GeminiThinkingLevel = GeminiThinkingLevel.MEDIUM,
        **kwargs
    ) -> AsyncGenerator[str, None]:
        client = await self._get_client()
        
        contents = []
        for msg in messages:
            role = "user" if msg["role"] == "user" else "model"
            contents.append({
                "role": role,
                "parts": [{"text": msg["content"]}]
            })
        
        payload = {
            "contents": contents,
            "systemInstruction": {
                "parts": [{"text": system_prompt}]
            },
            "generationConfig": {
                "maxOutputTokens": min(max_tokens, self.config.max_output_tokens),
                "temperature": temperature,
            }
        }
        
        if self.config.supports_thinking_level:
            payload["generationConfig"]["thinkingConfig"] = {
                "thinkingLevel": thinking_level.value
            }
        
        url = f"{self.base_url}/models/{self.config.model_id}:streamGenerateContent"
        
        async with client.stream(
            "POST",
            url,
            params={"key": self.api_key, "alt": "sse"},
            json=payload
        ) as response:
            async for line in response.aiter_lines():
                if line.startswith("data: "):
                    try:
                        data = json.loads(line[6:])
                        candidates = data.get("candidates", [])
                        if candidates:
                            parts = candidates[0].get("content", {}).get("parts", [])
                            for part in parts:
                                if "text" in part:
                                    yield part["text"]
                    except json.JSONDecodeError:
                        continue


# =============================================================================
# REASONING ENGINE ROUTER
# =============================================================================

class ReasoningEngine:
    """
    Legendary Reasoning Engine v3.0
    
    Routes requests to the optimal frontier model with:
    - Automatic capability matching
    - Cost optimization
    - Adaptive thinking levels
    """
    
    def __init__(self):
        self._adapters: Dict[EngineID, LLMAdapter] = {}
    
    def _get_adapter(self, engine: EngineID) -> LLMAdapter:
        """Get or create adapter for engine"""
        if engine not in self._adapters:
            config = MODEL_WHITELIST[engine]
            
            if engine == EngineID.CLAUDE_SONNET_45:
                self._adapters[engine] = Claude45Adapter(config)
            elif engine == EngineID.GPT_52:
                self._adapters[engine] = GPT52Adapter(config)
            elif engine == EngineID.GEMINI_FLASH_30:
                self._adapters[engine] = Gemini30Adapter(config)
            else:
                raise ValueError(f"Unknown engine: {engine}")
        
        return self._adapters[engine]
    
    async def generate(
        self,
        engine: EngineID,
        messages: List[Dict[str, str]],
        system_prompt: str,
        task_type: TaskType = TaskType.STRATEGY,
        **kwargs
    ) -> LLMResponse:
        """
        Generate response with optimal compute budget
        """
        adapter = self._get_adapter(engine)
        budget = get_compute_budget(engine, task_type)
        
        with tracer.start_as_current_span("reasoning_engine_generate") as span:
            span.set_attribute("engine", engine.value)
            span.set_attribute("task_type", task_type.value)
            span.set_attribute("max_tokens", budget["max_tokens"])
            
            # Merge budget with kwargs (kwargs takes precedence)
            params = {**budget, **kwargs}
            
            response = await adapter.generate(
                messages=messages,
                system_prompt=system_prompt,
                **params
            )
            
            # Record metrics
            REQUEST_COUNT.labels(
                engine=engine.value,
                status="success",
                task_type=task_type.value
            ).inc()
            LATENCY_HISTOGRAM.labels(engine=engine.value).observe(response.latency_ms / 1000)
            COST_HISTOGRAM.labels(engine=engine.value).observe(response.cost_usd)
            TOKEN_GAUGE.labels(engine=engine.value, direction="input").set(response.input_tokens)
            TOKEN_GAUGE.labels(engine=engine.value, direction="output").set(response.output_tokens)
            
            # Log cost warning if approaching cap
            config = MODEL_WHITELIST[engine]
            if response.cost_usd > config.cost_cap_per_request * 0.8:
                logger.warning(
                    f"Cost approaching cap: ${response.cost_usd:.4f} "
                    f"(cap: ${config.cost_cap_per_request})"
                )
            
            return response
    
    async def stream(
        self,
        engine: EngineID,
        messages: List[Dict[str, str]],
        system_prompt: str,
        task_type: TaskType = TaskType.STRATEGY,
        **kwargs
    ) -> AsyncGenerator[str, None]:
        """Stream response for real-time UI updates"""
        adapter = self._get_adapter(engine)
        budget = get_compute_budget(engine, task_type)
        params = {**budget, **kwargs}
        
        async for chunk in adapter.stream(
            messages=messages,
            system_prompt=system_prompt,
            **params
        ):
            yield chunk
    
    def get_engine_profile(self, engine: EngineID) -> Dict[str, Any]:
        """Get engine capabilities for UI display"""
        config = MODEL_WHITELIST[engine]
        return {
            "id": engine.value,
            "display_name": config.display_name,
            "provider": config.provider,
            "strength": config.strength,
            "max_context": config.max_context_tokens,
            "max_output": config.max_output_tokens,
            "typical_latency_ms": config.typical_latency_ms,
            "cost_per_1k_output": config.cost_per_1m_output / 1000,
            "capabilities": {
                "effort_control": config.supports_effort,
                "thinking_levels": config.supports_thinking_level,
                "tool_calling": config.supports_tools,
                "vision": config.supports_vision,
                "streaming": config.supports_streaming,
            }
        }


# =============================================================================
# SESSION MANAGEMENT
# =============================================================================

@dataclass
class GenesisSession:
    """Session state with engine preference"""
    session_id: str
    created_at: float
    updated_at: float
    active_engine: EngineID = EngineID.GEMINI_FLASH_30  # Default to fastest
    phase: int = 1
    answers: Dict[str, Any] = field(default_factory=dict)
    uploaded_assets: List[Dict] = field(default_factory=list)
    total_cost: float = 0.0
    request_count: int = 0
    metrics: Dict[str, Any] = field(default_factory=dict)


class SessionManager:
    """Thread-safe session management"""
    
    def __init__(self, ttl_seconds: int = 86400):
        self._sessions: Dict[str, GenesisSession] = {}
        self._ttl = ttl_seconds
    
    def create(self, engine: Optional[EngineID] = None) -> GenesisSession:
        session = GenesisSession(
            session_id=str(uuid.uuid4()),
            created_at=time.time(),
            updated_at=time.time(),
            active_engine=engine or EngineID.GEMINI_FLASH_30
        )
        self._sessions[session.session_id] = session
        return session
    
    def get(self, session_id: str) -> Optional[GenesisSession]:
        session = self._sessions.get(session_id)
        if session and (time.time() - session.created_at) > self._ttl:
            del self._sessions[session_id]
            return None
        return session
    
    def get_or_create(self, session_id: Optional[str], engine: Optional[EngineID] = None) -> GenesisSession:
        if session_id:
            session = self.get(session_id)
            if session:
                if engine:
                    session.active_engine = engine
                return session
        return self.create(engine)
    
    def update(self, session_id: str, **updates) -> Optional[GenesisSession]:
        session = self.get(session_id)
        if session:
            for key, value in updates.items():
                if hasattr(session, key):
                    setattr(session, key, value)
            session.updated_at = time.time()
        return session


# =============================================================================
# FASTAPI APPLICATION
# =============================================================================

app = FastAPI(
    title="RAGNAROK GENESIS - Legendary Reasoning Engine v3.0",
    version="3.0.0",
    description="Frontier Model Integration: Claude 4.5 + GPT-5.2 + Gemini 3.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://barrios-landing.vercel.app",
        "http://localhost:3000",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize singletons
reasoning_engine = ReasoningEngine()
session_manager = SessionManager()


# =============================================================================
# API MODELS
# =============================================================================

class EngineSelectRequest(BaseModel):
    """Select active reasoning engine"""
    engine: EngineID


class IntakeRequest(BaseModel):
    """Intake phase request"""
    session_id: Optional[str] = None
    engine: Optional[EngineID] = None
    phase: int = Field(ge=1, le=10)
    user_message: str = Field(min_length=1, max_length=10000)


class StrategyRequest(BaseModel):
    """Strategy generation request"""
    session_id: str
    engine: Optional[EngineID] = None
    include_assets: bool = True


class IntakeResponse(BaseModel):
    """Intake response"""
    session_id: str
    engine_used: str
    phase: int
    ai_response: str
    progress_percent: float
    tokens_used: int
    cost_usd: float
    latency_ms: float
    thinking_tokens: Optional[int] = None


# =============================================================================
# API ENDPOINTS
# =============================================================================

@app.get("/health")
async def health():
    """Health check with engine status"""
    return {
        "status": "legendary",
        "version": "3.0.0",
        "engines": {
            e.value: reasoning_engine.get_engine_profile(e)
            for e in EngineID
        },
        "active_sessions": len(session_manager._sessions)
    }


@app.get("/api/engines")
async def list_engines():
    """List all available reasoning engines"""
    return {
        "engines": [
            reasoning_engine.get_engine_profile(e)
            for e in EngineID
        ],
        "recommended": {
            "fastest": EngineID.GEMINI_FLASH_30.value,
            "smartest": EngineID.CLAUDE_SONNET_45.value,
            "most_capable": EngineID.GPT_52.value
        }
    }


@app.post("/api/genesis/session")
async def create_session(request: Optional[EngineSelectRequest] = None):
    """Create new session with engine preference"""
    engine = request.engine if request else EngineID.GEMINI_FLASH_30
    session = session_manager.create(engine)
    
    return {
        "session_id": session.session_id,
        "active_engine": session.active_engine.value,
        "engine_profile": reasoning_engine.get_engine_profile(session.active_engine)
    }


@app.post("/api/genesis/intake", response_model=IntakeResponse)
async def process_intake(request: IntakeRequest):
    """Process intake with adaptive reasoning"""
    # Get or create session
    session = session_manager.get_or_create(request.session_id, request.engine)
    engine = request.engine or session.active_engine
    
    # Build system prompt
    system_prompt = f"""You are the AI Creative Director for RAGNAROK GENESIS.
You are in Phase {request.phase} of 10 in the commercial intake process.

GUIDELINES:
- Be concise and professional
- Ask ONE clarifying question per response
- Maintain the premium Barrios A2I brand identity
- Extract key business insights for strategy generation

Current Phase: {request.phase}/10
Phase Name: {_get_phase_name(request.phase)}"""
    
    messages = [{"role": "user", "content": request.user_message}]
    
    # Use INTAKE task type for fast responses
    response = await reasoning_engine.generate(
        engine=engine,
        messages=messages,
        system_prompt=system_prompt,
        task_type=TaskType.INTAKE
    )
    
    # Update session
    session.answers[f"phase_{request.phase}"] = request.user_message
    session.total_cost += response.cost_usd
    session.request_count += 1
    session.phase = min(request.phase + 1, 10)
    session.updated_at = time.time()
    
    return IntakeResponse(
        session_id=session.session_id,
        engine_used=engine.value,
        phase=session.phase,
        ai_response=response.content,
        progress_percent=(request.phase / 10) * 100,
        tokens_used=response.output_tokens,
        cost_usd=response.cost_usd,
        latency_ms=response.latency_ms,
        thinking_tokens=response.thinking_tokens if response.thinking_tokens > 0 else None
    )


@app.post("/api/genesis/strategy")
async def generate_strategy(request: StrategyRequest):
    """Generate full commercial strategy with STRATEGY task type"""
    session = session_manager.get(request.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    engine = request.engine or session.active_engine
    
    system_prompt = """You are the RAGNAROK GENESIS Strategy Synthesizer.
    
Generate a comprehensive commercial strategy including:
1. BUSINESS ANALYSIS - Key insights from intake
2. TARGET AUDIENCE - Demographics, psychographics, pain points
3. CORE MESSAGE - Unique value proposition & emotional hook
4. 30-SECOND SCRIPT - Hook, body, CTA with timestamps
5. VISUAL STORYBOARD - Scene-by-scene breakdown
6. DISTRIBUTION STRATEGY - Platform-specific recommendations
7. SUCCESS METRICS - KPIs and measurement approach

Be specific, actionable, and aligned with the Barrios A2I premium brand."""
    
    context = json.dumps({
        "intake_answers": session.answers,
        "assets_count": len(session.uploaded_assets),
        "asset_types": [a.get("assetType") for a in session.uploaded_assets]
    }, indent=2)
    
    messages = [{"role": "user", "content": f"Client Brief:\n{context}"}]
    
    response = await reasoning_engine.generate(
        engine=engine,
        messages=messages,
        system_prompt=system_prompt,
        task_type=TaskType.STRATEGY
    )
    
    session.total_cost += response.cost_usd
    session.request_count += 1
    
    return {
        "session_id": session.session_id,
        "engine_used": engine.value,
        "strategy": response.content,
        "tokens_used": response.input_tokens + response.output_tokens,
        "thinking_tokens": response.thinking_tokens,
        "cost_usd": response.cost_usd,
        "latency_ms": response.latency_ms,
        "effort_used": response.effort_used,
        "thinking_level_used": response.thinking_level_used
    }


@app.get("/api/genesis/stream/{session_id}")
async def stream_strategy(session_id: str, engine: Optional[EngineID] = None):
    """Stream strategy generation for real-time UI"""
    session = session_manager.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    engine = engine or session.active_engine
    
    async def generate():
        system_prompt = "You are the RAGNAROK GENESIS Strategy Synthesizer..."
        context = json.dumps(session.answers)
        messages = [{"role": "user", "content": f"Client Brief:\n{context}"}]
        
        async for chunk in reasoning_engine.stream(
            engine=engine,
            messages=messages,
            system_prompt=system_prompt,
            task_type=TaskType.STRATEGY
        ):
            yield f"data: {json.dumps({'content': chunk})}\n\n"
        
        yield "data: [DONE]\n\n"
    
    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )


@app.get("/metrics")
async def metrics():
    """Prometheus metrics endpoint"""
    return generate_latest()


# =============================================================================
# HELPERS
# =============================================================================

def _get_phase_name(phase: int) -> str:
    """Get human-readable phase name"""
    names = {
        1: "Introduction",
        2: "Target Audience",
        3: "Value Proposition",
        4: "Emotional Hook",
        5: "Call to Action",
        6: "Budget & Timeline",
        7: "Inspiration & References",
        8: "Distribution Channels",
        9: "Brand Guidelines",
        10: "Final Requirements"
    }
    return names.get(phase, "Unknown")


# =============================================================================
# ENTRY POINT
# =============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
