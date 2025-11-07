async function readBody(stream: any): Promise<any> {
  return new Promise((resolve, reject) => {
    let data = '';
    stream.on('data', (chunk: any) => {
      data += chunk;
    });
    stream.on('end', () => {
      try {
        resolve(JSON.parse(data));
      } catch (error) {
        reject(error);
      }
    });
    stream.on('error', reject);
  });
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    let body = req.body;

    if (typeof body === 'string') {
      body = JSON.parse(body);
    } else if (body && typeof body === 'object' && !body.full_name) {
      body = await readBody(body);
    }

    const { full_name, email, interest, formation_title } = body;

    if (!full_name || !email || !interest || !formation_title) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const adminEmail = 'artur@forge.college';

    const emailBody = `
New waitlist registration for formation: ${formation_title}

Student Information:
- Name: ${full_name}
- Email: ${email}
- Interest: ${interest}

---
This is an automated email from Forge College Waitlist System
    `.trim();

    const confirmationEmailBody = `
Hello ${full_name},

Thank you for your interest in our "${formation_title}" formation! We're excited to have you on our waitlist.

We'll keep you updated as we prepare this program. In the meantime, you can:
- Explore our other learning paths
- Check out our existing formations
- Join our community

Best regards,
The Forge College Team
    `.trim();

    const adminResponse = await sendEmail(
      adminEmail,
      `New Waitlist Registration: ${formation_title}`,
      emailBody
    );

    const studentResponse = await sendEmail(
      email,
      `Waitlist Confirmation: ${formation_title}`,
      confirmationEmailBody
    );

    if (!adminResponse || !studentResponse) {
      throw new Error('Failed to send emails');
    }

    return res.status(200).json({ 
      message: 'Successfully joined waitlist and confirmation email sent',
      adminNotified: true,
      studentNotified: true,
    });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return res.status(500).json({ 
      message: error?.message || 'Failed to process waitlist registration',
      error: process.env.NODE_ENV === 'development' ? error?.message : undefined,
    });
  }
}

async function sendEmail(to: string, subject: string, text: string): Promise<boolean> {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (resendApiKey) {
      return await sendViaResend(to, subject, text, resendApiKey);
    }

    const sendgridApiKey = process.env.SENDGRID_API_KEY;
    
    if (sendgridApiKey) {
      return await sendViaSendgrid(to, subject, text, sendgridApiKey);
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseServiceKey) {
      return await sendViaSupabase(to, subject, text, supabaseUrl, supabaseServiceKey);
    }

    console.warn('No email service configured. Email not sent to:', to);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

async function sendViaResend(
  to: string,
  subject: string,
  text: string,
  apiKey: string
): Promise<boolean> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: 'noreply@forge.college',
      to,
      subject,
      text,
    }),
  });

  return response.ok;
}

async function sendViaSendgrid(
  to: string,
  subject: string,
  text: string,
  apiKey: string
): Promise<boolean> {
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: 'noreply@forge.college' },
      subject,
      content: [{ type: 'text/plain', value: text }],
    }),
  });

  return response.ok;
}

async function sendViaSupabase(
  to: string,
  subject: string,
  text: string,
  supabaseUrl: string,
  serviceKey: string
): Promise<boolean> {
  const response = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${serviceKey}`,
    },
    body: JSON.stringify({
      to,
      subject,
      text,
    }),
  });

  return response.ok;
}
