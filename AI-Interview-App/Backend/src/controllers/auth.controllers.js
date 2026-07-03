import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const registerUser = async (req, res) => {
    const {username , email , password , targetRole} = req.body;

    const isUserExist = await User.findOne({
        $or : [
            {username} , 
            {email}
        ]
    })

    if(isUserExist){
        return res.status(409).json({
            message : "User already exist"
        })
    }

    const hash = await bcrypt.hash(password ,10) ;

    const user = await User.create({
        username , 
        email , 
        password : hash ,
        targetRole
    })

    const token = jwt.sign(
        {
        id : user._id ,
        username : user.username
    }
    , process.env.JWT_SECRET ,
     {expiresIn : "1d"})

     res.cookie("token" , token)

     res.status(201).json({
        message : "User register Succesfully.." , 
        user : {
            email : user.email ,
            username : user.username ,
            bio : user.bio ,
            profileImg : user.profileImg
        }
     })
};

export const loginUser = async (req, res) => {
    try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.json({
      message: '✅ Login successful',
      token,
      user: { id: user._id, username: user.username, email: user.email, targetRole: user.targetRole }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};