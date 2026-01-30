// Vercel Serverless Function: Terminal Intake Email Handler
// Uses Resend for email delivery

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'ERR_METHOD_NOT_ALLOWED' });
  }

  try {
    const { email, company, objective, protocol, timestamp } = req.body;

    // Validate required fields
    if (!email || !company) {
      return res.status(400).json({
        error: 'ERR_MISSING_PARAMS: email and company required.'
      });
    }

    // Send via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Barrios Terminal <system@barriosa2i.com>',
        to: ['alienation2innovation@gmail.com'],
        subject: `[TERMINAL] New ${protocol} Inquiry - ${company}`,
        html: `
          <div style="font-family: 'Courier New', monospace; background: #0a0a1e; color: #00c2ff; padding: 32px; border: 1px solid #00c2ff33;">
            <div style="border-bottom: 1px solid #00c2ff33; padding-bottom: 16px; margin-bottom: 24px;">
              <h1 style="margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 4px; color: #00c2ff;">
                /// INCOMING TRANSMISSION ///
              </h1>
            </div>

            <table style="width: 100%; font-size: 14px;">
              <tr>
                <td style="color: #666; padding: 8px 0; width: 160px;">PROTOCOL_SELECTED:</td>
                <td style="color: #fff; padding: 8px 0; font-weight: bold;">${protocol || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="color: #666; padding: 8px 0;">ORGANIZATION_ID:</td>
                <td style="color: #fff; padding: 8px 0;">${company}</td>
              </tr>
              <tr>
                <td style="color: #666; padding: 8px 0;">TARGET_EMAIL:</td>
                <td style="color: #00c2ff; padding: 8px 0;">${email}</td>
              </tr>
              <tr>
                <td style="color: #666; padding: 8px 0;">TIMESTAMP:</td>
                <td style="color: #fff; padding: 8px 0;">${timestamp || new Date().toISOString()}</td>
              </tr>
              ${objective ? `
              <tr>
                <td style="color: #666; padding: 8px 0; vertical-align: top;">MISSION_BRIEF:</td>
                <td style="color: #fff; padding: 8px 0;">${objective}</td>
              </tr>
              ` : ''}
            </table>

            <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #00c2ff33;">
              <p style="margin: 0; font-size: 12px; color: #666;">
                [ SIGNAL_ORIGIN: barriosa2i.com/terminal ]
              </p>
            </div>
          </div>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend error:', data);
      return res.status(500).json({ error: 'ERR_TRANSMISSION_FAILED' });
    }

    // Success
    return res.status(200).json({
      status: 'SIGNAL_LOCKED',
      id: data.id
    });

  } catch (error) {
    console.error('Terminal intake error:', error);
    return res.status(500).json({
      error: 'ERR_NETWORK_FAILURE: Signal lost.'
    });
  }
}
