import React, { useEffect, useRef, useState } from 'react'
import SideBar from '../components/sideBar';

import SearchIcon from '../assets/searchIcon';
import MicIcon from './../assets/micIcon';
import SendMessageIcon from './../assets/sendMessageIcon';
import AttachmentIcon from './../assets/attachmentIcon';
import EmoteIcon from '../assets/emoteIcon';
import ThreeDotsIcon from '../assets/threeDotsIcon.jsx';
import DocumentIcon from './../assets/DocumentIcon';
import io from 'socket.io-client';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
const OnlineIcon = () => (
    <div style={{
        width: '15px',
        height: '15px',
        backgroundColor: 'green',
        borderRadius: '50%',
        display: 'inline-block',
        marginLeft: '8px'
    }}></div>
);
const ArchivesPage = () => {
 
    const [userData, setUserData] = useState({});
    const [unreadCounts, setUnreadCounts] = useState({});
    const [chats, setChats] = useState([]);

    const [selectedChat, setSelectedChat] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
        const [loading, setLoading] = useState(true)
    const [newMessage, setNewMessage] = useState('');
    const [files, setFiles] = useState([]);
    const [socket, setSocket] = useState(null);
    const messageContainerRef = useRef(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [dotMenu, setDotMenu] = useState(false);  
    useEffect(() => {
        const newSocket = io('https://chat-app-fjxy.onrender.com');
        setSocket(newSocket);
        
        newSocket.on('getOnlineUsers', (users) => {
            setOnlineUsers(users);
        });

        newSocket.emit('addNewUser', userData.username);
        newSocket.on('message',(message)=>{
            
            setChats((prevChats) => {
               return prevChats.map((chat) => {
                   if (chat._id === message.chatId) {
                       return {
                           ...chat,
                           messages: [...chat.messages, message]
                       };
                   }
                   return chat;
               });
           });
           
           if (!selectedChat || message.chatId !== selectedChat._id) {
               setUnreadCounts((prevUnreadCounts) => ({
                   ...prevUnreadCounts,
                   [message.chatId]: (prevUnreadCounts[message.chatId] || 0) + 1
               }))}})
        newSocket.on('chat', (chat) => {
            setChats((prevChats) => [...prevChats, chat]);
           
        })
        return () => {
            newSocket.disconnect();
        };
    }, [userData.username,selectedChat]);


  

    useEffect(() => {
        
        if (selectedChat){

            chats.map((chat)=>{if (chat._id===selectedChat._id){
                setSelectedChat(chat)
            }})
        }
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [chats]);
    useEffect(() => {
        setLoading(true)
        const getUser = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:4000/user/getUser', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });

                if (response.status === 401) {
                    setLoading(false);
                    return window.location.replace('http://localhost:3000/login');
                }

                const data = await response.json();
                setUserData(data);
                setChats(data.archives);
               
                setLoading(false);
               
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        getUser();
       
    }, []);
   
    
   
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!selectedChat || (!newMessage && !files)) { return; }

        try {
            const response = await fetch('https://chat-app-fjxy.onrender.com/message/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ text: newMessage, chatId: selectedChat._id, senderUsername: userData.username, files })
            });
            if (response.status === 401) {
                return window.location.replace('http://localhost:3000/login');
            }
            const data = await response.json();
            setNewMessage('');
            setFiles([]);
            socket.emit('message',  data.message,selectedChat.members);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    
    const handleDelete = async () => {
        try {
            const response = await fetch(`https://chat-app-fjxy.onrender.com/chat/delete/${selectedChat._id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (response.status === 401) {
                return window.location.replace('http://localhost:3000/login');
            }

            if (response.status === 200) {
                setChats(chats.filter((chat) => chat._id !== selectedChat._id));
                setInitialChats(initialChats.filter((chat) => chat._id !== selectedChat._id));
                setSelectedChat(null);
                setUserData((prevUserData) => ({
                    ...prevUserData,
                    chats: [...prevUserData.chats.filter((chat) => chat._id !== selectedChat._id)]
                }));
            } else {
                console.error('Failed to delete chat');
            }
        } catch (error) {
            console.error('Error deleting chat:', error);
        }
    };
    const handleFileChange = (e) => {
        const filesArray = Array.from(e.target.files);

        const promises = filesArray.map((file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
            });
        });

        Promise.all(promises)
            .then((base64Strings) => {
                setFiles(base64Strings);
            })
            .catch((error) => console.error('Error converting files:', error));
    };

   function handleselection(chat) {
     setSelectedChat(chat);
    }

    function getChatUsers(array) {
        if (!array) { return console.log('Array is empty'); }
        return array?.filter(user => user?.username !== userData?.username);
    }

    const convertBase64ToImage = (base64String) => {
        try {
            if (!base64String) {
                return null;
            }

            const base64 = base64String.replace(/^data:image\/[a-z]+;base64,/, '');

            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            const blob = new Blob([byteArray], { type: 'image/jpeg' });

            const urlCreator = window.URL || window.webkitURL;
            const imageUrl = urlCreator.createObjectURL(blob);

            return imageUrl;
        } catch (error) {
            console.error('Error converting base64 to image:', error);
            return null;
        }
    };

    const isUserOnline = (username) => {
        return onlineUsers.some(user => user.username === username);
    };
    const senderimg = (senderUsername) => {
        const member = selectedChat.members.find(member => member.username === senderUsername);
        if (member) {
            return member.profilePicture;
        } 
    }
    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };
    return (
        <div className="flex p-4 h-screen bg-[#e1e1e1] gap-4 w-full">
            <SideBar fillChat="#FFFFFF" fillArchives="#FF4A09" fillSettings="#FFFFFF" fillProfile="#1B1A32" usernam={userData.username} />
             {loading ? (
                <div className="flex justify-center items-center w-full h-full">
                    <p>Loading...</p>
                </div>
            ) :(

           <>
           
            <div className="w-full flex gap-2">
                <div className="w-2/6 h-full flex flex-col gap-2">
                    
                    <div className="w-full rounded-2xl bg-white h-full overflow-y-scroll">
                       
                        {chats && (
                            chats.map((chat) => (
                                <div key={chat._id} className={`flex justify-between items-center gap-4 py-2 px-4 border-b border-gray-200 hover:cursor-pointer hover:bg-gray-200 ${selectedChat==chat ? 'bg-gray-300':'bg-white'}`} onClick={() => handleselection(chat)}>
                                    <div className="w-1/8 h-12 bg-gray-200 rounded-full relative">
                                        <img src={getChatUsers(chat?.members)[0]?.profilePicture} alt="not found" className='h-full w-full rounded-full' />
                                            <span key={chat.members[0].username} className='absolute -bottom-2 right-0'>
                                        {getChatUsers(chat.members).some(member => isUserOnline(member.username)) && <OnlineIcon key={chat.members[0].username} />}
                                        
                                        
                                        </span>
                            
                                        
                                    </div>
                                    <div className="w-4/6 h-10 flex flex-col gap-1">
                                        <h2>
                                            {getChatUsers(chat.members).map(user => (
                                                <span key={user.username}>
                                                    {user.username}
                                                </span>
                                            ))}
                                        </h2>
                                        <p>{chat.messages && chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].text : ''}</p>
                                    </div>
                                    <div className="w-1/6 h-full flex flex-col justify-center text-right">
                                        <h4 className='text-sm'>
                                            {chat.messages && chat.messages.length > 0 ? 
                                                new Date(chat.messages[chat.messages.length - 1].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : ''}
                                        </h4>
                                        {unreadCounts[chat._id] > 0 && (
                                                    <span className="ml-2 bg-red-500 text-white rounded-full w-6 flex justify-center  text-lg h-6">
                                                        {unreadCounts[chat._id]}
                                                    </span>
                                                )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="w-4/6 h-full flex flex-col gap-2">
                    <div className="w-full h-[15%] flex justify-between bg-white rounded-2xl p-2">
                        <div className='flex items-center h-full gap-3 w-2/5 font-semibold'> 
                            <div className="w-1/8 h-12 bg-gray-200 rounded-full relative">
                                {selectedChat && selectedChat.members && selectedChat.members.length > 0 && (
                                    <img src={getChatUsers(selectedChat?.members)[0]?.profilePicture} alt="not found" className='h-full w-full rounded-full' />
                                
                        
                                )}
                                {selectedChat && <span key={selectedChat?._id} className='absolute -bottom-2 right-0'>
                                    {selectedChat && getChatUsers(selectedChat?.members).members?.some(member => isUserOnline(member.username)) && <OnlineIcon key={selectedChat?._id} />}
                                    </span>}
                            </div>
                            <div className="w-4/6 h-10 flex flex-col gap-1">
                                {selectedChat && (
                                    <h2>{getChatUsers(selectedChat?.members)?.map(user => (
                                        <span key={user.username}>
                                            {user.username}
                                            
                                        </span>
                                    ))}</h2>
                                )}
                            </div>
                        </div>
                        <div className="h-full flex items-center gap-2">
                        <button disabled className='px-6 py-2 border-gray-300 border rounded-2xl font-bold'>
                                Profile
                            </button>
                            <button disabled className='px-8 py-2 border-gray-300 border rounded-2xl font-semibold bg-black text-white'>
                                Call
                            </button>
                            <div className='border bg-gray-200 h-10 w-0.5'></div>
                            <button className='w-10 h-8' disabled><SearchIcon /></button>
                            <button className='relative' disabled onClick={()=>setDotMenu(!dotMenu)}>
                                <ThreeDotsIcon />
                                {selectedChat && dotMenu &&(
                                    <div className='absolute top-8 -right-2 h-8 w-24 py-1 bg-[#010019] text-white  rounded-xl z-10'>
                                        <ul>
                                            
                                            <div onClick={handleDelete } className='hover:bg-gray-300 h-7 rounded-b-xl'>Delete</div>
                                        </ul>
                                    </div>
                                )}
                                </button>
                        </div>
                    </div>

                    <div className="w-full h-[75%] bg-white rounded-2xl" >
                        <div className="overflow-y-scroll overflow-x-hidden h-full" ref={messageContainerRef}>
                            <div className="flex flex-col gap-2 h-full">
                            {selectedChat?.messages && selectedChat.messages.map((message) => (
                                    <div key={message._id} className="flex flex-col gap-1 p-4 relative mb-6">
                                        <div className={`${message.senderUsername === userData.username ? 'flex justify-end items-center ' : 'flex justify-start items-center'} h-12 relative px-10`}>
                                            <div>
                                            <img src={senderimg(message.senderUsername)} alt="pas trouvé" className={`absolute ${message.senderUsername === userData.username ? '-right-1':'-left-1'} bottom-1 h-10 w-10 rounded-full bot-0`}/>
                                            </div>
                                            <div className={`px-4 py-2 flex text-white ${message.senderUsername === userData.username ? 'rounded-l-xl rounded-tr-xl bg-[#FF4A09]' : 'rounded-r-xl rounded-tl-xl bg-gray-300'} inline-block ${message.text !== undefined && message.text !== "" ? 'bg-[#FF4A09]' : 'bg-white'}`}>
                                                {message?.text !== undefined && message.text !== "" ? (
                                                    message.text
                                                ) : (
                                                    message?.files?.map((file, index) => (
                                                        <div key={index}>
                                                            {file.startsWith("data:image") ? (
                                                                <img src={convertBase64ToImage(file)} alt="" className='mb-2 w-24 h-20 cursor-pointer' onClick={() => window.open(convertBase64ToImage(file), '_blank')} />
                                                            ) : (
                                                                <a href={file} download={file.split('/').pop()} className="text-blue-500 cursor-pointer">
                                                                    <DocumentIcon />
                                                                </a>
                                                            )}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                            <h4 className={`text-sm absolute ${message.senderUsername === userData.username ? 'right-2' : 'left-2'} ${message.text ? '-bottom-4' : '-bottom-8'}`}>
                                                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                            </h4>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <form className='h-[8%] w-full flex relative' onSubmit={handleSendMessage}>
                    {showEmojiPicker && (
                            <div className="absolute bottom-16 right-2">
                                <Picker data={data} onEmojiSelect={(emoji) => setNewMessage(prevMessage => prevMessage + emoji.native)} />
                            </div>
                        )}
                        <input type="file" id="fileInput" disabled className='absolute left-2 bottom-3.5 hidden' onChange={handleFileChange} multiple />
                        <label disabled htmlFor="fileInput"  className='cursor-pointer flex items-center absolute left-2 bottom-3.5'>
                            <AttachmentIcon />
                        </label>
                        <input type="text" disabled className='w-4/5 rounded-2xl px-10 py-3.5 overflow-hidden' placeholder='Write a message' value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                        <button type="button" disabled className='absolute right-44 bottom-4' onClick={toggleEmojiPicker}>
                            <EmoteIcon />
                        </button>
                        <div className='flex gap-2 w-1/5 justify-center'>
                            <button disabled type="button" className='rounded-xl bg-[#FF4A09] p-1'>
                                <MicIcon />
                            </button>
                            <button disabled type="submit" className='bg-[#FF4A09] rounded-xl p-1'>
                                <SendMessageIcon />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            </>
            )}
        </div>
    );
};

export default ArchivesPage