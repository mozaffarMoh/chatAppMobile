import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  Image,
  useColorScheme,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { object, z } from "zod";
import { createValidationSchema } from "./schema";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";

// Step 1: Define dynamic validation array
const validationFields = [
  { name: "username", type: "string", required: true },
  { name: "email", type: "email", required: true },
  { name: "file", type: "file", required: true }, // File field validation
  { name: "date", type: "date", required: true }, // Date field validation
];

const validationSchema = createValidationSchema(validationFields);

// Step 3: Main Component
const FileUploadWithValidation = () => {
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const colorScheme = useColorScheme();
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });
      if (!result.canceled) {
        setSelectedFile(result.assets[0]);
        setFormData((prev: any) => ({ ...prev, file: result.assets[0] }));
      }
    } else {
      console.log("Permission to access media library denied");
    }
  };

  const handleSubmit = () => {
    try {
      validationSchema.parse(formData);
      console.log("Form Submitted Successfully:", formData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: any = err.errors.reduce((acc: any, error: any) => {
          acc[error.path[0]] = error.message;
          return acc;
        }, {});
        setErrors(fieldErrors);
        console.log("Validation Errors:", fieldErrors);
      }
    }
  };

  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      handleSubmit();
    }
  }, [formData]);

  const handleChangeDate = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios"); // For iOS, keep picker open.
    setDate(currentDate);
    setFormData((prev: any) => ({
      ...prev,
      date: dayjs(currentDate).format("DD-MM-YYYY"),
    }));
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <View style={styles.container}>
      {validationFields.map((field: any) => {
        if (field.type === "file") {
          return (
            <View key={field.name} style={styles.fileInputContainer}>
              <Button title="Upload File" onPress={handleFileUpload} />
              {selectedFile && (
                <View>
                  {selectedFile.type?.startsWith("image") ? (
                    <Image
                      source={{ uri: selectedFile.uri }}
                      style={styles.imagePreview}
                    />
                  ) : (
                    <Text>File: {selectedFile.name}</Text>
                  )}
                </View>
              )}
              {errors[field.name] && (
                <Text style={styles.error}>{errors[field.name]}</Text>
              )}
            </View>
          );
        }

        if (field.type === "date") {
          return (
            <View key={field.name} style={styles.inputContainer}>
              <Button onPress={showDatepicker} title="Select Date" />
              {show && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={handleChangeDate}
                />
              )}
              {errors[field.name] && (
                <Text style={styles.error}>{errors[field.name]}</Text>
              )}
              {date && (
                <Text style={{ textAlign: "center" }}>{formData?.date}</Text>
              )}
            </View>
          );
        }

        const inputTextColor = colorScheme === "dark" ? "white" : "black";
        const placeholderColor = colorScheme === "dark" ? "#aaa" : "#888";
        const backgroundColor = colorScheme === "dark" ? "#333" : "#fff";
        const borderColor = colorScheme === "dark" ? "#555" : "#ccc";
        return (
          <View key={field.name} style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                {
                  color: inputTextColor, // Dynamic text color
                  backgroundColor, // Dynamic background color
                  borderColor, // Dynamic border color
                },
              ]}
              placeholderTextColor={placeholderColor} // Dynamic placeholder color
              placeholder={field.name}
              onChangeText={handleInputChange.bind(this, field.name)}
            />
            {errors[field.name] && (
              <Text style={styles.error}>{errors[field.name]}</Text>
            )}
          </View>
        );
      })}
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  fileInputContainer: {
    marginBottom: 20,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginTop: 10,
    resizeMode: "cover",
  },
  error: {
    color: "red",
    marginTop: 5,
  },
});

export default FileUploadWithValidation;
