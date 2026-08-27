import { useState } from "react";
import {
    Alert,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../services/api";

export default function Login({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    if (!username || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      const response = await api.get("/usuarios");
      const usuarios = response.data;
      const user = usuarios.find(
        (u) => u.email === username && u.senha === password,
      );

      if (user) {
        navigation.replace("Home", { usuarioLogado: user });
      } else {
        Alert.alert("Erro", "E-mail ou senha incorretos.");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    }
  }

  return (
    // 2. Envolva tudo com o ImageBackground
    <ImageBackground
      source={require("../assets/bg-login.png")} // Ajuste o caminho conforme sua pasta
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <Text style={styles.brand}>Medicine💊</Text>
              <Text style={styles.tagline}>
                Sua rotina de saúde sob controle.
              </Text>
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>Bem-vindo de volta</Text>

              <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#999"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />

              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#999"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Acessar Conta</Text>
              </TouchableOpacity>

              {/* Restante do seu footer... */}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(18, 18, 20, 0.7)", // Camada escura para dar leitura
  },
  scrollContent: {
    flexGrow: 1, // Permite que o conteúdo cresça e centralize
    justifyContent: "center", // Centraliza o formulário verticalmente
    paddingHorizontal: 24, // Dá respiro nas laterais
    paddingBottom: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  brand: {
    color: "#A020F0",
    fontSize: 40,
    fontWeight: "800",
  },
  tagline: {
    color: "#DDD",
    fontSize: 14,
    marginTop: 5,
  },
  form: {
    width: "100%",
  },
  label: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "rgba(28, 28, 30, 0.9)",
    color: "#FFF",
    height: 60,
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#444",
  },
  button: {
    backgroundColor: "#A020F0",
    height: 60,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
