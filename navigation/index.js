
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Authorization from "../screens/AuthScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import LinkingConfiguration from "./LinkingConfiguration";

export default function Navigation({ colorScheme }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
        >
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createStackNavigator();

function RootNavigator() {

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
      <Stack.Screen name="Authorization" component={Authorization} />
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }}/>
      {/* // )} */}
       {/* {isAutorized.valueOf() === 'true' && (
        <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }}/>
      )}
      <Stack.Screen name="NotFound" component={NotFoundScreen} /> */}
    </Stack.Navigator>
  );
}
