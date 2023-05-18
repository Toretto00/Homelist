import { useState } from "react";

import { StyleSheet, Text, View, Image } from "react-native";

import { Button } from "react-native-paper";

import { COLORS } from "../variables/color";

export default function Apologize({ navigation }) {
  return (
    <View style={styles.loginReuestContainer}>
      <Image source={require("../assets/sad.png")} />
      <Text style={[styles.text, { fontSize: 20, margin: 8 }]}>Sorry</Text>
      <Text style={[styles.text, {width:  '60%'}]}>
        This screen is in development, please come back later!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loginReuestContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    color: COLORS.text_gray,
  },
});
