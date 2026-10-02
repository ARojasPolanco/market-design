import { Resend } from 'resend';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { envs } from '../enviroments.js';

const resend = new Resend(envs.RESEND_API_KEY);

const LOGO_CID = 'marketdesign-logo';
const LOGO_BUFFER = readFileSync(
  fileURLToPath(new URL('../../../assets/brand/logo.png', import.meta.url))
);

const RANK_COLORS = {
  bronce: '#CD7F32',
  plata: '#808080',
  oro: '#DAA520',
  platino: '#5AABAB',
  diamante: '#7C3AED',
};

export class MailService {
  async sendVerificationEmail(to, token) {
    const verificationUrl = `${envs.CORS_ORIGIN}/verify-email?token=${token}`;
    const year = new Date().getFullYear();

    return await resend.emails.send({
      from: envs.OWNER_EMAIL || 'onboarding@resend.dev',
      to,
      subject: 'Verificá tu email - Market Design',
      attachments: [
        {
          filename: 'market-design.png',
          content: LOGO_BUFFER,
          inlineContentId: LOGO_CID,
        },
      ],
      html: `
        <div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">
          Verificá tu email para activar tu cuenta en Market Design.
        </div>
        <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
          <div style="text-align: center; padding: 32px 20px; background: linear-gradient(135deg, #0F2A44 0%, #1a3d5c 100%); border-radius: 12px 12px 0 0;">
            <div style="display: inline-block; background: #ffffff; border-radius: 16px; padding: 14px 20px;">
              <img src="cid:${LOGO_CID}" alt="Market Design" style="height: 44px; display: block; border: 0;" />
            </div>
            <p style="color: #ffffff; margin: 16px 0 0 0; font-size: 14px;">Diseños digitales que hacen crecer tus ideas</p>
          </div>

          <div style="background: #ffffff; padding: 32px; border-radius: 0 0 12px 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
            <h1 style="color: #0F2A44; font-size: 24px; margin: 0 0 12px 0;">¡Bienvenido a Market Design!</h1>
            <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 8px 0;">
              Estás a un paso de empezar. Para <strong>comprar, vender y comentar</strong> necesitamos confirmar que este email es tuyo.
            </p>
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
              Hacé click en el botón para verificar tu cuenta. Mientras tanto, tu cuenta queda con acceso limitado.
            </p>

            <div style="text-align: center; margin: 0 0 24px 0;">
              <a href="${verificationUrl}" style="display: inline-block; background: #00C2B8; color: #ffffff; padding: 14px 34px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                Verificar mi email
              </a>
            </div>

            <p style="color: #9ca3af; font-size: 12px; line-height: 1.6; margin: 0 0 4px 0; text-align: center;">
              ¿El botón no funciona? Copiá y pegá este enlace en tu navegador:
            </p>
            <p style="color: #00C2B8; font-size: 12px; word-break: break-all; text-align: center; margin: 0 0 28px 0;">
              ${verificationUrl}
            </p>

            <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
              <p style="color: #0F2A44; font-size: 14px; font-weight: bold; margin: 0 0 12px 0;">
                Con tu cuenta verificada vas a poder:
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%;">
                <tr>
                  <td style="padding: 4px 8px 4px 0; color: #00C2B8; font-size: 15px; width: 22px; vertical-align: top;">&#10003;</td>
                  <td style="padding: 4px 0; color: #4b5563; font-size: 14px; line-height: 1.5;">Comprar diseños y descargarlos al instante</td>
                </tr>
                <tr>
                  <td style="padding: 4px 8px 4px 0; color: #00C2B8; font-size: 15px; vertical-align: top;">&#10003;</td>
                  <td style="padding: 4px 0; color: #4b5563; font-size: 14px; line-height: 1.5;">Publicar y vender tus propios diseños</td>
                </tr>
                <tr>
                  <td style="padding: 4px 8px 4px 0; color: #00C2B8; font-size: 15px; vertical-align: top;">&#10003;</td>
                  <td style="padding: 4px 0; color: #4b5563; font-size: 14px; line-height: 1.5;">Comentar y valorar a los vendedores</td>
                </tr>
              </table>
            </div>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 0 0 16px 0;" />
            <p style="color: #9ca3af; font-size: 12px; line-height: 1.6; margin: 0;">
              Si no creaste esta cuenta, podés ignorar este mensaje: no se activará nada.
            </p>
          </div>

          <div style="text-align: center; padding: 16px 0;">
            <p style="color: #9ca3af; font-size: 11px; margin: 0;">
              © ${year} Market Design. Todos los derechos reservados.
            </p>
          </div>
        </div>
      `,
    });
  }

