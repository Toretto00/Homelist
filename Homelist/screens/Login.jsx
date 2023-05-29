import { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Touchable,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
} from "react-native";

import { Button, HelperText, TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { COLORS } from "../variables/color";
import api from "../api/client";
import { useStateValue } from "../StateProvider";

export default function Login({ navigation }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [disabledLoginBtn, setdisableLoginBtn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [{}, dispatch] = useStateValue();

  useEffect(() => {
    if (userName !== "" && password !== "") {
      setdisableLoginBtn(false);
    } else {
      setdisableLoginBtn(true);
    }
  }, [userName, password]);

  function handleLogin() {
    Keyboard.dismiss();
    setIsLoading(true);
    api
      .post("login", {
        username: userName,
        password: password,
      })
      .then((res) => {
        if (res.ok) {
          storeUserData(res.data);
          dispatch({
            type: "SET_AUTH_DATA",
            data: {
              user: res.data.user,
              auth_token: res.data.jwt_token,
            },
          });
          setIsLoading(false);
          navigation.pop();
        } else {
          Alert.alert(res.data.message);
        }
      });
  }

  const storeUserData = async (userData) => {
    try {
      await AsyncStorage.setItem("@userData", JSON.stringify(userData));
    } catch (e) {
      Alert.alert(e);
    }
  };

  function handleValidEmail() {
    if (userName === "") return false;
    return !userName.includes("@gmail.com");
  }

  function handleValidPassword() {
    if (password === "" || password.length >= 6) return false;
    return true;
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.flexGrow0}>
          <View style={styles.alignCenter}>
            <Text style={styles.text}>Log in to your account</Text>
          </View>
          <TextInput
            placeholder="Email"
            mode="outlined"
            activeOutlineColor={COLORS.primary}
            style={[styles.margin, styles.backgroundTransparent]}
            value={userName}
            keyboardType="email-address"
            onChangeText={(userName) => {
              setUserName(userName);
            }}
          />
          <HelperText type="error" visible={handleValidEmail()}>
            Email address is invalid!
          </HelperText>
          <TextInput
            placeholder="Password"
            mode="outlined"
            activeOutlineColor={COLORS.primary}
            style={[styles.margin, styles.backgroundTransparent]}
            secureTextEntry={hidePassword ? true : false}
            value={password}
            onChangeText={(password) => {
              setPassword(password);
            }}
            right={
              <TextInput.Icon
                icon={hidePassword ? "eye" : "eye-off"}
                onPress={() => {
                  setHidePassword(!hidePassword);
                }}
              />
            }
          />
          <HelperText type="error" visible={handleValidPassword()}>
            Password must be at least 6 characters
          </HelperText>
          <TouchableOpacity style={styles.margin}>
            <Text>Forgot your password?</Text>
          </TouchableOpacity>
          <View style={styles.margin}>
            <Button
              mode="contain"
              buttonColor={COLORS.primary}
              textColor={COLORS.white}
              disabled={disabledLoginBtn}
              onPress={handleLogin}
              loading={isLoading}
            >
              Login
            </Button>
          </View>
          <View style={[styles.alignCenter, styles.margin]}>
            <Text>Or login with</Text>
          </View>
          <View style={styles.margin}>
            <Button
              mode="contain"
              buttonColor={COLORS.black}
              icon="apple"
              textColor={COLORS.white}
            >
              Login with Apple
            </Button>
          </View>
          <View style={styles.margin}>
            <Button
              mode="contain"
              buttonColor={COLORS.blueFacebook}
              icon="facebook"
              textColor={COLORS.white}
            >
              Login with Facebook
            </Button>
          </View>
          <View style={styles.margin}>
            <Button
              mode="contain"
              buttonColor={COLORS.redGoogle}
              icon="google"
              textColor={COLORS.white}
            >
              Login with Google
            </Button>
          </View>
        </View>
        <View style={styles.flexEnd}>
          <View style={styles.signUp}>
            <Text>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Sign up")}>
              <Text style={styles.textColor}>Sign up now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 10,
  },
  backgroundTransparent: {
    backgroundColor: COLORS.transparent,
  },
  margin: {
    marginTop: 10,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    height: 60,
    lineHeight: 60,
    fontWeight: "bold",
  },
  alignCenter: {
    alignItems: "center",
  },
  justifyCenter: {
    justifyContent: "center",
  },
  signUp: {
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "center",
  },
  textColor: {
    color: COLORS.primary,
  },
  flexEnd: {
    alignItems: "stretch",
  },
});
