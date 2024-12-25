import { primaryColor, secondaryColor } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import { Socket, io } from "socket.io-client";
import Peer from "simple-peer";
import { RTCPeerConnection, RTCSessionDescription } from 'react-native-webrtc';
import 'react-native-get-random-values';

const CallSection = ({
  t,
  isVisible,
  handleCloseModal,
  isAudioCall,
  isVideoCall,
  CallerName,
  name,
  caller,
  callerSignal,
  stream,
  userId,
  isReceiveCall,
  setIsReceiveCall,
  isCallStart,
  setIsCallStart,
  receiverId,
}: any) => {
  const myAudio:any = useRef<HTMLAudioElement | any>(null);
  const userAudio:any = useRef<HTMLVideoElement | any>(null);
  const connectionRef = useRef<any>(null);
  const socketRef = useRef<Socket | any>(null);
  const [callAccepted, setCallAccepted] = useState<boolean>(false);
  const [callEnded, setCallEnded] = useState<boolean>(false);
  const [switchCamera, setSwitchCamera] = useState<boolean>(false);
  const [callTime, setCallTime] = useState<any>({
    minutes: 0,
    seconds: 0,
  });

  /* intial the socket */
  useEffect(() => {
    const socket = io("https://chatappapi-2w5v.onrender.com");
    socketRef.current = socket;
    setTimeout(() => {
      //myAudio?.current?.srcObject = stream;
    }, 10);
    const handleLeaveCall = () => {
      leaveCall();
    };

    socket.on("leaveCall", handleLeaveCall);

    return () => {
      socket.off("leaveCall", handleLeaveCall);
    };
  }, []);

   const callUser = () => {
    setIsCallStart(true);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    const handleSignal = (data: any) => {
      socketRef.current.emit("callUser", {
        userToCall: receiverId,
        voice: isAudioCall,
        video: isVideoCall,
        signalData: data,
        from: userId,
        name: CallerName,
      });
    };

    const handleStream = (stream: any) => {
      //userAudio.current.srcObject = stream;
    };

    const handleCallAccepted = (data: any) => {
      setCallAccepted(true);
      peer.signal(data.signal);
    };

    peer.on("signal", handleSignal);
    peer.on("stream", handleStream);

    socketRef.current.on("callAccepted", handleCallAccepted);
    connectionRef.current = peer;
  }; 

  const answerCall = () => {
    setCallAccepted(true);
    setCallTime({ minutes: 0, seconds: 0 });

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    const handleSignal = (data: any) => {
      socketRef.current.emit("answerCall", { signal: data, to: caller });
    };

    const handleStream = (stream: any) => {
      userAudio.current.srcObject = stream;
    };

    peer.on("signal", handleSignal);
    peer.on("stream", handleStream);

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  useEffect(() => {
    const cleanup = callUser();
    return cleanup; // Cleanup event listeners when call ends
  }, []); 

  const leaveCall = () => {
    setCallEnded(true);
    setIsReceiveCall(false);
    setCallAccepted(false);
    setIsCallStart(false);
    setCallTime({ minutes: 0, seconds: 0 });
    handleCloseModal();
    if (socketRef.current) {
      socketRef.current.emit("leaveCall");
      socketRef.current.disconnect();
    }
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    // Clear the video elements
    if (myAudio.current) {
      myAudio.current.srcObject = null;
      myAudio.current = null;
    }

    if (userAudio.current) {
      userAudio.current.srcObject = null;
      userAudio.current = null;
    }
    connectionRef.current = null;
  };

  /* Start call timer when user accept the call */
  useEffect(() => {
    if (callAccepted) {
      const intervalId = setInterval(() => {
        setCallTime((prevCallTime: any) => {
          let newMinutes = prevCallTime.minutes;
          let newSeconds = prevCallTime.seconds + 1;

          if (newSeconds >= 60) {
            newMinutes += 1;
            newSeconds = 0;
          }

          return { minutes: newMinutes, seconds: newSeconds };
        });
      }, 1000);

      return () => clearInterval(intervalId); // Cleanup interval when call ends or component unmounts
    }
  }, [callAccepted]);

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={leaveCall}
    >
      <View style={styles.modalOverlay}>
        {callAccepted && (
          <View className="flexCenterColumn">
            <Text style={{ color: "red" }}>The call has started</Text>
            <Text style={{ color: "blue" }}>
              {callTime.minutes < 60 &&
                "0" +
                  callTime.minutes +
                  ":" +
                  (callTime.seconds < 10 ? "0" : "") +
                  callTime.seconds}
            </Text>
          </View>
        )}

        {!callAccepted && (
          <View >
            <View style={styles.callerName}>
              <Text style={styles.callerNameText}>
                {isReceiveCall && `${name} is calling...`}
              </Text>
              <Text style={styles.callerNameText}>
                {isCallStart && "Ringing..."}
              </Text>
            </View>
            <View style={styles.callerButtons}>
              {isReceiveCall && (
                <TouchableOpacity
                  style={styles.answerButton}
                  onPress={answerCall}
                >
                  <Ionicons
                    name={isAudioCall ? "call" : "videocam"}
                    size={30}
                    color="white"
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        <Pressable style={styles.endCallButton} onPress={leaveCall}>
          <Ionicons
            style={{ width: 30 }}
            name={isAudioCall ? "call-sharp" : "videocam-off"}
            size={30}
            color={"white"}
          />
        </Pressable>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: primaryColor + "cc",
  },
  endCallButton: {
    width: "20%",
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f00",
    padding: 10,
    borderRadius: 10,
  },
  caller: {
    flex: 1,
    width:'100%',
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  callerName: {
    marginBottom: 20,
  },
  callerNameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  callerButtons: {
    flexDirection: "row",
  },
  answerButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 50,
    marginHorizontal: 10,
  },
});

export default CallSection;
