import { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

import { View, StyleSheet, TouchableOpacity, Text, TextInput, KeyboardAvoidingView, Keyboard, Platform, Alert, Linking } from "react-native";
import * as app from '../app.json';
import { getValue, save } from "../store";
import { authorizationRequest } from "../store/requests";
import axios from "axios";
function Icon(props) {
  return <Ionicons size={32} style={{ marginBottom: -3 }} {...props} />;
}
export default function Authorization({ navigation }) {
    const [number, setNumber] = useState('');
    const [password, setCode] = useState('');
    const [isValid, setIsValid] = useState(true);
      
  const [isAutorized, setIsAutorized] = useState(false);

  useEffect(() => {
    getValue('isAutorized').then((result) => {
      if (result) {
         setIsAutorized(result);
          if (result === 'true') {
            navigation.navigate('Root')
          }
      }
    });
  }, [isAutorized])
    const version = app.expo.version;

    const onPressAuth = () => {
        if (!number.length || !password.length) {
          setIsValid(false);
        }
        Keyboard.dismiss();
        // console.log('token', token)
        authorizationRequest({phoneNumber: number, password}).then((response) => {
          // if (response && (response.code === 422 || response.code === '422')) {
          //     setIsValid(false);
          //     setTimeout(() => {
          //       setIsValid(true);
          //   }, 2000);
          // }
          if (response && response.data) {
            save('sessionToken', response.data?.data?.sessionToken);
            save('isAutorized', 'true');
            axios.defaults.headers.common['Authorization'] = `X-Session-Token: ${response.data?.data?.sessionToken}`;
            navigation.navigate('Root');
          } else {
              setIsValid(false);
              setTimeout(() => {
                setIsValid(true);
            }, 2000);
          }
        })
        .catch((er) => console.log('er', JSON.stringify(er)));
    }
  return (
    <View style={{flex: 1, paddingBottom: 40}}>
    <View style={styles.container}>
        <Text style={styles.title}>MUDANZER</Text>
        <Text style={styles.version}>{`v${version.slice(0, 3)}`}</Text>
    </View>
    <KeyboardAvoidingView style={{backgroundColor: "#fff"}} keyboardVerticalOffset={16} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <View style={{ justifyContent: "flex-end", marginHorizontal: 10, paddingVertical: 10,}}>
        <TextInput placeholderTextColor={'#CCC'} keyboardType='phone-pad' value={number} onTouchStart={() => setNumber('+34')} placeholder={'+34 '} onChangeText={setNumber} style={styles.input} onFocus={() => setIsValid(true)}/>
        <TextInput placeholderTextColor={'#CCC'} maxLength={4} value={password} keyboardType='numeric' placeholder={'1234'} onChangeText={setCode} style={styles.input} onFocus={() => setIsValid(true)}/>
        {!isValid && (
          <Text style={{color: 'red', textAlign: 'center'}}>{'Introduzca el número o la contraseña correctos'}</Text>
        )}
    </View>
    <TouchableOpacity onPress={onPressAuth} style={{ borderRadius: 10,
        alignItems: 'center', marginHorizontal: 10, backgroundColor: '#f3c10f', padding: 12}}>
        <Text>{'Entrada'}</Text>
    </TouchableOpacity>
   </KeyboardAvoidingView>
   </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    // justifyContent: "flex-start",
    padding: 20,
    paddingVertical: 60,
  },
 input: {
    borderWidth: 0.5,
    borderColor:'#000',
    padding: 12,
    borderRadius: 10,
    marginVertical: 4,
 },
  title: {
    fontSize: 28,
    fontWeight: '800',
    padding: 40,
  },
  version: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: -40,
  }
});
