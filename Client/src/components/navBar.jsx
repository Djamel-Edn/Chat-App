import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavBar = () => {
    const location = useLocation();

    return (
        <nav className='flex gap-2 md:gap-4 justify-between items-center w-full py-2 md:py-4 px-2 md:px-10'>
            <Link to={"/"} className='text-orange-600  py-3 font-bold text-lg md:text-2xl'>
                ALGChat
            </Link>
            <div className="relative">
                <ul className='flex gap-4 md:gap-12 '>
                    <Link to={"/about"} className={`py-3 font-bold text-md md:text-lg hover:text-black relative ${location.pathname === '/about' ? 'text-gray-900' : 'text-gray-600'}`}>
                        About
                    </Link>
                    <Link to={'/blog'} className={`py-3 font-bold text-md md:text-lg hover:text-black relative ${location.pathname === '/blog' ? 'text-gray-900' : 'text-gray-600'}`}>
                        Blog
                    </Link>
                    <Link to={'/contact'} className={`py-3 font-bold text-md md:text-lg hover:text-black relative ${location.pathname === '/contact' ? 'text-gray-900' : 'text-gray-600'}`}>
                        Contact
                    </Link>
                </ul>
                <div className="absolute bottom-0 -left-1 w-6 md:w-14 h-1 bg-orange-600 transition-transform" style={{
    transform: location.pathname === '/about' ? ' translateX(0)' : location.pathname === '/blog' ? 'translateX(100px)' : location.pathname === '/' ? 'translateX(0)' : 'translateX(210px)',
    visibility: location.pathname === '/' ? 'hidden' : 'visible'
}}>

</div>

            </div>
            <Link to={'/login'} className='border border-white rounded-xl md:rounded-3xl px-2 md:px-8 py-1 md:py-3  text-white bg-orange-600 hover:bg-orange-800'>Login</Link>
        </nav>
    );
};

export default NavBar;
