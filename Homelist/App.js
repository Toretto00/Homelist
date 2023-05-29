import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeNavigator from "./navigation/HomeNavigator";

import { StateProvider } from "./StateProvider";
import reducer, { initialState } from "./reducer";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <NavigationContainer>
        <HomeNavigator />
      </NavigationContainer>
    </StateProvider>
  );
}
