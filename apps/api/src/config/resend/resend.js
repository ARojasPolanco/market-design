import { Resend } from 'resend';
import { envs } from '../enviroments.js';

const resend = new Resend(envs.RESEND_API_KEY);

export class MailService {
  async sendVerificationEmail(to, token) {
    const verificationUrl = `${envs.CORS_ORIGIN}/verify-email?token=${token}`;

    await resend.emails.send({
      from: envs.OWNER_EMAIL || 'onboarding@resend.dev',
      to,
      subject: 'Verificá tu email - Market Design',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0F2A44;">¡Bienvenido a Market Design!</h1>
          <p>Para completar tu registro, verificá tu email haciendo click en el siguiente botón:</p>
          <a href="${verificationUrl}" style="display: inline-block; background: #00C2B8; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">
            Verificar email
          </a>
          <p style="color: #666; font-size: 14px;">Si no creaste esta cuenta, ignorá este mensaje.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #999; font-size: 12px;">Market Design - Diseños digitales que hacen crecer tus ideas.</p>
        </div>
      `,
    });
  }

  async sendDesignApproved(to, designTitle) {
    await resend.emails.send({
      from: envs.OWNER_EMAIL || 'onboarding@resend.dev',
      to,
      subject: '¡Tu diseño fue aprobado! - Market Design',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0F2A44;">¡Felicitaciones!</h1>
          <p>Tu diseño <strong>"${designTitle}"</strong> fue aprobado y ya está publicado en el marketplace.</p>
          <p>Los compradores ya pueden verlo y comprarlo.</p>
          <a href="${envs.CORS_ORIGIN}/vendedor/panel" style="display: inline-block; background: #00C2B8; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">
            Ver mi panel
          </a>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #999; font-size: 12px;">Market Design - Diseños digitales que hacen crecer tus ideas.</p>
        </div>
      `,
    });
  }

  async sendDesignRejected(to, designTitle, reason) {
    await resend.emails.send({
      from: envs.OWNER_EMAIL || 'onboarding@resend.dev',
      to,
      subject: 'Tu diseño fue rechazado - Market Design',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0F2A44;">Diseño rechazado</h1>
          <p>Tu diseño <strong>"${designTitle}"</strong> fue rechazado por el siguiente motivo:</p>
          <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 12px; margin: 16px 0;">
            <p style="margin: 0; color: #991b1b;">${reason}</p>
          </div>
          <p>Podés editar tu diseño y volver a enviarlo.</p>
          <a href="${envs.CORS_ORIGIN}/vendedor/panel" style="display: inline-block; background: #0F2A44; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">
            Ver mis diseños rechazados
          </a>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #999; font-size: 12px;">Market Design - Diseños digitales que hacen crecer tus ideas.</p>
        </div>
      `,
    });
  }

  async sendPurchaseConfirmation(to, designTitle, downloadUrl) {
    await resend.emails.send({
      from: envs.OWNER_EMAIL || 'onboarding@resend.dev',
      to,
      subject: '¡Compra exitosa! - Market Design',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0F2A44;">¡Gracias por tu compra!</h1>
          <p>Tu diseño <strong>"${designTitle}"</strong> está listo para descargar.</p>
          <a href="${downloadUrl}" style="display: inline-block; background: #00C2B8; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">
            Descargar diseño
          </a>
          <p style="color: #666; font-size: 14px;">El link de descarga expira en 24 horas. Si necesitás descargarlo de nuevo, hacelo desde tu panel de comprador.</p>
          <a href="${envs.CORS_ORIGIN}/comprador/panel" style="display: inline-block; background: #0F2A44; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">
            Ir a mis compras
          </a>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #999; font-size: 12px;">Market Design - Diseños digitales que hacen crecer tus ideas.</p>
        </div>
      `,
    });
  }

  async sendRankUpgrade(to, newRank, newCommission) {
    await resend.emails.send({
      from: envs.OWNER_EMAIL || 'onboarding@resend.dev',
      to,
      subject: '¡Subiste de rango! - Market Design',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0F2A44;">¡Felicitaciones!</h1>
          <p>Subiste al rango <strong>${newRank}</strong>. Tu nueva comisión es del <strong>${newCommission}%</strong>.</p>
          <p>Seguí vendiendo para alcanzar el siguiente nivel.</p>
          <a href="${envs.CORS_ORIGIN}/vendedor/panel" style="display: inline-block; background: #00C2B8; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">
            Ver mi panel
          </a>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #999; font-size: 12px;">Market Design - Diseños digitales que hacen crecer tus ideas.</p>
        </div>
      `,
    });
  }
}

export const mailService = new MailService();
