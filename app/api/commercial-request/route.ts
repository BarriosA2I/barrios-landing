import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// POST - Submit a new commercial request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      brandName,
      product,
      targetAudience,
      tone,
      keyMessage,
      cta,
      clientEmail,
      clientName,
      priority = 'STANDARD',
      accountId,
    } = body;

    // Validate required fields
    if (!brandName || !product || !targetAudience || !tone || !keyMessage || !cta || !clientEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the commercial request
    const request = await db.commercialRequest.create({
      data: {
        brandName,
        product,
        targetAudience,
        tone,
        keyMessage,
        cta,
        clientEmail,
        clientName,
        priority,
        accountId,
        status: 'PENDING',
      },
    });

    // Send email notification to Gary
    const emailContent = `
New Commercial Request: ${brandName}

Client: ${clientName || 'Not provided'} (${clientEmail})
Brand: ${brandName}
Product: ${product}
Target Audience: ${targetAudience}
Tone: ${tone}
Key Message: ${keyMessage}
CTA: ${cta}
Priority: ${priority}

Request ID: ${request.id}
Submitted: ${new Date().toLocaleString()}

View in Dashboard: https://www.barriosa2i.com/dashboard/queue
    `.trim();

    try {
      // ==========================================
      // EMAIL 1: Notification to Gary (Admin)
      // ==========================================
      await resend.emails.send({
        from: 'Barrios A2I <notifications@barriosa2i.com>',
        to: ['alienation2innovation@gmail.com'],
        subject: `🎬 New Commercial Request: ${brandName}`,
        text: emailContent,
      });
      console.log(`✅ Admin notification sent to: alienation2innovation@gmail.com`);

      // ==========================================
      // EMAIL 2: Confirmation to Client
      // ==========================================
      await resend.emails.send({
        from: 'Barrios A2I Commercial Lab <noreply@barriosa2i.com>',
        replyTo: 'alienation2innovation@gmail.com',
        to: clientEmail,
        subject: `🎬 We've Received Your Commercial Brief - ${brandName}`,
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #e0e0e0; padding: 30px; border-radius: 12px; border: 1px solid #00CED1;">

            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #00CED1; margin: 0; font-size: 24px;">Your Commercial is in Production! 🎬</h1>
            </div>

            <!-- Confirmation Message -->
            <div style="background: linear-gradient(135deg, rgba(0,206,209,0.1), rgba(0,139,139,0.1)); padding: 25px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #00CED1;">
              <p style="margin: 0; font-size: 16px; line-height: 1.6;">
                Hey there! 👋
              </p>
              <p style="margin-top: 15px; font-size: 16px; line-height: 1.6;">
                We've received your commercial brief for <strong style="color: #00CED1;">${brandName}</strong> and our AI-powered production system is already analyzing your requirements.
              </p>
            </div>

            <!-- What's Next -->
            <div style="background: #111118; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h2 style="color: #00CED1; margin-top: 0; font-size: 18px;">⏱️ What Happens Next</h2>

              <div style="margin-bottom: 15px;">
                <span style="background: #00CED1; color: #000; padding: 2px 8px; border-radius: 50%; font-weight: bold; margin-right: 10px;">1</span>
                <strong style="color: #fff;">Brief Analysis</strong>
                <p style="margin: 5px 0 0 28px; color: #aaa; font-size: 14px;">Our team reviews your creative direction and target audience</p>
              </div>

              <div style="margin-bottom: 15px;">
                <span style="background: #00CED1; color: #000; padding: 2px 8px; border-radius: 50%; font-weight: bold; margin-right: 10px;">2</span>
                <strong style="color: #fff;">AI Production</strong>
                <p style="margin: 5px 0 0 28px; color: #aaa; font-size: 14px;">RAGNAROK generates your commercial with custom visuals and voiceover</p>
              </div>

              <div>
                <span style="background: #00CED1; color: #000; padding: 2px 8px; border-radius: 50%; font-weight: bold; margin-right: 10px;">3</span>
                <strong style="color: #fff;">Delivery</strong>
                <p style="margin: 5px 0 0 28px; color: #aaa; font-size: 14px;">Your completed commercial arrives in your inbox within ${priority === 'RUSH' ? '24' : '48'} hours</p>
              </div>
            </div>

            <!-- Brief Summary -->
            <div style="background: #111118; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h2 style="color: #00CED1; margin-top: 0; font-size: 18px;">📋 Your Brief Summary</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #888; width: 120px;">Brand</td>
                  <td style="padding: 8px 0; color: #fff;">${brandName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #888;">Product</td>
                  <td style="padding: 8px 0; color: #fff;">${product.substring(0, 100)}${product.length > 100 ? '...' : ''}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #888;">Audience</td>
                  <td style="padding: 8px 0; color: #fff;">${targetAudience.substring(0, 100)}${targetAudience.length > 100 ? '...' : ''}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #888;">Tone</td>
                  <td style="padding: 8px 0; color: #fff;">${tone}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #888;">Call to Action</td>
                  <td style="padding: 8px 0; color: #fff;">${cta}</td>
                </tr>
              </table>
            </div>

            <!-- Questions CTA -->
            <div style="text-align: center; padding: 20px; background: rgba(0,206,209,0.05); border-radius: 8px; margin-bottom: 25px;">
              <p style="margin: 0 0 15px; color: #ccc;">Have questions or need to update your brief?</p>
              <a href="mailto:alienation2innovation@gmail.com?subject=Question about ${encodeURIComponent(brandName)} Commercial"
                 style="color: #00CED1; text-decoration: none; font-weight: bold;">
                Reply to this email →
              </a>
            </div>

            <!-- Footer -->
            <div style="text-align: center; padding-top: 20px; border-top: 1px solid #333;">
              <p style="color: #666; font-size: 12px; margin: 0;">Reference ID: ${request.id}</p>
              <p style="color: #888; font-size: 14px; margin-top: 15px;">
                <strong style="color: #00CED1;">Barrios A2I</strong> | AI-Powered Commercial Production
              </p>
              <p style="color: #666; font-size: 12px; margin-top: 10px;">
                <a href="https://www.barriosa2i.com" style="color: #00CED1; text-decoration: none;">www.barriosa2i.com</a>
              </p>
            </div>

          </div>
        `,
      });
      console.log(`✅ Client confirmation sent to: ${clientEmail}`);

    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      requestId: request.id,
      message: "Your commercial request has been submitted! You'll receive your completed commercial within 48 hours.",
      deliveryTime: priority === 'RUSH' ? '24 hours' : '48 hours',
    });

  } catch (error) {
    console.error('Error creating commercial request:', error);
    return NextResponse.json(
      { error: 'Failed to submit request' },
      { status: 500 }
    );
  }
}

// GET - List commercial requests (for dashboard)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }

    const requests = await db.commercialRequest.findMany({
      where,
      orderBy: [
        { status: 'asc' }, // PENDING first
        { createdAt: 'desc' },
      ],
      take: limit,
      include: {
        account: {
          select: {
            name: true,
          },
        },
      },
    });

    // Get counts by status
    const counts = await db.commercialRequest.groupBy({
      by: ['status'],
      _count: true,
    });

    const statusCounts = {
      PENDING: 0,
      IN_PROGRESS: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    };

    counts.forEach((c) => {
      statusCounts[c.status as keyof typeof statusCounts] = c._count;
    });

    return NextResponse.json({
      requests,
      counts: statusCounts,
      total: requests.length,
    });

  } catch (error) {
    console.error('Error fetching commercial requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch requests' },
      { status: 500 }
    );
  }
}
