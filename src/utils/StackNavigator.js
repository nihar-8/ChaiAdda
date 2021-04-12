import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import Dashboard from '../screens/Dashboard'
import AddStock from '../screens/AddStock'
import AddItem from '../screens/AddItem'
import CheckStock from '../screens/CheckStock'
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
                <Stack.Screen name="CheckStock" component={CheckStock} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
