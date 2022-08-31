import React from 'react';
import { StyleSheet, View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const Icon = (props) => {
  return <Ionicons size={18} {...props} />;
}
const OrderCard = ({ data = null }) => {
  const navigation = useNavigation();

  const routes = data?.route;
  const renderRoute = () => {
    return (
      <>
        {routes.map((route, index) => {
          return (
            <View style={{flexDirection: 'row', paddingVertical: 4, }} key={index}>
              <Icon name="pin" color={index === 0 ? 'green' : 'red'}/>
              <Text>{route.address}</Text>
            </View>
          )
        })}
      </>
    )
  }
  const goOrder = () => {
    navigation.navigate('OrderById', data);
  }
    return (
    <TouchableOpacity style={{flex: 1}} onPress={goOrder}>
       <View style={styles.container} key={data?.id}>
          <Text style={styles.datetime}>{new Date(data.date).toLocaleDateString() + ' ' + new Date(data.date).toLocaleTimeString().slice(0, 5)}</Text>
            <View style={styles.header}>
                <Text style={styles.numOrder}>{data?.id}</Text>
                <Text style={styles.total}>{data?.total + ' €'}</Text>
            </View>
       {renderRoute()}
       </View>
     </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    borderColor: 'gray',
    paddingHorizontal: 20,
    // borderRadius: 10,
    padding: 8,
  },
  datetime: {
    fontSize: 14,
    color: 'gray',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  numOrder: {
    fontSize: 18,
    fontWeight: '400',
  },
  text: {
    fontSize: 14,
  },
  total: {
    fontSize: 18,
    fontWeight: '600',
  }
});
  
export default OrderCard;