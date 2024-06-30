import React, { useEffect, useRef, useState } from 'react';
import SideBar from '../components/sideBar';
import { useParams } from 'react-router-dom';

const ProfilePage = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [userUsername,setuserUsername]=useState('')
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const { usernam } = useParams()
  const fileInputRef = useRef(null);
  const [oldUsername, setOldUsername] = useState('');
  const clearFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; 
    }
  };
  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        setuserUsername(localStorage.getItem('username'))
        const response = await fetch(`https://chat-app-fjxy.onrender.com/user/${usernam}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (response.status === 401) {
          setLoading(false);
          return window.location.replace('https://chat-app-gold-seven.vercel.app/login');
        }

        const data = await response.json();
        
        setUserData(data);
        setUsername(data.username);
        setOldUsername(data.username);
        setEmail(data.email);
        setDescription(data.description || '');
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    getUser();
  }, [usernam]);

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     

      const response = await fetch('https://chat-app-fjxy.onrender.com/user/updateProfile', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ 
          oldUsername,
          username,
          email,
          description,
          profilePicture,
        }),
      });
      if (response.status === 401) {
        return window.location.replace('https://chat-app-gold-seven.vercel.app/login');
      }

      const updatedUserData = await response.json();
      setUserData(updatedUserData);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
  
    reader.onloadend = () => {
      setProfilePicture(reader.result);
    };
  
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="flex p-4 h-screen bg-[#e1e1e1] gap-4 w-full">
      <SideBar
        fillProfile={usernam==userUsername ? "#FF4A09" : "#1B1A32"  }
        fillChat="#FFFFFF"
        fillArchives="#FFFFFF"
        fillSettings="#FFFFFF"
        usernam={userUsername}
      />
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
      <div className="flex-1 bg-white p-4 rounded-md">
            <h1 className="text-xl font-bold mb-4 flex justify-center">Profile</h1>
            {editMode ? (
              <form onSubmit={handleSubmit}>
               
                <div className="mb-4">
                  <label htmlFor="username" className="block font-semibold mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                    className="border rounded-md p-2 w-full"
                    placeholder={userData.username}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block font-semibold mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    className="border rounded-md p-2 w-full"
                    placeholder={userData.email}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="description" className="block font-semibold mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e)=>setDescription(e.target.value)}
                    className="border rounded-md p-2 w-full"
                    rows={3}
                    placeholder={userData.description || 'Description'}
                  />
                </div>
                <div className="mb-4 flex items-center gap-4">
                  <img src="" alt="" />
                  {userData.profilePicture && (
                  <img src={userData.profilePicture} alt="Profile" className="rounded-full w-32 h-32 mt-4" />
                )}
                  <label htmlFor="profilePicture" className="block font-semibold mb-1 hover:cursor-pointer">
                   Change Profile Picture
                  </label>
                  <input
                  ref={fileInputRef}
                    type="file"
                    id="profilePicture"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="border rounded-md p-2 w-full hidden"
                    onClick={clearFileInput}
                  />
                </div>
                <div className="flex justify-between">
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                    Save
                  </button>
                  <button type="button" onClick={toggleEditMode} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className='flex flex-col items-center'>
                <p><strong>Name:</strong> {userData.name}</p>
                <p><strong>Username:</strong> {userData.username}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                {userData.description && <p><strong>Description:</strong> {userData.description}</p>}
                {userData.profilePicture && (
                  <img src={userData.profilePicture} alt="Profile" className="rounded-full w-32 h-32 mt-4" />
                )}
                {userUsername === usernam && (
                <button onClick={toggleEditMode} className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4">
                  Edit Profile
                </button>
                )}
              </div>
            )}
      </div>
          </>
        )}
    </div>
  );
};

export default ProfilePage;
