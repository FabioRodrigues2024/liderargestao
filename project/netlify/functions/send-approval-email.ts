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
    const { to, companyName } = JSON.parse(event.body || '{}');

    if (!to || !companyName) {
      return { statusCode: 400, body: 'Missing required fields' };
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: 'Sua conta foi aprovada!',
      html: `
        <h1>Bem-vindo ao Sistema!</h1>
        <p>Olá,</p>
        <p>Temos o prazer de informar que sua conta para ${companyName} foi aprovada!</p>
        <p>Você já pode acessar o sistema usando seu email e senha cadastrados.</p>
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