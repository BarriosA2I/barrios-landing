import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// GET - Get a single commercial request
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const request = await db.commercialRequest.findUnique({
      where: { id },
      include: {
        account: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!request) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ request });

  } catch (error) {
    console.error('Error fetching commercial request:', error);
    return NextResponse.json(
      { error: 'Failed to fetch request' },
      { status: 500 }
    );
  }
}

// PATCH - Update a commercial request status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const { status, internalNotes, deliveryUrl } = body;

    // Get current request to check status change
    const currentRequest = await db.commercialRequest.findUnique({
      where: { id },
    });

    if (!currentRequest) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: Record<string, unknown> = {};

    if (status) {
      updateData.status = status;

      // Set deliveredAt timestamp when marking as delivered
      if (status === 'DELIVERED') {
        updateData.deliveredAt = new Date();
      }
    }

    if (internalNotes !== undefined) {
      updateData.internalNotes = internalNotes;
    }

    if (deliveryUrl !== undefined) {
      updateData.deliveryUrl = deliveryUrl;
    }

    // Update the request
    const updatedRequest = await db.commercialRequest.update({
      where: { id },
      data: updateData,
    });

    // Send delivery email to client if status changed to DELIVERED
    if (status === 'DELIVERED' && currentRequest.status !== 'DELIVERED') {
      const deliveryEmailContent = `
Hi ${currentRequest.clientName || 'there'},

Great news! Your commercial for ${currentRequest.brandName} is ready for review!

${deliveryUrl ? `View Your Commercial: ${deliveryUrl}` : 'Your commercial will be shared with you shortly.'}

If you have any questions or need revisions, simply reply to this email.

Thank you for choosing Barrios A2I!

Best,
The Barrios A2I Team
      `.trim();

      try {
        await resend.emails.send({
          from: 'Barrios A2I <delivery@barriosa2i.com>',
          to: [currentRequest.clientEmail],
          subject: `Your Commercial is Ready! - ${currentRequest.brandName}`,
          text: deliveryEmailContent,
          replyTo: 'gary@barriosa2i.com',
        });

        console.log(`Delivery email sent to ${currentRequest.clientEmail}`);
      } catch (emailError) {
        console.error('Failed to send delivery email:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      request: updatedRequest,
      message: status === 'DELIVERED'
        ? 'Request marked as delivered and client notified'
        : 'Request updated successfully',
    });

  } catch (error) {
    console.error('Error updating commercial request:', error);
    return NextResponse.json(
      { error: 'Failed to update request' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a commercial request
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.commercialRequest.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Request deleted',
    });

  } catch (error) {
    console.error('Error deleting commercial request:', error);
    return NextResponse.json(
      { error: 'Failed to delete request' },
      { status: 500 }
    );
  }
}
