import { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg,setErrorMsg]=useState('')
  const [name,setName]=useState('')
  const toggleView = () => {
    setShowLogin(!showLogin);
    setEmail('');
    setPassword('');
    setErrorMsg('')
    setName('')
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please fill all the fields');
      return;
    }
    try {
      const response = await fetch(`https://chat-app-fjxy.onrender.com/user/${showLogin ? 'login' : 'register'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password,name }),
      });
      const data = await response.json();
      if (!response.ok){
        setErrorMsg(data.error);
        return;
      }
      
      console.log('Response Data:', data);
      if (data.error) {
        setErrorMsg(data.error);
        return;
      }
      localStorage.setItem('user', data);
      window.location.href = 'https://chat-app-gold-seven.vercel.app/chat';
     
    } catch (error) {
      setErrorMsg(error.message);
    }
  };
  const handleGoogleLogin = () => {
    window.location.href = 'https://chat-app-fjxy.onrender.com/auth/google'; 
  };
  
  return (
    <div className={`flex flex-col md:flex-row  h-screen w-full overflow-hidden  ${showLogin ? 'bg-[#010019] transition duration-1000 ease-in-out' : 'bg-white'}`}>
     <div className={`p-2 bg-white w-full md:w-1/2  ${showLogin ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-500 ease-in-out`}>
        <form onSubmit={handleSubmit} className='gap-10 w-full flex flex-col items-center'>

        <div className='h-10 mt-10 flex items-center  md:gap-8'>
          <h3 className='text-black text-xl  '>Don't have an account?</h3>
          <button className='px-6 md:px-12 py-3 rounded-3xl ml-10 border border-[#797488] text-[#010019] hover:text-white hover:bg-[#010019] transition-colors duration-300' type='button' onClick={toggleView}>Sign Up</button>
        </div>
        
        <div className='flex flex-col  md:w-1/2'>
          <h1 className='text-black font-bold text-3xl '>Welcome to ALGChat</h1>
          <h3 className='text-black ml-1 text-xl'>Log in to your account</h3>
        </div>
        <input type="email" className='py-5 px-4 bg-[#F0F0F0] rounded-xl  w-1/2 outline-none text-black' placeholder='E-mail' onChange={(e) => setEmail(e.target.value)} value={email} />
        <div className=' w-1/2 flex flex-col'>
        <input type="password" className=' bg-[#F0F0F0] rounded-xl py-5 px-4  outline-none text-black' placeholder='Password' onChange={(e) => setPassword(e.target.value)} value={password} />
        <button className='text-[#010019] text-md ml-2 text-start '>Forget password ?</button>
        </div>

        {errorMsg && <p className='text-red-500  '>{errorMsg}</p>}

        <div className=' gap-4 w-full flex flex-col items-center mb-20'>
          <button className='py-4  text-white rounded-xl hover:bg-white hover:border hover:text-black hover:border-[#797488]  w-1/2 bg-[#010019] transition-colors duration-300' type='submit'>Log In</button>
         
          <button type='button' onClick={handleGoogleLogin} className='py-4 bg-white text-[#010019] rounded-xl w-1/2 border border-[#797488] hover:text-white hover:bg-[#010019]   hover:border hover:border-solid transition-colors duration-300 flex items-center justify-center'>
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="45" height="30" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
            </svg>Continue with Google</button>
        </div>
        
        </form>
      </div > 

     <div className={`absolute flex justify-center items-center w-1/2 ${showLogin ? 'md:translate-x-full' : 'md:translate-x-0'} transition-transform duration-500 bg-gren-200 h-full`}>
     
<Link to={"/"} className=''>
    <img src="/images (3).png" alt="pas trouvé" className='w-full h-full' />
</Link>
     </div>
     <div className={`p-2 bg-[#010019]   w-full md:w-1/2 flex flex-col items-center ${showLogin ? 'md:translate-x-full' : 'md:translate-x-0'} transition-transform duration-500 ease-in-out`}>
     <form onSubmit={handleSubmit} className='gap-6 w-full flex flex-col items-center'>
        <div className='h-10 mt-10  flex items-center gap-8 '>
          <h3 className='text-white text-lg'>Already have an account ?</h3>
          <button className='px-12 py-3 rounded-3xl border border-white  text-white  hover:bg-white transition-colors duration-300'  onClick={toggleView} type='button'>Login</button>
        </div>
        <div className='flex flex-col w-3/4 ml-10 mb-2'>
          <h1 className='text-white font-bold text-3xl '>Welcome to ALGChat</h1>
          <h3 className='text-white text-xl ml-1'>Register your account</h3>
        </div>
        <input type="text" className='py-5 px-4 bg-[#F0F0F0] text-lg rounded-xl w-3/5 outline-none flex items-center  text-black mr-20' placeholder='Name' onChange={(e) => setName(e.target.value)} value={name} />
        <input type="email" className='py-5 px-4 bg-[#F0F0F0] text-lg  rounded-xl w-3/5 flex items-center outline-none  text-black mr-20' placeholder='E-mail' onChange={(e) => setEmail(e.target.value)} value={email} />
        <input type="password" className='py-5 px-4 bg-[#F0F0F0] text-lg rounded-xl w-3/5 outline-none flex items-center  text-black mr-20' placeholder='Password' onChange={(e) => setPassword(e.target.value)} value={password} />
        {errorMsg && <p className='text-red-500 text-center mr-20 '>{errorMsg}</p>} 
        <div className='flex flex-col gap-3 w-full items-center mt-5'>
          <button className='py-4 bg-[#FF4A09] text-white  rounded-xl w-3/5 mr-20 hover:text-[#010019] hover:bg-white hover:border hover:border-white hover:border-solid transition-colors duration-300' onClick={handleSubmit}> Sign Up</button>
         
          <button type='button' onClick={handleGoogleLogin} className='py-4  border border-white rounded-xl bg-white   w-3/5 flex justify-center items-center mr-20 text-black hover:text-white hover:bg-[#FF4A09] transition-colors duration-300'>
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="45" height="30" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
            </svg>
            Continue with Google
          </button>
        </div>
    </form>
      </div>
    </div>
  );
};

export default Login;