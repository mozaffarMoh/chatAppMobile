import { useState } from "react";
import { Platform, Text, View, StyleSheet, Button } from "react-native";
import * as Device from "expo-device";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

export default function LocationComponent() {
  const [location, setLocation] = useState<any>(null);
  const [address, setAddress] = useState<string>(""); // Store the readable address
  const [text, setText] = useState<string>("");

  // Function to reverse geocode the location coordinates
  const reverseGeocode = async (latitude: number, longitude: number) => {
    setAddress("Waiting to get human address..");
    try {
      const [result] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (result) {
        // Format and set the address from the geocode result
        setAddress(`${result.name}, ${result.city}, ${result.country}`);
      } else {
        setAddress("No address found.");
      }
    } catch (error) {
      console.log(error);
      setAddress("Failed to reverse geocode.");
    }
  };

  // Function to get current location
  const getCurrentLocation = async () => {
    setText("Waiting...");
    if (Platform.OS === "android" && !Device.isDevice) {
      setText(
        "Oops, this will not work on Snack in an Android Emulator. Try it on your device!"
      );
      return;
    }

    // Request location permission
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setText("Permission to access location was denied");
      return;
    }

    try {
      // Get current location coordinates
      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        lat: location.coords.latitude,
        long: location.coords.longitude,
      });
      setText("Location found");

      // Reverse geocode the current location to get a readable address
      reverseGeocode(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      setText("Failed to get location");
    }
  };

  const handleChangeLocation = (e: any) => {
    let lat = e.nativeEvent.coordinate.latitude;
    let long = e.nativeEvent.coordinate.longitude;
    setLocation({ lat, long });

    // Reverse geocode the new coordinates when the map is pressed
    reverseGeocode(lat, long);
  };

  return (
    <View style={styles.container}>
      <Button title="Get Location" onPress={getCurrentLocation} />
      <Text style={styles.paragraph}>{text}</Text>
      {address && <Text style={styles.paragraph}>Address: {address}</Text>}

      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.lat,
            longitude: location.long,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onPress={handleChangeLocation}
        >
          <Marker
            coordinate={{
              latitude: location.lat,
              longitude: location.long,
            }}
            title="You are here"
          />
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 20,
  },
  map: {
    flex: 1, // Allow the map to take the remaining space
    width: "100%",
  },
  paragraph: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
  },
});
