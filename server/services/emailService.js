const nodemailer = require('nodemailer');

/* Transporteur unique, créé une seule fois */
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,  // true si vous passez au port 465
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
});

const emailService = {
    async send({ nom, email, message, destinataire }) {
    const mailOptions = {
        from: `"Farigoule Website" <${process.env.CONTACT_MAIL_FROM}>`,
        to: destinataire,
        replyTo: email,
        subject: 'Message via le site',
        text: `Message de ${nom} (${email}) :\n\n${message}`,
    };

    return transporter.sendMail(mailOptions);
    },
}

module.exports = emailService;
