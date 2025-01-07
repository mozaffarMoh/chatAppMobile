import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

// In your notifications file
export function setNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async (notification: any) => {
      return {
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        badge: notification.data?.badge || 0,
      };
    },
  });
}


/* show Error message */
function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

/* get the token */
export async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#ff0000",
      sound: "sound.mp3",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError(
        "Permission not granted to get push token for push notification!"
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      return pushTokenString;
    } catch (e: unknown) {
      console.log(e);
      //handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}


/* push the notification */
export async function sendPushNotification(messageContent: any) {
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messageContent),
  })
}


/* This is just for add local notification */
export async function scheduleAndCancel(messageContent: any) {
  const triggerDetails: any = {
    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    seconds: 2, // Notification will trigger after 60 seconds
    repeats: false, // Set to false to prevent it from repeating
  }

  try {
    // Schedule the notification
    const identifier = await Notifications.scheduleNotificationAsync({
      content: messageContent,
      trigger: null
    });

    console.log('Notification scheduled. Identifier:', identifier);

    // Optionally, cancel the scheduled notification immediately
    await Notifications.cancelScheduledNotificationAsync(identifier);
    console.log('Scheduled notification cancelled immediately.');
  } catch (error) {
    console.error('Error scheduling or cancelling notification:', error);
  }
}