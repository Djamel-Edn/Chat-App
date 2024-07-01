const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const jwt = require('jsonwebtoken'); 
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
dotenv.config();
require('./api/passport');
const usersRoute = require('./Routes/usersRoute');
const chatRoute = require('./Routes/chatRoute');
const messageRoute = require('./Routes/messageRoute');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const Chat = require('./Models/chatModel');

app.use(bodyParser.json({ limit: '1gb' }));
app.use(bodyParser.urlencoded({ limit: '1gb', extended: true }));
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URI, {})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

const allowedOrigins = [
  'https://chat-app-gold-seven.vercel.app',
  'https://chat-clk3f3wii-goriocks-projects.vercel.app',
  'https://chat-app-git-main-goriocks-projects.vercel.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(session({
    secret: process.env.MY_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: 'sessions'
  })
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use('/user', usersRoute);
app.use('/chat', chatRoute);
app.use('/message', messageRoute);
app.get('/',
  (req, res) => res.send('Server is running.')
);

app.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/google/failure'
  }),
  function(req, res) {
    const token = jwt.sign({ _id: req.user._id }, process.env.MY_SECRET, { expiresIn: '1h' });
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000000,
    });
    res.redirect('https://chat-app-gold-seven.vercel.app/chat');
  }
);

app.get('/auth/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});

const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

let onlineUsers = [];
io.on('connection', (socket) => {
  

  socket.on('addNewUser', (username) => {
    if (!onlineUsers.some(user => user.username === username)) {
      onlineUsers.push({ username, socketId: socket.id });
    }
    io.emit('getOnlineUsers', onlineUsers);
    console.log(`User ${username} connected. Online users:`, onlineUsers);
  });



    socket.on('message', ( message,members) => {
      const membersUsernames=members?.map(member=>member.username)
      const filteredUsers = onlineUsers.filter(user => membersUsernames.includes(user.username));
      const memberIds = filteredUsers.map(user => user.socketId);
      memberIds.forEach(member => {
        io.to(member).emit('message',message);
    });
    const otherusers=onlineUsers.filter(user=>user.username!==message.senderUsername)
    const membersIds=otherusers.map(member=>member.socketId)
    
    membersIds.forEach(member=>{
      io.to(member).emit('notif',message)
    
    })
    })  
    ;
    socket.on('chat', async (chat) => {
      if (chat.members){

        membersUsernames=chat.members.map(member=>member.username)  
        const filteredUsers = onlineUsers.filter(user => membersUsernames.includes(user.username));
        const memberIds = filteredUsers.map(user => user.socketId);
        
        memberIds.forEach(member => { 
            io.to(member).emit('chat', chat);
        });
      }
  });
  socket.on('updateChat',(chat)=>{
    console.log('test update',chat)
    membersUsernames=chat.members.map(member=>member.username)  
    const filteredUsers = onlineUsers.filter(user => membersUsernames.includes(user.username));
    const memberIds = filteredUsers.map(user => user.socketId);
    
    memberIds.forEach(member => { 
        io.to(member).emit('updateChat', chat);
    });
  
  })
  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
    io.emit('getOnlineUsers', onlineUsers);
    console.log(`Client disconnected. Online users:`, onlineUsers);
  });
});

const PORT = process.env.PORT
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
