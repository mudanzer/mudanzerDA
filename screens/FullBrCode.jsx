import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getValue, ORDER_ACTIONS, statusBarHeight } from "../store";
import Icon from "../components/Icon";
import { useEffect, useState } from "react";
import BrCode from "../components/brCode";
import { sendActionForOrder } from "../store/requests";

const FullBRCode = (props) => {
    const navigation = useNavigation();
    const {order} = props?.route?.params;
    const { total, id, paid, counter_total } = order;
    const totalAmount = (total > counter_total ? total : counter_total) - paid;
    const onBack = () => navigation.goBack();
    const [smsLink, setSmsLink] = useState(`https://api.mudanzer.es/api/payment/redirect/auto/?payeeType=order&payeeId=${id}&amount=${totalAmount}`);

    useEffect(() => {
        getValue('sessionToken').then((token) => {
            if (token && token.length > 0) {
              const val = JSON.parse(token)
              sendActionForOrder(id, ORDER_ACTIONS.GET_PAYMENT_LINK, val).then((result) => {
                const link = result?.data?.url;
                setSmsLink(link);
              }).catch((er) => console.log(er));
        }
      });
    }, [])
    return (
        <View style={styles.container}>
                <TouchableOpacity onPress={onBack} style={styles.header}>
                    <Icon name={'ios-arrow-back'} size={26}/>
                    <View style={{justifyContent: 'center', paddingHorizontal: 12 }}>
                        <Text style={[styles.defaultText, {fontSize: 18 }]}>Atrás</Text>
                    </View>
                </TouchableOpacity>

             <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-around' }}>
                <BrCode order={order} smsLink={smsLink} />
                <View style={styles.content}>
                        <Text style={[styles.defaultText, { paddingVertical: 8 }]}>{`Número de pedido: ${id}`}</Text>
                        <Text style={[styles.defaultText, { paddingVertical: 8 }]}>{`Valor del pedido: ${total} €`}</Text>
                        {!!paid && (<Text style={[styles.defaultText, { paddingVertical: 8 }]}>{`Pagado: ${paid} €`}</Text>)}
                        <Text style={[styles.defaultText, {fontWeight: '700', paddingVertical: 14}]}>{`Pagar: ${totalAmount} €`}</Text>
                </View>
             </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 14,
        flexDirection: 'row',
    },
    content: {
        paddingHorizontal: 14,
        alignItems: 'center'
    },
    defaultText: {
        color: 'black',
        fontSize: 22,
    }
})
export default FullBRCode;