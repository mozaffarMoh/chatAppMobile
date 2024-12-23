import { useCallback, useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import { openDatabase, saveDataInSQLite } from "@/utils/database";
import { useFocusEffect } from "expo-router";

const useSQList = (
  dataFetched: any,
  getDataFetched: any,
  tableName: string,
  isFirstRender: boolean
) => {
  const [data, setData]: any = useState([]);
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  // Check the network status
  useFocusEffect(
    useCallback(() => {
      const unsubscribe = NetInfo.addEventListener((state: any) => {
        setIsOnline(state.isConnected);
      });
      return () => unsubscribe(); // Clean up the listener
    }, [])
  );

  /* fetch the data from api if online true */
  useFocusEffect(
    useCallback(() => {
      const fetchAndStoreData = async () => {
        if (isOnline === true) {
          await getDataFetched(); // Fetch data
        }
      };

      fetchAndStoreData();
    }, [isOnline, isFirstRender])
  );

  /* save date if comes from api otherwise got it from sqlite */
  useFocusEffect(
    useCallback(() => {
      const saveOrFetchData = async () => {
        const db = await openDatabase();
        const savedData: any = await db.getAllAsync(
          `SELECT * FROM ${tableName}`
        );

        if (
          isOnline === false ||
          (dataFetched?.length && dataFetched?.length < savedData?.length)
        ) {
          console.log("Fetching data from SQLite...");
          setData(savedData);
        } else if (isOnline === true && dataFetched?.length) {
          console.log("Saving fetched data...");
          setData(dataFetched);
          await saveDataInSQLite(db, tableName, dataFetched);
        }
      };

      saveOrFetchData();
    }, [dataFetched, isOnline, isFirstRender])
  );

  return [data];
};

export default useSQList;
