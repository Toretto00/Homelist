import 'react-native-gesture-handler';

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../screens/Login";
import SignUp from "../screens/SignUp";

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
        </Stack.Navigator>
    );
}