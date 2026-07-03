const {User} = require('../models/User');
const jwt = require('jsonwebtoken');
const {z} = require('zod');

//will be remove to .env later
const JWT_SECRET = 'MonsterBillSuperSecretKey2026';

//data schema
const registerSchema = z.object({
    username: z.string()
        .min(4, { message: 'Username should have at least 4 characters.'})
        .regex(/^[a-zA-Z0-9]+$/, { message: "Foramt falut: all the character should be num or A-Z" }),
    password: z.string()
        .min(8, { message: 'Username should have at least 8 characters.'})
        .regex(/[a-z]/, { message: "Password should include at least one lowcase character" })
        .regex(/[A-Z]/, { message: "Password should include at least one uppercase character" })
        .regex(/\d/, { message: "Password should include at least one number " }),
    email: z.string()
        .email({message: 'Emial format is invalid'})
});

const loginSchema = z.object({
    password: z.string()
        .min(1, {message: 'Please enter password'}),
    email: z.string()
        .email({message: 'Emial format is invalid'})
});


exports.register = async(req, res) => {
    try{
        const result = registerSchema.safeParse(req.body);
        if (!result.success){
            return res.status(400).json({ message: result.error.errors[0].message });
        } 
        const {username, email, password} = result.data;

        const existEmail = await User.findOne({ where: {email}});
        if (existEmail){
            return res.status(400).json({ message: 'This email is exist' });
        }

        await User.create({ username, email, password });
        res.status(201).json({ message: 'Register successfully' });
    } catch(e){
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

exports.login = async (req, res) => {
    try{
        const result = loginSchema.safeParse(req.body);
        if (!result.success){
            return res.status(400).json({ message: result.error.errors[0].message });
        }

        const {email, password} = result.data;
        const user = await User.findOne({where : {email}});
        if (!user){
            return res.status(400).json({message: 'User not exist'});
        }

        const isPassword = await user.validPassword(password);
        if (!isPassword){
            return res.status(400).json({message: 'Password Invalid'});
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

        res.status(200).json({
            message: 'Login Successfully',
            token: token,
            user: { id: user.id, username: user.username, email: user.email }
        })

    } catch(e){
        res.status(500).json({ message: 'Server error', error: err.message });
    }

}