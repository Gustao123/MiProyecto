import React, { useEffect, useState } from "react";
import {View, StyleSheet, Button} from "react-native";
import { db } from "../database/firebaseconfig";
import { collection, doc,deleteDoc, getDocs, addDoc, updateDoc } from "firebase/firestore";
import FormularioProductos from "../components/productos/FormularioProductos";
import TablaProductos from "../components/productos/TablaProductos";
import { signOut } from "firebase/auth";
import { auth } from "../database/firebaseconfig";


const Productos = () =>{

  const cerrarSesion = async () => {
  try {
    await signOut(auth);
    console.log("Sesión cerrada correctamente");
    // Aquí puedes redirigir o limpiar el estado
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};

const eliminarProducto = async (id)=>{
      try{
        await deleteDoc(doc(db, "productos", id));
        cargarDatos();
      }catch (error){
        console.error("Error al eliminar", error)
      }
    }
  
  const [productos, setProductos] = useState([]);

  const [nuevoProducto, setNuevoProducto]= useState({
    nombre:"",
    precio:"",
  });

  const [modoEdicion, setModoEdicion]= useState(false);
  const [productoId, setProductoId]=useState(null);

  const manejoCambio=(nombre, valor)=>{
    setNuevoProducto((prev)=>({
      ...prev,
      [nombre]:valor,
    }))
  };

  const guardarProducto = async ()=>{
    try{
      if(nuevoProducto.nombre && nuevoProducto.precio){
        await addDoc(collection(db,"productos"),{
          nombre: nuevoProducto.nombre,
          precio: parseFloat(nuevoProducto.precio),
        });
        cargarDatos();

        setNuevoProducto({ nombre:"", precio:""});
      }else{
        alert("Por favor, complete todos los campos");
      }
    }catch (error){
      console.error("Error al registrar productos:", error)
    }
  };

  const actualizarProducto = async () =>{
    try{
      if(nuevoProducto.nombre && nuevoProducto.precio){
        await updateDoc(doc(db, "productos", productoId),{
          nombre: nuevoProducto.nombre,
          precio: parseFloat(nuevoProducto.precio),
        });

        setNuevoProducto({nombre:"", precio:""});
        setModoEdicion(false);
        setProductoId(null);

        cargarDatos();
      }else{
        alert("Por favor, complete todos los campos");
      }
    }catch (error){
      console.error("Error al actualizar producto:", error)
    }
  }

  const editarProducto = (producto)=>{
    setNuevoProducto({
      nombre: producto.nombre,
      precio:producto.precio.toString(),
    });
    setProductoId(producto.id);
    setModoEdicion(true);
  }

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

      
      <FormularioProductos 
      nuevoProducto={nuevoProducto}
      manejoCambio={manejoCambio}
      guardarProducto={guardarProducto}
      actualizarProducto={actualizarProducto}
      modoEdicion={modoEdicion}
      cerrarSesion={cerrarSesion}
      />

      <TablaProductos 
      productos={productos}
      editarProducto={editarProducto}
      eliminarProducto={eliminarProducto}/>

      <Button title="Cerrar Sesión" onPress={cerrarSesion} />

      
    </View>
  );
};

const styles= StyleSheet.create({
  container:{
    flex:1,
    padding:20
  }
})

export default Productos;