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
export default function AddItem(props) {
    const [selectedItem, setSelectedItem] = React.useState(null)
    const items = props.route.params.body
    const [itemName, setItemName] = React.useState('')
    const [qty, setQty] = React.useState('')
    const [price, setPrice] = React.useState('')

    const didSelectItem = (item) => {
        if (!!item) {
            setSelectedItem(item)
            setItemName('')
            setPrice('')
            setQty('')
        }
    }

    const addItem = () => {
        if (selectedItem == null) {
            showErrorAlert('Please select a Category')
        } else if (itemName.trim().length == 0) {
            showErrorAlert('Please enter Item Name')
        } else if (qty.trim().length == 0) {
            showErrorAlert('Please enter Quantity.')
        } else if (price.trim().length == 0) {
            showErrorAlert('Please enter Price.')
        } else if (qty.split('.').length > 1) {
            showErrorAlert("Quantiy can't be a fraction.")
        } else if (price.split('.').length > 2) {
            showErrorAlert("Invalid Price entered")
        } else {
            Alert.alert("Confirmation", "Category: " + selectedItem + "\nItem: " + itemName + "\nPrice: " + price + "\nQuantity: " + qty, [
                {
                    text: 'Confirm', onPress: () => {
                        updateDatabase()
                    }
                },
                { text: 'Cancel', onPress: () => console.log('Cancel') }
            ])
        }
    }

    const getDate = () => {
        let val = new Date()
        let myDate = val.toDateString().split(" ")
        return (`${myDate[2]} ${myDate[1]}, ${myDate[3]}`)
    }

    function updateDatabase() {
        NetInfo.fetch().then((state) => {
            if (state.isConnected) {
                database().ref(`/stock/${selectedItem}/${itemName}`).update({
                    in: parseInt(qty),
                    out: 0,
                    left: parseInt(qty)
                }).then(() => {
                    database().ref(`/purchase/${selectedItem}/${itemName}/${getDate()}`).update({
                        price: parseFloat(price),
                        qty: parseInt(qty),
                        total: parseFloat(price) * parseInt(qty)
                    }).then(() => {
                        showErrorAlert('Item Added')
                        props.navigation.goBack()
                    });
                });
            }else {
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
                    <TextInput
                        style={styles.textInput}
                        placeholder={'Item Name Here'}
                        placeholderTextColor={Colors.Silver}
                        value={itemName}
                        onChangeText={(newName) => setItemName(newName)}
                        onSubmitEditing={() => Keyboard.dismiss()}
                    />
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
                        onPress={() => addItem()}
                    >
                        <Text
                            style={styles.buttonText}
                        >
                            Add Item
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