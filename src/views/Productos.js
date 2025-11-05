import React, { useEffect, useState } from "react";
import { View, StyleSheet, Button } from "react-native";
import { db } from "../database/firebaseconfig.js";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc, query, where, orderBy, limit } from "firebase/firestore";
import FormularioProductos from "../components/productos/FormularioProductos.js";
import TablaProductos from "../components/productos/TablaProductos.js";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing"
import * as Clipboard from "expo-clipboard";

const Productos = ({cerrarSesion}) => {

  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoId, setProductoId] = useState(null);

  const [productos, setProductos] = useState([]);

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    precio: "",
  });


    const colecciones = ["productos", "clientes", "ciudades"];

  const manejoCambio = (nombre, valor) => {
    setNuevoProducto((prev) => ({
      ...prev,
      [nombre]: valor,
    }));
  };

  const guardarProducto = async () => {
    try {
      if (nuevoProducto.nombre && nuevoProducto.precio) {
        await addDoc(collection(db, "productos"), {
          nombre: nuevoProducto.nombre,
          precio: parseFloat(nuevoProducto.precio),
        });
        cargarDatos(); // Recargar lista
        setNuevoProducto({ nombre: "", precio: "" });
      } else {
        alert("Por favor, complete todos los campos.");
      }
    } catch (error) {
      console.error("Error al registrar producto:", error);
    }
  };

  const cargarDatosFirebaseCompletos = async () => {
  try {
    const datosExportados = {};
      for (const col of colecciones) {
      const snapshot = await getDocs(collection(db, col));
      datosExportados[col] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
  }));
  }
    return datosExportados;
  }   catch (error) {
    console.error("Error extrayendo datos: ", error);
    }
  };


  const actualizarProducto = async () => {
    try {
      if (nuevoProducto.nombre && nuevoProducto.precio) {
        await updateDoc(doc(db, "productos", productoId), {
          nombre: nuevoProducto.nombre,
          precio: parseFloat(nuevoProducto.precio),
        });
        setNuevoProducto({ nombre: "", precio: "" });
        setModoEdicion(false); // Volver al modo registro
        setProductoId(null);
        cargarDatos(); // Recargar lista
      } else {
        alert("Por favor, complete todos los campos.");
      }
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  };

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "productos"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener documentos:", error);
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
    const datos = await cargarDatosFirebaseCompletos();
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

  const eliminarProducto = async (id) => {
    try {
      await deleteDoc(doc(db, "productos", id));
      cargarDatos(); // Recargar lista
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const editarProducto = (producto) => {
    setNuevoProducto({
      nombre: producto.nombre,
      precio: producto.precio.toString(),
    });
    setProductoId(producto.id);
    setModoEdicion(true);
  };


  const pruebaConsulta1 = async ()=>{
    try{
      const q = query(
        collection(db, "ciudades"),
        where("pais", "==", "Guatemala"),
        orderBy("poblacion", "desc"),
        limit(2)
      );
      const snapshot = await getDocs(q);
      console.log("------- Consulta 1 --------")
      snapshot.forEach((doc)=>{
        const data = doc.data();
        console.log (`ID: ${doc.id}, Nombre:${data.nombre}, Poblacion: ${data.poblacion}, Pais: ${data.pais}, Region: ${data.region}`)
      });
    }catch (error){
      console.error("Error al cargar las ciudades")
    }
  } 

  const consultaHonduras = async ()=>{
    try{
      const q = query(
        collection(db, "ciudades"),
        where("pais", "==", "Honduras"),
        where("poblacion", ">", 700),
        orderBy("nombre", "asc"),
        limit(3)
      );
      const snapshot = await getDocs(q);
      console.log("------- Consulta 2 --------")
      snapshot.forEach((doc)=>{
        const data = doc.data();
        console.log (`ID: ${doc.id}, Nombre:${data.nombre}, Población: ${data.poblacion}, País: ${data.pais}, Región: ${data.region}`)
      });
    }catch (error){
      console.error("Error al cargar las ciudades:", error)
    }
  };

  const consultaSalvadoreña = async ()=>{
    try{
      const q = query(
        collection(db, "ciudades"),
        where("pais", "==", "El Salvador"),
        orderBy("poblacion", "desc"),
        limit(2)
      );
      const snapshot = await getDocs(q);
      console.log("------- Consulta 3 --------")
      snapshot.forEach((doc)=>{
        const data = doc.data();
        console.log (`ID: ${doc.id}, Nombre:${data.nombre}, Poblacion: ${data.poblacion}, Pais: ${data.pais}, Region: ${data.region}`)
      });
    }catch (error){
      console.error("Error al cargar las ciudades", error)
    }
  };

  const consultaCentroamerica = async ()=>{
    try{
      const q = query(
        collection(db, "ciudades"),
        where("region", "==", "América Central"),
        where("poblacion", "<=", 300),
        orderBy("pais", "desc"),
        limit(4)
      );
      const snapshot = await getDocs(q);
      console.log("------- Consulta 4 --------")
      snapshot.forEach((doc)=>{
        const data = doc.data();
        console.log (`ID: ${doc.id}, Nombre:${data.nombre}, Población: ${data.poblacion}, País: ${data.pais}, Región: ${data.region}`)
      });
    }catch (error){
      console.error("Error al cargar las ciudades:", error)
    }
  };

  const consultaPoblacionGrande = async ()=>{
    try{
      const q = query(
        collection(db, "ciudades"),
        where("poblacion", ">", 900),
        orderBy("nombre", "asc"),
        limit(3)
      );
      const snapshot = await getDocs(q);
      console.log("------- Consulta 5 --------")
      snapshot.forEach((doc)=>{
        const data = doc.data();
        console.log (`ID: ${doc.id}, Nombre:${data.nombre}, Población: ${data.poblacion}, País: ${data.pais}, Región: ${data.region}`)
      });
    }catch (error){
      console.error("Error al cargar las ciudades:", error)
    }
  };

  const consultaGuatemala = async ()=>{
    try{
      const q = query(
        collection(db, "ciudades"),
        where("pais", "==", "Guatemala"),
        orderBy("poblacion", "desc"),
        limit(5)
      );
      const snapshot = await getDocs(q);
      console.log("------- Ciudades de Guatemala --------")
      snapshot.forEach((doc)=>{
        const data = doc.data();
        console.log (`ID: ${doc.id}, Nombre:${data.nombre}, Población: ${data.poblacion}, País: ${data.pais}, Región: ${data.region}`)
      });
    }catch (error){
      console.error("Error al cargar las ciudades:", error)
    }
  };

  const consultaPoblacionMedia = async ()=>{
    try{
      const q = query(
        collection(db, "ciudades"),
        where("poblacion", ">=", 200),
        where("poblacion", "<=", 600),
        orderBy("pais", "asc"),
        limit(5)
      );
      const snapshot = await getDocs(q);
      console.log("------- Ciudades con población entre 200k y 600k --------")
      snapshot.forEach((doc)=>{
        const data = doc.data();
        console.log (`ID: ${doc.id}, Nombre:${data.nombre}, Población: ${data.poblacion}, País: ${data.pais}, Región: ${data.region}`)
      });
    }catch (error){
      console.error("Error al cargar las ciudades:", error)
    }
  };

  const consultaTopPoblacion = async ()=>{
    try{
      const q = query(
        collection(db, "ciudades"),
        orderBy("poblacion", "desc"),
        limit(5)
      );
      const snapshot = await getDocs(q);
      console.log("------- Top 5 ciudades por población --------")
      snapshot.forEach((doc)=>{
        const data = doc.data();
        console.log (`ID: ${doc.id}, Nombre:${data.nombre}, Población: ${data.poblacion}, País: ${data.pais}, Región: ${data.region}`)
      });
    }catch (error){
      console.error("Error al cargar las ciudades:", error)
    }
  };

  useEffect(() => {
    cargarDatos();
    pruebaConsulta1();
    consultaHonduras();
    consultaSalvadoreña();
    consultaCentroamerica();
    consultaPoblacionGrande();
    consultaGuatemala();
    consultaPoblacionMedia();
    consultaTopPoblacion();
  }, []);


  

  return (
    <View style={styles.container}>

      

      <FormularioProductos
        nuevoProducto={nuevoProducto}
        manejoCambio={manejoCambio}
        guardarProducto={guardarProducto}
        actualizarProducto={actualizarProducto}
        modoEdicion={modoEdicion}
      />
      
      <TablaProductos 
        productos={productos}
        editarProducto={editarProducto} 
        eliminarProducto={eliminarProducto}
      />

      <View style={{ marginVertical: 10 }}>
        <Button title="Exportar" onPress={exportDatos} />
      </View>

      <View style={{ marginVertical: 10 }}>
        <Button title="Exportar todo" onPress={exportDatos} />
      </View>

      

      <Button title="Cerrar Sesión" onPress={cerrarSesion} />
      
    </View>

  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});

export default Productos;