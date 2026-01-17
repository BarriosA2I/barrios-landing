#!/usr/bin/env node
// =============================================================================
// STRIPE PRODUCT SEEDING SCRIPT
// Creates all products and prices in Stripe from the product catalog
// Run with: node scripts/seed-stripe-products.js
// =============================================================================

require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');
const { PRODUCT_CATALOG } = require('../js/product-catalog.js');

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('ERROR: STRIPE_SECRET_KEY not found in environment');
  console.error('Make sure you have .env.local with STRIPE_SECRET_KEY set');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

async function seedProducts() {
  console.log('Starting Stripe product seeding...\n');

  const productMap = new Map(); // local ID -> Stripe ID
  const priceMap = new Map(); // local ID -> Stripe ID

  for (const productConfig of PRODUCT_CATALOG) {
    console.log(`Creating product: ${productConfig.name}`);

    try {
      // Check if product already exists
      const existingProducts = await stripe.products.search({
        query: `metadata['localId']:'${productConfig.id}'`,
      });

      let product;

      if (existingProducts.data.length > 0) {
        product = existingProducts.data[0];
        console.log(`  Found existing: ${product.id}`);

        // Update product
        product = await stripe.products.update(product.id, {
          name: productConfig.name,
          description: productConfig.description,
          metadata: {
            ...productConfig.metadata,
            localId: productConfig.id,
            category: productConfig.category,
          },
        });
      } else {
        // Create new product
        product = await stripe.products.create({
          name: productConfig.name,
          description: productConfig.description,
          metadata: {
            ...productConfig.metadata,
            localId: productConfig.id,
            category: productConfig.category,
          },
        });
        console.log(`  Created: ${product.id}`);
      }

      productMap.set(productConfig.id, product.id);

      // Create/update prices
      for (const priceConfig of productConfig.prices) {
        console.log(`  Creating price: ${priceConfig.nickname}`);

        // Check if price exists
        const existingPrices = await stripe.prices.search({
          query: `metadata['localId']:'${priceConfig.id}'`,
        });

        let price;

        if (existingPrices.data.length > 0) {
          price = existingPrices.data[0];
          console.log(`    Found existing: ${price.id}`);
        } else {
          const priceParams = {
            product: product.id,
            unit_amount: priceConfig.unitAmount,
            currency: priceConfig.currency,
            nickname: priceConfig.nickname,
            metadata: {
              ...priceConfig.metadata,
              localId: priceConfig.id,
            },
          };

          if (priceConfig.recurring) {
            priceParams.recurring = {
              interval: priceConfig.recurring.interval,
              interval_count: priceConfig.recurring.intervalCount,
            };
          }

          price = await stripe.prices.create(priceParams);
          console.log(`    Created: ${price.id}`);
        }

        priceMap.set(priceConfig.id, price.id);
      }
    } catch (error) {
      console.error(`ERROR creating ${productConfig.name}:`, error.message);
      throw error;
    }
  }

  console.log('\n=== SEEDING COMPLETE ===\n');
  console.log('Product ID Mapping:');
  productMap.forEach((stripeId, localId) => {
    console.log(`  ${localId} -> ${stripeId}`);
  });

  console.log('\nPrice ID Mapping:');
  priceMap.forEach((stripeId, localId) => {
    console.log(`  ${localId} -> ${stripeId}`);
  });

  // Generate env snippet
  console.log('\n=== ADD TO .env.local ===');
  console.log('# Stripe Price IDs (auto-generated)');
  priceMap.forEach((stripeId, localId) => {
    const envKey = `STRIPE_PRICE_${localId.toUpperCase().replace(/-/g, '_').replace('PRICE_', '')}`;
    console.log(`${envKey}=${stripeId}`);
  });

  return { productMap, priceMap };
}

// Run if called directly
seedProducts()
  .then(() => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nFailed:', error);
    process.exit(1);
  });
