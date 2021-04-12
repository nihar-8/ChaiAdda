import React from 'react'
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Keyboard,
    TextInput,
    Alert
} from 'react-native'
import { normalize, showErrorAlert } from '../utils/Helper'
import Colors from '../utils/Colors'
import NetInfo from "@react-native-community/netinfo"
import database from '@react-native-firebase/database';
import RNPickerSelect from 'react-native-picker-select'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
export default function AddStock(props) {
    const [selectedItem, setSelectedItem] = React.useState(null)
    const items = props.route.params.body
    const [subItems, setSubItems] = React.useState([])
    const [selectedSubItem, setSelectedSubItem] = React.useState(null)
    const [qty, setQty] = React.useState('')
    const [price, setPrice] = React.useState('')
    const didSelectItem = (item) => {
        if (!!item) {
            setSelectedItem(item)
            setSelectedSubItem(null)
            setPrice('')
            setQty('')
            NetInfo.fetch().then((state) => {
                if (state.isConnected) {
                    var newItems = []
                    database().ref('/' + item).once('value').then(snapshot => {
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
            setPrice('')
            setQty('')
        }
    }

    const addStock = () => {
        if (selectedItem == null) {
            showErrorAlert('Please select a Category')
        } else if (selectedSubItem == null) {
            showErrorAlert('Please select an Item')
        } else if (qty.trim().length == 0) {
            showErrorAlert('Please enter Quantity.')
        } else if (price.trim().length == 0) {
            showErrorAlert('Please enter Price.')
        } else if (qty.split('.').length > 1) {
            showErrorAlert("Quantiy can't be a fraction.")
        } else if (price.split('.').length > 2) {
            showErrorAlert("Invalid Price entered")
        } else {
            Alert.alert("Confirmation", "Category: " + selectedItem + "\nItem: " + selectedSubItem + "\nPrice: " + price + "\nQuantity: " + qty, [
                {
                    text: 'Confirm', onPress: () => {
                        updateDatabase()
                    }
                },
                { text: 'Cancel', onPress: () => console.log('Cancel') }
            ])
        }
    }

    function updateDatabase() {
        NetInfo.fetch().then((state) => {
            if (state.isConnected) {
                database().ref(`/${selectedItem}/${selectedSubItem}/total`).once('value').then(snapshot => {
                    var tCost = snapshot.val()
                    tCost = tCost + (parseInt(qty, 10) * parseFloat(price))
                    database().ref(`/${selectedItem}/${selectedSubItem}/qty`).once('value').then(snapshot => {
                        var qt = snapshot.val()
                        qt = qt + parseInt(qty, 10)
                        var avPrc = tCost / qt
                        database().ref(`/${selectedItem}/${selectedSubItem}`).update({
                            avgPrice: avPrc,
                            qty: qt,
                            total: tCost
                        }).then(() => {
                            showErrorAlert('Stock Updated')
                            props.navigation.goBack()
                        });
                    })
                })
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
            <KeyboardAwareScrollView
                style={{ backgroundColor: Colors.White }}
                keyboardShouldPersistTaps="handled"
            >
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
                    <TextInput
                        style={styles.textInput}
                        placeholder={'Quantity Here'}
                        placeholderTextColor={Colors.Silver}
                        value={qty}
                        onChangeText={(newQty) => setQty(newQty)}
                        onSubmitEditing={() => Keyboard.dismiss()}
                        keyboardType={'numeric'}
                    />
                    <TextInput
                        style={styles.textInput}
                        placeholder={'Price Here'}
                        placeholderTextColor={Colors.Silver}
                        value={price}
                        onChangeText={(newPrice) => setPrice(newPrice)}
                        onSubmitEditing={() => Keyboard.dismiss()}
                        keyboardType={'decimal-pad'}
                    />
                    <TouchableOpacity
                        activeOpacity={0.6}
                        style={styles.button}
                        onPress={() => addStock()}
                    >
                        <Text
                            style={styles.buttonText}
                        >
                            Add Stock
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
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