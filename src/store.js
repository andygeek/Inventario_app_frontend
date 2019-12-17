import Vue from 'vue'
import Vuex from 'vuex'
import decode from 'jwt-decode'
import router from './router'

Vue.use(Vuex)

//Aqui se muestra el estado de nuestrav aplicacion
//Nuestros componentes emitiran acciones que modifiquen este estado
export default new Vuex.Store({
  state: {
    token: null,
    usuario: null
  },
  //logica para cambiar de estado
  //Mediante estas acciones se van a cambiar de estado
  mutations: {
    setToken(state, token){
      state.token = token
    },
    setUsuario(state, usuario){
      state.usuario = usuario
    }
  },
  //Las acciones no cambian de estado si no más bien realizan las mutaciones
  actions: {
    //Los comits nos permiten realizar mutaciones o acceder al state
    guardarToken({commit}, token){
      //para guardar el token cuando sea enviado por el backend
      commit("setToken", token)
      commit("setUsuario", decode(token))
      localStorage.setItem("token", token)
    },
    autoLogin({commit}){
      //Verifica si el usuario ya inicio sus credenciales correctas
      let token = localStorage.getItem("token")
      if(token){
        commit("setToken", token)
        commit("setUsuario", decode(token))
      }
      router.push({name: 'home'})

    },
    salir({commit}){
      //Eliminar el token registrado
      commit("setToken", null)
      commit("setUsuario", null)
      localStorage.removeItem("token")
      router.push({name: 'login'})
    }
  }
})
