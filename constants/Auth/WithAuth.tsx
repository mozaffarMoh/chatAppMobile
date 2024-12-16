import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native-paper";
const withAuth = (Component: React.FC<any>) => {
  const WithAuthComponent: React.FC<any> = (props: any) => {
    const token = async () => await AsyncStorage.getItem("token");

    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
      null
    );

    useEffect(() => {
      token()
        .then((token) => {
          setIsAuthenticated(token ? true : false);
        })
        .catch(() => {
          setIsAuthenticated(false);
        });
    }, [token]);

    useEffect(() => {
      if (isAuthenticated === false) {
        console.log("isAuth : ", isAuthenticated);

        router.push("/(screens)/Login");
      }
    }, [isAuthenticated]);

    if (isAuthenticated === null) {
      return <ActivityIndicator animating={true} color={"red"} />;
    }

    return isAuthenticated ? <Component {...props} /> : null;
  };

  return WithAuthComponent;
};

export default withAuth;
