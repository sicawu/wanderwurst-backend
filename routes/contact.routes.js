const router = require("express").Router();
const nodemailer = require("nodemailer");

// CONTACT FORM - SEND EMAIL
router.post("/contact", async (req, res, next) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Please fill in all required fields." });
  }

  try {
    // Set up transporter using Gmail + App Password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: `"Sweet Spot Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: `New message from ${name}`,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Your message was sent successfully!" });
  } catch (error) {
    console.error("Error sending contact form email:", error);
    next(error);
  }
});

module.exports = router;
