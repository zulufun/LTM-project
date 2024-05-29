import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import { Input, Button, List, Typography } from 'antd';
import axios from 'axios';

const { TextArea } = Input;
const { Text } = Typography;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatBot: React.FC = ()  => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const newMessages: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post<{ message: string }>('http://127.0.0.1:8000/chat', { message: input });
      const botMessage = response.data.message;
      setMessages([...newMessages, { role: 'assistant', content: botMessage }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([...newMessages, { role: 'assistant', content: 'Error: Unable to get response from server.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ width: '45vw', margin: '0' }}>
      <List
        bordered
        dataSource={messages}
        renderItem={(item) => (
          <List.Item>
            <Text  style={{ width: '80px', color: item.role === 'user' ? 'red' : 'Black' }} strong={item.role === 'user'}>{item.role === 'user' ? 'You: ' : 'MTA Bot: '}</Text>
            <Text style={{ width: '500px',display: 'block', textAlign: 'right' }}>{item.content}</Text>
          </List.Item>
        )}
        style={{ marginBottom: '16px', maxHeight: '500px', overflowY: 'auto',width: '100%' }}
      />
      <TextArea
        rows={4}
        value={input}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        disabled={loading}
        placeholder="Type your message here..."
        style={{ marginBottom: '8px', width: '150%' }}
      />
      <Button type="primary" onClick={sendMessage} loading={loading} block
      style={{ marginBottom: '8px',width: '100%' }}>
        Send
      </Button>
    </div>
  );
};

export default ChatBot;
