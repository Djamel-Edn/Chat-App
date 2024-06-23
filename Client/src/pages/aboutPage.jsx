import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
    return (
        <>
        <div className='flex'>

        <div className="container mx-auto  px-6">
        
            <div className="mb-2 px-2">
                <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
                <p className=" mb-4">
                    At <span className="font-semibold">ALGChat</span>, our mission is to provide a platform where people can connect, communicate, and collaborate effortlessly. We believe in the power of communication to bridge gaps, strengthen relationships, and create memorable experiences.
                </p>
            </div>
            <div className='flex gap-4'>
            <div className='bg-gray-700 rounded-t-full w-[3px]  bg-gradient-to-b from-gray-700 to-transparent; '></div>
            <div className="mb-2">
                <h2 className="text-xl font-semibold mb-2 ml-2">Features</h2>
                <ul className="list-disc pl-6">
                    <li className=" mb-2">Instant Messaging: Send instant messages to your friends, family, and colleagues.</li>
                    <li className=" mb-2">Multimedia Sharing: Share photos, videos, and documents with ease.</li>
                    <li className=" mb-2">Voice and Video Calls: Connect face-to-face or over a voice call.</li>
                    <li className=" mb-2">Customizable Profiles: Personalize your profile with a photo, bio, and status updates.</li>
                </ul>
            </div>
            <div className='bg-gray-700 rounded-t-full w-[3px]  bg-gradient-to-b from-gray-700 to-transparent; '></div>
            <div className="mb-2">
                <h2 className="text-xl font-semibold mb-2 ml-2">Benefits</h2>
                <ul className="list-disc pl-6">
                    <li className=" mb-2">Stay Connected: Keep in touch with your loved ones, no matter the distance.</li>
                    <li className=" mb-2">Boost Productivity: Collaborate with your team, share ideas, and get work done efficiently.</li>
                    <li className=" mb-2">Secure and Private: We take your privacy and security seriously.</li>
                    <li className=" mb-2">User-Friendly Interface: Our app is designed with you in mind.</li>
                </ul>
            </div>
            </div>
            <div className='flex justify-center'>
               
                <Link to={"/chat"} className="bg-orange-600 mt-4 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-2xl focus:outline-none focus:shadow-outline">Start Chatting</Link>
            </div>
        </div>
        <div className='px-4 py-10'>
            <img src="/chat app design.png" alt="" className='rounded-3xl mr-4' />
        </div>
        </div>
        </>
    );
};

export default AboutPage;
