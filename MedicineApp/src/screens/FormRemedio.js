import { Feather } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../services/api";

export default function FormRemedio({ navigation, route }) {
  // Se veio algo no route.params.remedio, estamos editando
  const remedioParaEditar = route.params?.remedio;

  const [nome, setNome] = useState(remedioParaEditar?.nome || "");
  const [diasSemana, setDiasSemana] = useState(
    remedioParaEditar?.diasSemana || [],
  );

  // Lista dinâmica de horários e doses
  const [configuracao, setConfiguracao] = useState(
    remedioParaEditar?.configuracao || [{ hora: "", dosagem: "" }],
  );

  const diasOpcoes = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];

  // Função para marcar/desmarcar dias
  const toggleDia = (dia) => {
    if (diasSemana.includes(dia)) {
      setDiasSemana(diasSemana.filter((d) => d !== dia));
    } else {
      setDiasSemana([...diasSemana, dia]);
    }
  };

  // Funções para a lista dinâmica de horários
  const adicionarHorario = () => {
    setConfiguracao([...configuracao, { hora: "", dosagem: "" }]);
  };

  const removerHorario = (index) => {
    const novaLista = [...configuracao];
    novaLista.splice(index, 1);
    setConfiguracao(novaLista);
  };

  const atualizarHorario = (index, campo, valor) => {
    const novaLista = [...configuracao];
    novaLista[index][campo] = valor;
    setConfiguracao(novaLista);
  };

  async function agendarNotificacoes(nomeRemedio, configuracoes) {
    // Limpar notificações antigas deste remédio (opcional, para evitar duplicados)
    // await Notifications.cancelAllScheduledNotificationsAsync();

    for (const config of configuracoes) {
      const [hora, minuto] = config.hora.split(":").map(Number);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Hora do seu remédio! 💊",
          body: `Está na hora de tomar: ${nomeRemedio} (${config.dosagem})`,
          sound: true, // No Android 8.0+ requer configuração de canais
          priority: Notifications.AndroidNotificationPriority.MAX,
        },
        trigger: {
          hour: hora,
          minute: minuto,
          repeats: true, // Isso fará o alarme tocar todo dia nesse horário
        },
      });
    }
  }

  async function handleSalvar() {
    const idDoUsuarioLogado =
      remedioParaEditar?.usuarioId || route.params?.usuarioId;

    if (!idDoUsuarioLogado) {
      Alert.alert("Erro", "Usuário não identificado.");
      return;
    }

    const dados = {
      nome,
      diasSemana,
      configuracao,
      usuarioId: idDoUsuarioLogado,
    };

    try {
      if (remedioParaEditar) {
        await api.put(`/medicamentos/${remedioParaEditar.id}`, dados);
      } else {
        await api.post("/medicamentos", dados);
      }

      // --- ADICIONE ESTA LINHA AQUI ---
      // Agendamos os alarmes no celular logo após salvar no banco
      await agendarNotificacoes(nome, configuracao);
      // --------------------------------

      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      Alert.alert("Erro", "Não foi possível salvar.");
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>
          {remedioParaEditar ? "Editar" : "Novo"} Remédio
        </Text>

        <Text style={styles.label}>Nome do Medicamento</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Amoxicilina"
          placeholderTextColor="#666"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>Dias da Semana</Text>
        <View style={styles.diasContainer}>
          {diasOpcoes.map((dia) => (
            <TouchableOpacity
              key={dia}
              style={[
                styles.diaBotao,
                diasSemana.includes(dia) && styles.diaBotaoAtivo,
              ]}
              onPress={() => toggleDia(dia)}
            >
              <Text
                style={[
                  styles.diaTexto,
                  diasSemana.includes(dia) && styles.diaTextoAtivo,
                ]}
              >
                {dia}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.label}>Horários e Doses</Text>
          <TouchableOpacity
            onPress={adicionarHorario}
            style={styles.addHorarioBtn}
          >
            <Feather name="plus-circle" size={20} color="#A020F0" />
            <Text style={styles.addHorarioTxt}> Adicionar</Text>
          </TouchableOpacity>
        </View>

        {configuracao.map((item, index) => (
          <View key={index} style={styles.horarioCard}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="08:00"
              placeholderTextColor="#666"
              value={item.hora}
              onChangeText={(txt) => atualizarHorario(index, "hora", txt)}
            />
            <TextInput
              style={[
                styles.input,
                { flex: 2, marginBottom: 0, marginLeft: 10 },
              ]}
              placeholder="Dose (ex: 1 comp)"
              placeholderTextColor="#666"
              value={item.dosagem}
              onChangeText={(txt) => atualizarHorario(index, "dosagem", txt)}
            />
            {configuracao.length > 1 && (
              <TouchableOpacity
                onPress={() => removerHorario(index)}
                style={{ marginLeft: 10 }}
              >
                <Feather name="trash-2" size={20} color="#FF4444" />
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
          <Text style={styles.saveButtonText}>Salvar Medicamento</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121214" },
  scrollContent: { padding: 24 },
  title: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    marginTop: 20,
  },
  label: { color: "#888", fontSize: 16, marginBottom: 8, fontWeight: "600" },
  input: {
    backgroundColor: "#1C1C1E",
    color: "#FFF",
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  diasContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  diaBotao: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#1C1C1E",
    marginBottom: 10,
    minWidth: 50,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  diaBotaoAtivo: { backgroundColor: "#A020F0", borderColor: "#A020F0" },
  diaTexto: { color: "#888", fontWeight: "bold" },
  diaTextoAtivo: { color: "#FFF" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  addHorarioBtn: { flexDirection: "row", alignItems: "center" },
  addHorarioTxt: { color: "#A020F0", fontWeight: "bold" },
  horarioCard: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  saveButton: {
    backgroundColor: "#A020F0",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 30,
  },
  saveButtonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  cancelButton: { marginTop: 20, alignItems: "center", paddingBottom: 40 },
  cancelButtonText: { color: "#888", fontSize: 16 },
});
