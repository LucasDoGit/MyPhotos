import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import TelaLogin from './src/telas/TelaLogin';
import TelaAddUser from './src/telas/TelaAddUser';
import TelaPosts from './src/telas/TelaPosts';
import TelaMeusPosts from './src/telas/TelaMeusPosts';
import TelaAddPost from './src/telas/TelaAddPost';
import TelaCamera from './src/telas/TelaCamera';

const Stack = createStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="login">
        <Stack.Screen 
          name="login"  
          options={{ headerShown: false }} 
          component={TelaLogin}
        />
        <Stack.Screen
          name="posts"
          options={{ headerShown: false }}
          component={TelaPosts}
        />
        <Stack.Screen
          name="meusPosts"
          options={{ headerShown: false }}
          component={TelaMeusPosts}
        />
        <Stack.Screen
          name="addPost"
          options={{ headerShown: false }}
          component={TelaAddPost}
        />
        <Stack.Screen
          name="addUser"
          options={{ headerShown: false }}
          component={TelaAddUser}
        />
        <Stack.Screen
          name="camera"
          options={{ headerShown: false }}
          component={TelaCamera}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
