import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import TabNavigator from './navigation/TabNavigator';

import Home from './screens/Home';
import Search from './screens/Search';
import AdNew from './screens/AdNew';
import Chats from './screens/Chats';
import Account from './screens/Account';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/* <Stack.Navigator>
        <Stack.Screen name='Home' component={Home}/>
        <Stack.Screen name='Search' component={Search}/>
        <Stack.Screen name='AdNew' component={AdNew}/>
        <Stack.Screen name='Chats' component={Chats}/>
        <Stack.Screen name='Account' component={Account}/>        
      </Stack.Navigator> */}
      <TabNavigator/>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
