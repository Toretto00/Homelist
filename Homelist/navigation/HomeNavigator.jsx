import 'react-native-gesture-handler';

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../screens/Login";
import SignUp from "../screens/SignUp";
import EditProfile from '../screens/EditProfile';
import MyProperties from '../screens/MyProperties';
import Favorites from '../screens/Favorites';
import AccountSetting from '../screens/AccountSetting';
import Inbox from '../screens/Inbox';

import TabNavigator from "./TabNavigator";
import DrawerNavigator from "./DrawerNavigator";
import { COLORS } from '../variables/color';

const Stack = createNativeStackNavigator();

export default function HomeNavigator() {
    return(
        <Stack.Navigator screenOptions={{
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: COLORS.primary,
            },
            headerTintColor: COLORS.white,
        }}>
            <Stack.Screen name="Drawer navigator" component={DrawerNavigator} options={{headerShown: false}}/>
            <Stack.Screen name="Log in" component={Login}/>
            <Stack.Screen name="Sign up" component={SignUp}/>
            <Stack.Screen name="Edit profile" component={EditProfile} options={{headerShown: false}}/>
            <Stack.Screen name="My properties" component={MyProperties}/>
            <Stack.Screen name="Favorites" component={Favorites}/>
            <Stack.Screen name="Settings" component={AccountSetting}/>
            <Stack.Screen name="Inbox" component={Inbox}/>
        </Stack.Navigator>
    );
}