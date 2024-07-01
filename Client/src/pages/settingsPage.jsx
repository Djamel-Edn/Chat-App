import React, { useState, useEffect } from 'react';
import SideBar from './../components/sideBar';

const SettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [notifications, setNotifications] = useState({
    message: true,
    sound: false,
  });

  const [privacy, setPrivacy] = useState({
    ContactPossibility: 'everyone',  
    Activity: 'contacts',
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch('https://chat-app-fjxy.onrender.com/user/getUser', {
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
        setNotifications({
          message: data.settings.notifications.message,
          sound: data.settings.notifications.sound,
        });
        setPrivacy({
          ContactPossibility: data.settings.privacy.ContactPossibility,
          Activity: data.settings.privacy.Activity,
        });
        setLoading(false);

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    getUser();
  }, []);

  const handleNotificationChange = async (e) => {
    const { name, checked } = e.target;
    const updatedNotifications = { ...notifications, [name]: checked };
    setNotifications(updatedNotifications);
    await updateUserData({ notifications: updatedNotifications });
  };

  const handlePrivacyChange = async (e) => {
    const { name, value } = e.target;
    const updatedPrivacy = { ...privacy, [name]: value };
    setPrivacy(updatedPrivacy);
    await updateUserData({ privacy: updatedPrivacy });
  };

  const updateUserData = async (updatedData) => {
    try {
      const response = await fetch('https://chat-app-fjxy.onrender.com/user/updateProfile', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        console.error('Failed to update user data');
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };



  return (
    <div className="flex p-4 h-screen bg-[#e1e1e1] gap-4 w-full">
      <SideBar fillSettings='#FF4A09' fillChat='#FFFFFF' fillArchives='#FFFFFF' fillProfile='#1B1A32' usernam={userData.username} />
      {loading ? (
        <div className="flex justify-center items-center w-full h-full">
        <p>Loading...</p>
    </div>
      ):(

     
      <div className="w-full flex flex-col gap-4">
        <div className="bg-white p-6 rounded-2xl flex flex-col gap-4 w-2/3 mx-auto">
          <h2 className="text-2xl font-semibold">Settings</h2>
          
          <div className="flex flex-col gap-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-xl font-semibold">Notifications</h3>
              <div className="flex flex-col gap-2 mt-2">
                <label className="flex justify-between items-center">
                  <span>Message Notifications</span>
                  <input
                    type="checkbox"
                    name="message"
                    checked={notifications.message}
                    onChange={handleNotificationChange}
                    className="form-checkbox h-5 w-5 text-indigo-600"
                  />
                </label>
               
                <label className="flex justify-between items-center">
                  <span>Notification Sound</span>
                  <input
                    type="checkbox"
                    name="sound"
                    checked={notifications.sound}
                    onChange={handleNotificationChange}
                    className="form-checkbox h-5 w-5 text-indigo-600"
                  />
                </label>
              </div>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-xl font-semibold">Privacy</h3>
              <div className="flex flex-col gap-2 mt-2">
                <label className="flex justify-between items-center">
                  <span>Contact Possibility</span>
                  <select
                    name="ContactPossibility"
                    value={privacy.ContactPossibility}
                    onChange={handlePrivacyChange}
                    className="form-select mt-1 block w-1/2 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="everyone">Everyone</option>
                    <option value="nobody">Nobody</option>
                  </select>
                </label>
                <label className="flex justify-between items-center">
                  <span>Activity</span>
                  <select
                    name="Activity"
                    value={privacy.Activity}
                    onChange={handlePrivacyChange}
                    className="form-select mt-1 block w-1/2 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="everyone">Everyone</option>
                    <option value="contacts">Contacts</option>
                    <option value="nobody">Nobody</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
       )}
    </div>
  );
};

export default SettingsPage;
