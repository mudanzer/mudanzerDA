import React from "react";
import { View, StyleSheet } from "react-native";
import QRCode from 'react-native-qrcode-svg';


const BrCode = ({ order = {}, smsLink = '' }) => {
  const linkToPay = smsLink;
    return (
      <View style={styles.container}>
          <QRCode
            size={300}
            logo={require('../assets/images/app-icon.png')}
            logoSize={100}
            logoBorderRadius={30}
            value = {linkToPay}
          />
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
})

export default BrCode;