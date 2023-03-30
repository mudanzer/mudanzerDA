import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View , ScrollView, Linking, Platform, Alert, RefreshControl, ActivityIndicator} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
import { getPaymentMethodName, getValue, ORDER_ACTIONS, PAYMENT_METHODS } from "../store";
import { getOrderByIdRequest, sendActionForOrder } from "../store/requests";
import Clipboard from '@react-native-clipboard/clipboard';
import { getDate, getTimeString } from '../store/index';
import Counter from "../components/Counter";
import BrCode from "../components/brCode";

// 90433607 1096

const title_start_order = 'Iniciar pedido';
const title_end_order = 'Completar el pedido';

function Icon(props) {
    return <Ionicons size={32} style={{ marginBottom: -3 }} {...props} />;
  }

const Order = (props) => {
    const navigation = useNavigation();
    const [refressing, setRefreshing] = useState(false);
    const [fullLoading, setFullLoading] = useState(false);
    const id = props?.route?.params?.id;
    const [order, setOrder] = useState();
    const counter_total = order?.counter_total ?? 0;
    const payMethod = order?.payment_method ?? PAYMENT_METHODS.CARD;

    const start_date = new Date(order?.date_start).getTime() / 1000 ?? 0;
    const [time, setTime] = useState(0);
    
    const isVisibleTime = order?.date_start !== null;

    useEffect(() => {
      if (order?.date_start !== null) {
        const timer = setInterval(() => {
          setTime((old) => old - 1);
      }, 1000);

      return () => clearInterval(timer);
      }
  }, [time, order?.date_start]);


    const currentAction = order?.actions[0] ?? [];
    const [textInButton, setTextInButton] = useState(title_start_order);
    const isVisibleButton = order?.actions?.length > 0 && order?.status_id === 'NEW' && (order?.actions?.includes(ORDER_ACTIONS.START_ORDER) || order?.actions?.includes(ORDER_ACTIONS.END_ORDER));
    const isVisibleQrBtn = payMethod && order?.actions?.includes(ORDER_ACTIONS.GET_PAYMENT_LINK);
    const isVisibleSmsBtn = payMethod && order?.actions?.includes(ORDER_ACTIONS.SEND_PAYMENT_SMS);
    const isVisiblePayBtns = payMethod && (order?.actions?.includes(ORDER_ACTIONS.GET_PAYMENT_LINK) || order?.actions?.includes(ORDER_ACTIONS.SEND_PAYMENT_SMS))

    useEffect(() => {
      if (currentAction === ORDER_ACTIONS.START_ORDER) {
        setTextInButton(title_start_order);
      }
      if (currentAction === ORDER_ACTIONS.END_ORDER) {
        setTextInButton(title_end_order);
      }
    }, [currentAction])

    const onPressAction = () => {
      if (currentAction === ORDER_ACTIONS.START_ORDER) {
        getValue('sessionToken').then((token) => {
              if (token && token.length > 0) {
                const val = JSON.parse(token)
                sendActionForOrder(id, ORDER_ACTIONS.START_ORDER, val).then().catch((er) => console.log(er));
          }
        });
      } else {
        getValue('sessionToken').then((token) => {
              if (token && token.length > 0) {
                const val = JSON.parse(token)
                sendActionForOrder(id, ORDER_ACTIONS.END_ORDER, val).then((response) => {
                  if (response && response?.status === 204) {
                    Alert.alert('' ,'La solicitud para cerrar el pedido ha sido enviada. Un operador se pondrá en contacto contigo.')
                  }
                }).catch((er) => console.log(er));
          }
        });
      }
      getOrderById();
    }

    const onPressGetSmsLink = (type = 'sms') => {
      switch (type) {
        case 'sms':
          return getValue('sessionToken').then((token) => {
            if (token && token.length > 0) {
                const val = JSON.parse(token)
                  sendActionForOrder(id, ORDER_ACTIONS.SEND_PAYMENT_SMS, val).then((result) => {
                      // console.log('result sms payment', result);
                      if (result && result?.status === 204){
                        Alert.alert('SMS enviado', '', [
                          {
                            text: "Bueno",
                            onPress: null,
                          }
                        ])
                      getOrderById();
                    }
                  }).catch((er) => console.log(er));
            }
          })
          case 'qr':
            return navigation.navigate('BrCode', {order: order})
        default:
          break;
      }
      getOrderById();
    }
    const getOrderById = () => {
        getValue('sessionToken').then((token) => {
            if (token.length > 0) {
              let params = {
                  headers: {
                    "X-Session-Token": JSON.parse(token),
                }
              };
              setFullLoading(true);
              getOrderByIdRequest(params, id).then((response) => {
            if (response && response.data) {
              // console.log(response.data)
                  setOrder(response.data);
                  setRefreshing(false)
                  setFullLoading(false);
              }
          }).catch((errors) => console.log('errors', JSON.stringify(errors)))
        }
      });
    }
    useEffect(() => {
        getOrderById();
    }, [])
    const copyAddress = (coord) => {
     const url = 'https://www.google.com/maps/place/' + coord.lat + ',' + coord.lng + '/@' + coord.lat + ',' + coord.lng + ',14z'
      Alert.alert('', coord?.address, 
        [
          {
            text: "Copiar dirección",
            onPress: () => Clipboard.setString(coord?.address),
          },
          { text: "Abrir en mapas",
            onPress: () => Linking.openURL(url)
          }
        ])
    }
    const renderRoute = () => {
        return (
          <View style={{paddingVertical: 8}}>
            <Text style={{paddingHorizontal: 14, fontSize: 16, color: 'black'}}>{'route'}</Text>
            {order?.route.map((route, index) => {
              return (
                <TouchableOpacity onPress={() => copyAddress(route)} style={{flexDirection: 'row', padding: 14, }} key={index}>
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

    const renderAlert = () => {
      return (
        <View style={{ position: 'absolute',zIndex: 1, bottom: 100, left: 0, right: 0, backgroundColor: 'rgba(234, 1, 1, 0.8)'}}>
          <Text style={{ color: 'white', fontSize: 20, padding: 14 }}>{'Si ha llegado al punto de carga/descarga, actualice el pedido tirando hacia abajo'}</Text>
        </View>
      )
    }

    const payQRBtn = () => {
        return (
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            {isVisibleSmsBtn && (
            <TouchableOpacity style={styles.payBtn} onPress={() => onPressGetSmsLink('sms')}>
              <Text style={{paddingHorizontal: 8, color: 'black', fontSize: 14 }}>Enviar enlace de pago</Text>
              <Icon name={'chatbubble-ellipses'} size={17}/>
            </TouchableOpacity>
          )}
          {isVisibleQrBtn && (
            <TouchableOpacity style={styles.payBtn} onPress={() => onPressGetSmsLink('qr')}>
              <Text style={{paddingHorizontal: 8, color: 'black', fontSize: 14 }}>Pagar con QR</Text>
              <Icon name={'qr-code'} size={16}/>
            </TouchableOpacity>
          )}
          </View>
        )
    }

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', marginBottom: -40, zIndex: 1 }}>
        {fullLoading && (
           <View style={{position: 'absolute', top: '50%', left: '50%', zIndex: 2, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size={'large'} color={'black'} />
          </View>
        )}
        {!order?.actions.length && order?.status_id === 'NEW' && renderAlert()}
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
                    <Text style={{padding: 12, color: 'black', fontSize: 18,}}>{(order?.total > counter_total ? order?.total : counter_total) + ' €'}</Text>
                </View>
                {order?.paid > 0 && (
                  <View style={{borderWidth: 0.5, borderColor: 'lightgray', flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text style={{padding: 12, color: 'green', fontSize: 16 }}>Pagado</Text>
                      <Text style={{padding: 12, color: 'green', fontSize: 16 }}>{order?.paid + ' €'}</Text>
                  </View>
                )}
                {isVisiblePayBtns && payQRBtn()}
            <View style={{padding: 14}}>
                  <Text style={{fontSize: 16, color: 'gray'}}>{'Método de pago'}</Text>
                  <Text style={{fontSize: 16, color: 'black'}}>{getPaymentMethodName(order?.payment_method)}</Text>
              </View>
              {isVisibleTime && (
              <View style={{ alignItems: 'center', borderTopWidth: 0.5, borderBottomWidth: 0.5, paddingVertical: 14, marginVertical: 10 }}>
                  <Text style={{ fontSize: 30, fontWeight: '700', lineHeight: 44 }}>
                      {getTimeString((getDate().getTime() / 1000) - start_date)}
                  </Text>
              </View>
              )}
              {isVisibleButton && (
                  <TouchableOpacity onPress={onPressAction} style={styles.arrivedBtn}>
                      <Text>{textInButton}</Text>
                  </TouchableOpacity>
              )}
              {order?.route?.length > 0 && renderRoute()}
                <View  style={{borderWidth: 0.5, borderColor: 'lightgray', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8}}>
                    <View>
                        <Text style={{paddingHorizontal: 12, color: 'gray', fontSize: 18}}>Cliente</Text>
                        <Text style={{paddingHorizontal: 12, color: 'black', fontSize: 18}}>{order?.client_name}</Text>
                    </View>
                    <TouchableOpacity onPress={() => {
                        if (Platform.OS === 'android') {
                            Linking.openURL(`tel:${order?.client_phone_number}`);
                        } else {
                            Linking.openURL(`telprompt:${order?.client_phone_number}`);
                        }
                    }} style={{justifyContent: 'center', paddingHorizontal: 12}}>
                        <Icon name='call' color={'gray'} size={26}/>
                     </TouchableOpacity>
             </View>

              {order?.notes !== null && (
                  <View style={{padding: 14}}>
                  <Text style={{fontSize: 16, color: 'gray'}}>{'Nota'}</Text>
                  <Text style={{fontSize: 16, color: 'black'}}>{order?.notes}</Text>
               </View>
             )}

              {/* {payMethod === PAYMENT_METHODS.CARD && (
                <BrCode order={order} smsLink={smsLink} />
              )} */}

            {/* <View style={{marginBottom: 60}} />/ */}
        </ScrollView>
      </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginVertical: 10,
      backgroundColor: '#fff',
    },
    datetime: {
      fontSize: 14,
      color:'gray',
    },
    arrivedBtn: {
      marginHorizontal: 20,
      marginVertical: 10,
      borderWidth: 0.5,
      borderRadius: 10,
      padding: 14,
      alignItems: 'center'
    },
    payBtn: {
      margin: 14,
      borderWidth: 0.5,
      borderRadius: 10,
      padding: 8,
      flexDirection: 'row',
      justifyContent: 'center',
    },
  });
  
export default Order;