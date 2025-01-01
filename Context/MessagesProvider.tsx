import { createContext, useContext, useState } from "react";

const MessagesCacheContext = createContext({});

export const MessagesCacheProvider = ({ children }: any) => {
  const [messagesCache, setMessagesCache] = useState({});

  return (
    <MessagesCacheContext.Provider value={{ messagesCache, setMessagesCache }}>
      {children}
    </MessagesCacheContext.Provider>
  );
};

export const useMessagesCache = () => useContext(MessagesCacheContext);
