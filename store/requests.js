import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Alert } from 'react-native';
import { navigateTo, save } from './index';
// const api = 'http://10.11.1.21:8000/api/drivers/';
const api = 'https://operador.mudanzer.es/api/drivers/';

const AUTH = api + 'auth/login';
const LOG_OUT = api + 'auth/logout';
const PROFILE = api + 'profile';
const ORDERS = api + 'orders';
const BALANCE = api + 'funds_flow';
const ORDER_ID = api + 'orders';
const SEND_ACTION = ORDERS;

const post = async (url, params, token) => {
   const data = JSON.stringify(params);
   return axios.post(url, data, {
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Session-Token': token ?? '',
        },
   }).then((result) => {
    return result;
    }).catch((er) => {
        console.log('er', er);
        if (er?.code === 'ERR_NETWORK') {
            return Alert.alert('Sin conexión a Internet','', [
                {
                    text: 'Es comprensible'
                }
            ])
        }
        return er;
    })
};

const get = async (url, config) => {
    return axios.get(url, config,{
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    }).then((result) => {
        // console.log('result', result);
         return result;
     }).catch((er) => {
        // console.log('get er', er?.response?.status);
        if (er?.response?.status === 401) {
            save('isAutorized', 'false').then();
            save('sessionToken', '').then();
        }
        if (er?.code === 'ERR_NETWORK') {
            return Alert.alert('Sin conexión a Internet','', [
                {
                    text: 'Es comprensible'
                }
            ])
        } 
            return er;
     });
 }
 
export const authorizationRequest = async (params) => {
    const data = post(AUTH, params).then((response) => response);
    return data;
}
 
export const logoutRequest = (params) => {
    const data = axios.delete(LOG_OUT, params).then((response) => response);
    return data;
}
export const getOrdersRequest = (params) => {
    const data = get(ORDERS, params).then((response) => response.data);
    return data;
}
export const getOrderByIdRequest = (params, id) => {
    const data = get(`${ORDER_ID}/${id}`, params).then((response) => response.data);
    return data;
}
export const getProfileRequest = (params) => {
    const data = get(PROFILE, params).then((response) => response.data);
    return data;
}

export const sendActionForOrder = (id, action, token) => {
    const data = post(`${SEND_ACTION}/${id}/action/${action}`, null, token).then((response) => response);
    return data;
}

export const getBalanceRequest = (params) => {
    const data = get(BALANCE, params).then((response) => response.data);
    return data;
}
export const getBalanceInPeriod = (params, token) => {
    const data = post(BALANCE, params, token).then((response) => response.data);
    return data;
}