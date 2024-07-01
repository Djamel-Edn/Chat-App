    const User = require('../Models/userModel.js');

    const bcrypt = require('bcryptjs');
    const jwt = require("jsonwebtoken")
    const validator = require('validator');
    const dotenv = require('dotenv');
    const nodemailer = require('nodemailer');
const { model } = require('mongoose');
const Chat= require('../Models/chatModel');
const Message=require('../Models/messageModel');
    dotenv.config();
    function addRandom(str){
        const randomString = Math.random().toString(36).substring(2, 5); 
        str += randomString;
    }
    const signUp = async (req, res) => {
        const { name, email, password } = req.body;
        try {
            if (!validator.isEmail(email)) {
                return res.status(400).json({ error: "Invalid email" });
            }
            if (!validator.isStrongPassword(password)) {
                return res.status(400).json({ error: "Password is not strong enough" });
            }



            let username = name; 
            let userExists = await User.findOne({ username }); 
    
            
            while (userExists) {
                addRandom(username);
                userExists = await User.findOne({ username });
            }
            
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ name, username, email, password: hashedPassword, profilePicture: "./defaultProfilePicture.png" });
            await newUser.save();
    
            const token = jwt.sign({ _id: newUser._id }, process.env.MY_SECRET, { expiresIn: 1000 * 60 * 60 });
            res.cookie("token", token, {
                httpOnly: true,
                //secure: true, // Uncomment this if you're using HTTPS
                maxAge: 1000000,
                //signed: true,
            });
            const userObject = newUser.toObject();
            delete userObject.password;
            return res.status(201).json({ userObject });
        } catch (error) {
            console.log("error :", error);
            res.status(500).json({ error: "Server error" });
        }
    }
    
    

    const login = async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            console.log(req.get('origin'))
            if (!user) {
                return res.status(400).json({ error: "User does not exist" });
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ error: "Invalid credentials" });
            }
            
            
            const token = jwt.sign({_id:user._id}, process.env.MY_SECRET, { expiresIn: 1000*60*60 });
res.cookie("token", token, {
    httpOnly: true,
    maxAge: 1000000,
});
            
userObject=user.toObject();
delete userObject.password
return  res.status(201).json({userObject});
        
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server error" });
        }
    };
    const getUserdata = async (req, res) => {
        try {
          const user=await User.findById(req.user._id).populate({
            path:"chats",
            populate:{
                path:"members",
                model:"User"
            }
          })
          .populate({
            path:"chats",
            populate:{
                path:"messages",
                model:"Message"
            }
          })
          .populate({
            path:'archives',
            populate:{
                path:"members",
                model:"User",
                
            }
          })
          .populate({
            path:'archives',
            populate:{
                path:"messages",
                model:"Message"
            }
          })
            if(!user){
                return res.status(400).json({error:"User not found"})
            }
            const userObject=user.toObject();
            delete userObject.password
            return res.status(200).json(userObject);
            

        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    };

    const sendMail = async (req, res) => {
        const { name, email, subject, message } = req.body;
    
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD, 
                },
            });
    
    
            const mailOptions = {
                from: email,
                to: process.env.EMAIL_USERNAME, 
                subject: subject,
                text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
                replyTo: email,
            };
    
        
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    res.status(500).json({ error: 'Server error' });
                } else {
                    console.log('Email sent:', info.response);
                    res.status(200).json({ message: 'Email sent successfully' });
                }
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    };
    const Search = async (req, res) => {
        const { username } = req.body;
        try {
            const users = await User.find({ username: { $regex: username, $options: 'i' } });
    
            if (users.length === 0) {
                return res.status(400).json({ error: "User(s) not found" });
            }
    
            return res.status(200).json({users});
        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
    const updateProfile = async (req, res) => {
        const { oldUsername, username, email, description, profilePicture, notifications, privacy } = req.body;
        try {
            const user = await User.findById(req.user._id);
            if (!user) {
                return res.status(400).json({ error: "User not found" });
            }
    
            if (username) {
                user.username = username;
            }
            if (email) {
                user.email = email;
            }
            if (description) {
                user.description = description;
            }
            if (profilePicture) {
                user.profilePicture = profilePicture;
            }
            if (notifications) {
                user.settings.notifications = notifications;
            }
            if (privacy) {
                user.settings.privacy = privacy;
            }
            await user.save();
    
            const chats = await Chat.find({ members: user._id }).populate('members');
            for (const chat of chats) {
                chat.members.forEach(member => {
                    if (member.username === oldUsername) {
                        member.username = username;
                    }
                });
                await chat.save();
            }
    
            await Message.updateMany(
                { senderUsername: oldUsername },
                { $set: { senderUsername: username } }
            );
    
            const userObject = user.toObject();
            delete userObject.password;
            return res.status(200).json(userObject);
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Server error" });
        }
    };
    const fromUsername=async (req,res)=>{
        const {username}=req.params
        try {
            const user=await User.findOne({username})
            if (!user){
                res.status(400).json({error:'user not found'})
            }
            userObject=user.toObject()
            delete userObject.password
            
            res.status(200).json(userObject)

        }catch(error){
            console.error(error)
        }
    }
    module.exports = { login, signUp,getUserdata,sendMail,Search,updateProfile,fromUsername};
