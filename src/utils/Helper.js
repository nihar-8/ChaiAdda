import { PixelRatio, Platform, Dimensions, ToastAndroid } from "react-native";

export function normalize(size)
{
    const scale = (Dimensions.get("window").width / 320);
    const newSize = size * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export function showErrorAlert(message) 
{
    if (Platform.OS == "android") 
    {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    }
}