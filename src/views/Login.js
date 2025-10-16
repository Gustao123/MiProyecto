import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import {signInWithEmailAndPassword}from "firebase/auth";
import {auth} from "../database/firebaseconfig";

const Login =({onloginSuccess})=> {

          const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const manejadorLogin = async () => {
          if (!email || !password) {
            Alert.alert("Error", "Por favor completa ambos campos.");
            return;
          }

          try {
            await signInWithEmailAndPassword(auth, email, password);
            onloginSuccess(); // Notifica al componente App que el login fue exitoso
            console.log("error");
            let mensaje = "Error al iniciar sesión.";
            if (error.code === "auth/invalid-email") {
              mensaje = "Correo inválido.";
            }
            if (error.code === "auth/user-not-found") {
              mensaje = "Usuario no encontrado.";
            }
            if (error.code === "auth/wrong-password") {
              mensaje = "Contraseña incorrecta.";
            }
            Alert.alert("Error", mensaje);
          } catch (error) {
            console.log(error);
            let mensaje = "Error al iniciar sesión.";
            if (error.code === "auth/invalid-email") {
              mensaje = "Correo inválido.";
            }
            if (error.code === "auth/user-not-found") {
              mensaje = "Usuario no encontrado.";
            }
            if (error.code === "auth/wrong-password") {
              mensaje = "Contraseña incorrecta.";
            }
            Alert.alert("Error", mensaje);
          }
        };
  return (
   <View style={styles.container}>
    <Text style={styles.titulo}>Iniciar Sesión</Text>
    <TextInput
      style={styles.input}
      placeholder="Correo electrónico"
      value={email}
      onChangeText={setEmail}
      keyboardType="email-address"
      autoCapitalize="none"
    />
    <TextInput
      style={styles.input}
      placeholder="Contraseña"
      value={password}
      onChangeText={setPassword}
      secureTextEntry
    />
    <TouchableOpacity style={styles.boton} onPress={manejadorLogin}>
      <Text style={styles.textoBoton}>Entrar</Text>
    </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F9F9F9",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "white",
  },
  boton: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  textoBoton: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
})

export default Login;