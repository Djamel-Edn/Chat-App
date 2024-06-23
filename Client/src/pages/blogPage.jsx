import React from 'react';

const BlogPage = () => {
    const blogPosts = [
        {
            id: 1,
            title: "10 Tips for Making Video Calls More Professional",
            author: "Sarah Johnson",
            date: "May 20, 2024",
            content: "Video calls have become an integral part of our professional lives, especially with the rise of remote work. Here are 10 tips to help you make your video calls more professional and effective..."
        },
        {
            id: 2,
            title: "The Importance of Emojis in Online Communication",
            author: "Michael Smith",
            date: "May 15, 2024",
            content: "Emojis are more than just fun little characters to add to your messages. They play a crucial role in online communication, conveying emotions, tone, and context. In this post, we explore the importance of emojis and how to use them effectively..."
        },
        {
            id: 3,
            title: "10 Must-Have Features for a Modern Chat App",
            author: "Emily Davis",
            date: "May 10, 2024",
            content: "With so many chat apps available, it's important to choose one that meets your needs. In this post, we discuss 10 must-have features for a modern chat app, from end-to-end encryption to customizable profiles..."
        }
    ];

    return (
        <>
        <div className="container mx-auto py-4 px-8">
            {blogPosts.map(post => (
                <div key={post.id} className="mb-8 w-3/5">
                    <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                    <p className="text-gray-600 mb-2">By {post.author} | {post.date}</p>
                    <p className="text-gray-700">{post.content}</p>
                </div>
            ))}
        </div>
        </>
    );
};

export default BlogPage;
