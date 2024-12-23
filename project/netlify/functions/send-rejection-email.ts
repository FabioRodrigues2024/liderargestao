import { Handler } from '@netlify/functions';
import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { to, companyName, reason } = JSON.parse(event.body || '{}');

    if (!to || !companyName) {
      return { statusCode: 400, body: 'Missing required fields' };
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: 'Atualização sobre sua solicitação de conta',
      html: `
        <h1>Atualização sobre sua solicitação</h1>
        <p>Olá,</p>
        <p>Infelizmente sua solicitação de conta para ${companyName} não foi aprovada neste momento.</p>
        ${reason ? `<p>Motivo: ${reason}</p>` : ''}
        <p>Se você tiver dúvidas, por favor entre em contato conosco.</p>
        <p>Atenciosamente,<br>Equipe do Sistema</p>
      `
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' })
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send email' })
    };
  }
};