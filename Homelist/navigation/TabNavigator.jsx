import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Home from '../screens/Home';
import Search from '../screens/Search';
import AdNew from '../screens/AdNew';
import Chats from '../screens/Chats';
import Account from '../screens/Account';
import { COLORS } from '../variables/color';

const Tab = createBottomTabNavigator();

MaterialCommunityIcons.loadFont();

export default function TabNavigator() {
    return (
        <Tab.Navigator 
            initialRouteName='home'
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                }
            }>
            <Tab.Screen name='home' 
                        component={Home}
                        options={
                            {tabBarIcon: ({color}) => (<MaterialCommunityIcons name="home" color={color} size={26} />)}                      
                        }/>
            <Tab.Screen name='search' 
                        component={Search}
                        options={
                            {tabBarIcon: ({color}) => (<MaterialCommunityIcons name="magnify" color={color} size={26} />)}                        
                        }/>
            <Tab.Screen name='adnew' 
                        component={AdNew}
                        options={
                            {tabBarIcon: ({color}) => (<MaterialCommunityIcons name="home-plus" color={color} size={26} />)}                        
                        }/>
            <Tab.Screen name='chats' 
                        component={Chats}
                        options={
                            {tabBarIcon: ({color}) => (<MaterialCommunityIcons name="chat" color={color} size={26} />)}                        
                        }/>
            <Tab.Screen name='account' 
                        component={Account}
                        options={
                            {tabBarIcon: ({color}) => (<MaterialCommunityIcons name="account" color={color} size={26} />)}                        
                        }/>
        </Tab.Navigator>
    );
}