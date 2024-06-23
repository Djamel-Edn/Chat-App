const mongoose=require('mongoose')

const messageSchema=mongoose.Schema({
    chatId:String,
    senderUsername:String,
    text:String,
    files:[],
    timestamp:Date,
    audioFile: String
})
module.exports=mongoose.model('Message',messageSchema)