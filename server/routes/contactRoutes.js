const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/contact', async (req, res) => {
  const { nom, email, message, destinataire } = req.body;
  if (!nom || !email || !message || !destinataire) {
    return res.status(400).json({ success: false, message: 'Champs manquants' });
  }

    const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false, // True pour le port 465
    auth: {
        user: process.env.BREVO_SMTP_USER, // Ex: abcd1234@smtp-brevo.com
        pass: process.env.BREVO_SMTP_PASS // Password d'une clé SMTP spécifique
    }
    });

    const mailOptions = {
    from: `"Farigoule Website" <${process.env.CONTACT_MAIL_FROM}>`, // Doit être un email vérifié dans Brevo
    to: destinataire,
    replyTo: email,
    subject: 'Message via le site de la Farigoule',
    text: `Message de ${nom} (${email}) :\n\n${message}`,
    };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Message envoyé' });
  } catch (error) {
    console.error('[MAIL ERROR]', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l’envoi',
    });
  }
});

module.exports = router;
