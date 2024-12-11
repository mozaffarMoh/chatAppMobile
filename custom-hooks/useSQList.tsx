import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import { openDatabase, saveDataInSQLite } from "@/utils/database";

const useSQList = (
  dataFetched: any,
  getDataFetched: any,
  tableName: string
) => {
  const [data, setData]: any = useState([]);
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  // Check the network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: any) => {
      setIsOnline(state.isConnected);
    });
    return () => unsubscribe(); // Clean up the listener
  }, []);

  /* fetch the data from api if online true */
  useEffect(() => {
    const fetchAndStoreData = async () => {
      if (isOnline === true) {
        await getDataFetched(); // Fetch data
      }
    };

    fetchAndStoreData();
  }, [isOnline]);

  /* save date if comes from api otherwise got it from sqlite */
  useEffect(() => {
    const saveOrFetchData = async () => {
      const db = await openDatabase();

      if (isOnline === true && dataFetched.length > 0) {
        console.log("Saving fetched data...");
        setData(dataFetched);
        await saveDataInSQLite(db, tableName, dataFetched);
      } else if (isOnline === false) {
        const productsData: any = await db.getAllAsync(
          `SELECT * FROM ${tableName}`
        );
        console.log("Fetching data from SQLite...");
        setData(productsData);
      }
    };

    saveOrFetchData();
  }, [dataFetched, isOnline]);

  return [data];
};

export default useSQList;
