const { Router } = require('express');

const User = require("../models/user");
const { createHmac } = require('node:crypto');
const { createTokenForUser, validateToken } = require('../service/authentication');

const router = Router();

router.post("/register", async (req, res) => {
    const { token } = req.body;
    if(token) {
        const data = validateToken(token);
        const user = await User.findById(data._id);

        if(!user) {
            return res.json({msg : "Invalid user"});
        }
        else {
            return res.json({msg : "Valid user"});
        }
    }
    else {

        const { name, email, password } = req.body;

        await User.create({
            fullName : name,
            email : email,
            password : password
        });
        
        const user = await User.findOne({
            email : email
        });

        console.log(user);
        
        const token = createTokenForUser(user);
        return res.json({token : token});
    }
});

router.post("/validate", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({
        email: email
    });

    let msg = 'Authorized Access';
    if (user) {
        const salt = user.salt;
        const hashedPassword = user.password;

        const userProvidedHash = createHmac("sha256", salt)
            .update(password)
            .digest("hex");

        if (hashedPassword !== userProvidedHash)
            msg = 'Unauthorized Access';
    }
    else {
        msg = 'Unauthorized Access';
    }

    return res.json({ msg: msg });
});

module.exports = router;