  async sendDesignPaused(to, designTitle, reason, ticketId) {
    await resend.emails.send({
      from: envs.OWNER_EMAIL || 'onboarding@resend.dev',
      to,
      subject: `🚨 Diseño pausado - ACCIÓN REQUERIDA - Ticket ${ticketId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 8px;">🚨</div>
            <h1 style="color: white; font-size: 24px; margin: 0;">DISEÑO PAUSADO</h1>
            <p style="color: #fecaca; margin: 8px 0 0 0; font-size: 14px;">Acción requerida de tu parte</p>
          </div>

          <div style="background: white; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin-bottom: 20px; border-radius: 0 8px 8px 0;">
              <p style="margin: 0; color: #991b1b; font-weight: bold; font-size: 16px;">
                Tu diseño "${designTitle}" fue pausado
              </p>
            </div>

            <div style="background: #fffbeb; border: 2px solid #f59e0b; padding: 16px; margin-bottom: 20px; border-radius: 8px; text-align: center;">
              <p style="margin: 0; color: #92400e; font-weight: bold; font-size: 15px;">
                ⚠️ Tu diseño NO está visible para los compradores
              </p>
              <p style="margin: 8px 0 0 0; color: #b45309; font-size: 13px;">
                Estás perdiendo ventas hasta que se resuelva este problema
              </p>
            </div>

            <div style="margin-bottom: 20px;">
              <p style="color: #374151; font-weight: bold; margin: 0 0 8px 0;">Motivo de la pausa:</p>
              <div style="background: #f3f4f6; padding: 12px; border-radius: 8px;">
                <p style="margin: 0; color: #1f2937; font-size: 14px;">${reason}</p>
              </div>
            </div>

            <div style="background: #0F2A44; padding: 16px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
              <p style="color: #94a3b8; margin: 0 0 4px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Número de ticket</p>
              <p style="color: #00C2B8; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 2px;">${ticketId}</p>
              <p style="color: #94a3b8; margin: 8px 0 0 0; font-size: 11px;">Guardá este número para tu consulta</p>
            </div>

            <div style="margin-bottom: 20px;">
              <p style="color: #374151; font-weight: bold; margin: 0 0 12px 0;">¿Qué tenés que hacer?</p>
              <ul style="margin: 0; padding: 0 0 0 20px; color: #4b5563; font-size: 14px; line-height: 2;">
                <li>Contactanos por email a <strong>soporte@market-design.com</strong></li>
                <li>Mencioná el número de ticket: <strong>${ticketId}</strong></li>
                <li>Respondé al motivo de la pausa con tu explicación</li>
                <li>Una vez resuelto, reactivamos tu diseño</li>
              </ul>
            </div>

            <div style="text-align: center; margin-bottom: 20px;">
              <a href="mailto:soporte@market-design.com?subject=Reactivación%20diseño%20-%20Ticket%20${ticketId}&body=Hola,%0A%0AMi%20número%20de%20ticket%20es:%20${ticketId}%0A%0A" style="display: inline-block; background: #dc2626; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                📧 Contactar soporte ahora
              </a>
            </div>

            <div style="background: #fef2f2; padding: 12px; border-radius: 8px; text-align: center;">
              <p style="margin: 0; color: #991b1b; font-size: 13px; font-weight: bold;">
                ⏰ Mientras tu diseño esté pausado, no recibís ventas
              </p>
            </div>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="color: #9ca3af; font-size: 11px; text-align: center; margin: 0;">
              Este es un email automático de Market Design. No respondas directamente a este email.
            </p>
          </div>
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
    const panelUrl = `${envs.CORS_ORIGIN}/vendedor/panel`;
    const year = new Date().getFullYear();
    const rankColor = RANK_COLORS[String(newRank).toLowerCase()] || '#00C2B8';

    return await resend.emails.send({
      from: envs.OWNER_EMAIL || 'onboarding@resend.dev',
      to,
      subject: `🎉 ¡Subiste al rango ${newRank}! - Market Design`,
      attachments: [
        {
          filename: 'market-design.png',
          content: LOGO_BUFFER,
          inlineContentId: LOGO_CID,
        },
      ],
      html: `
        <div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">
          ¡Increíble! Subiste de rango en Market Design.
        </div>
        <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
          <div style="text-align: center; padding: 34px 20px 26px 20px; background: linear-gradient(135deg, #8B5CF6 0%, #FF5B8F 52%, #FFB347 100%); border-radius: 12px 12px 0 0;">
            <div style="font-size: 32px; line-height: 1; margin-bottom: 14px;">🎉&nbsp;&nbsp;✨&nbsp;&nbsp;🎉</div>
            <div style="display: inline-block; background: #ffffff; border-radius: 16px; padding: 12px 18px;">
              <img src="cid:${LOGO_CID}" alt="Market Design" style="height: 40px; display: block; border: 0;" />
            </div>
            <p style="color: #ffffff; margin: 14px 0 0 0; font-size: 14px; font-weight: bold; letter-spacing: 0.3px;">¡Lograste algo increíble!</p>
          </div>

          <div style="background: #ffffff; padding: 32px; border-radius: 0 0 12px 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
            <h1 style="color: #0F2A44; font-size: 26px; margin: 0 0 8px 0; text-align: center;">¡Felicitaciones! 🏆</h1>
            <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
              Subiste de rango y tu comisión bajó. Todo tu esfuerzo vendiendo en Market Design está dando frutos.
            </p>

            <div style="text-align: center; margin-bottom: 22px;">
              <div style="display: inline-block; background: ${rankColor}; border-radius: 999px; padding: 14px 32px; box-shadow: 0 6px 16px rgba(0,0,0,0.18);">
                <span style="color: #ffffff; font-size: 22px; font-weight: bold; letter-spacing: 0.5px;">⭐ ${newRank}</span>
              </div>
            </div>

            <div style="background: #f0fdfa; border: 2px solid #00C2B8; border-radius: 12px; padding: 22px; text-align: center; margin-bottom: 24px;">
              <p style="color: #0f766e; margin: 0 0 2px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Tu nueva comisión por venta</p>
              <p style="color: #0F2A44; margin: 0; font-size: 42px; font-weight: bold; line-height: 1.1;">${newCommission}%</p>
              <p style="color: #0f766e; margin: 6px 0 0 0; font-size: 13px;">Menos comisión, más ganancia para vos 💚</p>
            </div>

            <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0 0 26px 0; text-align: center;">
              Seguí publicando diseños de calidad para desbloquear el siguiente nivel. <strong>¡El próximo rango te espera!</strong>
            </p>

            <div style="text-align: center;">
              <a href="${panelUrl}" style="display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #00C2B8 100%); color: #ffffff; padding: 15px 38px; border-radius: 999px; text-decoration: none; font-weight: bold; font-size: 16px;">
                Ver mi panel
              </a>
            </div>
          </div>

          <div style="text-align: center; padding: 16px 0;">
            <p style="color: #9ca3af; font-size: 11px; margin: 0;">
              © ${year} Market Design. Todos los derechos reservados.
            </p>
          </div>
        </div>
      `,
    });
  }
}

export const mailService = new MailService();
