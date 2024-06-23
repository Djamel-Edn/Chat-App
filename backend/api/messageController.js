
const Message=require('../Models/messageModel');
const Chat=require('../Models/chatModel');
const createMessage=async(req,res)=>{
    const {senderUsername,chatId,text,files,audioFile}=req.body;
    try{
        const newMessage=new Message({
            senderUsername,
            chatId,
            text,
            files,
            audioFile,
            timestamp:new Date()
        })
        await newMessage.save();
        await Chat.findByIdAndUpdate(chatId,{$push:{messages:newMessage._id}});
        return res.status(201).json({message:newMessage})
    }catch(error){
        console.log(error);
        res.status(500).json({error:"Server error"})
    }
}
module.exports={createMessage}