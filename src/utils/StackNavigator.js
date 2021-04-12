import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import Dashboard from '../screens/Dashboard'
import AddStock from '../screens/AddStock'
import AddItem from '../screens/AddItem'
import CheckPurchaseHistory from '../screens/CheckPurchaseHistory'
import CheckStock from '../screens/CheckStock'
import RemoveStock from '../screens/RemoveStock'
const Stack = createStackNavigator()

export default function NavgationRoutes() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Dashboard"
                screenOptions={{
                    headerShown: false,
                    ...TransitionPresets.SlideFromRightIOS
                }}
            >
                <Stack.Screen name="Dashboard" component={Dashboard} />
                <Stack.Screen name="AddStock" component={AddStock} />
                <Stack.Screen name="AddItem" component={AddItem} />
                <Stack.Screen name="CheckPurchaseHistory" component={CheckPurchaseHistory} />
                <Stack.Screen name="CheckStock" component={CheckStock} />
                <Stack.Screen name="RemoveStock" component={RemoveStock} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
