<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      fixed
      app
      v-if="logueado"
    >
      <v-list dense>
        <!-- Aqui agrego las opciones del menu -->
        <template v-if="esAdministrador || esAlmacenero || esVendedor">
          <v-list-tile :to="{ name: 'home'}">
            <v-list-tile-action><v-icon>home</v-icon></v-list-tile-action>
            <v-list-tile-title>Inicio</v-list-tile-title>
          </v-list-tile>
        </template>

        <!-- Opción desplegable del menú -->
        <template  v-if="esAdministrador || esAlmacenero">
          <v-list-group>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>Almacén</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <!--Botón de Categoria-->
            <v-list-tile :to="{ name: 'categorias'}">
              <v-list-tile-action><v-icon>table_chart</v-icon></v-list-tile-action>
              <v-list-tile-title>Categorías</v-list-tile-title>
            </v-list-tile>

            <!--Botón de Categoria-->
            <v-list-tile :to="{ name: 'articulos'}">
              <v-list-tile-action><v-icon>table_chart</v-icon></v-list-tile-action>
              <v-list-tile-title>Articulos</v-list-tile-title>
            </v-list-tile>
          </v-list-group>
        </template>

        <!-- Opción desplegable del menú -->
        <template  v-if="esAdministrador || esAlmacenero">
          <v-list-group>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>Compras</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <!--Botón de Categoria-->
            <v-list-tile :to="{ name: 'ingresos'}">
              <v-list-tile-action><v-icon>table_chart</v-icon></v-list-tile-action>
              <v-list-tile-title>Ingresos</v-list-tile-title>
            </v-list-tile>

            <!--Botón de Categoria-->
            <v-list-tile :to="{ name: 'proveedores'}">
              <v-list-tile-action><v-icon>table_chart</v-icon></v-list-tile-action>
              <v-list-tile-title>Proveedores</v-list-tile-title>
            </v-list-tile>
          </v-list-group>
        </template>

        <!-- Opción desplegable del menú -->
        <template  v-if="esAdministrador || esVendedor">
          <v-list-group>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>Ventas</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <!--Botón de Categoria-->
            <v-list-tile :to="{ name: 'ventas'}">
              <v-list-tile-action><v-icon>table_chart</v-icon></v-list-tile-action>
              <v-list-tile-title>Facturación</v-list-tile-title>
            </v-list-tile>

            <!--Botón de Categoria-->
            <v-list-tile :to="{ name: 'clientes'}">
              <v-list-tile-action><v-icon>table_chart</v-icon></v-list-tile-action>
              <v-list-tile-title>Clientes</v-list-tile-title>
            </v-list-tile>
          </v-list-group>
        </template>

        <!-- Opción desplegable del menú -->
        <template  v-if="esAdministrador">
          <v-list-group> 
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>Usuario</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <!--Botón de Categoria-->
            <v-list-tile :to="{ name: 'roles'}">
              <v-list-tile-action><v-icon>table_chart</v-icon></v-list-tile-action>
              <v-list-tile-title>Roles</v-list-tile-title>
            </v-list-tile>

            <!--Botón de Categoria-->
            <v-list-tile :to="{ name: 'usuarios'}">
              <v-list-tile-action><v-icon>table_chart</v-icon></v-list-tile-action>
              <v-list-tile-title>Usuarios</v-list-tile-title>
            </v-list-tile>
          </v-list-group>
        </template>

      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      color="#EB7466"
      dark
      app
      fixed
    >
      <!-- Toolbar -->
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-toolbar-side-icon color="#000000" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span class="hidden-sm-and-down black--text">Inventario APP</span>
      </v-toolbar-title>
      <!-- Espacio -->
      <v-spacer></v-spacer>
      <!-- Icono de Apps -->
      <v-btn @click="salir" v-if="logueado" color="#000000">
         <v-icon>logout</v-icon> 

      </v-btn>
      <v-btn :to="{name: 'login'}" v-else color="#000000">
        <v-icon>apps</v-icon> Login
      </v-btn>
    </v-toolbar>

    <!-- Contenedor de la pagina -->
    <v-content>
      <v-container fluid fill-height>
        <v-slide-y-transition mode="out-in">
          <router-view/>
        </v-slide-y-transition>
      </v-container>

      <!-- Pie de pagina-->
      <v-footer dark height="auto">
        <v-layout justify-center>
          <v-flex text-xs-center>
            <v-card flat tile color="primary" class="white--text">
              <v-card-text class="black--text pt-3">
                Proyecto Final Applicaciones Web &copy;2019 UPC
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-footer>

    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      drawer: null,
    }
  },
  computed: {
    //Verificandod esde el store
    logueado(){
      return this.$store.state.usuario
    },
    esAdministrador(){
      return this.$store.state.usuario && this.$store.state.usuario.rol == 'Administrador'

    },
    esAlmacenero(){
      return this.$store.state.usuario && this.$store.state.usuario.rol == 'Almacenero'
    },
    esVendedor(){
      return this.$store.state.usuario && this.$store.state.usuario.rol == 'Vendedor'
    }
  },
  created(){
    this.$store.dispatch("autoLogin");
  },
  methods:{
    salir(){
      this.$store.dispatch("salir");
    }
  }
}
</script>
