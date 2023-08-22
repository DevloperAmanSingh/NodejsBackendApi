const router = require('express').Router();
const verifyToken = require('../middlewares/verifyToken');
const User = require('../models/user');
const CryptoJS = require('crypto-js');
const verifyTokenAndAuthorization = require('../middlewares/verifyToken');
const verifyTokenAndAdmin = require('../middlewares/verifyToken');

router.put('/:id',verifyTokenAndAuthorization, async (req,res) => {
    if (req.body.password){
        req.body.password = CryptoJS.AES.encrypt(req.body.password,process.env.SECRET_KEY).toString();
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true});
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/find/:id',verifyTokenAndAdmin, async (req,res) => {
    try {
        const user = await User.findById(req.params.id);
        console.log(user.username);
        if (!user){
            res.status(404).json("User not found!");
        }
        const {password, ...others} = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/' , async (req,res) => {
  const amount = req.query.amount;
  const to = req.query.to;
  res.status(200).json(
    {
        status : "success",
        message : "Conversion successful",
        amount : "1 USD",
        conversion : "0.000043 BTC"
    }
  )
  console.log(amount,to)

    // url to fetch -> https://blockchain.info/tobtc?currency=USD&value=1
});


module.exports = router;