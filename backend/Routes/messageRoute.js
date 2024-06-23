const express=require('express');
const { createMessage } = require('../api/messageController');
const router=express.Router();
const {cookieJwtAuth} = require('../middleware/cookieJwtAuth');
router.post('/create',cookieJwtAuth,createMessage)











module.exports=router