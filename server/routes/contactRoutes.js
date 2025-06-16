const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/contact', async (req, res) => {
  const { nom, email, message, destinataire } = req.body;

  if (!nom || !email || !message || !destinataire) {
    return res.status(400).json({ success: false, message: 'Champs manquants' });
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email', //'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: 'erick.spencer@ethereal.email', //user: process.env.BREVO_SMTP_USER,
      pass: 'aPAwzhm7FVkdARwtwz' // pass: process.env.BREVO_SMTP_PASS,
    }
  });

  const mailOptions = {
    from: `"Website" <erick.spencer@ethereal.email>`, // from: "Website" <${process.env.BREVO_SMTP_USER}>,
    to: destinataire,
    replyTo: email,
    subject: 'Message via le site de la Farigoule',
    text: `Message de ${nom} (${email}) :\n\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Message envoyé' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l’envoi',
    });
  }
});

module.exports = router;
