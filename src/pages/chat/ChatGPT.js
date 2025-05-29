import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { BsFillSendArrowUpFill } from "react-icons/bs";
import './chatgpt.scss';
const ChatGPT = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        const savedMessages = JSON.parse(localStorage.getItem('messages')) || [];
        setMessages(savedMessages);
    }, []);

    useEffect(() => {
        localStorage.setItem('messages', JSON.stringify(messages));
    }, [messages]);

    const sendMessage = async () => {
        if (input.trim() === '') return;

        const userMessage = { sender: 'user', text: input };
        setMessages([...messages, userMessage]);

        const response = await axios.post('http://localhost:5000/api/chat', { message: input });
        const botMessage = { sender: 'bot', text: response.data.reply };

        setMessages([...messages, userMessage, botMessage]);
        setInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className='chatgpt-content'>
            <InfiniteScroll
                dataLength={messages.length}
                next={() => {}}
                hasMore={false}
                loader={<h4>loading...</h4>}
                height={400}
            >
                {messages.map((msg, index) => (
                    <div key={index} className={msg.sender}>
                        {msg.text}
                    </div>
                ))}
            </InfiniteScroll>
            {
              input.trim() === '' && <div className='title'>What can i do for you?</div>
            }
            <div className='chatgpt-input-wrapper'>
              <textarea
                className='chatgpt-input'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={3}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }} />
              <div className='send-icon'><BsFillSendArrowUpFill /></div>
            </div>
        </div>
    );
};

export default ChatGPT;