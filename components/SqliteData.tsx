import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, Surface } from "react-native-paper";
import useGet from "@/custom-hooks/useGet";
import SkeletonLoader from "./SkeletonLoader";
import { LinearGradient } from "expo-linear-gradient";
import Sncakbar from "./CustomSnackbar";
import useSQList from "@/custom-hooks/useSQList";

const Item = ({ id, category, price, title }: any) => (
  <LinearGradient
    colors={["#00559988", "#55009911"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.gradientOverlay}
  >
    <Text>
      {id} - <Text style={{ fontWeight: "bold" }}>{category}</Text>: {price}{" "}
      {"\n"}
      {title}
    </Text>
  </LinearGradient>
);

const SqliteData = () => {
  const [dataFetched, loading, getDataFetched, success]: any = useGet(
    "https://fakestoreapi.com/products"
  );

  const [products]: any = useSQList(
    dataFetched,
    getDataFetched,
    "products"
  );

  
  return (
    <>
      <Surface style={{ gap: 2, paddingLeft: 10 }}>
        <Sncakbar />
        {loading ? (
          <SkeletonLoader />
        ) : (
          products.length > 0 && (
            <FlatList
              data={products}
              renderItem={({ item }) => <Item {...item} />}
              alwaysBounceVertical={true}
            />
          )
        )}
        {products.length === 0 && success && <Text>No products available</Text>}
      </Surface>
    </>
  );
};

export default SqliteData;

const styles = StyleSheet.create({
  surface: {
    justifyContent: "center",
    alignItems: "center",
    height: 100,
    marginBottom: 10,
  },
  gradientOverlay: {
    padding: 20,
    marginVertical: 8,
  },
});
