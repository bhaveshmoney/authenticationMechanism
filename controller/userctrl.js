const Users = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userctrl = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            const user = await Users.findOne({ email });

            if (user) return res.status(400).json({ msg: "This email  already exists." })

            if (password.length < 6)
                return res.status(400).json({ msg: "Password is at 6 Charcaters long." })

            const passwordhash = await bcrypt.hash(password, 10);
            const newUser = new Users({
                name, email, password: passwordhash
            })
            await newUser.save();
            const accessToken = createAccessToken({ id: newUser._id })
            const refreshToken = createRefreshToken({ id: newUser._id })

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path: '/user/refresh_token'
            })
            res.json({ accessToken })
            // res.json({msg:"Registerd Sucessfully"})


        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    login: async (req, res) => {
        try {
           const {email, password} = req.body;

           const user = await Users.findOne({email});
           if(!user) return res.status(400).json({msg:"User does not exit"});

           const isMatch = await bcrypt.compare(password, user.password);
           if(!isMatch) return res.status(400).json({msg:"Incorrect Password"})

           const accessToken = createAccessToken({ id: user._id })
            const refreshToken = createRefreshToken({ id: user._id })

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path: '/user/refresh_token'
            })
            res.json({ accessToken })

        //    res.json({msg:"login success"})

        } catch (error) {
            return res.status(500).json({ msg: err.message });   
        }
    },
    refreshToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshToken;
            if (!rf_token) return res.status(400).json({ msg: "Please Login or register" });

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ msg: "Please Login or register" });

                const accessToken = createAccessToken({id: user.id})
                res.json({rf_token})
                //  res.json({user, accessToken})
            })

            // res.json({ rf_token });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }

    }
}


const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1D' })
}

const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7D' })
}

module.exports = userctrl