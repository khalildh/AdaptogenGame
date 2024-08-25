import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

let socket;

try {
    console.log("trying to connect")
    socket = io('http://localhost:3001');
    console.log("connected")
} catch (error) {
  console.error('Error initializing socket connection:', error);
}

const styles = {
    chatContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        padding: '20px',
    },
    messageBox: {
        flexGrow: 1,
        overflowY: 'auto',
        marginBottom: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '10px',
        maxHeight: '70vh',
    },
    message: {
        backgroundColor: '#f1f1f1',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px',
    },
    inputArea: {
        display: 'flex',
    },
    input: {
        flexGrow: 1,
        padding: '10px',
        marginRight: '10px',
    },
    button: {
        padding: '10px 20px',
    },
};

export const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const messageListRef = useRef(null);

    useEffect(() => {
        if (!socket) {
            console.error('Socket connection failed to initialize');
            return;
        }

    
        socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });
      
        socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
        });
      
        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

    
        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('message');
            socket.off('connect_error');
        };
    }, []);


    useEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = () => {
        if (inputValue.trim()) {
            socket.emit('message', inputValue);
            setInputValue('');
        }
    };

    return (
        <div style={styles.chatContainer}>
            <div style={styles.messageBox} ref={messageListRef}>
                {messages.map((message, index) => (
                    <div key={index} style={styles.message}>
                        {message}
                    </div>
                ))}
            </div>
            <div style={styles.inputArea}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    style={styles.input}
                />
                <button onClick={sendMessage} style={styles.button}>Send</button>
            </div>
        </div>
    );
};