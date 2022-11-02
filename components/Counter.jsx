import { useEffect, useState } from "react"
import { StyleSheet, Text, View, TouchableOpacity } from "react-native"
import { getDate, getTimeString } from "../store";

// Completar el pedido
const Counter = ({ actual_arrival_time, duration = 0 }) => {
    // const actual_arrival_time = 1666430586;
    const [time, setTime ] = useState(actual_arrival_time / 1000);
    // console.log('afafasf', actual_arrival_time, getTimeString(time))

    useEffect(() => {
        const timer = setInterval(() => {
            setTime((old) => old - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [actual_arrival_time]);

//   const arrivedButton = () => {
//     const borderColor = isArived ? 'black' : 'gray';
//     const backgroundColor = isArived ? 'transparent' : 'lightgray'
//     return (
//         <TouchableOpacity disabled={isArived} style={[{borderColor, backgroundColor}, styles.button]}>
//             <Text style={[styles.duration, { padding: 10 }]}>Iniciar pedido</Text>
//         </TouchableOpacity>
//     )
//   }

    return (
        <View style={styles.container}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.duration}>Duración</Text>
                <Text style={styles.duration}>{duration}</Text>
          </View>
        <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 30, fontWeight: '700', lineHeight: 44 }}>
                {getTimeString(time)}
            </Text>
        </View>

        {/* {arrivedButton()} */}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 14,
        borderWidth: 0.5,
        borderColor: 'lightgray',
        padding: 12,
    },
    duration: {
        color: 'black',
        fontSize: 16,
    },
    button: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        marginTop: 12, 
    }
})
export default Counter;