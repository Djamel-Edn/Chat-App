import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        
            <div className='flex mt-10 md:mt-5  '>
                <div className='w-full md:w-1/2  flex flex-col gap-10 md:gap-8 '>
                    <div className='flex w-full flex-col gap-2 ml-2 items-center'>
                        <h2 className='text-xl md:text-5xl mt-8 font-bold'>
                            Let's Connect in
                        </h2>
                        <h2 className='text-xl md:text-5xl  font-bold'>
                            Real Time
                        </h2>
                    </div>
                    <p className='text-md w-full md:text-2xl px-3 py-1 sm:ml-2 lg:ml-4 xl:ml-8'>
                        Bring your connections to life, whether they are friends, family, or colleagues. ALGChat is a real-time messaging app that lets you connect with people from all over the world.
                    </p>
                    <div className='flex justify-center w-full'>
                        <Link to={"/chat"} className='px-8 md:px-14 text-md md:text-xl py-2 md:py-4 rounded-3xl border text-white bg-orange-600 border-gray-300'>Get Started</Link>
                    </div>
                </div>
                <div className='md:w-1/2 md:flex md:items-start hidden'>
                    <img src="/man.jpg" alt="Image not found" className='h-full lg:h-[118%] w-full  md:mr-20' />
                </div>
            </div>
      
    );
}

export default LandingPage;
