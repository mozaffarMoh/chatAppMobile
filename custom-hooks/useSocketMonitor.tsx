import { getItemFromStorage } from "@/constants/getItemFromStorage";
import { useSocket } from "@/Context/SocketRefProvider";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const useSocketMonitor = () => {
  const [isMessageReceived, setIsMessageReceived] = useState(false);
  const [myData, setMyData]: any = useState(null);
  const socketRef: any = useRef(null);

  useFocusEffect(
    useCallback(() => {
      !myData && getItemFromStorage("myData", setMyData);
    }, [])
  );

  useEffect(() => {
    const socket = io("https://chatappapi-2w5v.onrender.com");
    socketRef.current = socket;

    const handleReceiveMessage = (messageReceiverID: string) => {
      console.log("check message : ", myData?._id, messageReceiverID);
      if (myData?._id == messageReceiverID) {
        console.log("message is received");
        setIsMessageReceived(true);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.disconnect();
    };
  }, [myData]);

  return { socketRef, isMessageReceived, setIsMessageReceived };
};

export default useSocketMonitor;
