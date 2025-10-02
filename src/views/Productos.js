import React, { useEffect, useState } from "react";
import {View, StyleSheet} from "react-native";
import { db } from "../database/firebaseconfig";
import { collection, doc,deleteDoc, getDocs } from "firebase/firestore";
import ListaProductos from "../components/productos/ListaProductos";
import FormularioProductos from "../components/productos/FormularioProductos";
import TablaProductos from "../components/productos/TablaProductos";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const Productos = () =>{

const eliminarProducto = async (id)=>{
      try{
        await deleteDoc(doc(db, "productos", id));
        cargarDatos();
      }catch (error){
        console.error("Error al eliminar", error)
      }
    }
  
  const [productos, setProductos] = useState([]);

  const cargarDatos = async () =>{
    try{
      const querySnapshot = await getDocs(collection(db, "productos"));
      const data = querySnapshot.docs.map((doc) =>({
        id:doc.id,
        ...doc.data(),
      }));
      setProductos(data);
    }catch (error){
      console.error("Error al obtener documentos", error);
    }
  };

  useEffect(() =>{
    cargarDatos();
  },[]);

  return(
    <View style={styles.container}>
      <FormularioProductos cargarDatos={cargarDatos}/>

      <TablaProductos 
      productos={productos}
      eliminarProducto={eliminarProducto}/>
    </View>
  );
};

const styles= StyleSheet.create({
  container:{
    flex:1,
    padding:20
  }
})

export default Productos