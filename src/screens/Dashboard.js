import React from 'react'
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native'
import { normalize } from '../utils/Helper'
import Colors from '../utils/Colors'
import database from '@react-native-firebase/database';
import NetInfo from "@react-native-community/netinfo"
export default function Dashboard(props) {
    const add = (page) => {
        NetInfo.fetch().then((state) => {
            if (state.isConnected) {
                var newItems = []
                database().ref().once('value').then(snapshot => {
                    snapshot.forEach((item) => {
                        var currentItem = {
                            label: item.key,
                            value: item.key
                        }
                        newItems.push(currentItem)
                    })
                }).then(() => {
                    if (page == 'stock') {
                        props.navigation.navigate('AddStock', { body: newItems })
                    } else if (page == 'item') {
                        props.navigation.navigate('AddItem', { body: newItems })
                    } else {
                        props.navigation.navigate('CheckStock', { body: newItems })
                    }
                });
            } else {
                showErrorAlert('Please check your internet connection.')
            }
        });
    }

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: Colors.White }}
        >
            <View
                style={styles.headerView}
            >
                <View
                    style={styles.headerLogo}
                >
                    <Image
                        style={styles.image}
                        source={require('../assets/logo.png')}
                    />
                </View>
            </View>
            <View
                style={styles.container}
            >
                <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.button}
                    onPress={() => add('stock')}
                >
                    <Text
                        style={styles.buttonText}
                    >
                        Add Stock
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.button}
                    onPress={() => add('item')}
                >
                    <Text
                        style={styles.buttonText}
                    >
                        Add Item
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.button}
                    onPress={() => add('check')}
                >
                    <Text
                        style={styles.buttonText}
                    >
                        Check Stock
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.White,
        justifyContent: 'center'
    },
    headerView:
    {
        width: '100%',
        backgroundColor: Colors.White,
        alignItems: 'center',
        paddingHorizontal: normalize(10),
        borderBottomWidth: normalize(1),
        borderColor: Colors.AppColor,
        justifyContent: 'center'
    },
    headerLogo:
    {
        width: normalize(60),
        height: normalize(60)
    },
    image:
    {
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    },
    button:
    {
        width: '75%',
        height: normalize(50),
        borderRadius: normalize(25),
        backgroundColor: Colors.AppColor,
        padding: normalize(5),
        alignItems: 'center',
        justifyContent: 'center',
        margin: normalize(5)
    },
    buttonText:
    {
        color: Colors.White,
        fontSize: normalize(15),
        fontWeight: 'bold',
        textAlign: 'center'
    }
})