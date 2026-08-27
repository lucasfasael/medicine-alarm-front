import { useEffect, useState } from "react";
// Importamos Image e TouchableOpacity
import { Feather } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import api from "../services/api";

export default function Home({ navigation, route }) {
  const [userPhoto, setUserPhoto] = useState("https://github.com/github.png"); // Foto padrão inicial

  const user = route.params?.usuarioLogado || {};
  const isFocused = useIsFocused();
  const [remedios, setRemedios] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const { width, height } = Dimensions.get("window");

  useEffect(() => {
    if (isFocused && user && user.id) {
      api
        .get(`/medicamentos/usuario/${user.id}`)
        .then((response) => {
          setRemedios(response.data);
        })
        .catch((error) => {
          console.error("Erro ao buscar remédios do usuário:", error);
        });
    }
  }, [isFocused, user.id]);

  function handleLogout() {
    Alert.alert("Sair", "Tem certeza que deseja encerrar a sessão?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: () => {
          setModalVisible(false); // Fecha o modal antes de sair
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }], // Nome exato da sua rota de Login
          });
        },
      },
    ]);
  }

  // Função que abre o alerta de confirmação
  const confirmarExclusao = (id, nome) => {
    Alert.alert(
      "Excluir Medicamento",
      `Tem certeza que deseja remover o remédio ${nome}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => handleDeletar(id), // Se confirmar, chama a função de delete
        },
      ],
    );
  };

  // Função que realmente fala com o Back-end
  const handleDeletar = async (id) => {
    try {
      await api.delete(`/medicamentos/${id}`);

      setRemedios(remedios.filter((remedio) => remedio.id !== id));
    } catch (error) {
      console.error("Erro ao deletar:", error.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível excluir o medicamento.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header com Título e Avatar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Meus Remédios</Text>
          <Text style={styles.subtitle}>Olá, {user.nome || "usuário"}!</Text>
        </View>

        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={
            () => setModalVisible(true) // Abre o modal ao clicar no avatar
          }
        >
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
            statusBarTranslucent={true}
            presentationStyle="overFullScreen"
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                {/* Botão de Fechar */}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={{ color: "#FFF", fontWeight: "bold" }}>X</Text>
                </TouchableOpacity>

                <Image
                  source={{ uri: user.fotoUrl || userPhoto }}
                  style={styles.largeAvatar}
                />

                <Text style={styles.userName}>{user.nome}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>

                <View style={styles.statsContainer}>
                  <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{remedios.length}</Text>
                    <Text style={styles.statLabel}>Remédios</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statNumber}>95%</Text>
                    <Text style={styles.statLabel}>Aderência</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={handleLogout}
                >
                  <Text
                    style={{
                      color: "#FF4444",
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    Sair da Conta
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Image
            source={{
              uri:
                user.fotoUrl && user.fotoUrl.trim().length > 0
                  ? user.fotoUrl
                  : userPhoto,
            }}
            style={styles.avatarImage}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={remedios}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }} // Espaço para o botão não cobrir o último card
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.remedioInfo}>
              <Text style={styles.remedioNome}>{item.nome}</Text>

              <View style={styles.horariosContainer}>
                {item.configuracao?.map((config, index) => (
                  <Text key={index} style={styles.remedioHora}>
                    ⏰ {config.hora} ({config.dosagem})
                  </Text>
                ))}
              </View>

              <Text style={styles.diasSemanaText}>
                {item.diasSemana?.join(" • ")}
              </Text>
            </View>
            <View style={styles.actionsContainer}>
              {/* Botão Editar (já existe) */}
              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  navigation.navigate("FormRemedio", { remedio: item })
                }
              >
                <Feather name="edit-2" size={20} color="#A020F0" />
              </TouchableOpacity>

              {/* NOVO: Botão Deletar */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => confirmarExclusao(item.id, item.nome)} // Note que passamos o ID e o Nome
              >
                <Feather name="trash-2" size={20} color="#FF4444" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          navigation.navigate("FormRemedio", { usuarioId: user.id })
        } // Passando o ID aqui!
      >
        <Feather name="plus" size={30} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121214",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 50, // Aumentado para não colar no topo
    marginBottom: 20,
  },
  title: {
    color: "#FFF",
    fontSize: 26,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#888",
    fontSize: 15,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#A020F0",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },

  // --- CARDS DE REMÉDIOS ---
  card: {
    backgroundColor: "#1C1C1E",
    padding: 18,
    borderRadius: 20,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderLeftWidth: 6,
    borderLeftColor: "#A020F0",
    // Sombra/Glow
    shadowColor: "#A020F0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  remedioInfo: {
    flex: 1,
  },
  remedioNome: {
    color: "#FFF",
    fontSize: 19,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  horariosWrapper: {
    marginTop: 6,
  },
  remedioHora: {
    color: "#A020F0",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 2,
  },
  diasSemanaText: {
    color: "#666",
    fontSize: 12,
    marginTop: 6,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  editButton: {
    padding: 12,
    backgroundColor: "rgba(160, 32, 240, 0.1)",
    borderRadius: 14,
    marginLeft: 10,
  },

  // --- BOTÃO FLUTUANTE (FAB) ---
  fab: {
    position: "absolute",
    right: 25,
    bottom: 55,
    backgroundColor: "#A020F0",
    width: 65,
    height: 65,
    borderRadius: 32.5,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#A020F0",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },

  // --- MODAL DE PERFIL ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#1C1C1E",
    borderRadius: 25,
    padding: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 5,
  },
  largeAvatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#A020F0",
    marginBottom: 15,
  },
  userName: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  userEmail: {
    color: "#888",
    fontSize: 14,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#333",
    paddingVertical: 20,
  },
  statBox: {
    alignItems: "center",
  },
  statNumber: {
    color: "#A020F0",
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#888",
    fontSize: 12,
  },
  logoutButton: {
    marginTop: 15,
    padding: 10,
    width: "100%",
    alignItems: "center",
  },
  actionsContainer: {
    flexDirection: "row", // Coloca um botão do lado do outro
    alignItems: "center",
  },
  editButton: {
    padding: 10,
    backgroundColor: "rgba(160, 32, 240, 0.1)",
    borderRadius: 12,
    marginRight: 8, // Espaço entre o editar e o deletar
  },
  deleteButton: {
    padding: 10,
    backgroundColor: "rgba(255, 68, 68, 0.1)", // Fundo vermelho clarinho
    borderRadius: 12,
  },
});
