import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { currentUser } = useSelector((state) => state.user);
  const userId = currentUser?._id;
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    const socket = io(import.meta.env.VITE_BASE_URL, {
      transports: ["websocket"],
      autoConnect: false,
    });

    socketRef.current = socket;
    socket.connect();

    const onConnect = () => {
      setConnected(true);
      socket.emit("register", userId);
    };

    const onDisconnect = () => {
      setConnected(false);
    };

    const onOnlineUsers = (userIds) => {
      setOnlineUsers(new Set(userIds));
    };

    const onUserOnline = ({ userId: uid }) => {
      setOnlineUsers((prev) => new Set([...prev, uid]));
    };

    const onUserOffline = ({ userId: uid }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(uid);
        return next;
      });
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("onlineUsers", onOnlineUsers);
    socket.on("userOnline", onUserOnline);
    socket.on("userOffline", onUserOffline);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("onlineUsers", onOnlineUsers);
      socket.off("userOnline", onUserOnline);
      socket.off("userOffline", onUserOffline);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
