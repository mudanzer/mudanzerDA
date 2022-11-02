import * as React from 'react';
import * as SecureStore from 'expo-secure-store';

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

export {save, getValue, getTimeString, getDate}