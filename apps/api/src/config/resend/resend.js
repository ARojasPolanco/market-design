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

  async sendDesignPaused(to, designTitle, reason, ticketId) {
    await resend.emails.send({
      from: envs.OWNER_EMAIL || 'onboarding@resend.dev',
      to,
      subject: `Tu diseño fue pausado - Ticket ${ticketId} - Market Design`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0F2A44;">Diseño pausado</h1>
          <p>Tu diseño <strong>"${designTitle}"</strong> fue pausado por el siguiente motivo:</p>
          <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px; margin: 16px 0;">
            <p style="margin: 0; color: #92400e;">${reason}</p>
          </div>
          <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="margin: 0; color: #374151; font-size: 14px;">
              <strong>Número de ticket:</strong> <span style="color: #0F2A44; font-weight: bold; font-size: 18px;">${ticketId}</span>
            </p>
            <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 13px;">
              Guardá este número para cualquier consulta sobre este caso.
            </p>
          </div>
          <p>Tu diseño no está visible para los compradores hasta que se resuelva esta situación.</p>
          <p>Si tenés preguntas, contactanos a <strong>soporte@market-design.com</strong> con el número de ticket.</p>
          <a href="${envs.CORS_ORIGIN}/vendedor/panel" style="display: inline-block; background: #0F2A44; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">
            Ver mi panel
          </a>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #999; font-size: 12px;">Market Design - Diseños digitales que hacen crecer tus ideas.</p>
        </div>
      `,
    });
  }

  async sendPurchaseConfirmation(to, data) {
    const { designTitle, downloadUrl, orderNumber, purchaseDate, previewUrl, sellerName } = data;
    
    const result = await resend.emails.send({
      from: envs.OWNER_EMAIL || 'onboarding@resend.dev',
      to,
      subject: `¡Compra exitosa! #${orderNumber} - Market Design`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
          <div style="text-align: center; padding: 30px 0; background: linear-gradient(135deg, #0F2A44 0%, #1a3d5c 100%); border-radius: 12px 12px 0 0;">
            <h1 style="color: #00C2B8; font-size: 28px; margin: 0;">Market Design</h1>
            <p style="color: #ffffff; margin: 8px 0 0 0; font-size: 14px;">Diseños digitales que hacen crecer tus ideas</p>
          </div>

          <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
            <h2 style="color: #0F2A44; font-size: 22px; margin: 0 0 8px 0;">¡Gracias por tu compra!</h2>
            <p style="color: #6b7280; margin: 0 0 24px 0;">Tu diseño está listo para descargar.</p>

            <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280; font-size: 14px;">Orden:</span>
                <span style="color: #0F2A44; font-weight: bold; font-size: 14px;">#${orderNumber}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280; font-size: 14px;">Fecha:</span>
                <span style="color: #0F2A44; font-size: 14px;">${purchaseDate}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #6b7280; font-size: 14px;">Vendedor:</span>
                <span style="color: #0F2A44; font-size: 14px;">${sellerName}</span>
              </div>
            </div>

            ${previewUrl ? `
            <div style="text-align: center; margin-bottom: 24px;">
              <img src="${previewUrl}" alt="${designTitle}" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
            </div>
            ` : ''}

            <h3 style="color: #0F2A44; font-size: 18px; text-align: center; margin: 0 0 24px 0;">${designTitle}</h3>

            <div style="text-align: center; margin-bottom: 24px;">
              <a href="${downloadUrl}" style="display: inline-block; background: #00C2B8; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                Descargar diseño
              </a>
              <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;">El link expira en 24 horas</p>
            </div>

            <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px; margin-bottom: 24px; border-radius: 0 8px 8px 0;">
              <p style="color: #166534; margin: 0; font-size: 14px;">
                <strong>¿Te gustó el diseño?</strong> Dejá tu review para ayudar a otros compradores y al vendedor.
              </p>
            </div>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />

            <div style="text-align: center;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 12px 0;">
                <a href="${envs.CORS_ORIGIN}/comprador/panel" style="color: #00C2B8; text-decoration: none;">Mis compras</a>
                &nbsp;&nbsp;|&nbsp;&nbsp;
                <a href="${envs.CORS_ORIGIN}/catalogo" style="color: #00C2B8; text-decoration: none;">Explorar más diseños</a>
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                ¿Necesitás ayuda? Escribinos a soporte@market-design.com
              </p>
            </div>
          </div>

          <div style="text-align: center; padding: 16px 0;">
            <p style="color: #9ca3af; font-size: 11px; margin: 0;">
              © ${new Date().getFullYear()} Market Design. Todos los derechos reservados.
            </p>
          </div>
        </div>
      `,
    });
    
    return result;
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

  async sendSaleNotification(to, designTitle, buyerName, price, commission, earnings) {
    const result = await resend.emails.send({
      from: envs.OWNER_EMAIL || 'onboarding@resend.dev',
      to,
      subject: '¡Nueva venta! - Market Design',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0F2A44;">¡Tenés una nueva venta!</h1>
          <p>Tu diseño <strong>"${designTitle}"</strong> fue comprado por <strong>${buyerName}</strong>.</p>
          <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px; margin: 16px 0;">
            <p style="margin: 0 0 8px 0; color: #166534; font-weight: bold;">Resumen de la venta</p>
            <p style="margin: 0; color: #166534;">Precio: $${Number(price).toLocaleString()}</p>
            <p style="margin: 0; color: #166534;">Comisión: -$${Number(commission).toLocaleString()}</p>
            <p style="margin: 8px 0 0 0; color: #166534; font-weight: bold; font-size: 18px;">Tu ganancia: $${Number(earnings).toLocaleString()}</p>
          </div>
          <a href="${envs.CORS_ORIGIN}/vendedor/panel" style="display: inline-block; background: #00C2B8; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">
            Ver mis ventas
          </a>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #999; font-size: 12px;">Market Design - Diseños digitales que hacen crecer tus ideas.</p>
        </div>
      `,
    });
    
    return result;
  }
}

export const mailService = new MailService();
