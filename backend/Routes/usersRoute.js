const express=require('express')
const { signUp, login, getUserdata, sendMail, Search,  updateProfile, fromUsername } = require('../api/userController')
const { cookieJwtAuth } = require('../middleware/cookieJwtAuth')
const router = express.Router()

router.post('/register',signUp)
router.post('/login',login)
router.get('/getUser',cookieJwtAuth,getUserdata)
router.post('/sendMail',sendMail)
router.get('/logout',(req,res)=>{
    res.clearCookie('token');
    res.redirect('http://localhost:3000/');
})
router.post('/search',cookieJwtAuth,Search)
router.put('/updateProfile',cookieJwtAuth,updateProfile)
router.get('/:username',fromUsername)
module.exports=router