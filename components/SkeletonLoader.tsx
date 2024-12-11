import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { Surface } from "react-native-paper";

const SkeletonLoader = () => {
  return (
    <Surface style={styles.surfaceContainer}>
      <MaskedView
        style={styles.container}
        maskElement={
          <View style={styles.maskContainer}>
            {/* This is the mask (the skeleton shape you want to show) */}
            <View style={styles.skeleton} />
            <View style={styles.skeleton} />
            <View style={styles.skeleton} />
          </View>
        }
      >
        <View style={{ width: 100, height: 100 }}></View>
      </MaskedView>
    </Surface>
  );
};

const styles = StyleSheet.create({
  surfaceContainer: {
    height:'100%',
    paddingTop:20,
  },
  container: {
    backgroundColor: "#ddeedd",
    justifyContent: "center",
    alignItems: "center",
  },
  maskContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  skeleton: {
    height: 20,
    width: "60%",
    backgroundColor: "#e0e0e0", // Placeholder background color
    marginBottom: 10,
    borderRadius: 4,
  },
});

export default SkeletonLoader;
