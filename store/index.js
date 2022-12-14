import * as React from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform, StatusBar, NativeModules } from 'react-native';
import {LocaleConfig} from 'react-native-calendars';

const { StatusBarManager } = NativeModules;

async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
  }
  
async function getValue(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      console.log("Here's your value " + result);
      return result;
    } else {
       console.log('No values stored under that key.', result);
       return result;
    }
}
export const getPaymentMethodName = (method) => {
  switch (method) {
    case 'card':
        return 'Pago en línea'

        case 'cash':
          return 'En efectivo'
        
          case 'bank':
            return 'Transferencia bancaria'
      
            case 'terminal':
              return 'Datáfono'
    
    default:
      return '-'
  }
}

function getTimeString(sec) {

  // console.log(sec)
  // console.log(Math.floor(getDate().getDate()/1000 - sec))

  if (!sec || sec < 0)
      sec = 0;

  sec = Math.floor(sec)

  let hours = Math.floor(sec / (60 * 60));
  let minutes = Math.floor(sec / 60) % 60;
  let seconds = Math.floor(sec % 60);

  hours = (hours.toString().length === 1 ? '0' + hours : hours);
  minutes = (minutes.toString().length === 1 ? '0' + minutes : minutes);
  seconds = (seconds.toString().length === 1 ? '0' + seconds : seconds);

  return hours + ':' + minutes + ':' + seconds;
}
let getDate = () => {
  return new Date();
}

export const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : StatusBarManager.HEIGHT;

export const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
LocaleConfig.locales['es'] = {
  monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
  monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
  dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
  dayNamesShort: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
  today: "hoy día"
};
LocaleConfig.defaultLocale = 'es';
export {save, getValue, getTimeString, getDate}