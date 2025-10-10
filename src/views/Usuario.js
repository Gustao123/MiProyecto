import React, { useEffect, useState } from "react";
import {View, StyleSheet, Alert} from "react-native";
import { db } from "../database/firebaseconfig";
import { collection, doc, getDocs, deleteDoc, updateDoc, addDoc } from "firebase/firestore";
import FormularioUsuarios from "../components/usuarios/FormularioUsuarios";
import TablaUsuarios from "../components/usuarios/TablaUsuarios";



const Usuarios = () =>{

const validarDatos = async (datos)=> {
  try{
    const response = await fetch("https://c48ncklfog.execute-api.us-east-2.amazonaws.com/validaciones", {
      method: "POST", 
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(datos),
    });
    const resultado = await response.json();

    if (resultado.success){
      return resultado.data;
    }else{
      Alert.alert("Errores en los datos", resultado.errors.join("\n"));
      return null;
    }
  }catch (error){
    console.error("Error al validar con Lambda:", error)
    Alert.alert("Error", "No se pudo validar la informacion con el servidor.");
    return null;
  }
};


  

const [usuarios, setUsuarios] = useState([]);

  const [nuevoUsuario, setNuevoUsuario]= useState({
    nombre:"",
    correo:"",
    telefono:"",
    edad:"",
  });

  const [modoEdicion, setModoEdicion]= useState(false);
    const [usuarioId, setUsuarioId]=useState(null);

    const manejoCambio=(nombre, valor)=>{
    setNuevoUsuario((prev)=>({
      ...prev,
      [nombre]:valor,
    }))
  };

   const guardarUsuario = async () => {
    const datosValidados = await validarDatos(nuevoUsuario);
        if(datosValidados){
        try {
          await addDoc(collection(db, "usuarios"),{
              nombre: datosValidados.nombre,
              correo: datosValidados.correo,
              telefono: datosValidados.telefono,
              edad: parseInt(datosValidados.edad),
          });
          cargarDatos();
          setNuevoUsuario({ nombre:"", correo:"", telefono:"", edad:""});
          Alert.alert("Exito", "Usuario registrado correctamente.")
        }catch (error){
          console.error("Error al registrar usuario", error)
        }
      }
    };

 


    const actualizarUsuario = async () =>{
        const datosValidados = await validarDatos(nuevoUsuario);
        if (datosValidados) {
          try{
            await updateDoc(doc(db, "usuarios", usuarioId),{
              nombre: datosValidados.nombre,
              correo: datosValidados.correo,
              telefono: datosValidados.telefono,
              edad: parseInt(datosValidados.edad),
            });
            setNuevoUsuario({nombre:"", correo:"", telefono:"", edad:""});
            setModoEdicion(false);
            setUsuarioId(null);
            cargarDatos();
            Alert.alert("Exito", "Usuario actualizado correctamente.");
          }catch (error){
            console.error("Error al actualizar usuario", error);
          }
        }
      };

      const editarUsuario= (usuario)=>{
    setNuevoUsuario({
      nombre: usuario.nombre,
      correo:usuario.correo,
      telefono: usuario.telefono,
      edad:usuario.edad.toString(),
    });
    setUsuarioId(usuario.id);
    setModoEdicion(true);
  }


  const eliminarUsuario = async (id)=>{
      try{
        await deleteDoc(doc(db, "usuarios", id));
        cargarDatos();
      }catch (error){
        console.error("Error al eliminar", error)
      }
    }
  



  const cargarDatos = async () =>{
    try{
      const querySnapshot = await getDocs(collection(db, "usuarios"));
      const data = querySnapshot.docs.map((doc) =>({
        id:doc.id,
        ...doc.data(),
      }));
      setUsuarios(data);

    
    }catch (error){
      console.error("Error al obtener documentos", error);
    }
  };

  useEffect(() =>{
    cargarDatos();
  },[]);


  return(
    <View style={styles.container}>
      <FormularioUsuarios
      nuevoUsuario={nuevoUsuario}
      manejoCambio={manejoCambio}
      guardarUsuario={guardarUsuario}
      actualizarUsuario={actualizarUsuario}
      modoEdicion={modoEdicion}
      
      
      />
      

      <TablaUsuarios
      usuarios={usuarios}
      editarUsuario={editarUsuario}
      eliminarUsuario={eliminarUsuario}
      
      />
      
    </View>
  );
};



const styles= StyleSheet.create({
  container:{
    flex:1,
    padding:20
  }
})


export default Usuarios;