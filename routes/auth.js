const router = require('express').Router();
const User = require('../models/user');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

// Register
router.post("/register", async (req, res) => {

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString(),
        isAdmin: req.body.isAdmin
    });
   try {
    const user = await newUser.save();
    res.status(200).json(user);
   } catch (err) {
        res.status(500).json(err);
   }
});

// LOGIN 

router.post("/login", async (req, res) => {
  try {
    console.log(req.body);
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json("Wrong password or username!");
    }
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.SECRET_KEY
    );
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    console.log(OriginalPassword);
    if (OriginalPassword === req.body.password) {
      console.log("You are now logged in!");
      const { password, ...others } = user._doc;
      const token =  jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.SECRET_KEY,
        { expiresIn: "1d" } );
        User.updateOne({_id:user._id},{$set:{token:token}});
        res.status(200).json({...others, token});
    } else {
      res.status(401).json("Wrong Username or Password");
    }
  } catch (err) {
    res.status(500).json(err);
  }     
});

module.exports = router;
