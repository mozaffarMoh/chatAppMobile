import { createContext, useContext, useState } from "react";

const PushTokensContext = createContext({});

export const PushTokensProvider = ({ children }: any) => {
  const [pushTokens, setPushTokens] = useState({});

  return (
    <PushTokensContext.Provider value={{ pushTokens, setPushTokens }}>
      {children}
    </PushTokensContext.Provider>
  );
};

export const usePushTokens = () => useContext(PushTokensContext);
