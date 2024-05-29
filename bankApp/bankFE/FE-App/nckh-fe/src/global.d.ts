// src/global.d.ts
interface Window {
    CozeWebSDK: {
      WebChatClient: new (config: { config: { bot_id: string }, componentProps: { title: string } }) => void;
    };
  }
  