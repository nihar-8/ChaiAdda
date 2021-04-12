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
export default function CheckPurchaseHistory(props) {
    const [selectedItem, setSelectedItem] = React.useState(null)
    const items = props.route.params.body
    const [subItems, setSubItems] = React.useState([])
    const [selectedSubItem, setSelectedSubItem] = React.useState(null)
    const [data, setData] = React.useState([])

    const didSelectItem = (item) => {
        if (!!item) {
            setSelectedItem(item)
            setSelectedSubItem(null)
            setData([])
            NetInfo.fetch().then((state) => {
                if (state.isConnected) {
                    var newItems = []
                    database().ref('/purchase/' + item).once('value').then(snapshot => {
                        snapshot.forEach((subItem) => {
                            var currentItem = {
                                label: subItem.key,
                                value: subItem.key
                            }
                            newItems.push(currentItem)
                        })
                    }).then(() => {
                        setSubItems(newItems)
                    });
                } else {
                    showErrorAlert('Please check your internet connection.')
                }
            });
        }
    }

    const didSelectSubItem = (item) => {
        if (!!item) {
            setSelectedSubItem(item)
            fetchData(item)
        }
    }

    function fetchData(item) {
        NetInfo.fetch().then((state) => {
            if (state.isConnected) {
                var subItems = []
                database().ref(`/purchase/${selectedItem}/${item}`).once('value').then(snapshot => {
                    snapshot.forEach((child) => {
                        var subItem = {
                            title: child.key,
                            price: child.val().price.toFixed(2),
                            qty: child.val().qty,
                            total: child.val().total.toFixed(2)
                        }
                        subItems.push(subItem)
                    })
                }).then(() => {
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
                <View
                    style={styles.textInputView}
                >
                    <RNPickerSelect
                        onValueChange={(value) => didSelectSubItem(value)}
                        items={subItems}
                        value={selectedSubItem}
                        style={{
                            inputIOS: [pickerSelectStyles.inputIOS],
                            inputAndroid: [pickerSelectStyles.inputAndroid],
                        }}
                        placeholder={{
                            label: 'Select Item',
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
                                style={{ backgroundColor: Colors.White, padding: normalize(5), width: width, borderColor: Colors.AppColor, borderTopWidth: normalize(1), marginTop: index == 0 ? normalize(10) : 0, borderBottomWidth: index == data.length - 1 ? normalize(1) : 0 }}
                            >
                                <Text
                                    style={styles.itemText}
                                >
                                   Date : {item.title}
                                </Text>
                                <Text
                                   style={styles.itemText}
                                >
                                    Price : {item.price}
                                </Text>
                                <Text
                                    style={styles.itemText}
                                >
                                    Quantity : {item.qty}
                                </Text>
                                <Text
                                    style={styles.itemText}
                                >
                                    Total : {item.total}
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
    itemText:
    {
        fontSize: normalize(14),
        marginHorizontal: 10,
        textTransform: 'capitalize'
    }
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