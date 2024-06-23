import React, { useState } from 'react';

const ContactPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !subject || !message) {
            setErrorMsg('Please fill all the fields');
            return;
        }
        try {
            const response = await fetch('http://localhost:4000/user/sendMail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, subject, message }),
            });
            const data = await response.json();
            console.log('Response Data:', data);
            if (data.error) {
                setErrorMsg(data.error);
                return;
            }
            alert('Message sent successfully');
        } catch (error) {
            setErrorMsg(error.message);
        }
    };
    return (
        <div className="container mx-auto px-8 py-2 ">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               
                <div>
                    <h2 className="text-xl font-bold mb-2">Send us a message</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-gray-700">Name</label>
                            <input type="text" value={name} onChange={(e)=>setName(e.target.value)} className="form-input border p-2 border-gray-800 mt-1 w-full h-10 rounded-md" required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700">Email</label>
                            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="form-input border p-2 border-gray-800 mt-1 w-full h-10 rounded-md" required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="subject" className="block text-gray-700">Subject</label>
                            <input type="text" value={subject} onChange={(e)=>setSubject(e.target.value)} className="form-input border p-2 border-gray-800 mt-1 w-full h-10 rounded-md" required />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="message" className="block  text-gray-700">Message</label>
                            <textarea value={message} onChange={(e)=>setMessage(e.target.value)} className="form-textarea border p-2 border-gray-800 mt-1 w-full rounded-md" rows="6" required></textarea>
                        </div>
                        {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}
                        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Send</button>
                    </form>
                </div>

               
                <div className='px-8 gap-4 flex flex-col'> 
                    <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                    <p className="mb-4">Feel free to get in touch with us via email or phone.</p>
                    <p className="mb-4">Email: d.dib@esi-sba.dz</p>
                    <p>Phone: +213 0559709674</p>

                   
                    <div className="mt-8 ">
                        <h2 className="text-xl font-bold mb-2">Follow Us</h2>
                        <div className="flex space-x-4">
                            <a href="#" className="text-blue-500 hover:text-blue-700">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10 2a8 8 0 015.657 13.657l-3.535-3.535a3 3 0 10-4.243 4.243l-3.535 3.535A8 8 0 0110 2zm-2.828 9.121a1 1 0 111.414-1.414 3 3 0 014.243 4.243 1 1 0 11-1.414 1.414 1 1 0 00-1.414 0 1 1 0 01-1.414 0 3 3 0 01-2.829-2.829zM8 10a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="#" className="text-blue-500 hover:text-blue-700">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8-7a7 7 0 00-5.556 11.243l-.671.671a1 1 0 00-.258.707v.265a1 1 0 001.742.671l.671-.671A7 7 0 0015 10c0-.285-.019-.568-.056-.848a7.001 7.001 0 00-5.847-5.848A6.982 6.982 0 0010 3z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="#" className="text-blue-500 hover:text-blue-700">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M14.95 7.657a2 2 0 10-2.829 2.829 2 2 0 002.829-2.829zM3 10a7 7 0 1114 0 7 7 0 01-14 0zm11.243-2.243a1 1 0 111.414 1.414 4 4 0 11-5.657 5.657 1 1 0 01-1.414-1.414 2 2 0 002.829-2.829 1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
