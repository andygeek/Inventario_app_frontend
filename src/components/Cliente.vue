<template>
    <!--Para alinear el contenido-->
    <v-layout align-start>
       <v-flex>
           
            <v-toolbar flat color="white">
                <v-toolbar-title>CLIENTES</v-toolbar-title>
                <v-divider
                    class="mx-2"
                    inset
                    vertical
                ></v-divider>
                <v-spacer></v-spacer>
                <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Busqueda" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo</v-btn>
                    </template>
                    <v-card>
                    <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                        <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12 sm12 md12>
                            <v-text-field v-model="nombre" label="Nombre"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md6>
                                <v-select v-model="tipo_documento" :items="documentos" label="Tipo Documento">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm6 md6>
                            <v-text-field v-model="num_documento" label="Número Documento"></v-text-field>
                            </v-flex>
                            <v-flex xs8 sm8 md8>
                            <v-text-field v-model="direccion" label="Dirección"></v-text-field>
                            </v-flex>
                            <v-flex xs4 sm4 md4>
                            <v-text-field v-model="telefono" label="Teléfono"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md12>
                            <v-text-field type="email" v-model="email" label="Email"></v-text-field>
                            </v-flex>

                            <v-flex xs12 sm12 md12 v-show="valida">
                                <!--Método para mostrar un mensaje usando un for digito por digito-->
                                <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">
                                </div>
                            </v-flex>
                        </v-layout>
                        </v-container>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat @click="close">Cancelar</v-btn>
                        <v-btn color="blue darken-1" flat @click="guardar">Guardar</v-btn>
                    </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
            <v-data-table
            :headers="headers"
            :items="clientes"
            :search="search"
            class="elevation-1"
            >
            <template v-slot:items="props">
                <td class="justify-center layout px-0">
                <v-icon
                    small
                    class="mr-2"
                    @click="editItem(props.item)"
                >
                    edit
                </v-icon>
                </td>
                <td>{{ props.item.nombre }}</td>
                <td>{{ props.item.tipo_persona }}</td>
                <td>{{ props.item.tipo_documento }}</td>
                <td>{{ props.item.num_documento }}</td>
                <td>{{ props.item.direccion }}</td>
                <td>{{ props.item.telefono }}</td>
                <td>{{ props.item.email }}</td>
            </template>
            <template v-slot:no-data>
                <v-btn color="primary" @click="listar">Actualizar</v-btn>
            </template>
            </v-data-table>

        </v-flex> 
    </v-layout>
</template>

<script>
    import axios from 'axios'
    export default {
        data(){
            return{
                clientes:[],
                dialog: false,
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'Nombre', value: 'nombre', sortable: true },
                    { text: 'Tipo Persona', value: 'tipo_persona', sortable: true },
                    { text: 'Tipo Documento', value: 'tipo_documento', sortable: true },
                    { text: 'Número Documento', value: 'num_documento', sortable: false },
                    { text: 'Dirección', value: 'direccion', sortable: false},
                    { text: 'Teléfono', value: 'telefono', sortable: false }, 
                    { text: 'Email', value: 'email', sortable: false },   
                ],
                search:'',
                editedIndex: -1,
                valida:0,
                validaMensaje:[],
                //Para crear usuarios
                id: '',
                nombre:'',
                tipo_documento:'',
                documentos:['DNI', 'RUC', 'PASAPORTE', 'CEDULA'],
                num_documento: '',
                direccion: '',
                telefono:'',
                email:'',
                //Para controlar si se va visualizar el modal
                adModal: 0,
                //Para controlar que accion usar
                adAccion:0,
                adNombre: '',
                adId: ''
                

            }
        },

        //Evaluar si se registra o se edita
        computed: {
            
            formTitle () {
            return this.editedIndex === -1 ? 'Nueva Cliente' : 'Actualizar Cliente'
            }
        },

        watch: {
            dialog (val) {
            val || this.close()
            }
        },

        created () {
            //Esta propiedad es la primera que se ejecuta al iniciar
            this.listar()
        },

        methods:{
            listar(){
                let me = this;
                axios.get('api/Personas/ListarClientes').then(function(response){
                    me.clientes = response.data
                }).catch(function(error){
                    console.log(error)
                })
            },

            editItem (item) {
                this.id = item.idpersona
                this.nombre = item.nombre
                this.tipo_documento = item.tipo_documento
                this.num_documento = item.num_documento
                this.direccion = item.direccion
                this.telefono = item.telefono
                this.email = item.email
                this.editedIndex = 1
                this.dialog = true
            },

            deleteItem (item) {
                const index = this.desserts.indexOf(item)
                confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
            },

            close () {
                this.dialog = false
                this.limpiar()
            },

            limpiar(){
                this.id=""
                this.nombre=""
                this.tipo_documento=""
                this.num_documento=""
                this.direccion=""
                this.telefono=""
                this.email=""
                this.editedIndex=-1
            },

            guardar () {
                if(this.validar()){
                    return;
                }
                if (this.editedIndex > -1) {
                    //Para editar
                    let me = this

                    
                    if(me.password!=me.passwordAnt){
                        me.actPassword = true
                    }

                    axios.put('api/Personas/Actualizar',{
                        'idpersona':me.id,
                        'tipo_persona':'Cliente',
                        'nombre':me.nombre,
                        'tipo_documento':me.tipo_documento,
                        'num_documento':me.num_documento,
                        'direccion':me.direccion,
                        'telefono':me.telefono,
                        'email':me.email,
                    }).then(function(response){
                        me.close()
                        me.listar()
                        me.limpiar()
                    }).catch(function(error){
                        console.log(error)
                    })
                } else {
                    //Para guardar
                    let me = this

                    axios.post('api/Personas/Crear',{
                        'tipo_persona':'Cliente',
                        'nombre':me.nombre,
                        'tipo_documento':me.tipo_documento,
                        'num_documento':me.num_documento,
                        'direccion':me.direccion,
                        'telefono':me.telefono,
                        'email':me.email,
                    }).then(function(response){
                        me.close()
                        me.listar()
                        me.limpiar()
                    }).catch(function(error){
                        console.log(error)
                    })
                }
                this.close()
            },
            validar(){
                this.valida=0
                this.validaMensaje=[]
                if(this.nombre.length < 3 || this.nombre.length > 100){
                    this.validaMensaje.push("El nombre debe tener mas de 3 caracteres y menos de 100 caracteres.")
                }
                if(!this.tipo_documento){
                    this.validaMensaje.push("Debe seleccionar un documento.")
                }
                if(this.validaMensaje.length){
                    this.valida=1
                }
                return this.valida
            }
        }        
    }
</script>