import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { StyleSheet, LayoutAnimation, TouchableOpacity, Text, View, Alert, ScrollView, RefreshControl } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getValue, save, statusBarHeight } from "../store";
import { getProfileRequest, logoutRequest } from "../store/requests";
import Scroll from "../components/Scroll";

function Icon(props) {
    return <Ionicons size={32} style={{ marginBottom: -3 }} {...props} />;
  }
  
export default function ProfileScreen() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const getUserData = () => {
        setRefreshing(true)
        getValue('sessionToken').then((token) => {
          if (token && token.length > 0) {
            let params = {
                headers: {
                  "X-Session-Token": token,
              }
            };
            getProfileRequest(params).then((response) => {
          if (response && response.data) {
                setUserData(response?.data);
                setRefreshing(false)
            } 
            if (!response) {
              navigation.navigate('Authorization');
            }
        }).catch((errors) => console.log('errors', JSON.stringify(errors)))
      } else {setRefreshing(false)}
    }).catch(() => logout())
  }
  const onPressLogoutBtn = () => {
    Alert.alert('¿Quieres salir de la aplicación?', '', [
      {
        text: "Sí",
        onPress: () => logout(),
      },
      {
        text: 'No hay',
      }
    ])
  }
  const logout = () => {
    getValue('isAutorized').then((result) => {
      if (result === 'true') {
        LayoutAnimation.configureNext({
          create: {
            type: LayoutAnimation.Types.spring,
            property: LayoutAnimation.Properties.opacity,
            duration: 2000,
            springDamping: 0.5,
          }
        });
        getValue('sessionToken').then((token) => {
                if (token.length > 0) {
                  let params = {
                      headers: {
                        "X-Session-Token": token,
                    }
                  };
                  logoutRequest(params).then(() => {
                    save('isAutorized', 'false');
                    save('sessionToken', '');
                    navigation.navigate('Authorization');
              });
            }
        });
        console.log('result', result)
      } else {
        navigation.navigate('Authorization');
      }
    }).catch(() => navigation.navigate('Authorization'))
  }
  useEffect(() => {
    getUserData();
  }, [])
  return (
    <View style={{flex: 1, backgroundColor: "#fff"}}>
      <Scroll onRefresh={getUserData} refreshing={refreshing}>
      <View style={styles.container}>
            <Text style={styles.title}>{`Nombre completo: ${userData?.fullName ?? ''}`}</Text>
            <Text style={styles.text}>{`Señal de llamada: ${userData?.callsign ?? ''}`}</Text>
            <Text style={styles.text}>{`Teléfono: ${userData?.phone ?? ''}`}</Text>
            <Text style={styles.text}>{`Número NIE: ${userData?.NIE ?? ''}`}</Text>
      </View>
    </Scroll>
    <TouchableOpacity onPress={onPressLogoutBtn} style={{justifyContent: 'flex-end', alignItems: 'center', borderRadius: 10, borderWidth: 1, margin: 14, }}>
            <Text style={{padding: 8}}>Salida</Text>
    </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 40,
    paddingTop: statusBarHeight,
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
  },
  text: {
    color: 'black',
    fontSize: 16,
    paddingVertical: 4,
  }
});
