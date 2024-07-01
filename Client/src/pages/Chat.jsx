import React, { useEffect, useRef, useState } from 'react';
import SideBar from '../components/sideBar';
import PlusIcon from '../assets/plusIcon';
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
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, Navigate } from 'react-router-dom';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
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

const Chat = () => {
    const [userData, setUserData] = useState({});
    const [unreadCounts, setUnreadCounts] = useState({});
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('');
    const [chats, setChats] = useState([]);
    const [users, setUsers] = useState([]);
    const [initialChats, setInitialChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [files, setFiles] = useState([]);
    const [socket, setSocket] = useState(null);
    const messageContainerRef = useRef(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [dotMenu, setDotMenu] = useState(false);
    const [showlist,setShowList]=useState(false)
    const [isRecording, setIsRecording] = useState(false); 
    const mediaRecorderRef = useRef(null); 
    const chunksRef = useRef([]);
    const [audioFile, setAudioFile] = useState();
    const audioPlayerRef = useRef(null);
    const [uploading,setUploading]=useState(false)
    const[returnlog,setReturnLog]=useState(false)
   const handleStartRecording = () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    mediaRecorderRef.current = new MediaRecorder(stream);
                    mediaRecorderRef.current.ondataavailable = (event) => {
                        chunksRef.current.push(event.data);
                    };
                    mediaRecorderRef.current.onstop = () => {
                        const blob = new Blob(chunksRef.current, { type: 'audio/ogg; codecs=opus' });
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            const base64Data = reader.result;
                            setAudioFile(base64Data);
                        };
                        reader.readAsDataURL(blob);
                        chunksRef.current = [];
                    };
                    mediaRecorderRef.current.start();
                    setIsRecording(true);
                })
                .catch(error => {
                    console.error('Error accessing microphone:', error);
                });
        } else {
            console.error('Media devices not supported');
        }
    };

    useEffect(() => {
        if (audioFile) {
            handleSendMessage();
        }
    }, [audioFile]);

    const handleStopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleSendMessage = async (e) => {
        if (e){
            e.preventDefault()
        }
        if (!selectedChat || (!newMessage && files.length === 0 && !audioFile)) {
            return;
        }
        setUploading(true)
        const messageData = {
            text: newMessage,
            chatId: selectedChat._id,
            senderUsername: userData.username,
            files,
            audioFile,
        };

        try {
            const response = await fetch('https://chat-app-fjxy.onrender.com/message/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(messageData)
            });

            if (response.status === 401) {
                return window.location.replace('https://chat-app-gold-seven.vercel.app/login');
            }

            const data = await response.json();

            setNewMessage('');
            setFiles([]);
            setAudioFile(null);

            socket.emit('message', data.message, selectedChat.members);
            setUploading(false)
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };
    useEffect(() => {
        if (audioPlayerRef.current) {
            const player = new Plyr(audioPlayerRef.current);
        }
    }, []);
    
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
        newSocket.on('updateChat', (chat) => {
            if (userData.chats.some(userChat => userChat._id === chat._id)) {
            setChats((prevChats) => {
                return prevChats.map((prevChat) => {
                    if (prevChat._id === chat._id) {
                        return chat;
                    }
                    return prevChat;
                });
            });
        }else{
            setChats((prevChats) => [...prevChats, chat]);
            setUnreadCounts((prevUnreadCounts) => ({
                ...prevUnreadCounts,
                [chat._id]:  1
            }))
        }
        })
        return () => {
            newSocket.disconnect();
            newSocket.off('message');
        };
    }, [userData.username,selectedChat]);
    
    useEffect(() => {
        if (selectedChat) {
            chats.map((chat) => {
                if (chat._id === selectedChat._id) {
                    setSelectedChat(chat);
                }
            });
        }
    }, [chats, selectedChat]);
    
    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messageContainerRef, selectedChat]);

    
    useEffect(() => {
        const getUser = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://chat-app-fjxy.onrender.com/user/getUser', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });

                if (response.status === 401) {
                    setLoading(false);
                    setReturnLog(true)
                    window.location.href = 'login';
                }

                const data = await response.json();
                setUserData(data);
                setChats(data.chats);
                setInitialChats(data.chats);
                setLoading(false);
               localStorage.setItem('username',data.username)
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        getUser();
    }, []);

    useEffect(() => {
        const searchChats = async () => {
            try {
                const filteredChats = chats.filter((chat) => chat.members.includes(searchQuery));
                if (searchQuery === '') {
                    setUsers([]);
                    return setChats(initialChats);
                }
                setChats(filteredChats);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        searchChats();
    }, [searchQuery]);

    const handleplus = async () => {
        try {
            const response = await fetch('https://chat-app-fjxy.onrender.com/chat/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ members: [userData.username, searchQuery] })
            });

            if (response.status === 401) {
                return window.location.replace('https://chat-app-gold-seven.vercel.app/login');
            }
            if (response.status === 400) {
                setSearchQuery('');
               const data= await response.json();
               toast.error(data.error, {
                position: "bottom-left"
               });
                return setUsers([]);
            }
            const data = await response.json();
            setSearchQuery('');
            setUsers([]);

            
            setUserData((prevUserData) => ({
                ...prevUserData,
                chats: [...prevUserData.chats, data.chat]
            }));
            socket.emit('chat',data.chat);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setSearchQuery('');
            setUsers([]);
        }
    };

    const handlesearch = async () => {
        try {
            const response = await fetch('https://chat-app-fjxy.onrender.com/user/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ username: searchQuery })
            });

            if (response.status === 401) {
                return window.location.replace('https://chat-app-gold-seven.vercel.app/login');
            }
            if (response.status === 400) {
                setSearchQuery('');
                return setUsers([]);
            }
            const data = await response.json();
            setUsers(data.users.filter(user => user.username !== userData.username));
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

   

    const handleArchive = async () => {
        try {
            const response = await fetch(`https://chat-app-fjxy.onrender.com/chat/archive/${selectedChat._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (response.status === 401) {
                return window.location.replace('https://chat-app-gold-seven.vercel.app/login');
            }

            const data = await response.json();

            setChats(chats.filter((chat) => chat._id !== selectedChat._id));
            setInitialChats(initialChats.filter((chat) => chat._id !== selectedChat._id));
            
            setUserData((prevUserData) => ({
                ...prevUserData,
                archives: [...prevUserData.archives, selectedChat],
                chats: [...prevUserData.chats.filter((chat) => chat._id !== selectedChat._id)]
            }));
            setSelectedChat(null);
        } catch (error) {
            console.error('Error archiving chat:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`https://chat-app-fjxy.onrender.com/chat/removeMember`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body:JSON.stringify({chatId:selectedChat._id,username:userData.username})
            });
            
            if (response.status === 401) {
                return window.location.replace('https://chat-app-gold-seven.vercel.app/login');
            }
            if (response.status === 200) {
                const data=await response.json()
                setChats(chats.filter((chat) => chat._id !== selectedChat._id));
                console.log('delete',data)
                socket.emit('updateChat',data)
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
    const handleAdd=async()=>{
        try {
            const response = await fetch(`https://chat-app-fjxy.onrender.com/chat/addMember`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body:JSON.stringify({chatId:selectedChat._id,username:searchQuery})
            });

            if (response.status === 401) {
                return window.location.replace('https://chat-app-gold-seven.vercel.app/login');
            }
            const data=await response.json()
           setSelectedChat(data)
           setSearchQuery('')
           socket.emit('updateChat',data)
        } catch (error) {
            console.error('Error deleting chat:', error);
        }
    }
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
        setUnreadCounts((prevUnreadCounts) => ({
            ...prevUnreadCounts,
            [chat._id]: 0
        }));    
    }

    function getChatUsers(array) {
        if (!array) { return console.log('Array is empty'); }
        return array?.filter(user => user?.username !== userData.username);
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

    const isUserOnline = (username, chat) => {
        const user = onlineUsers.find(user => user.username === username);
        if (!user) {
            return false; 
        }
        if (chat) {
            const member = chat.members.find(member => member.username === username);
            if (member && member.settings.privacy.Activity === 'nobody') {
                return false;
            }
        }
        return true;
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
            
            <SideBar fillChat="#FF4A09" fillArchives="#FFFFFF" fillSettings="#FFFFFF" fillProfile="#1B1A32" usernam={userData.username} />
        {loading ? (
            <div className="flex justify-center items-center w-full h-full">
                <p>Loading...</p>
            </div>
        ) :(
       <>
            {returnlog && <Navigate to='/login' />} 
            <div className="w-full flex gap-2">
                <div className="w-2/6 h-full flex flex-col gap-2">
                    <div className="bg-white p-4 rounded-2xl flex justify-between items-center gap-4 h-[15%]">
                        <div className='relative w-full'>
                            <input
                                type="text"
                                placeholder="Search"
                                className="rounded-2xl bg-[#F5F5F5] py-2 pl-4 pr-10 w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="absolute right-4 top-2" onClick={handlesearch}>
                                <SearchIcon />
                            </button>
                        </div>
                        <button onClick={handleplus}>
                            <PlusIcon />
                        </button>
                    </div>
                    <ToastContainer />
                    <div className="w-full rounded-2xl bg-white h-[85%] overflow-y-scroll">
                        {users && users.map((user) => (
                            
                            <div key={user._id} className={`flex justify-between items-center gap-2 p-4 border-b border-gray-200 hover:bg-gray-300 hover:cursor-pointer `} onClick={() => setSearchQuery(user.username)}>
                                <div className="w-1/8 h-12 relative">
                                    <img src={user.profilePicture} alt="not found" className='h-full w-12 rounded-full' />
                                    <span className='absolute -bottom-2 right-0'>
                                        {user.settings.privacy.Activity!=="nobody" && isUserOnline(user.username) && <OnlineIcon />}
                                    </span>
                                </div>
                                <div className="w-4/6 h-10 flex flex-col gap-1">
                                    <h2>{user.username}</h2>
                                    
                                </div>
                            </div>
                        ))}
                        {users?.length === 0 && chats && (
                            chats.map((chat) => (
                                <div key={chat._id} className={`flex justify-between items-center gap-4 py-2 px-4 border-b border-gray-200 hover:cursor-pointer hover:bg-gray-200 ${selectedChat==chat ? 'bg-gray-300':'bg-white'}`} onClick={() => handleselection(chat)}>
                                    <div className="w-1/8 h-12 bg-gray-200 rounded-full relative">
                                        <img src={getChatUsers(chat?.members)[0]?.profilePicture} alt="not found" className='h-full w-12 rounded-full' />
                                            <span key={chat.members[0].username} className='absolute -bottom-2 right-0'>
                                        {getChatUsers(chat.members).some(member => isUserOnline(member.username,chat)) &&  <OnlineIcon key={chat.members[0].username} />}
                                        
                                        </span>
                            
                                        
                                    </div>
                                    <div className="w-4/6 h-10 flex flex-col gap-1">
                                        <h2>
                                            {getChatUsers(chat.members).length ==0 ? <span>User got out</span> : getChatUsers(chat.members).map(user => (
                                                <span key={user.username} className='text-sm'>
                                                    {user.username+ ','}
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
                            <div className="w-1/8 h-12 bg-gray-200 rounded-full relative ml-3">
                                {selectedChat && selectedChat.members && selectedChat.members.length > 0 && (
                                    <img src={getChatUsers(selectedChat?.members)[0]?.profilePicture} alt="not found" className='h-full w-12 rounded-full' />
                                )}
                                {selectedChat && <span key={selectedChat?._id} className='absolute -bottom-2 right-0'>
                                    {selectedChat && getChatUsers(selectedChat?.members).some(member => isUserOnline(member.username,selectedChat)) && <OnlineIcon key={selectedChat?._id} />}
                                    </span>}
                            </div>
                            <div className="w-4/6 h-10 flex flex-col gap-1">
                                {selectedChat && (
                                    <h2>{getChatUsers(selectedChat?.members)?.map(user => (
                                        <span key={user.username}>
                                            {user.username + ''}
                                            
                                        </span>
                                    ))}</h2>
                                )}
                            </div>
                        </div>
                        <div className="h-full flex items-center gap-2">
                            <button disabled={!selectedChat}  className='px-6 py-2 border-gray-300 border rounded-2xl font-bold relative' onClick={()=>setShowList(!showlist)}>
        
                                Profile
                            {showlist && (
                                <div className='flex flex-col gap-2 absolute top-12 left-2 bg-gray-100  rounded-t-lg p-1'>
                                    
                                    {getChatUsers(selectedChat.members).map(user=>(
    
                                        <Link key={user.username} to={`/profile/${user.username}`} className=' border-gray-600 border-b-2 h-12 '>
                                            {user.username}
                                        </Link>
                                    ))}
                                
                                </div>  
                            )}
                            </button>
                            <button disabled={!selectedChat} className='px-8 py-2 border-gray-300 border rounded-2xl font-semibold bg-black text-white'>
                                Call
                            </button>
                            <div className='border bg-gray-200 h-10 w-0.5'></div>
                            <button className='w-10 h-8' disabled={!selectedChat}><SearchIcon /></button>
                            <button className='relative' disabled={!selectedChat} onClick={()=>setDotMenu(!dotMenu)}>
                                <ThreeDotsIcon />
                                {selectedChat && dotMenu &&(
                                    <div className='absolute top-8 -right-2 h-22 w-24 bg-[#010019] text-white  rounded-xl z-10'>
                                        <ul>
                                            <div onClick={handleArchive} className='hover:bg-gray-300 h-7 rounded-t-xl'>Archive</div>
                                            <div className='w-full h-0.5 bg-gray-300'></div>
                                            <div onClick={handleDelete } className='hover:bg-gray-300 h-7'>Delete</div>
                                            <div className='w-full h-0.5 bg-gray-300'></div>
                                            <div onClick={handleAdd } className='hover:bg-gray-300 h-7 rounded-b-xl'>Add Member</div>
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
                        <img src={senderimg(message.senderUsername)} alt="pas trouvé" className={`absolute ${message.senderUsername === userData.username ? '-right-1':'-left-1'} bottom-1 h-10 w-10 rounded-full bot-0`} />
                    </div>
                    <div className={`px-4 py-2 flex text-white ${message.senderUsername === userData.username ? 'rounded-l-xl rounded-tr-xl bg-[#FF4A09]' : 'rounded-r-xl rounded-tl-xl bg-gray-300'} inline-block ${message.text !== undefined && message.text !== "" ? 'bg-opacity-100':'bg-opacity-0'}`}>
                        {message.text !== undefined && message.text !== "" ? message.text : message?.files?.map((file, index) => (
                            <div key={index} className='bg-gray-100 rounded-xl mb-5 p-2'>
                                <img src={convertBase64ToImage(file)} className="w-16 h-16" alt="pas trouvé" />
                            </div>
                        ))}
                        {message.audioFile && (
                            <audio ref={audioPlayerRef} controls>
                                <source src={message.audioFile} type="audio/ogg" />
                                Your browser does not support the audio element.
                            </audio>
                        )}
                    </div>
                </div>
                <div className={`flex items-center w-full ${message.senderUsername === userData.username ? 'justify-end':' justify-start' }`}>
                    <div>
                        <span className={`flex ${message.senderUsername === userData.username ? 'justify-end' : 'justify-start'}`}>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                    </div>
                    
                    
                </div>
            </div>
        ))}
    </div>
</div>

                    </div>
                <form className='h-[8%] w-full flex relative gap-2' onSubmit={(e)=>handleSendMessage(e)}>
                {showEmojiPicker && (
                            <div className="absolute bottom-16 right-2">
                                <Picker data={data} onEmojiSelect={(emoji) => setNewMessage(prevMessage => prevMessage + emoji.native)} />
                            </div>
                        )}
            <input type="file" id="fileInput" className='absolute left-2 bottom-3.5 hidden' onChange={handleFileChange} multiple />
            <label htmlFor="fileInput" className='cursor-pointer flex items-center absolute left-2 bottom-3.5'>
                {files.length>0 && (
                    <div className='w-5 h-5 absolute left-0 -top-4 bg-red-700 rounded-xl flex justify-center text-white'>{files.length}</div>
                )}
                <AttachmentIcon />
            </label>
            <input type="text" className='w-full rounded-2xl px-10 py-3.5 overflow-hidden' placeholder='Write a message' value={uploading ? 'uploading':  newMessage} onChange={(e) => setNewMessage(e.target.value)} />
            <button type="button" className='absolute right-32 bottom-4' onClick={toggleEmojiPicker}>
                <EmoteIcon />
            </button>
            <div className='flex gap-2 justify-center'>
            {!isRecording ? (
                <button type="button" onClick={handleStartRecording} disabled={!selectedChat} className='rounded-xl bg-[#FF4A09] p-1'>
                    <MicIcon />
                </button>
            ) : (
                <button type="button" onClick={handleStopRecording} disabled={!selectedChat} className='rounded-xl bg-[#FF4A09] p-1'>
                    Stop
                </button>
    )}
                <button type="button" disabled={!selectedChat } className='bg-[#FF4A09] rounded-xl p-1' onClick={handleSendMessage}>
                    <SendMessageIcon />
                </button>
            </div>
        </form>
                </div>
            </div>
            
            {showEmojiPicker && (
                <div className="absolute bottom-[80px] right-0">
                    <Picker set='twitter' onSelect={(emoji) => setNewMessage(newMessage + emoji.native)} />
                </div>
            )}
            </>
             )}
        </div>
    );
    
};

export default Chat;
