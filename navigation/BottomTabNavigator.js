import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { useColorScheme, View } from "react-native";

import Colors from "../constants/Colors";
import Balance from "../screens/Balance";
import Order from "../screens/Order";
import Orders from "../screens/Orders";
import ProfileScreen from "../screens/Profile";

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {

  return (
    <BottomTab.Navigator
      initialRouteName="Orders"
      screenOptions={{ tabBarActiveTintColor: 'black' }}
    >
      <BottomTab.Screen
        name="Pedidos"
        component={OrdersNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <>
            <View style={{ paddingTop: 4 }}/>
              <TabBarIcon name="list-outline" color={color} />
            </>
          ),
        }}
      />
      <BottomTab.Screen
        name="Saldo"
        component={BalanceNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <>
            <View style={{ paddingTop: 4 }}/>
              <TabBarIcon name="wallet-outline" color={color} />
            </>
          )
        }}
      />
      <BottomTab.Screen
        name="Perfil"
        component={ProfileNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <>
            <View style={{ paddingTop: 4 }}/>
              <TabBarIcon name="person-outline" color={color} />
            </>
          )
        }}
      />
    </BottomTab.Navigator>
  );
}

function TabBarIcon(props) {
  return <Ionicons size={28} {...props} />;
}

const TabOneStack = createStackNavigator();

function OrdersNavigator() {
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name="OrdersScreen"
        component={Orders}
        options={{ headerShown: false }}
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

const BalanceStack = createStackNavigator();

function BalanceNavigator() {
  return (
    <BalanceStack.Navigator>
      <BalanceStack.Screen
        name="BalanceScreen"
        component={Balance}
        options={{ headerShown: false}}
      />
    </BalanceStack.Navigator>
  );
}
