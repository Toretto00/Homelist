import "react-native-gesture-handler";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../screens/Login";
import SignUp from "../screens/SignUp";
import EditProfile from "../screens/EditProfile";
import MyProperties from "../screens/MyProperties";
import Favorites from "../screens/Favorites";
import AccountSetting from "../screens/AccountSetting";
import Inbox from "../screens/Inbox";
import ListingDetail from "../screens/ListingDetail";
import SelectLocation from "../screens/SelectLocation";

import TabNavigator from "./TabNavigator";
import DrawerNavigator from "./DrawerNavigator";
import { COLORS } from "../variables/color";
import { useStateValue } from "../StateProvider";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();

export default function HomeNavigator() {
  const [{}, dispatch] = useStateValue();

  useEffect(()=>{
    getUserData();
  },[]);

  const getUserData = async () => {
    const obj = await AsyncStorage.getItem("@userData");
    if(!obj) return;
    dispatch({
      type: "SET_AUTH_DATA",
      data: {
        user: JSON.parse(obj).user,
        auth_token: JSON.parse(obj).jwt_token,
      },
    });
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
      }}
    >
      <Stack.Screen
        name="Drawer navigator"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Log in" component={Login} />
      <Stack.Screen name="Sign up" component={SignUp} />
      <Stack.Screen
        name="Edit profile"
        component={EditProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="My properties" component={MyProperties} />
      <Stack.Screen name="Favorites" component={Favorites} />
      <Stack.Screen name="Settings" component={AccountSetting} />
      <Stack.Screen name="Inbox" component={Inbox} />
      <Stack.Screen name="Select Location" component={SelectLocation} />
      <Stack.Screen
        name="Listing Detail"
        component={ListingDetail}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
