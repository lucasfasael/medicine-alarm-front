# 💊 MedicineAlarm

> Sua rotina de saúde sob controle. Um aplicativo mobile moderno para gerenciamento de medicamentos, lembretes e acompanhamento de rotina terapêutica.

---

## 📱 Telas do Aplicativo

<div align="center">
  <img src="https://github.com/user-attachments/assets/ccb6d514-be32-4c1b-893e-be354a723a56" width="280" alt="Tela de Login" />
  <img src="https://github.com/user-attachments/assets/35804d75-22bb-4456-8660-01f40fe2ce06" width="280" alt="Tela Inicial" />
  <img src="https://github.com/user-attachments/assets/a45faa72-97ef-40d4-ba8b-4523df8801ff" width="280" alt="Perfil do Usuário" />
</div>

*(Dica: Você pode arrastar as imagens dos prints para o seu repositório do GitHub e substituir os links acima para exibi-las direto no README)*

---

## 🚀 Funcionalidades

- **Autenticação de Usuários:** Login seguro integrado ao backend.
- **Gerenciamento de Medicamentos:** Cadastro, edição e exclusão de remédios.
- **Controle de Horários e Doses:** Definição personalizada de dias da semana, horários específicos e quantidade de comprimidos.
- **Painel de Perfil:** Visualização rápida de dados da conta, estatísticas de uso e taxa de aderência ao tratamento.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi desenvolvido com uma arquitetura separada entre **Front-end** e **Back-end**:

### Front-end (Mobile)
- **React Native** com **Expo**
- **JavaScript / JSX**
- **Axios** (para requisições HTTP)

### Back-end (API REST)
- **Java** com **Spring Boot**
- **Spring Data MongoDB**
- **MongoDB Atlas** (Banco de dados na nuvem)

---

## ⚙️ Como Executar o Projeto

### Pré-requisitos
Certifique-se de ter instalado em sua máquina:
- Node.js e npm/yarn
- Java JDK 17+
- Android Studio (com um emulador configurado) ou o aplicativo Expo Go no celular.

### 1. Rodando o Back-end (Spring Boot)
1. Clone o repositório ou abra a pasta do projeto backend.
2. Configure a sua string de conexão do MongoDB Atlas no arquivo `src/main/resources/application.properties`.
3. Execute o projeto usando sua IDE favorita (IntelliJ, Eclipse, VS Code) ou pelo terminal:
   ```
   ./mvnw spring-boot:run
   ```

2. Rodando o Front-end (Expo / React Native)

- Entre na pasta do front-end:

```
cd caminho-da-pasta-do-front
```

- Instale as dependências:

```
npm install
```

- Inicie o projeto com:

```
npm start
```

- Pressione a para abrir no emulador Android (ou escaneie o QR Code com o aplicativo Expo Go no seu celular).



##👨‍💻 Autor

Desenvolvido por Lucas Fasael.


