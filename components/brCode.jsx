import React from "react";
import { TouchableOpacity, View } from "react-native";
import QRCode from 'react-native-qrcode-svg';


const BrCode = () => {

    return (
        <TouchableOpacity style={{flex: 1, backgroundColor: '#fff', alignItems: 'center'}}>
        <QRCode
          size={50}
          logo={require('../assets/images/app-icon.png')}
        //   logoSize={60}
          logoBorderRadius={15}
          value = 'https://github.com/awesomejerry/react-native-qrcode-svg'
        />
        </TouchableOpacity>
    )
}

export default BrCode;