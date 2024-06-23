const express = require('express');
const { createChat,  archiveChat, addMember, removeMember } = require('../api/chatController');
const {cookieJwtAuth} = require('../middleware/cookieJwtAuth');

const router = express.Router();

router.post('/removeMember', cookieJwtAuth, removeMember)
router.post('/create', cookieJwtAuth, createChat);
router.put('/archive/:chatId', cookieJwtAuth, archiveChat);
router.post('/addMember', cookieJwtAuth, addMember);
module.exports = router;