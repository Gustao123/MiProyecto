import React, { useEffect, useState } from "react";
import {View, StyleSheet} from "react-native";
import { db } from "../database/firebaseconfig";
import { collection, doc, getDocs, deleteDoc, updateDoc } from "firebase/firestore";
import FormularioClientes from "../components/clientes/FormularioClientes";
import TablaClientes from "../components/clientes/TablaClientes";
import TituloPromedio from "../components/clientes/TituloPromedio";

import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing"
import * as Clipboard from "expo-clipboard";


const Clientes = () =>{

  const calcularPromedioAPI = async (lista) => {
  try {
    const response = await fetch("https://g6tek5o9xf.execute-api.us-east-2.amazonaws.com/promedio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ edades: lista }),
    });

    const data = await response.json();
    setPromedio(data.promedio || null);
  } catch (error) {
    console.error("Error al calcular promedio en API:", error);
  }
};

const [clientes, setClientes] = useState([]);

  const [nuevoCliente, setNuevoCliente]= useState({
    nombre:"",
    apellido:"",
    edad:"",
  });

  const [modoEdicion, setModoEdicion]= useState(false);
    const [clienteId, setClienteId]=useState(null);

    const manejoCambio=(nombre, valor)=>{
    setNuevoCliente((prev)=>({
      ...prev,
      [nombre]:valor,
    }))
  };


  const guardarCliente = async ()=>{
      try{
        if(nuevoCliente.nombre && nuevoCliente.apellido && nuevoCliente.edad){
          await addDoc(collection(db,"clientes"),{
            nombre: nuevoCliente.nombre,
            apellido: nuevoCliente.apellido,
            edad: nuevoCliente.edad,
          });
          cargarDatos();
  
          setNuevoCliente({ nombre:"", apellido:"", edad:""});
        }else{
          alert("Por favor, complete todos los campos");
        }
      }catch (error){
        console.error("Error al registrar cliente:", error)
      }
    };


    const cargarDatosFirestore = async (nombreColeccion) => {
      if (typeof nombreColeccion !== 'string') {
        console.error("Error: Se requiere un nombre de colección válido.");
        return;
      }
    
      try {
        const datosExportados = {};
        // Obtener la referencia a la colección específica
        const snapshot = await getDocs(collection(db, nombreColeccion));
        // Mapear los documentos y agregarlos al objeto de resultados
        datosExportados[nombreColeccion] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
    
        return datosExportados;
      } catch (error) {
        console.error(`Error extrayendo datos de la colección "${nombreColeccion}": `, error);
      }
    };
    
    const exportDatos = async () => {
      try {
        const datos = await cargarDatosFirestore("productos");
        console.log("Datos cargados:", datos);
        // Formatea los datos para el archivo y el portapapeles
        const jsonString = JSON.stringify(datos, null, 2);
        const baseFileName = "datos_firebase.txt";
        // Copiar datos al portapapeles (JsonString):
        await Clipboard.setStringAsync(jsonString);
        console.log("Datos copiados al portapapeles.");
        // Verificar si la función compartir está disponible en tu dispositivo
        if (!await Sharing.isAvailableAsync()) {
          return;
        }
        // Guardar archivo temporalmente
        const fileUri = FileSystem.cacheDirectory + baseFileName;
        await FileSystem.writeAsStringAsync(fileUri, jsonString);
        await Sharing.shareAsync(fileUri, {
          mimeType: "text/plain",
          dialogTitle: "Compartir datos de Firebase (JSON)"
        });
        alert("Datos copiados al portapapeles y listos para compartir.");
      } catch (error) {
        console.error("Error al exportar y compartir:", error);
        alert("Error al exportar y compartir: " + error.message);
      }
    };


    const actualizarCliente = async () =>{
        try{
          if(nuevoCliente.nombre && nuevoCliente.apellido && nuevoCliente.edad){
            await updateDoc(doc(db, "clientes", clienteId),{
              nombre: nuevoCliente.nombre,
              apellido: nuevoCliente.apellido,
              edad: nuevoCliente.edad
            });
    
            setNuevoCliente({nombre:"", apellido:"", edad:""});
            setModoEdicion(false);
            setClienteId(null);
    
            cargarDatos();
          }else{
            alert("Por favor, complete todos los campos");
          }
        }catch (error){
          console.error("Error al actualizar cliente:", error)
        }
      }

      const editarCliente = (cliente)=>{
    setNuevoCliente({
      nombre: cliente.nombre,
      apellido:cliente.apellido,
      edad:cliente.edad.toString(),
    });
    setClienteId(cliente.id);
    setModoEdicion(true);
  }


  const eliminarCliente = async (id)=>{
      try{
        await deleteDoc(doc(db, "clientes", id));
        cargarDatos();
      }catch (error){
        console.error("Error al eliminar", error)
      }
    }
  
  const [promedio, setPromedio] = useState(null);


  const cargarDatos = async () =>{
    try{
      const querySnapshot = await getDocs(collection(db, "clientes"));
      const data = querySnapshot.docs.map((doc) =>({
        id:doc.id,
        ...doc.data(),
      }));
      setClientes(data);

      if(data.length > 0){
        calcularPromedioAPI(data);
      }else{
        setClientes(null)
      }
    }catch (error){
      console.error("Error al obtener documentos", error);
    }
  };

  useEffect(() =>{
    cargarDatos();
  },[]);

  return(
    <View style={styles.container}>
      <FormularioClientes 
      nuevoCliente={nuevoCliente}
      manejoCambio={manejoCambio}
      guardarCliente={guardarCliente}
      actualizarCliente={actualizarCliente}
      modoEdicion={modoEdicion}
      
      
      />
      

      <TablaClientes
      clientes={clientes}
      editarCliente={editarCliente}
      eliminarCliente={eliminarCliente}
      
      />
      <TituloPromedio 
      promedio={promedio} />

      <View style={{ marginVertical: 10 }}>
        <Button title="Exportar" onPress={exportDatos} />
      </View>
      
      
    </View>
  );
};

const styles= StyleSheet.create({
  container:{
    flex:1,
    padding:20
  }
})

export default Clientes;