import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View , ScrollView, Linking, Platform, Alert, RefreshControl} from "react-native"
import { getPaymentMethodName, getValue } from "../store";
import { getOrderByIdRequest } from "../store/requests";

function Icon(props) {
    return <Ionicons size={32} style={{ marginBottom: -3 }} {...props} />;
  }
  
const Order = (props) => {
    const navigation = useNavigation();
    const [refressing, setRefreshing] = useState(false);
    const id = props?.route?.params?.id;
    const [order, setOrder] = useState();
    const getOrderById = () => {
        getValue('sessionToken').then((token) => {
            if (token.length > 0) {
              let params = {
                  headers: {
                    "X-Session-Token": token,
                }
              };
              getOrderByIdRequest(params, id).then((response) => {
            if (response && response.data) {
                  setOrder(response?.data);
                //   Alert.alert('getOrderByIdRequest', JSON.stringify(response))
                  setRefreshing(false)
                }
          }).catch((errors) => console.log('errors', JSON.stringify(errors)))
        }
      });
    }
    useEffect(() => {
        getOrderById();
        // getOrderByIdRequest(data?.id).then((response) => setOrder(response.data));
    }, [])
    const openMap = (coord) => {
        const url = 'https://www.google.com/maps/@' + coord.lat + ',' + coord.lng + ',14z';
        // console.log('coor', coord, url);
        Linking.openURL(url);
    }
    const renderRoute = () => {
        return (
          <View style={{paddingVertical: 8}}>
            <Text style={{paddingHorizontal: 14, fontSize: 16, color: 'black'}}>{'route'}</Text>
            {order?.route.map((route, index) => {
              return (
                <TouchableOpacity onPress={() => openMap(route)} style={{flexDirection: 'row', padding: 14, }} key={index}>
                  <Icon name="pin" color={index === 0 ? 'green' : 'red'}/>
                  <View style={{justifyContent: 'center'}}>
                      <Text>{route.address}</Text>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        )
      }

    return (
        <ScrollView style={styles.container}
        refreshControl={
          <RefreshControl size={'large'} color={'black'} onRefresh={getOrderById} refreshing={refressing}/>}
        >
            <TouchableOpacity onPress={() => navigation.goBack()} style={{flexDirection: 'row', paddingHorizontal: 12}}>
                <Icon name={'ios-arrow-back'}/>
                    <View style={{justifyContent: 'center', paddingLeft: 14}}>
                        <Text style={styles.datetime}>{new Date(order?.date).toLocaleDateString() + ' ' + new Date(order?.date).toLocaleTimeString().slice(0, 5)}</Text>
                        <Text style={{fontSize: 16}}>{order?.id}</Text>
                    </View>
            </TouchableOpacity>
            <View style={{flexDirection: 'column', justifyContent: 'space-evenly', marginVertical: 8}}>
                <View style={{borderWidth: 0.5, borderColor: 'lightgray', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{padding: 12, color: 'black'}}>Cargadores</Text>
                    <Text style={{padding: 12, color: 'black'}}>{order?.cargo_count}</Text>
                </View>
                <View style={{borderWidth: 0.5, borderColor: 'lightgray', flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{padding: 12, color: 'black'}}>Pasajeros</Text>
                    <Text style={{padding: 12, color: 'black'}}>{order?.passengers_count}</Text>
                </View>
            </View>
            <View style={{borderWidth: 0.5, borderColor: 'lightgray', flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{padding: 12, color: 'black', fontSize: 18,}}>Costo</Text>
                    <Text style={{padding: 12, color: 'black', fontSize: 18,}}>{order?.total + ' €'}</Text>
                </View>
            <View style={{padding: 14}}>
                  <Text style={{fontSize: 16, color: 'gray'}}>{'Método de pago'}</Text>
                  <Text style={{fontSize: 16, color: 'black'}}>{getPaymentMethodName(order?.payment_method)}</Text>
              </View>
            <View style={{borderWidth: 0.5, borderColor: 'lightgray', flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{padding: 12, color: 'black', fontSize: 18,}}>Duración</Text>
                    <Text style={{padding: 12, color: 'black', fontSize: 18,}}>{order?.duration}</Text>
                </View>
                {renderRoute()}
                <View  style={{borderWidth: 0.5, borderColor: 'lightgray', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, paddingRight: 50}}>
                    <View>
                        <Text style={{paddingHorizontal: 12, color: 'gray', fontSize: 18,}}>Cliente</Text>
                        <Text style={{paddingHorizontal: 12, color: 'black', fontSize: 18,}}>{order?.client_name}</Text>
                    </View>
                    <TouchableOpacity onPress={() => {
                        if (Platform.OS === 'android') {
                            Linking.openURL(`tel:${order?.client_phone_number}`);
                        } else {
                            Linking.openURL(`telprompt:${order?.client_phone_number}`);
                        }
                    }} style={{justifyContent: "center", paddingHorizontal: 12}}>
                        <Icon name='call' color={'gray'} size={26}/>
                     </TouchableOpacity>
             </View>
             <View style={{padding: 14}}>
                <Text style={{fontSize: 16, color: 'gray'}}>{'Nota'}</Text>
                <Text style={{fontSize: 16, color: 'black'}}>{order?.notes}</Text>
             </View>
            <View style={{marginBottom: 60}} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginVertical: 20,
      paddingTop: 60,
      backgroundColor: '#fff',
    },
    datetime: {
      fontSize: 14,
      color:'gray',
    },
  });
  
export default Order;