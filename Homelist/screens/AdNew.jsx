import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import AsyncStorage from "@react-native-async-storage/async-storage";

import Header from '../components/Header';
import LoginRequest from '../components/LoginRequest';
import Apologize from '../components/Apologize';

export default function AdNew({navigation}) {
  const [userData, setUserData] = useState();

  useEffect(() => {
    const focusHandler = navigation.addListener("focus", () => {
      getUserData();
    });
    return focusHandler;
  }, [navigation]);

  const getUserData = async () => {
    try {
      await AsyncStorage.getItem("@userData").then((res) => {
        var obj = JSON.parse(res);
        setUserData(obj);
      });
    } catch (e) {
      Alert.alert(e);
    }
  };
  return (
    <View style={styles.container}>
        <Header/>
        {userData ? (<Apologize/>) : (<LoginRequest navigation={navigation}/>)}
        
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});