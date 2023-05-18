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

export default function AccountSetting({ route, navigation }) {
  function handleLogout() {
    removeData();
    navigation.goBack();
  };

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
        <Text style={styles.orange}>{route?.params?.userData.email}</Text>
      </TouchableOpacity>
      <Divider />
      <TouchableOpacity style={styles.actionBtn}>
        <Text>Mobile Phonenumber</Text>
        <Text style={styles.orange}>{route?.params?.userData ? route.params.userData.phone : 'Add'}</Text>
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
    //backgroundColor: COLORS.white,
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
