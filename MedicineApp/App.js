import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Notifications from "expo-notifications";
import { useEffect } from "react"; // 1. Importe o useEffect

// Suas telas
import FormRemedio from "./src/screens/FormRemedio";
import Home from "./src/screens/Home";
import Login from "./src/screens/Login";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Stack = createNativeStackNavigator();

// Mantenha a função de permissão aqui fora
async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    // No Android físico ou emulador, isso é essencial
    console.log("Falha ao obter permissão para notificações!");
    return;
  }
}

export default function App() {
  // 2. Chame a função de permissão quando o App carregar
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="FormRemedio" component={FormRemedio} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
