import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, LayoutAnimation, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

import OrderCard from "../components/orderCard";
import { getValue } from "../store";
import { getOrdersRequest } from "../store/requests";

export default function Orders() {
  const [activeTab, setActiveTab] = useState(1);
  const [orders, setOrders] = useState([]);
  const [refressing, setRefreshing] = useState(false);

  const getOrders = () => {
    LayoutAnimation.configureNext({
      create: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
        duration: 500,
      }
    });
        getValue('sessionToken').then((token) => {
          if (token && token.length > 0) {
            let params = {
                headers: {
                  "X-Session-Token": token,
              }
            };
        setRefreshing(true)
        getOrdersRequest(params).then((response) => {
          if (response && response.data) {
                setOrders(response.data.orders);
                setRefreshing(false)
              }
        }).catch(() => setRefreshing(false))
      } else { setRefreshing(false) }
    });
  }
  useEffect(() => {
    getOrders();
  }, [])

  const onPressTab = (num) => {
    LayoutAnimation.configureNext({
      create: {
        type: LayoutAnimation.Types.spring,
        property: LayoutAnimation.Properties.opacity,
        duration: 2000,
        springDamping: 0.5,
      }
    });
    setActiveTab(num)
  }

  const renderTabs = () => {
    return (
    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
      <TouchableOpacity onPress={() => onPressTab(1)} style={{borderBottomWidth: activeTab === 1 ? 1 : 0, borderBottomColor: 'gray', minWidth: '40%'}}>
        <Text style={{textAlign: 'center', padding: 4,}}>{'new'}</Text>
     </TouchableOpacity>
      <TouchableOpacity onPress={() => onPressTab(2)} style={{borderBottomWidth: activeTab === 2 ? 1 : 0, borderBottomColor: 'gray', minWidth: '40%'}}>
        <Text style={{textAlign: 'center', padding: 4,}}>{'old'}</Text>
     </TouchableOpacity>
    </View>
    )
  }
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl size={'large'} color={'black'} onRefresh={getOrders} refreshing={refressing}/>}
        >
          {!orders.length && (
               <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginVertical: 40,}}>
               <Text style={{color: 'black', fontSize: 20}}>No hay pedidos</Text>
             </View>
          )}
        {orders?.map((item, index) => {
          return (<OrderCard key={index} data={item}/>)
        })}
        <View style={{marginBottom: 100}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
});
