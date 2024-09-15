import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ChatIcon from './../assets/chatIcon';
import ArchivesIcon from './../assets/archivesIcon';
import SettingsIcon from './../assets/settingsIcon';
import ProfileIcon from './../assets/profileIcon';

const SideBar = ({ fillSettings, fillArchives, fillChat, fillProfile,usernam }) => { 
    const [showMenu, setShowMenu] = useState(false);
    const [notifications,setNotifications]=useState({
        chats:0,
        archives:0
    })
   const handlelogout=async()=>{
    setShowMenu(!showMenu)
    localStorage.removeItem('username')
    
   }
   


    return (
        <aside className='flex flex-col h-full py-4 justify-between gap-8 w-[5%] bg-[#010019] rounded-2xl text-white'>
            <Link to={'/'}>
                <img src="/images (3).png" alt="" className='h-full w-full' />
            </Link>
            <div className='flex flex-col gap-6 px-2 items-center'>
               <Link to={'/archives'}> <ArchivesIcon fill={fillArchives} /> 
               {notifications.archives > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1">
              {notifications.archives}
            </span>
          )}
               </Link> 
               <Link to={'/chat'}>  <ChatIcon fill={fillChat}/>
               {notifications.chats > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1">
              {notifications.chats}
            </span>
          )}
                    </Link>
               <Link to={'/settings'}>   <SettingsIcon fill={fillSettings} /></Link> 
            </div>
            <div className='relative flex justify-center'>
                <button onClick={e => setShowMenu(!showMenu)}>
                    <ProfileIcon fill={fillProfile} /> 
                </button>
                {showMenu && (
                    <div className='absolute top-[-50px] left-[10px] flex flex-col'>
                        <Link to={`/profile/${usernam}`} onClick={e => setShowMenu(!showMenu)} className='border border-gray-600'>Profile</Link>
                        <Link to={'https://chat-app-fjxy.onrender.com/user/logout' } onClick={handlelogout}  className='border border-gray-600'>Logout</Link>
                    </div>
                )}
            </div>
        </aside>
    );
}

export default SideBar;
