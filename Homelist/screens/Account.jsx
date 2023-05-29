import { useState } from "react";

import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";

import {
  Avatar,
  Badge,
  Button,
  Divider,
  ActivityIndicator,
} from "react-native-paper";

import { COLORS } from "../variables/color";

import Header from "../components/Header";
import LoginRequest from "../components/LoginRequest";
import Icon from "react-native-vector-icons/FontAwesome";
import { useStateValue } from "../StateProvider";

const { height: screenHeight, width: screenWidth } = Dimensions.get("screen");

export default function Account({ navigation }) {
  const [messages, setMessages] = useState(2);
  const [{user}, dispatch] = useStateValue();

  return (
    <View style={styles.container}>
      <Header />
      {user && (
        <View>
          <ImageBackground
            source={require("../assets/account_header.png")}
            resizeMode="contain"
            style={styles.userAvatarContainer}
          >
            <Avatar.Image size={80} source={{ uri: user.pp_thumb_url }} />
            <Text style={styles.text}>
              {[user.first_name, user.last_name].join(" ")}
            </Text>
          </ImageBackground>
          <View style={styles.userActions}>
            <Button
              mode="outlined"
              textColor={COLORS.black}
              style={styles.editProfileBtn}
              onPress={() => navigation.navigate("Edit profile")}
            >
              EDIT PROFILE
            </Button>
            <View style={styles.userContainer}>
              <Button
                mode="text"
                icon="home"
                textColor={COLORS.text_gray}
                compact={true}
                contentStyle={{
                  flexDirection: "column",
                  width: screenWidth / 4,
                }}
                onPress={() => navigation.navigate("My properties")}
              >
                <Text>Properties</Text>
              </Button>
              <Divider style={{ width: 1, height: "60%", marginVertical: 8 }} />
              <Button
                mode="text"
                icon="cards-heart"
                textColor={COLORS.text_gray}
                compact={true}
                contentStyle={{
                  flexDirection: "column",
                  width: screenWidth / 4,
                }}
                onPress={() => navigation.navigate("Favorites")}
              >
                <Text>Favorites</Text>
              </Button>
              <Divider style={{ width: 1, height: "60%", marginVertical: 8 }} />
              <Button
                mode="text"
                icon="storefront"
                textColor={COLORS.text_gray}
                compact={true}
                contentStyle={{
                  flexDirection: "column",
                  width: screenWidth / 4,
                }}
              >
                <Text>Stores</Text>
              </Button>
              <Divider style={{ width: 1, height: "60%", marginVertical: 8 }} />
              <Button
                mode="text"
                icon="account-settings"
                textColor={COLORS.text_gray}
                compact={true}
                contentStyle={{
                  flexDirection: "column",
                  width: screenWidth / 4,
                }}
                onPress={() => navigation.navigate("Settings", {user})}
              >
                <Text>Setting</Text>
              </Button>
            </View>
            <TouchableOpacity
              style={styles.inboxBtn}
              onPress={() => navigation.navigate("Inbox")}
            >
              <View>
                <Text style={styles.bold}>INBOX</Text>
                <Text style={styles.textGray}>View messages</Text>
              </View>
              <View style={styles.row}>
                <Badge visible={messages !== 0} style={styles.orange}>
                  {messages}
                </Badge>
                <Image
                  style={styles.image}
                  source={require("../assets/right-arrow.png")}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {!user && <LoginRequest navigation={navigation} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  userContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: screenWidth,
    marginTop: 20,
  },
  userAvatarContainer: {
    height: (screenWidth * 306) / 750,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    margin: 8,
  },
  userActions: {
    marginTop: 20,
    alignItems: "center",
  },
  editProfileBtn: {
    width: 200,
    borderRadius: 6,
  },
  inboxBtn: {
    height: 80,
    width: screenWidth,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 0,
    marginTop: 20,
    padding: 10,
  },
  textInboxBtn: {
    flexDirection: "row",
    height: 60,
  },
  image: {
    height: 24,
    width: 24,
  },
  bold: {
    fontWeight: "bold",
  },
  textGray: {
    color: COLORS.text_gray,
  },
  row: {
    flexDirection: "row",
  },
  orange: {
    backgroundColor: COLORS.orange,
  },
});
