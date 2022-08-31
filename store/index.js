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
export {save, getValue}