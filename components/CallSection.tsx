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
import "react-native-get-random-values";
import LottieView from "lottie-react-native";
import Video from "react-native-video";
import { Audio } from "expo-av";
import {
  playReceiveCallSound,
  playSendCallSound,
  stopReceiveCallSound,
  stopSendCallSound,
} from "@/constants/soundsFiles";
import Peer from "peerjs";
import { WebView } from "react-native-webview";

const CallSection = ({
  t,
  isVisible,
  handleCloseModal,
  isAudioCall,
  isVideoCall,
  name,
  caller,
  myData,
  callerSignal,
  stream,
  userId,
  isReceiveCall,
  setIsReceiveCall,
  isCallStart,
  setIsCallStart,
  receiverId,
}: any) => {
  const localStreamRef = useRef<any>(null);
  const remoteStreamRef = useRef<any>(null);
  const connectionRef = useRef<any>(null);
  const socketRef = useRef<Socket | any>(null);
  const [callAccepted, setCallAccepted] = useState<boolean>(false);
  const [callEnded, setCallEnded] = useState<boolean>(false);
  const [callTime, setCallTime] = useState<any>({
    minutes: 0,
    seconds: 0,
  });

  /* Initialize the socket */
  useEffect(() => {
    const socket = io("https://chatappapi-2w5v.onrender.com");
    socketRef.current = socket;

    const handleLeaveCall = () => {
      leaveCall();
    };

    socket.on("leaveCall", handleLeaveCall);

    return () => {
      socket.off("leaveCall", handleLeaveCall);
    };
  }, []);

  const callUser = async () => {
    try {
      const peer = new RTCPeerConnection();
      console.log("peer success  : ", peer);
    } catch (err) {
      console.log("peer error is : ", err);
    }
    socketRef.current.emit("callUser", {
      userToCall: receiverId,
      voice: isAudioCall,
      video: isVideoCall,
      from: userId,
      name: myData?.username,
      //signalData: data,
    });

    const handleStream = (stream: any) => {
      console.log("stream inside : ", stream);

      remoteStreamRef.current.srcObject = stream;
    };

    const handleCallAccepted = (data: any) => {
      console.log("call accepted data : ", data);

      setCallAccepted(true);
    };

    socketRef.current.on("stream", handleStream);

    socketRef.current.on("error", (err: any) => {
      console.error("PeerJS Error:", err);
    });

    socketRef.current.on("callAccepted", handleCallAccepted);
    connectionRef.current = socketRef.current;
  };

  const answerCall = async () => {
    stopReceiveCallSound();
    setCallAccepted(true);
    setCallTime({ minutes: 0, seconds: 0 });

    // Initialize PeerJS
    const peer = new Peer("", {
      host: "chatappapi-2w5v.onrender.com",
      port: 3000,
      path: "/",
    });

    peer.on("open", (id) => {
      console.log("PeerJS connected with ID:", id);
    });

    peer.on("call", (call) => {
      // Answer the call with the local media stream
      call.answer(stream);

      call.on("stream", async (remoteStream: any) => {
        console.log("Receiving remote stream : ", remoteStream);
        socketRef.current.emit("answerCall", {
          to: caller,
          signal: remoteStream,
        });
        // Use expo-av to play the remote audio stream
        const soundObject = new Audio.Sound();

        try {
          await soundObject.loadAsync({ uri: remoteStream }); // Use the stream URL
          await soundObject.playAsync();
        } catch (error) {
          console.error("Error playing remote audio:", error);
        }
      });

      call.on("error", (error) => {
        console.error("Error during the call:", error);
      });
      call.on("close", () => {
        console.log("Call closed");
      });
    });

    // Store the peer connection
    connectionRef.current = peer;
  };

  useEffect(() => {
    if (isReceiveCall) {
      playReceiveCallSound();
    }
    if (isCallStart) {
      playSendCallSound();
      callUser();
    }
  }, [isReceiveCall, isCallStart]);

  const leaveCall = () => {
    stopSendCallSound();
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
      connectionRef.current.close();
    }

    connectionRef.current = null;
  };

  /* Start call timer when user accepts the call */
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

      return () => clearInterval(intervalId);
    }
  }, [callAccepted]);

  let animationRinging = isAudioCall
    ? require("@/assets/animations/audioCall.json")
    : require("@/assets/animations/videoCall.json");

  if (localStreamRef?.current) {
    console.log("stream is : ", localStreamRef?.current?.srcObject);
  }

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={leaveCall}
    >
      <View style={styles.modalOverlay}>
        {callAccepted ? (
          <View style={styles.callContainer}>
            {!localStreamRef.current ? (
              <Text>Loading Local Stream...</Text>
            ) : (
              <Video
                source={{ uri: localStreamRef.current.srcObject.toURL() }}
                style={styles.localStream}
                resizeMode="contain"
                muted
              />
            )}

            {!remoteStreamRef.current ? (
              <Text>Loading Remote Stream...</Text>
            ) : (
              <Video
                source={{ uri: remoteStreamRef.current.srcObject.toURL() }}
                style={styles.remoteStream}
                resizeMode="contain"
              />
            )}
            <Text style={styles.callTimer}>
              {`${callTime.minutes < 10 ? "0" : ""}${callTime.minutes}:${
                callTime.seconds < 10 ? "0" : ""
              }${callTime.seconds}`}
            </Text>
          </View>
        ) : (
          <View style={styles.answerSection}>
            <LottieView
              source={animationRinging}
              autoPlay
              loop
              style={styles.animation}
            />
            <Text style={styles.callerNameText}>
              {isReceiveCall ? `${name}` : "Ringing..."}
            </Text>
            <Pressable
              style={[styles.actionButton, styles.answerCallButton]}
              onPress={answerCall}
            >
              <Ionicons
                name={isAudioCall ? "call-outline" : "videocam"}
                size={30}
                color="white"
              />
            </Pressable>
          </View>
        )}
        <Pressable
          style={[styles.actionButton, styles.endCallButton]}
          onPress={leaveCall}
        >
          <Ionicons
            name={isAudioCall ? "call-sharp" : "videocam-off"}
            size={30}
            color="white"
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
    gap: 10,
    backgroundColor: `${primaryColor}cc`,
  },
  callContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    maxHeight: 100,
  },
  answerSection: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  localStream: {
    width: 100,
    height: 150,
    position: "absolute",
    top: 20,
    right: 20,
  },
  remoteStream: {
    width: "100%",
    height: "100%",
  },
  callTimer: {
    color: "white",
    fontSize: 16,
  },
  callerNameText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
  actionButton: {
    width: "50%",
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
  },
  endCallButton: {
    backgroundColor: "red",
  },
  answerCallButton: {
    backgroundColor: secondaryColor,
  },
  animation: {
    width: 150, // Set size for the Lottie animation
    height: 150,
  },
});

export default CallSection;
