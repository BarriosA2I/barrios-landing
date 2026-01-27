/**
 * Email Service - Resend Integration for Barrios A2I
 *
 * Handles transactional emails:
 * - Production complete notifications
 * - Welcome emails
 * - Payment failure alerts
 */

import { Resend } from "resend";

// Lazy initialization to avoid build-time errors
let resendClient: Resend | null = null;
function getResend(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

const FROM_EMAIL = process.env.FROM_EMAIL || "Barrios A2I <notifications@barriosa2i.com>";
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.barriosa2i.com";

// ============================================================================
// Types
// ============================================================================

export interface ProductionCompleteEmailData {
  to: string;
  customerName: string;
  productionId: string;
  productionTitle: string;
  thumbnailUrl?: string;
  videoUrl: string;
  downloadUrls: {
    mp4Hd?: string;
    mp4Sd?: string;
    gif?: string;
  };
  mulliganToken: string;
  processingTime?: number; // seconds
}

export interface WelcomeEmailData {
  to: string;
  customerName: string;
  tier: string;
  monthlyTokens: number;
}

export interface PaymentFailedEmailData {
  to: string;
  customerName: string;
  invoiceAmount: number;
  retryDate: Date;
  updatePaymentUrl: string;
}

export interface NewOrderNotificationData {
  productionId: string;
  customerName: string;
  customerEmail: string;
  accountId: string;
  title: string;
  script: string;
  targetAudience?: string;
  brandVoice?: string;
  format?: string;
  duration?: number;
  priority: string;
  tokensUsed: number;
  timestamp: Date;
}

export interface PurchaseNotificationData {
  customerEmail: string;
  productName: string;
  amount: number; // in cents
  intent: string;
  stripeSessionId: string;
  stripeCustomerId?: string;
}

// ============================================================================
// Email Functions
// ============================================================================

/**
 * Send production complete email with download links and mulligan button
 */
export async function sendProductionCompleteEmail(
  data: ProductionCompleteEmailData
): Promise<{ success: boolean; id?: string; error?: string }> {
  const mulliganUrl = `${BASE_URL}/api/mulligan?token=${data.mulliganToken}`;
  const dashboardUrl = `${BASE_URL}/dashboard/lab?production=${data.productionId}`;

  try {
    const { data: result, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: data.to,
      subject: `Your Commercial is Ready: ${data.productionTitle}`,
      html: generateProductionCompleteHtml({
        ...data,
        mulliganUrl,
        dashboardUrl,
      }),
    });

    if (error) {
      console.error("[EmailService] sendProductionCompleteEmail error:", error);
      return { success: false, error: error.message };
    }

    console.log(`[EmailService] Production complete email sent: ${result?.id}`);
    return { success: true, id: result?.id };
  } catch (error) {
    console.error("[EmailService] sendProductionCompleteEmail exception:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send welcome email after subscription activation
 */
export async function sendWelcomeEmail(
  data: WelcomeEmailData
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const { data: result, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: data.to,
      subject: `Welcome to Commercial Lab - ${data.tier} Tier`,
      html: generateWelcomeHtml(data),
    });

    if (error) {
      console.error("[EmailService] sendWelcomeEmail error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, id: result?.id };
  } catch (error) {
    console.error("[EmailService] sendWelcomeEmail exception:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send payment failed notification
 */
export async function sendPaymentFailedEmail(
  data: PaymentFailedEmailData
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const { data: result, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: data.to,
      subject: "Action Required: Payment Failed",
      html: generatePaymentFailedHtml(data),
    });

    if (error) {
      console.error("[EmailService] sendPaymentFailedEmail error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, id: result?.id };
  } catch (error) {
    console.error("[EmailService] sendPaymentFailedEmail exception:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send new order notification to Gary for manual fulfillment
 */
export async function sendNewOrderNotificationEmail(
  data: NewOrderNotificationData
): Promise<{ success: boolean; id?: string; error?: string }> {
  const dashboardUrl = `${BASE_URL}/dashboard/lab?production=${data.productionId}`;

  try {
    const { data: result, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: "alienation2innovation@gmail.com",
      subject: `New Commercial Order: ${data.title}`,
      html: generateNewOrderNotificationHtml({
        ...data,
        dashboardUrl,
      }),
    });

    if (error) {
      console.error("[EmailService] sendNewOrderNotificationEmail error:", error);
      return { success: false, error: error.message };
    }

    console.log(`[EmailService] New order notification sent: ${result?.id}`);
    return { success: true, id: result?.id };
  } catch (error) {
    console.error("[EmailService] sendNewOrderNotificationEmail exception:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send purchase notification to Gary on every successful checkout
 * This is triggered by the Stripe webhook on checkout.session.completed
 */
export async function sendPurchaseNotificationEmail(
  data: PurchaseNotificationData
): Promise<{ success: boolean; id?: string; error?: string }> {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(data.amount / 100);

  try {
    const { data: result, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: "alienation2innovation@gmail.com",
      subject: `New Purchase: ${data.productName} (${formattedAmount})`,
      html: generatePurchaseNotificationHtml(data),
    });

    if (error) {
      console.error("[EmailService] sendPurchaseNotificationEmail error:", error);
      return { success: false, error: error.message };
    }

    console.log(`[EmailService] Purchase notification sent: ${result?.id}`);
    return { success: true, id: result?.id };
  } catch (error) {
    console.error("[EmailService] sendPurchaseNotificationEmail exception:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ============================================================================
// HTML Templates (Inline for simplicity - could use React Email)
// ============================================================================

function generateProductionCompleteHtml(data: {
  customerName: string;
  productionTitle: string;
  thumbnailUrl?: string;
  videoUrl: string;
  downloadUrls: { mp4Hd?: string; mp4Sd?: string; gif?: string };
  mulliganUrl: string;
  dashboardUrl: string;
  processingTime?: number;
}): string {
  const processingMinutes = data.processingTime
    ? Math.round(data.processingTime / 60)
    : null;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Commercial is Ready</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0F; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0A0F; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #0B1220 0%, #0A0A0F 100%); border: 1px solid rgba(0, 206, 209, 0.2); border-radius: 16px; overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px; border-bottom: 1px solid rgba(0, 206, 209, 0.1);">
              <h1 style="margin: 0; color: #00CED1; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                BARRIOS A2I
              </h1>
              <p style="margin: 8px 0 0; color: #6B7280; font-size: 14px;">
                Commercial Lab
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px; color: #FFFFFF; font-size: 24px; font-weight: 600;">
                Your commercial is ready, ${data.customerName}!
              </h2>

              <p style="margin: 0 0 24px; color: #9CA3AF; font-size: 16px; line-height: 1.6;">
                <strong style="color: #00CED1;">${data.productionTitle}</strong> has been crafted by our AI production pipeline.
                ${processingMinutes ? `Completed in ${processingMinutes} minutes.` : ""}
              </p>

              <!-- Video Thumbnail -->
              ${data.thumbnailUrl ? `
              <div style="margin: 0 0 24px; border-radius: 12px; overflow: hidden; border: 1px solid rgba(0, 206, 209, 0.2);">
                <a href="${data.videoUrl}" target="_blank">
                  <img src="${data.thumbnailUrl}" alt="Video Preview" style="display: block; width: 100%; height: auto;">
                </a>
              </div>
              ` : ""}

              <!-- Download Buttons -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 32px;">
                <tr>
                  ${data.downloadUrls.mp4Hd ? `
                  <td style="padding-right: 8px;">
                    <a href="${data.downloadUrls.mp4Hd}" style="display: block; padding: 14px 24px; background: #00CED1; color: #000000; text-decoration: none; font-weight: 600; font-size: 14px; text-align: center; border-radius: 8px;">
                      Download HD
                    </a>
                  </td>
                  ` : ""}
                  ${data.downloadUrls.mp4Sd ? `
                  <td style="padding-left: 8px;">
                    <a href="${data.downloadUrls.mp4Sd}" style="display: block; padding: 14px 24px; background: rgba(0, 206, 209, 0.1); color: #00CED1; text-decoration: none; font-weight: 600; font-size: 14px; text-align: center; border-radius: 8px; border: 1px solid rgba(0, 206, 209, 0.3);">
                      Download SD
                    </a>
                  </td>
                  ` : ""}
                </tr>
              </table>

              <!-- Mulligan Section -->
              <div style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 12px; padding: 24px; margin: 0 0 24px;">
                <h3 style="margin: 0 0 12px; color: #D4AF37; font-size: 18px; font-weight: 600;">
                  Not quite right?
                </h3>
                <p style="margin: 0 0 16px; color: #9CA3AF; font-size: 14px; line-height: 1.5;">
                  Every production includes <strong style="color: #D4AF37;">one free mulligan</strong>. Click below to recreate your commercial with fresh creative direction.
                </p>
                <a href="${data.mulliganUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #D4AF37 0%, #B8941F 100%); color: #000000; text-decoration: none; font-weight: 700; font-size: 14px; border-radius: 8px; text-transform: uppercase; letter-spacing: 0.5px;">
                  Use Your Mulligan
                </a>
              </div>

              <!-- Dashboard Link -->
              <p style="margin: 0; color: #6B7280; font-size: 14px;">
                <a href="${data.dashboardUrl}" style="color: #00CED1; text-decoration: none;">
                  View in Dashboard &rarr;
                </a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; border-top: 1px solid rgba(0, 206, 209, 0.1); background: rgba(0, 0, 0, 0.3);">
              <p style="margin: 0; color: #6B7280; font-size: 12px; text-align: center;">
                Barrios A2I | Commercial Lab<br>
                <a href="${BASE_URL}" style="color: #00CED1; text-decoration: none;">www.barriosa2i.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function generateWelcomeHtml(data: WelcomeEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0F; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0A0F; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #0B1220 0%, #0A0A0F 100%); border: 1px solid rgba(0, 206, 209, 0.2); border-radius: 16px; overflow: hidden;">
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 24px; color: #00CED1; font-size: 28px;">Welcome to Commercial Lab!</h1>
              <p style="margin: 0 0 16px; color: #FFFFFF; font-size: 18px;">Hey ${data.customerName},</p>
              <p style="margin: 0 0 24px; color: #9CA3AF; font-size: 16px; line-height: 1.6;">
                You're now on the <strong style="color: #00CED1;">${data.tier}</strong> tier with <strong style="color: #D4AF37;">${data.monthlyTokens} tokens</strong> per month.
              </p>
              <a href="${BASE_URL}/dashboard/lab" style="display: inline-block; padding: 14px 32px; background: #00CED1; color: #000; text-decoration: none; font-weight: 600; border-radius: 8px;">
                Start Creating
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function generatePaymentFailedHtml(data: PaymentFailedEmailData): string {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(data.invoiceAmount / 100);

  const retryDateStr = data.retryDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0F; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0A0F; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #0B1220 0%, #0A0A0F 100%); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 16px; overflow: hidden;">
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 24px; color: #EF4444; font-size: 24px;">Payment Failed</h1>
              <p style="margin: 0 0 16px; color: #FFFFFF; font-size: 16px;">Hey ${data.customerName},</p>
              <p style="margin: 0 0 24px; color: #9CA3AF; font-size: 16px; line-height: 1.6;">
                We couldn't process your payment of <strong style="color: #FFFFFF;">${formattedAmount}</strong>.
                We'll retry on ${retryDateStr}.
              </p>
              <a href="${data.updatePaymentUrl}" style="display: inline-block; padding: 14px 32px; background: #EF4444; color: #FFFFFF; text-decoration: none; font-weight: 600; border-radius: 8px;">
                Update Payment Method
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function generateNewOrderNotificationHtml(data: {
  productionId: string;
  customerName: string;
  customerEmail: string;
  accountId: string;
  title: string;
  script: string;
  targetAudience?: string;
  brandVoice?: string;
  format?: string;
  duration?: number;
  priority: string;
  tokensUsed: number;
  timestamp: Date;
  dashboardUrl: string;
}): string {
  const formattedTime = data.timestamp.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Commercial Order</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0F; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0A0F; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #0B1220 0%, #0A0A0F 100%); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 16px; overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="padding: 24px 40px; text-align: center; border-bottom: 1px solid rgba(0, 206, 209, 0.1);">
              <h1 style="margin: 0; color: #00CED1; font-size: 24px; font-weight: 700; letter-spacing: 2px;">
                BARRIOS A2I
              </h1>
              <p style="margin: 4px 0 0; color: #6B7280; font-size: 12px;">
                New Order Notification
              </p>
            </td>
          </tr>

          <!-- Alert Banner -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="background: #D4AF37; border-radius: 8px; padding: 16px; text-align: center; margin-top: 24px;">
                <span style="color: #000000; font-size: 16px; font-weight: 700; letter-spacing: 1px;">
                  NEW ORDER RECEIVED
                </span>
              </div>
            </td>
          </tr>

          <!-- Order Details -->
          <tr>
            <td style="padding: 24px 40px;">
              <h2 style="margin: 0 0 16px; color: #00CED1; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                Order Details
              </h2>
              <p style="margin: 0 0 8px; color: #E4E4E7; font-size: 14px;">
                <span style="color: #71717A;">Production ID:</span> ${data.productionId}
              </p>
              <p style="margin: 0 0 8px; color: #E4E4E7; font-size: 14px;">
                <span style="color: #71717A;">Status:</span>
                <span style="background: #D4AF37; color: #000; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">QUEUED</span>
              </p>
              <p style="margin: 0 0 8px; color: #E4E4E7; font-size: 14px;">
                <span style="color: #71717A;">Order Time:</span> ${formattedTime}
              </p>
              <p style="margin: 0 0 8px; color: #E4E4E7; font-size: 14px;">
                <span style="color: #71717A;">Priority:</span> ${data.priority}
              </p>
              <p style="margin: 0; color: #E4E4E7; font-size: 14px;">
                <span style="color: #71717A;">Tokens Used:</span> ${data.tokensUsed}
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <hr style="border: none; border-top: 1px solid #27272A; margin: 0;">
            </td>
          </tr>

          <!-- Customer Info -->
          <tr>
            <td style="padding: 24px 40px;">
              <h2 style="margin: 0 0 16px; color: #00CED1; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                Customer
              </h2>
              <p style="margin: 0 0 8px; color: #E4E4E7; font-size: 14px;">
                <span style="color: #71717A;">Name:</span> ${data.customerName}
              </p>
              <p style="margin: 0 0 8px; color: #E4E4E7; font-size: 14px;">
                <span style="color: #71717A;">Email:</span>
                <a href="mailto:${data.customerEmail}" style="color: #00CED1; text-decoration: none;">${data.customerEmail}</a>
              </p>
              <p style="margin: 0; color: #E4E4E7; font-size: 14px;">
                <span style="color: #71717A;">Account ID:</span> ${data.accountId}
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <hr style="border: none; border-top: 1px solid #27272A; margin: 0;">
            </td>
          </tr>

          <!-- Creative Brief -->
          <tr>
            <td style="padding: 24px 40px;">
              <h2 style="margin: 0 0 16px; color: #00CED1; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                Creative Brief
              </h2>
              <p style="margin: 0 0 8px; color: #71717A; font-size: 14px;">Title:</p>
              <p style="margin: 0 0 16px; color: #FFFFFF; font-size: 14px; line-height: 1.6;">
                ${data.title}
              </p>
              <p style="margin: 0 0 8px; color: #71717A; font-size: 14px;">Script:</p>
              <div style="background: #18181B; border: 1px solid #27272A; border-radius: 8px; padding: 16px; margin: 0 0 16px;">
                <p style="margin: 0; color: #FFFFFF; font-size: 13px; line-height: 1.6; white-space: pre-wrap;">${data.script}</p>
              </div>
              ${data.targetAudience ? `
              <p style="margin: 0 0 8px; color: #71717A; font-size: 14px;">Target Audience:</p>
              <p style="margin: 0 0 16px; color: #FFFFFF; font-size: 14px; line-height: 1.6;">${data.targetAudience}</p>
              ` : ""}
              ${data.brandVoice ? `
              <p style="margin: 0 0 8px; color: #71717A; font-size: 14px;">Brand Voice:</p>
              <p style="margin: 0 0 16px; color: #FFFFFF; font-size: 14px; line-height: 1.6;">${data.brandVoice}</p>
              ` : ""}
              <p style="margin: 0 0 8px; color: #E4E4E7; font-size: 14px;">
                <span style="color: #71717A;">Format:</span> ${data.format || "16:9"}
              </p>
              <p style="margin: 0; color: #E4E4E7; font-size: 14px;">
                <span style="color: #71717A;">Duration:</span> ${data.duration || 64} seconds
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <hr style="border: none; border-top: 1px solid #27272A; margin: 0;">
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding: 32px 40px; text-align: center;">
              <a href="${data.dashboardUrl}" style="display: inline-block; padding: 14px 32px; background: #00CED1; color: #000000; text-decoration: none; font-weight: 600; font-size: 14px; border-radius: 8px;">
                View in Dashboard
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; border-top: 1px solid rgba(0, 206, 209, 0.1); background: rgba(0, 0, 0, 0.3); text-align: center;">
              <p style="margin: 0 0 8px; color: #71717A; font-size: 12px;">
                This order is awaiting manual fulfillment.
              </p>
              <p style="margin: 0; color: #52525B; font-size: 11px;">
                Barrios A2I Commercial Lab
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function generatePurchaseNotificationHtml(data: PurchaseNotificationData): string {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(data.amount / 100);

  const timestamp = new Date().toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  // Determine intent label and color
  const intentColors: Record<string, string> = {
    SUBSCRIPTION: "#00CED1",
    TOP_UP: "#D4AF37",
    CONSULTATION: "#8B5CF6",
    UPGRADE: "#10B981",
    ENTERPRISE: "#F59E0B",
  };
  const intentColor = intentColors[data.intent] || "#6B7280";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Purchase</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0F; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0A0F; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #0B1220 0%, #0A0A0F 100%); border: 1px solid rgba(0, 206, 209, 0.2); border-radius: 16px; overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="padding: 24px 40px; text-align: center; border-bottom: 1px solid rgba(0, 206, 209, 0.1);">
              <h1 style="margin: 0; color: #00CED1; font-size: 24px; font-weight: 700; letter-spacing: 2px;">
                BARRIOS A2I
              </h1>
              <p style="margin: 4px 0 0; color: #6B7280; font-size: 12px;">
                Purchase Notification
              </p>
            </td>
          </tr>

          <!-- Alert Banner -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="background: #10B981; border-radius: 8px; padding: 16px; text-align: center; margin-top: 24px;">
                <span style="color: #FFFFFF; font-size: 16px; font-weight: 700; letter-spacing: 1px;">
                  NEW PURCHASE - ${formattedAmount}
                </span>
              </div>
            </td>
          </tr>

          <!-- Purchase Details -->
          <tr>
            <td style="padding: 24px 40px;">
              <h2 style="margin: 0 0 16px; color: #00CED1; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                Purchase Details
              </h2>
              <p style="margin: 0 0 12px; color: #E4E4E7; font-size: 14px;">
                <span style="color: #71717A;">Product:</span>
                <strong style="color: #FFFFFF;">${data.productName}</strong>
              </p>
              <p style="margin: 0 0 12px; color: #E4E4E7; font-size: 14px;">
                <span style="color: #71717A;">Amount:</span>
                <strong style="color: #10B981;">${formattedAmount}</strong>
              </p>
              <p style="margin: 0 0 12px; color: #E4E4E7; font-size: 14px;">
                <span style="color: #71717A;">Intent:</span>
                <span style="background: ${intentColor}; color: #000; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">${data.intent}</span>
              </p>
              <p style="margin: 0 0 12px; color: #E4E4E7; font-size: 14px;">
                <span style="color: #71717A;">Time:</span> ${timestamp}
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <hr style="border: none; border-top: 1px solid #27272A; margin: 0;">
            </td>
          </tr>

          <!-- Customer Info -->
          <tr>
            <td style="padding: 24px 40px;">
              <h2 style="margin: 0 0 16px; color: #00CED1; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                Customer
              </h2>
              <p style="margin: 0 0 12px; color: #E4E4E7; font-size: 14px;">
                <span style="color: #71717A;">Email:</span>
                <a href="mailto:${data.customerEmail}" style="color: #00CED1; text-decoration: none;">${data.customerEmail}</a>
              </p>
              ${data.stripeCustomerId ? `
              <p style="margin: 0 0 12px; color: #E4E4E7; font-size: 14px;">
                <span style="color: #71717A;">Stripe Customer:</span>
                <a href="https://dashboard.stripe.com/customers/${data.stripeCustomerId}" style="color: #00CED1; text-decoration: none;">${data.stripeCustomerId}</a>
              </p>
              ` : ""}
              <p style="margin: 0; color: #E4E4E7; font-size: 14px;">
                <span style="color: #71717A;">Session:</span>
                <a href="https://dashboard.stripe.com/payments/${data.stripeSessionId}" style="color: #00CED1; text-decoration: none; font-size: 12px;">${data.stripeSessionId.substring(0, 30)}...</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; border-top: 1px solid rgba(0, 206, 209, 0.1); background: rgba(0, 0, 0, 0.3); text-align: center;">
              <p style="margin: 0; color: #52525B; font-size: 11px;">
                Barrios A2I | Stripe Webhook Notification
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export default {
  sendProductionCompleteEmail,
  sendWelcomeEmail,
  sendPaymentFailedEmail,
  sendNewOrderNotificationEmail,
  sendPurchaseNotificationEmail,
};
