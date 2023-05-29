import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";

import { COLORS } from "../variables/color";
import { Divider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStateValue } from "../StateProvider";

export default function AccountSetting({ route, navigation }) {
  const [{ user }, dispatch] = useStateValue();

  function handleLogout() {
    removeData();
    dispatch({
      type: "SET_AUTH_DATA",
      data: {
        user: null,
        auth_token: null,
      },
    });
    navigation.goBack();
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
      <View style={styles.space} />
      <TouchableOpacity style={styles.actionBtn} onPress={() => handleLogout()}>
        <Text style={styles.red}>Log Out</Text>
        <Image source={require("../assets/log-out.png")} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
