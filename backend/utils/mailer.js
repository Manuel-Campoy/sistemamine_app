const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Función centralizada para enviar correos
 * @param {string} destinatario - Correo de quien recibe
 * @param {string} asunto - Título del correo
 * @param {string} mensajeHtml - Cuerpo del correo en formato HTML
 */
const enviarCorreo = async (destinatario, asunto, mensajeHtml) => {
    try {
        const mailOptions = {
            from: `"SistemaMine Alertas" <${process.env.EMAIL_USER}>`,
            to: destinatario,
            subject: asunto,
            html: mensajeHtml
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Correo enviado a ${destinatario} [${info.messageId}]`);
        return true;
    } catch (error) {
        console.error(`Error al enviar correo a ${destinatario}:`, error);
        return false;
    }
};

module.exports = { enviarCorreo };