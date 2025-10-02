import React, { use, useState } from "react";
import {View, TextInput, Button, StyleSheet,Text} from "react-native";
import {db} from "../../database/firebaseconfig";
import { collection, addDoc } from "firebase/firestore";


const FormularioClientes =({ cargarDatos }) =>{
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [cedula, setCedula] = useState("");

  const guardarCliente = async () =>{
    if(nombre && apellido && telefono && cedula) {
      try {
        await addDoc(collection(db, "clientes"),{
          nombre: nombre,
          apellido: apellido,
          telefono: telefono,
          cedula: cedula
        });
        setNombre("");
        setApellido("");
        setTelefono("");
        setCedula("");
        cargarDatos("");
      }catch (error){
        console.error("Error al registrar cliente:", error);
      }
      
    }else{
      alert("Por favor, complete todos los campos")
    }
  };

  return(
    <View style={styles.container}>
      <Text style={styles.titulo}>Registro de Clientes</Text>

      <TextInput 
      style={styles.input}
      placeholder="Nombre del cliente"
      value={nombre} 
      onChangeText={setNombre}/>

      <TextInput 
      style={styles.input}
      placeholder="Apellido"
      value={apellido} 
      onChangeText={setApellido}/>

      <TextInput 
      style={styles.input}
      placeholder="Telefono"
      value={telefono} 
      onChangeText={setTelefono}/>

      <TextInput 
      style={styles.input}
      placeholder="Cedula"
      value={cedula} 
      onChangeText={setCedula}/>

      <Button title="Guardar" onPress={guardarCliente}/>
    </View>
  )
};

const styles= StyleSheet.create({
  container: {padding: 20},
  titulo:{
    fontSize: 22,
    fontWeight: "bold",
    marginBottom:10
  },
  input:{
    borderWidth: 1,
    borderColor: "#ccc",
    padding:10,
    marginBottom: 10
  },
})

export default FormularioClientes;