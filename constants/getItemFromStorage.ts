import AsyncStorage from "@react-native-async-storage/async-storage";

export const getItemFromStorage = async (name: string, setItem: any) => {
    try {
        const item: any = await AsyncStorage.getItem(name);
        let value = name == 'myData' ? JSON.parse(item) : item;

        setItem(value);
    } catch (error) {
        console.log("Error fetching data from AsyncStorage", error);
        setItem(null)
    }
};