import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, LayoutAnimation, Easing, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
// import { FlatList } from 'react-native-gesture-handler';
import Icon from '../components/Icon';
import Scroll from '../components/Scroll';
import { getValue, statusBarHeight } from '../store';
import { getBalanceInPeriod, getBalanceRequest } from '../store/requests';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);

const CALENDAR_HEIGHT = {
  MIN_HEIGHT: 0,
  MAX_HEIGHT: 350,
};
const setupStart = {
  selected: true,
  startingDay: true,
  color: 'black',
  textColor: 'white',
};
const setupBetween = {
  color: 'black',
  textColor: 'white',
};
const setupEnd = {
  selected: true,
  endingDay: true,
  color: 'black',
  textColor: 'white',
};

const INITIAL_DATE = new Date();
const Balance = () => {
    const [balanceData, setBalanceData] = useState(null);
    const [balanceHistory, setBalanceHistory] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [initialHeight, setInitialHeight] = useState(0);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    // const [date_from, setDateFrom] = useState('');
    // const [date_to, setDateTo] = useState();
    const animatedHeight = new Animated.Value(0);
    const opacity = useRef(new Animated.Value(0)).current;
    const maxHeight = animatedHeight.interpolate({
      inputRange: [0, 1],
      outputRange: [initialHeight, CALENDAR_HEIGHT.MAX_HEIGHT],
    });
    useEffect(() => {
        setInitialHeight(CALENDAR_HEIGHT.MIN_HEIGHT);
        getBalance();
      }, []);

    const onPressCalendar = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        if (initialHeight === CALENDAR_HEIGHT.MIN_HEIGHT) {
          Animated.timing(animatedHeight, {
            toValue: 1,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: false,
          }).start(() => {
            Animated.timing(opacity, {
              toValue: 1,
              duration: 500,
              easing: Easing.linear,
              useNativeDriver: false,
            }).start();
          })
          setInitialHeight(CALENDAR_HEIGHT.MAX_HEIGHT);
        } else {
          Animated.timing(animatedHeight, {
            toValue: 0,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: false,
          }).start(() => {
            Animated.timing(opacity, {
              toValue: 0,
              duration: 500,
              easing: Easing.linear,
              useNativeDriver: false,
            }).start();
          })
          setInitialHeight(CALENDAR_HEIGHT.MIN_HEIGHT);
          setEndDate(null);
          setStartDate(null);
        }
    };
    
    const getBalance = () => {
        getValue('sessionToken').then((token) => {
            if (token && token.length > 0) {
              let params = {
                  headers: {
                    "X-Session-Token": token,
                }
              };
            setRefreshing(true)
            getBalanceRequest(params).then((response) => {
            if (response) {
                  setBalanceData(response);
                  setBalanceHistory(response?.driver_funds_flows);
                  setRefreshing(false)
              }
          }).catch((errors) => console.log('errors', JSON.stringify(errors)))
        } else {setRefreshing(false)}
      });
    };
    const renderItem = ({ item }) => (
      <View key={item.id} style={styles.itemContainer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 4}}>
          <Text style={{ color: 'gray' }}>{new Date(item?.created_at).toLocaleDateString() + ' ' + new Date(item?.created_at).toLocaleTimeString()}</Text>
          <Text style={{ color: item?.amount < 0 ? 'red' : 'green', fontWeight: '600', fontSize: 18 }}>{item?.amount + ' €'}</Text>
        </View>
        <View style={{ alignSelf: 'flex-end' }}>
          <Text style={{ color: 'gray', fontSize: 14}}>{item?.operation_balance + ' €'}</Text>
        </View>
        <Text style={styles.itemDesc}>{item?.cause_description}</Text>
        <Text style={{ paddingVertical: 6 }}>{item?.operation_type_description}</Text>
        {typeof(item?.order_id) === 'number' && (
          <Text style={{ paddingVertical: 6 }}>{'Número de pedido: ' + item.order_id}</Text>
        )}
      </View>
    )
    const renderBalanceHistory = () => {
      return (
        <FlatList
          data={balanceHistory}
          renderItem={renderItem}
          keyExtractor={(item, index) => index}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => {
            return (
              <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1}}>
                <Text style={{ fontWeight: '600', color: 'black', fontSize: 16, paddingVertical: 30 }}>Sin información</Text>
                <TouchableOpacity onPress={() => {
                  getBalance();
                  onPressCalendar()
                }}>
                  <Text style={{ color: 'blue' }}>Mostrar información de todo el período</Text>
                </TouchableOpacity>
              </View>
            )
          }}
        />
      )
    }
    const renderCustomHeader = (date) => {
      const header = date.toString('MMMM yyyy');
      const [month] = header.split(' ');
      return (
          <Text style={styles.month}>{month}</Text>
      );
    }

    const setDate = useMemo(() => {
      if (!endDate) {
        return {
          [startDate]: {
            color: 'black',
            textColor: 'white',
          },
        };
      }
      const range = moment().range(startDate, endDate);
      const days = Array.from(range.by('days'));
      const dayEntries = days.map((d, index) => {
        const date = d.format('YYYY-MM-DD');
        if (index === 0) {
          return [[date], setupStart];
        }
        if (index + 1 < days.length) {
          return [[date], setupBetween];
        }
        return [[date], setupEnd];
      });
      const date_from = days[0];
      const date_to = days[days.length - 1];
      getValue('sessionToken').then((token) => {
        if (token && token.length > 0) {
          let params = {
            date_from: date_from.format('YYYY-MM-DD HH:MM'),
            date_to: date_to.format('YYYY-MM-DD HH:MM')
          };
        setRefreshing(true)
        getBalanceInPeriod(params, token).then((response) => {
            if (response) {
                  setBalanceHistory(response.driver_funds_flows);
                  setRefreshing(false)
            }
          }).catch((errors) => {
            setRefreshing(false)
          })
        } else {setRefreshing(false)}
      });
      return Object.fromEntries(dayEntries);
    }, [startDate, endDate]);

    const onSelectDay = useCallback((day) => {
      if (day.dateString === startDate || day.dateString === endDate) {
        setStartDate(day.dateString);
        setEndDate(null);
        return;
      }
      if (moment(day.dateString).isAfter(startDate)) {
        setEndDate(day.dateString);
      } else {
        if (!endDate) {
          setEndDate(startDate);
          setStartDate(day.dateString);
          return;
        }
        setStartDate(day.dateString);
      }
    }, [startDate, endDate]);

    return (
        <View style={styles.container}>
            <Scroll onRefresh={getBalance} refreshing={refreshing}>
                <TouchableOpacity style={styles.periodContainer} onPress={onPressCalendar}>
                  <Text style={styles.text}>Todo el período</Text>
                  <Icon name={'calendar-outline'}/>
                </TouchableOpacity>
                <Animated.View style={{ maxHeight, opacity, borderBottomWidth: 0.5 }}>
                <Calendar
                    style={{
                      width: Dimensions.get('screen').width,
                    }}
                    theme={{
                      todayTextColor: '#000',
                      todayBackgroundColor: '#929292',
                      arrowColor: '#000',
                    }}
                    initialDate={moment().format('YYYY-MM-DD')}
                    maxDate={moment().format('YYYY-MM-DD')}
                    onDayPress={onSelectDay}
                    monthFormat={'yyyy MM'}
                    hideArrows={false}
                    firstDay={1}
                    hideDayNames={true}
                    renderHeader={(date) => renderCustomHeader(date)}
                    enableSwipeMonths={false}
                    markedDates={setDate}
                    markingType="period"
                  />
                </Animated.View>
                <View style={[styles.totalBalanceContainer, {
                        borderBottomColor: 'gray',
                        borderBottomWidth: balanceHistory.length > 0 ? 0 : 0.5,
                    }]}>
                    <Text style={styles.totalBalance}>{`Saldo ${balanceData?.current_balance ?? 0} €`}</Text>
                    <Text style={styles.deposit}>{`Compromiso actual ${balanceData?.pledge ?? 0} €`}</Text>
                </View>
                {renderBalanceHistory()}
            </Scroll>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: statusBarHeight,
      backgroundColor: "#fff",
    },
    periodContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 14,
        paddingVertical: 14,
        borderBottomWidth: 0.5,
        borderColor: 'gray'
    },
    text: {
        fontSize: 16,
        color: 'black',
    },
    totalBalanceContainer: {
      alignItems: 'center',
      paddingVertical: 14,
    },
    totalBalance: {
      fontWeight: 'bold',
      fontSize: 18,
      paddingVertical: 4,
    },
    deposit: {
      color: 'black',
      fontSize: 16,
    },
    itemContainer: {
      marginHorizontal: 12,
      marginVertical: 6,
      borderWidth: 0.5,
      borderColor: 'lightgray',
      padding: 6,
      paddingHorizontal: 10,
    },
    itemDesc: {
      fontSize: 16,
      color: 'black',
      fontWeight: '600',
    },
    month: {
      fontSize: 18,
      fontWeight: 'bold',
      paddingVertical: 12,
      color: 'black',
    }
  });
  
export default Balance;
