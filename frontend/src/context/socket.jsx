import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BASE_URL, {
  transports: ["websocket"],
  autoConnect: false,
});

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children, userId }) => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;

    socket.auth = { userId };
    socket.connect();

    const onConnect = () => {
      setConnected(true);
      console.log("Socket connected:", socket.id);
    };

    const onDisconnect = (reason) => {
      setConnected(false);
      console.log("Socket disconnected:", reason);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};
