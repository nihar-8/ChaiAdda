import React from 'react'
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    Dimensions
} from 'react-native'
import { normalize, showErrorAlert } from '../utils/Helper'
import Colors from '../utils/Colors'
import NetInfo from "@react-native-community/netinfo"
import database from '@react-native-firebase/database';
import RNPickerSelect from 'react-native-picker-select'
const { width, height } = Dimensions.get('screen')
export default function CheckStock(props) {
    const [selectedItem, setSelectedItem] = React.useState(null)
    const items = props.route.params.body
    const [data, setData] = React.useState([])

    const didSelectItem = (item) => {
        if (!!item) {
            setSelectedItem(item)
            fetchData(item)
        }
    }
    function fetchData(item) {
        NetInfo.fetch().then((state) => {
            if (state.isConnected) {
                var subItems = [{
                    title: 'Item',
                    price: 'Avg Price',
                    qty: 'Quantity',
                    total: 'Total Cost'
                }]
                database().ref(`/${item}`).once('value').then(snapshot => {
                    snapshot.forEach((child) => {
                        var subItem = {
                            title: child.key,
                            price: child.val().avgPrice.toFixed(2),
                            qty: child.val().qty,
                            total: child.val().total.toFixed(2)
                        }
                        subItems.push(subItem)
                    })
                }).then(() => {
                    console.log(subItems)
                    setData(subItems)
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
                <View
                    style={styles.textInputView}
                >
                    <RNPickerSelect
                        onValueChange={(value) => didSelectItem(value)}
                        items={items}
                        value={selectedItem}
                        style={{
                            inputIOS: [pickerSelectStyles.inputIOS],
                            inputAndroid: [pickerSelectStyles.inputAndroid],
                        }}
                        placeholder={{
                            label: 'Select Category',
                            value: null
                        }}
                        useNativeAndroidPickerStyle={false}
                    />
                </View>
                {(data.length > 0) ?
                    (<FlatList
                        data={data}
                        keyExtractor={(item) => item.title}
                        extraData={data}
                        renderItem={({ item, index }) =>
                            <View
                                style={{backgroundColor: Colors.White, padding: normalize(5), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: width, borderColor: Colors.AppColor, borderTopWidth: normalize(1), marginTop: index == 0 ? normalize(10) : 0, borderBottomWidth: index == data.length - 1 ? normalize(1) : 0 }}
                            >
                                <Text
                                    style={{textAlign: 'center', fontSize: normalize(12), width: normalize(width/4 - 40), marginHorizontal: 10, alignSelf: 'center', borderColor: Colors.AppColor, borderRightWidth: normalize(1), textTransform: 'capitalize'}}
                                >
                                    {item.title}
                                </Text>
                                <Text
                                    style={{textAlign: 'center', fontSize: normalize(12), width: normalize(width/4 - 40), marginHorizontal: 10,  alignSelf: 'center', borderColor: Colors.AppColor, borderRightWidth: normalize(1)}}
                                >
                                    {item.price}
                                </Text>
                                <Text
                                    style={{textAlign: 'center', fontSize: normalize(12), width: normalize(width/4 - 40), marginHorizontal: 10,  alignSelf: 'center', borderColor: Colors.AppColor, borderRightWidth: normalize(1)}}
                                >
                                    {item.qty}
                                </Text>
                                <Text
                                    style={{textAlign: 'center', fontSize: normalize(12), width: normalize(width/4 - 40), marginHorizontal: 10}}
                                >
                                    {item.total}
                                </Text>
                            </View>
                        }
                    />)
                    :
                    (<View
                        style={styles.noDataView}
                    >
                        <Text
                            style={styles.noDataText}
                        >
                            No Stock Found!
                        </Text>
                    </View>)
                }
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
        margin: normalize(10)
    },
    buttonText:
    {
        color: Colors.White,
        fontSize: normalize(15),
        fontWeight: 'bold',
        textAlign: 'center'
    },
    textInputView:
    {
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(10),
        marginTop: normalize(10),
        borderRadius: normalize(8),
        backgroundColor: Colors.White,
        borderWidth: normalize(1),
        borderColor: Colors.AppColor,
        width: '85%'
    },
    textInput:
    {
        fontSize: normalize(13),
        color: Colors.AppColor,
        padding: normalize(10),
        width: '85%',
        marginTop: normalize(10),
        borderRadius: normalize(8),
        backgroundColor: Colors.White,
        borderWidth: normalize(1),
        borderColor: Colors.AppColor,
    },
    noDataView:
    {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center'
    },
    noDataText:
    {
        alignSelf: 'center',
        fontSize: normalize(20),
        fontWeight: "500",
        color: Colors.AppColor,
    },
})

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: normalize(13),
        paddingVertical: normalize(2),
        paddingHorizontal: normalize(2),
        borderRadius: normalize(10),
        color: Colors.AppColor,
        elevation: normalize(2),
        height: normalize(30),
    },
    inputAndroid: {
        fontSize: normalize(13),
        paddingHorizontal: normalize(2),
        paddingVertical: normalize(2),
        borderRadius: normalize(10),
        borderColor: Colors.AppColor,
        color: Colors.AppColor,
        height: normalize(30),
    },
})