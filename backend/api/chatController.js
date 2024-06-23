const Chat=require('../Models/chatModel')
const User=require('../Models/userModel')
const Message=require('../Models/messageModel')
const createChat=async(req,res)=>{
    const {members}=req.body;
    try {
        const user1=await User.findOne({username:members[0]});
        const user2=await User.findOne({username:members[1]});
        if (!user2){
            return res.status(400).json({error:"User does not exist"})
        }
        if (user2.settings.privacy.ContactPossibility==='nobody'){
            return res.status(400).json({error:"User does not want to be contacted"})
        }
        const newChat=new Chat({
            members:[user1,user2]
        })
        await newChat.save();
        await User.updateMany(
            { username: { $in: [members[0], members[1]] } },
            { $push: { chats: newChat._id } }
        );
        return res.status(201).json({chat:newChat})
}catch(error){
    console.log(error);
    res.status(500).json({error:"Server error"})
}
}

const archiveChat=async(req,res)=>{
    const {chatId}=req.params;
    try {
        const chat=await Chat.findById(chatId);
        if (!chat){
            return res.status(400).json({error:"Chat not found"})
        }

        await User.findByIdAndUpdate(req.user._id,{$pull:{chats:chatId}})
        await User.findByIdAndUpdate(req.user._id,{$push:{archives:chatId}});
        return res.status(200).json({message:"Chat archived"})
}
catch(error){
    console.log(error)
}
}
const addMember = async (req, res) => {
    const { chatId, username } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }
        let chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(400).json({ error: "Chat not found" });
        }
        if (chat.members.includes(user._id)) {
            return res.status(400).json({ error: "User already in chat" });
        }
        await Chat.findByIdAndUpdate(chatId, { $push: { members: user._id } });
        await User.findByIdAndUpdate(user._id, { $push: { chats: chatId } });
        chat = await Chat.findById(chatId).populate('members').populate('messages');
    
        return res.status(200).json(chat);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }
};

const removeMember = async (req, res) => {
    const { chatId, username } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }
        let chat = await Chat.findById(chatId);
        if (!chat.members.includes(user._id)) {
            return res.status(400).json({ error: "User not in chat" });
        }
        await Chat.findByIdAndUpdate(chatId, { $pull: { members: user._id } });
        if (chat.members.length === 0) {
            await Chat.findByIdAndDelete(chatId);
        }
        await User.findByIdAndUpdate(user._id, { $pull: { chats: chatId } });
        chat = await Chat.findById(chatId).populate('members').populate('messages');
       
        return res.status(200).json(chat);
    } catch (error) {
        console.log(error);
    }
};
module.exports={createChat,archiveChat,addMember,removeMember}