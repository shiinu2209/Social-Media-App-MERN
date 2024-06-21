const router = require("express").Router();
const sendMail = require("../utils/sendemail");
const crypto = require("crypto");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const {
  registerControler,
  loginControler,
} = require("../controllers/userController");

router.post("/signup", registerControler);
router.post("/login", loginControler);

router.post("/forgotpassword", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const token = crypto.randomBytes(32).toString("hex");
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    const resetPasswordExpire = Date.now() + 3600000; // 1 hour

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpire = resetPasswordExpire;
    await user.save();

    const resetUrl = `https://banao-mern-2.netlify.app/reset-password/${token}`;

    const message = `
      You are receiving this email because you (or someone else) has requested the reset of a password.
      Please click on the following link, or paste this into your browser to complete the process:
      ${resetUrl}
      If you did not request this, please ignore this email and your password will remain unchanged.
    `;

    await sendMail(user.email, "Password Reset Request", message);

    res.status(200).send("Email sent");
  } catch (error) {
    res.status(500).send("Server error");
  }
});
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send("Invalid or expired token");
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).send("Password reset successful");
  } catch (error) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
module.exports = router;
