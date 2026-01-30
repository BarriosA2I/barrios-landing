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
      await resend.emails.send({
        from: 'Barrios A2I <notifications@barriosa2i.com>',
        to: ['alienation2innovation@gmail.com'],
        subject: `New Commercial Request: ${brandName}`,
        text: emailContent,
      });
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
