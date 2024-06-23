import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavBar = () => {
    const location = useLocation();

    return (
        <nav className='flex gap-4 justify-between w-full py-4 px-10'>
            <Link to={"/"} className='text-orange-600 ml-2 py-3 font-bold text-2xl'>
                ALGChat
            </Link>
            <div className="relative">
                <ul className='flex gap-12'>
                    <Link to={"/about"} className={`py-3 font-bold text-lg relative ${location.pathname === '/about' ? 'text-gray-900' : 'text-gray-600'}`}>
                        About
                    </Link>
                    <Link to={'/blog'} className={`py-3 font-bold text-lg relative ${location.pathname === '/blog' ? 'text-gray-900' : 'text-gray-600'}`}>
                        Blog
                    </Link>
                    <Link to={'/contact'} className={`py-3 font-bold text-lg relative ${location.pathname === '/contact' ? 'text-gray-900' : 'text-gray-600'}`}>
                        Contact
                    </Link>
                </ul>
                <div className="absolute bottom-0 -left-1 w-14 h-1 bg-orange-600 transition-transform" style={{
    transform: location.pathname === '/about' ? 'translateX(0)' : location.pathname === '/blog' ? 'translateX(100px)' : location.pathname === '/' ? 'translateX(0)' : 'translateX(210px)',
    visibility: location.pathname === '/' ? 'hidden' : 'visible'
}}>

</div>

            </div>
            <Link to={'/login'} className='mr-2 border border-white rounded-3xl px-8 py-3 h-full text-white bg-orange-600'>Login</Link>
        </nav>
    );
};

export default NavBar;
