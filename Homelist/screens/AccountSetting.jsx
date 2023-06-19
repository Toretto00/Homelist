import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from "react-native";

import { ActivityIndicator } from "react-native-paper";

import { COLORS } from "../variables/color";
import { Divider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStateValue } from "../StateProvider";
import api, { removeAuthToken } from "../api/client";
import { useState } from "react";

const { height: screenHeight, width: screenWidth } = Dimensions.get("screen");

export default function AccountSetting({ route, navigation }) {
  const [{ user, push_token }, dispatch] = useStateValue();
  const [isLoading, setIsLoading] = useState(false);

  function handleLogout() {
    setIsLoading(true);
    api
      .post("logout", { push_token: push_token })
      .then((res) => {
        dispatch({
          type: "SET_AUTH_DATA",
          data: {
            user: null,
            auth_token: null,
          },
        });
      })
      .then(() => {
        removeAuthToken();
        removeData();
        setIsLoading(false);
      })
      .finally(() => {
        navigation.goBack();
      });
  }

  const removeData = async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      Alert.alert(e);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {isLoading ? (
        <ActivityIndicator
          color={COLORS.primary}
          style={{ justifyContent: "center", alignItems: "center", flex: 1, height: screenHeight }}
          size="large"
        />
      ) : (
        <>
          <TouchableOpacity style={styles.actionBtn}>
            <Text>Email</Text>
            <Text style={styles.orange}>{route?.params?.user.email}</Text>
          </TouchableOpacity>
          <Divider />
          <TouchableOpacity style={styles.actionBtn}>
            <Text>Mobile Phonenumber</Text>
            <Text style={styles.orange}>
              {route?.params?.user ? route.params.user.phone : "Add"}
            </Text>
          </TouchableOpacity>
          <Divider />
          <TouchableOpacity style={styles.actionBtn}>
            <Text>Date of Birth</Text>
            <Text style={styles.orange}>02/07/2002</Text>
          </TouchableOpacity>
          <Divider/>
          <View style={styles.space} />
          <Divider/>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleLogout()}
          >
            <Text style={styles.red}>Log Out</Text>
            <Image source={require("../assets/log-out.png")} />
          </TouchableOpacity>
          <Divider/>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  actionBtn: {
    height: 60,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
  },
  image: {
    height: 24,
    width: 24,
  },
  space: {
    height: 60,
    backgroundColor: "transparent",
  },
  red: {
    color: COLORS.redGoogle,
  },
  orange: {
    color: COLORS.orange,
  },
});
