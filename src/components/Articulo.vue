<template>
    <!--Para alinear el contenido-->
    <v-layout align-start>
       <v-flex>
            <v-toolbar flat color="white">
                <v-btn @click="crearPDF"><v-icon>print</v-icon></v-btn>
                <v-toolbar-title>ARTICULOS</v-toolbar-title>
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
                            <v-flex xs6 sm6 md6>
                            <v-text-field v-model="codigo" label="Código"></v-text-field>
                            </v-flex>
                            <v-flex xs6 sm6 md6>
                                <v-select v-model="idcategoria" :items="categorias" label="Categoría">
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md12>
                            <v-text-field v-model="nombre" label="Nombre"></v-text-field>
                            </v-flex>
                            <v-flex xs6 sm6 md6>
                            <v-text-field type="number" v-model="stock" label="Stock"></v-text-field>
                            </v-flex>
                            <v-flex xs6 sm6 md6>
                            <v-text-field type="number" v-model="precio_venta" label="Precio Venta"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md12>
                            <v-text-field v-model="descripcion" label="Descripción"></v-text-field>
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
                <v-dialog v-model="adModal" max-width="290">
                    <v-card>
                        <v-card-title class="headline" v-if="adAccion==1">¿Activar Item?</v-card-title>
                        <v-card-title class="headline" v-if="adAccion==2">¿Desactivar Item?</v-card-title>
                        <v-card-text>
                            Estas a punto de
                            <span v-if="adAccion==1">Activar</span>
                            <span v-if="adAccion==2">Desactivar</span>
                            el item {{ adNombre }}
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="green darken-1" flat="flat" @click="activarDesactivarCerrar">
                                Cancelar
                            </v-btn>
                            <v-btn v-if="adAccion==1" color="orange darken-1" flat="flat" @click="activar()">
                                Activar
                            </v-btn>
                            <v-btn v-if="adAccion==2" color="orange darken-1" flat="flat" @click="desactivar()">
                                Desactivar
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
            <v-data-table
            :headers="headers"
            :items="articulos"
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
                <template v-if="props.item.condicion">
                    <v-icon
                        small
                        @click="activarDesactivarMostrar(2, props.item)"
                    >
                        block
                    </v-icon>
                </template>
                <template v-else>
                    <v-icon
                        small
                        @click="activarDesactivarMostrar(1, props.item)"
                    >
                        check
                    </v-icon>
                </template>
                </td>
                <td>{{ props.item.codigo }}</td>
                <td>{{ props.item.nombre }}</td>
                <td>{{ props.item.categoria }}</td>
                <td>{{ props.item.stock }}</td>
                <td>{{ props.item.precio_venta }}</td>
                <td>{{ props.item.descripcion }}</td>
                <td>
                    <div v-if="props.item.condicion">
                        <span class="blue--text">Activo</span>
                    </div>
                    <div v-else>
                        <span class="red--text">Inactivo</span>
                    </div>
                </td>
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
    import jsPDF from 'jspdf'
    import autoTable from 'jspdf-autotable'
    export default {
        data(){
            return{
                articulos:[],
                dialog: false,
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'Código', value: 'codigo', sortable: false },
                    { text: 'Nombre', value: 'nombre', sortable: true },
                    { text: 'Categoria', value: 'categoria', sortable: true },
                    { text: 'Stock', value: 'stock', sortable: true },
                    { text: 'Precio Venta', value: 'precio_venta', sortable: false },
                    { text: 'Descripción', value: 'descripcion', sortable: false},
                    { text: 'Estado', value: 'condicion', sortable: false },  
                ],
                search:'',
                editedIndex: -1,
                //Para crear articulo
                id: '',
                idcategoria:'',
                categorias:[],
                codigo:'',
                nombre: '',
                descripcion: '',
                stock:0,
                precio_venta:0,
                valida:0,
                validaMensaje:[],
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
            return this.editedIndex === -1 ? 'Nueva Articulo' : 'Actualizar Articulo'
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
            this.select()
        },

        methods:{
            crearPDF(){
                var columns = [
                    {title: "Código", dataKey: "codigo"}, 
                    {title: "Nombre", dataKey: "nombre"},
                    {title: "Categoría", dataKey: "categoria"}, 
                    {title: "Stock", dataKey: "stock"},
                    {title: "Precio Venta", dataKey: "precio_venta"}
                ];
                var rows = [];

                this.articulos.map(function(x){
                    rows.push({codigo:x.codigo,nombre:x.nombre,categoria:x.categoria,stock:x.stock,precio_venta:x.precio_venta});
                });

                // Only pt supported (not mm or in)
                var doc = new jsPDF('p', 'pt');
                doc.autoTable(columns, rows, {
                    margin: {top: 60},
                    addPageContent: function(data) {
                        doc.text("Listado de Artículos", 40, 30);
                    }
                });
                doc.save('Articulos.pdf');
            },
            listar(){
                let me = this;
                axios.get('api/Articulos/Listar').then(function(response){
                    me.articulos = response.data
                }).catch(function(error){
                    console.log(error)
                })
            },
            select(){
                let me = this;
                var categoriasArray = []
                axios.get('api/Categorias/Select').then(function(response){
                    categoriasArray=response.data
                    categoriasArray.map(function(x){
                        me.categorias.push({text: x.nombre, value:x.idcategoria})
                    })
                }).catch(function(error){
                    console.log(error)
                })
            },

            editItem (item) {
                this.id = item.idarticulo
                this.idcategoria=item.idcategoria
                this.codigo=item.codigo
                this.nombre = item.nombre
                this.stock = item.stock
                this.precio_venta=item.precio_venta
                this.descripcion = item.descripcion
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
                this.idcategoria=""
                this.codigo=""
                this.nombre=""
                this.stock=""
                this.precio_venta=""
                this.descripcion=""
                this.editedIndex=-1
            },

            guardar () {
                if(this.validar()){
                    return;
                }
                if (this.editedIndex > -1) {
                    //Para editar
                    let me = this
                    axios.put('api/Articulos/Actualizar',{
                        'idarticulo':me.id,
                        'idcategoria':me.idcategoria,
                        'codigo':me.codigo,
                        'nombre':me.nombre,
                        'stock':me.stock,
                        'precio_venta':me.precio_venta,
                        'descripcion':me.descripcion
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
                    axios.post('api/Articulos/Crear',{
                        'idcategoria':me.idcategoria,
                        'codigo':me.codigo,
                        'nombre':me.nombre,
                        'stock':me.stock,
                        'precio_venta':me.precio_venta,
                        'descripcion':me.descripcion
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
                if(this.nombre.length < 3 || this.nombre.length > 50){
                    this.validaMensaje.push("El nombre debe tener mas de 3 caracteres y menos de 50 caracteres.")
                }
                if(!this.idcategoria){
                    this.validaMensaje.push("Debe seleccionar la categoría del producto.")
                }
                if(!this.stock || this.stock == 0){
                    this.validaMensaje.push("Ingrese algun Stock.")
                }
                if(!this.precio_venta || this.precio_venta == 0){
                    this.validaMensaje.push("Ingrese precio de venta del producto.")
                }
                if(this.validaMensaje.length){
                    this.valida=1
                }
                return this.valida
            },
            activarDesactivarMostrar(accion, item){
                this.adModal = 1
                this.adNombre = item.nombre
                this.adId = item.idarticulo
                if(accion == 1){
                    this.adAccion=1
                }
                else if(accion == 2){
                    this.adAccion=2
                }
                else{
                    this.adModal=0
                }
            },
            activarDesactivarCerrar(){
                this.adModal=0
            },
            activar(){
                let me = this
                axios.put('api/Articulos/Activar/' + this.adId,{
                }).then(function(response){
                    me.adModal=0
                    me.adAccion=0
                    me.adNombre=""
                    me.adId=""
                    me.listar()
                }).catch(function(error){
                    console.log(error)
                })
            },
            desactivar(){
                let me = this
                axios.put('api/Articulos/Desactivar/' + this.adId,{
                }).then(function(response){
                    me.adModal=0
                    me.adAccion=0
                    me.adNombre=""
                    me.adId=""
                    me.listar()
                }).catch(function(error){
                    console.log(error)
                })
            }
        }        
    }
</script>