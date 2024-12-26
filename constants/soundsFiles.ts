import { Audio } from "expo-av";

let soundObject: any = null; // Single reference for all sounds

// Helper function to play a sound
const playSound = async (soundFile: any) => {
    if (soundObject) {
        console.log("Sound is already playing.");
        return; // Prevent multiple instances
    }
    try {
        const { sound } = await Audio.Sound.createAsync(soundFile);
        soundObject = sound; // Store reference
        await sound.setIsLoopingAsync(true); // Enable looping
        await sound.playAsync(); // Play sound
    } catch (error) {
        console.error("Error playing sound:", error);
    }
};

// Helper function to stop a sound
const stopSound = async () => {
    if (soundObject) {
        try {
            await soundObject.stopAsync(); // Stop sound
            await soundObject.unloadAsync(); // Free resources
            soundObject = null; // Reset reference
        } catch (error) {
            console.error("Error stopping sound:", error);
        }
    }
};


// Specific sound actions
export const playReceiveCallSound = () => playSound(require("../assets/sounds/receiveCall.mp3"));
export const stopReceiveCallSound = () => stopSound();

export const playSendCallSound = () => playSound(require("../assets/sounds/sendCall.mp3"));
export const stopSendCallSound = () => stopSound();


/* send message */
export const playReceiveMessageSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/receiveMessage.mp3")
    );
    await sound.playAsync();
};

export const playSendMessageSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/sendMessage.mp3")
    );
    await sound.playAsync();
};
