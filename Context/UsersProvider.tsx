import { createContext, useContext, useState } from "react";

const UsersContext = createContext({});

export const UsersProvider = ({ children }: any) => {
  const [users, setUsers] = useState<any>({ users: [], page: 1 });

  return (
    <UsersContext.Provider value={{ users, setUsers }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsersContext = () => useContext(UsersContext);
