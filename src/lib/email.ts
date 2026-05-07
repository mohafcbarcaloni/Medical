import nodemailer from "nodemailer";

// Create a transporter using Gmail SMTP
// For this to work, you need to use an "App Password" from your Google Account if 2FA is enabled.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "mohacontactworks@gmail.com", // e.g. "your-clinic-email@gmail.com"
    pass: process.env.EMAIL_PASS || "vmss kkqe hcub uxmy", // The 16-character App Password
  },
});

export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  const user = process.env.EMAIL_USER || "mohacontactworks@gmail.com";
  const pass = process.env.EMAIL_PASS || "12042008kenmohtar-";

  if (!user || !pass) {
    console.warn("EMAIL_USER or EMAIL_PASS is not set. Simulating email send instead.");
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Dr. Abdellatif Tarek Clinic" <${user}>`,
      to,
      subject,
      text,
    });
    console.log("Message sent: %s", info.messageId);
    return { success: true, simulated: false };
  } catch (error: any) {
    console.error("Error sending email:", error);
    throw new Error(error.message || "Failed to send email");
  }
}
