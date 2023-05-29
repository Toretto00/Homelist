import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import Header from '../components/Header';
import LoginRequest from '../components/LoginRequest';
import Apologize from '../components/Apologize';
import { useStateValue } from '../StateProvider';

export default function Chats({navigation}) {
  const [{user}, dispatch] = useStateValue();

  return (
    <View style={styles.container}>
        <Header/>
        {user ? (<Apologize/>) : (<LoginRequest navigation={navigation}/>)}
        
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});