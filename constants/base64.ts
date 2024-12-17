import * as FileSystem from "expo-file-system";

export const base64Image = async (uri: string) => {

    try {
        // Read the image file and convert it to Base64
        const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });
        
        return `data:image/jpeg;base64,${base64}`

    } catch (error) {
        console.error("Error reading file as Base64:", error);
        return uri
    }
};