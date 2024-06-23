import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Chat from './pages/Chat';
import AboutPage from './pages/aboutPage';
import BlogPage from './pages/blogPage';
import ContactPage from './pages/contactPage';
import NavBar from './components/navBar';
import ArchivesPage from './pages/archivesPage';
import ProfilePage from './pages/profilePage';
import SettingsPage from './pages/settingsPage';
import SideBar from './components/sideBar';

function App() {
  const location = useLocation();

  // Array of routes where NavBar should be displayed
  const navBarRoutes = ['/',  '/about', '/blog', '/contact'];

  // Check if the current route is in navBarRoutes array
  const showNavBar = navBarRoutes.includes(location.pathname);

  return (
    <>
      {showNavBar && <NavBar />} 
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/archives" element={<ArchivesPage />} />
        <Route path="/profile/:usernam" element={<ProfilePage/>} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </>
  );
}

export default App;
