import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { useColorScheme } from "react-native";

import Colors from "../constants/Colors";
import Order from "../screens/Order";
import Orders from "../screens/Orders";
import ProfileScreen from "../screens/Profile";

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Orders"
      screenOptions={{ tabBarActiveTintColor: Colors[colorScheme].tint }}
    >
      <BottomTab.Screen
        name="Pedidos"
        component={OrdersNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="list-circle-outline" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Perfil"
        component={ProfileNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="person-circle-outline" color={color} />
          )
        }}
      />
    </BottomTab.Navigator>
  );
}

function TabBarIcon(props) {
  return <Ionicons size={32} style={{ marginBottom: -3 }} {...props} />;
}

const TabOneStack = createStackNavigator();

function OrdersNavigator() {
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name="OrdersScreen"
        component={Orders}
        options={{ headerShown: false}}
      />
      <TabOneStack.Screen
        name="OrderById"
        component={Order}
        options={{ headerShown: false, gestureEnabled: true}}
      />
    </TabOneStack.Navigator>
  );
}

const TabTwoStack = createStackNavigator();

function ProfileNavigator() {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerShown: false}}
      />
    </TabTwoStack.Navigator>
  );
}
