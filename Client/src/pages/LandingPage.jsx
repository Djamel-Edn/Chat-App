import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    const headingText = "Let's Connect in Real Time";
    const words = headingText.split(' ');

  
    const firstLineWords = words.slice(0, 3).join(' ');
    const secondLineWords = words.slice(3).join(' ');
    useEffect(() => {
        console.log(window.location.href)
    },[])
    return (
        <div className='flex flex-col h-screen'>
            <div className='flex h-full'>
                <div className='w-1/2 flex flex-col gap-10 items-center'>
                    <h2 className='text-6xl mt-24 ml-10 font-bold'>
                        {firstLineWords}
                        <br />
                        {secondLineWords}
                    </h2>
                    <p className='text-2xl ml-24'>
                        Bring your connections to life, whether they are friends, family, or colleagues. ALGChat is a real-time messaging app that lets you connect with people from all over the world.
                    </p>
                    <div className='flex justify-center w-full'>
                        <Link to={"/chat"} className='px-14 text-xl py-4 rounded-3xl border text-white bg-orange-600 border-gray-300'>Get Started</Link>
                    </div>
                </div>
                <div className='w-1/2 flex justify-start'>
                    <img src="/man.jpg" alt="Image not found" className='h-full w-full mr-24' />
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
