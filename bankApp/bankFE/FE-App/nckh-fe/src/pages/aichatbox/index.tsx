
import React from 'react';
import { ChatBot } from '../../components/Chatbot/ChatBot';
import { Row, Col, Breadcrumb, Divider } from "antd";
const ChatBoxAI: React.FC = () => {
  return (
    <div style={{ padding: '10px', maxWidth: '1000px', margin: '0 auto' }}>
      <Row>
        <Breadcrumb
          style={{ margin: "auto", marginLeft: 0 }}
          items={[
            {
              title: "Chat Bot",
            },
            {
              title: <span style={{ fontWeight: "bold" }}>Chat Bot Ai</span>,
            },
          ]}
        />
        <Divider style={{ margin: "10px" }}></Divider>
      </Row>
      <Row gutter={[10, 10]}>

        <Col span={16}>
        <ChatBot/>
        </Col>
      </Row>
      
    </div>
  );
};

export default ChatBoxAI;
