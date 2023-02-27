import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useLayoutEffect } from "react";
import { useColorScheme, View } from "react-native";

import Colors from "../constants/Colors";
import Balance from "../screens/Balance";
import FullBRCode from "../screens/FullBrCode";
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

const OrdersNavigator = ({ navigation, route }) => {
      useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route);
        if (routeName === 'BrCode'){
            navigation.setOptions({tabBarStyle: { display: 'none' }});
        }else {
            navigation.setOptions({tabBarStyle: { display: 'flex' }});
        }
    }, [navigation, route]);
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
      <TabOneStack.Screen
        name="BrCode"
        component={FullBRCode}
        options={{ headerShown: false, gestureEnabled: false, presentation: 'modal' }}
      />
    </TabOneStack.Navigator>
  );
}

const TabTwoStack = createStackNavigator();

const ProfileNavigator = () => {
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

const BalanceNavigator = () => {
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
