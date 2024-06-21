const nodemailer = require("nodemailer");
const sendEmail = async (emailTo, subject, text) => {
  console.log("1");
  const transporter = await nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.sender,
      pass: process.env.pass,
    },
  });
  console.log("2");
  // send mail with defined transport object
  const info = await transporter.sendMail({
    to: emailTo, // list of receivers
    subject: subject, // Subject line
    text: text,
  });
  console.log("3");
  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
};

module.exports = sendEmail;
