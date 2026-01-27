/**
 * Notion Integration for Customer Tracking
 *
 * Logs all successful purchases to a Notion database for tracking and analytics.
 */

import { Client } from "@notionhq/client";

// Initialize Notion client (lazy to handle missing key gracefully)
let notionClient: Client | null = null;

function getNotionClient(): Client | null {
  if (!process.env.NOTION_API_KEY) {
    console.warn("[Notion] NOTION_API_KEY not configured - skipping Notion logging");
    return null;
  }

  if (!notionClient) {
    notionClient = new Client({
      auth: process.env.NOTION_API_KEY,
    });
  }

  return notionClient;
}

// Database ID from environment
const CUSTOMER_DATABASE_ID = process.env.NOTION_CUSTOMER_DB_ID;

export interface CustomerLogData {
  email: string;
  product: string;
  amount: number; // in cents
  date: Date;
  subscriptionStatus: "active" | "one_time" | "canceled";
  stripeCustomerId: string;
  stripeSessionId: string;
  intent: string;
}

/**
 * Log a customer purchase to the Notion database
 *
 * Designed to be non-blocking - failures won't break the webhook
 */
export async function logCustomerToNotion(data: CustomerLogData): Promise<{
  success: boolean;
  pageId?: string;
  error?: string;
}> {
  const notion = getNotionClient();

  if (!notion) {
    return { success: false, error: "Notion client not configured" };
  }

  if (!CUSTOMER_DATABASE_ID) {
    console.warn("[Notion] NOTION_CUSTOMER_DB_ID not configured - skipping log");
    return { success: false, error: "Database ID not configured" };
  }

  try {
    const response = await notion.pages.create({
      parent: { database_id: CUSTOMER_DATABASE_ID },
      properties: {
        // Email is the title property
        Email: {
          title: [
            {
              text: {
                content: data.email || "Unknown",
              },
            },
          ],
        },
        // Product as select
        Product: {
          select: {
            name: data.product || "Unknown",
          },
        },
        // Amount in dollars (converted from cents)
        Amount: {
          number: data.amount / 100,
        },
        // Date of purchase
        Date: {
          date: {
            start: data.date.toISOString(),
          },
        },
        // Subscription status
        "Subscription Status": {
          select: {
            name: data.subscriptionStatus,
          },
        },
        // Stripe Customer ID
        "Stripe Customer ID": {
          rich_text: [
            {
              text: {
                content: data.stripeCustomerId || "N/A",
              },
            },
          ],
        },
        // Stripe Session ID
        "Stripe Session ID": {
          rich_text: [
            {
              text: {
                content: data.stripeSessionId,
              },
            },
          ],
        },
        // Intent (SUBSCRIPTION, TOP_UP, etc.)
        Intent: {
          select: {
            name: data.intent || "UNKNOWN",
          },
        },
      },
    });

    console.log(`[Notion] Logged customer ${data.email} to database, page: ${response.id}`);

    return {
      success: true,
      pageId: response.id,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Notion] Failed to log customer:", message);

    return {
      success: false,
      error: message,
    };
  }
}
