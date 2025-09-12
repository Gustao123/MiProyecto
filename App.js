import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { db } from './src/database/firebaseconfig';
import { collection, getDocs } from 'firebase/firestore';


export default function App() {

  const [productos, setProductos]= useState([]);
  const [clientes, setClientes]=useState([]);

    useEffect(()=>{
    fetchDataClient();
    fetchDataProduct();
  }, []);

  const fetchDataClient = async () =>{
      try{
        const querySnapshot = await getDocs(collection(db, "clientes"));
        const data = querySnapshot.docs.map(doc =>({
          id: doc.id,
          ...doc.data(),
        }));
          
        setClientes(data);
      }catch (error) {
        console.error("Error al obtener documentos:", error);
      }
    };


  const fetchDataProduct = async () =>{
      try{
        const querySnapshot = await getDocs(collection(db, "productos"));
        const data = querySnapshot.docs.map(doc =>({
          id: doc.id,
          ...doc.data(),
        }));

        const productosConSubcoleccion = await Promise.all(data.map(async (item) =>{
          const SubcoleccionSnapshot = await getDocs(collection(db,"productos", item.id, "sabores")).catch(()=>[]);
          const SubcoleccionData = SubcoleccionSnapshot.docs.map(subDoc =>({
            id: subDoc.id,
            ...subDoc.data(),
            parentId: item.id,
          }));
          return SubcoleccionData.length > 0 ? { ...item, sabores: SubcoleccionData }: item;
        }))

        setProductos(productosConSubcoleccion);
      }catch (error) {
        console.error("Error al obtener documentos:", error);
      }
    };


  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de productos</Text>
      <FlatList 
      data={productos}
      keyExtractor={(item)=> item.id}
      renderItem={({ item }) => (

        <View>
        <Text style={styles.item}>
          {item.nombre} - ${item.precio}
        </Text>
        {item.sabores && item.sabores.length > 0 && (
          <FlatList
          data={item.sabores}
          keyExtractor={(subitem)=> subitem.id}
          renderItem={({item: subitem})=>(
            <Text style={(styles.item, {marginLeft:20})}>
              sabor:{subitem.sabor}
            </Text>
          )}
          />
        )}
        </View>
        )}
      />
    
      <Text style={styles.titulo}>Lista de Clientes</Text>
      <FlatList 
      data={clientes}
      keyExtractor={(item)=> item.id}
      renderItem={({ item }) => (
        <Text style={styles.item}>
          {item.nombre} {item.apellido} {item.telefono} {item.direccion}
        </Text>
          
        
        )}
      />
    
    </View>

    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.2,
    padding: 30,
    justifyContent: 'center',
  },

  titulo:{
    fontSize:22,
    fontWeight:'bold',
    marginBottom: 10
  },
  item:{
    fontSize: 18,
    marginBottom:5
  },

  
});
