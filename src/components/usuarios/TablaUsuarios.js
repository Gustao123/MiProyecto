import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import BotonEliminacionUsuarios from "./BotonEliminacionUsuario";





const TablaUsuarios = ({ usuarios, eliminarUsuario, editarUsuario }) =>   {

  
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tabla de Usuario</Text>

      <View style={[styles.fila, styles.encabezado]}>
        <Text style={[styles.celda, styles.textoEncabezado]}>Nombre</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Correo</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Telefono</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Edad</Text>
        <Text style={[styles.celdaAcciones, styles.textoEncabezado]}>Acciones</Text>
      </View>

      <ScrollView>
        {usuarios.map((item) =>(
          <View key={item.id} style={styles.fila}>
              <Text style={styles.celda}>{item.nombre}</Text>
              <Text style={styles.celda}>{item.correo}</Text>
              <Text style={styles.celda}>{item.telefono}</Text>
              <Text style={styles.celda}>{item.edad}</Text>

              <View style={[styles.celdaAcciones]}>

                <TouchableOpacity 
                    style={styles.botonActualizar}
                    onPress={()=> editarUsuario(item)}
                    >
                      <Text>🪄</Text>
                    </TouchableOpacity>
                  <BotonEliminacionUsuarios id={item.id} eliminarUsuario={eliminarUsuario}/>
              </View>

          </View>
        ))}
      </ScrollView>

    </View>
  )
};



const styles = StyleSheet.create({
  container:{
    flex:1,
    padding: 20,
    alignSelf: "stretch"
  },
  titulo:{
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
  },
  fila:{
    flexDirection:"row",
    borderBottomWidth: 1,
    borderColor:"#ccc",
    paddingVertical:6,
    alignItems:"center"
  },
  encabezado:{
    backgroundColor:"#f0f0f0",

  },
  celda:{
    flex:1,
    fontSize:16,
    textAlign:"center"
  },
  celdaAcciones:{
    flex:1,
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    gap:8
  },

  botonActualizar:{
    padding:4,
    borderRadius:5,
    alignItems:"center",
    justifyContent:"center",
    alignSelf: "center",
    backgroundColor: "#f3f3f7"

  },

  textoEncabezado:{
    fontWeight: "bold",
    fontSize:17,
    textAlign:"center"
  },
});


export default TablaUsuarios;