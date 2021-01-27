const { Router } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("../models/User");

const auth = require("../middleware/auth.middleware");

const router = Router();
const SECRET_KEY = process.env.SECRET_KEY;

router.post("/register", async (req, res) => {
  const { firstname, lastname, username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = new User({
    firstname,
    lastname,
    username,
    password: hashedPassword,
  });

  user.save((err, doc) => {
    if (err) {
      return res.status(400).json({ success: false, message: err });
    }
    return res.status(200).json({
      success: true,
    });
  });
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Пользователь не найден", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Неверный пароль, попробуйте снова", success: false });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      SECRET_KEY,
      { expiresIn: 60 }
    );
    
    res.status(200).json({ success: true, data: { token } });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Что то пошло не так", success: false });
  }
});

module.exports = router;
