import React from 'react';
import {
	LogBox
} from 'react-native';
import NavgationRoutes from './src/utils/StackNavigator'

LogBox.ignoreAllLogs()

export default function App() {
		return (
			<NavgationRoutes />
		)
}