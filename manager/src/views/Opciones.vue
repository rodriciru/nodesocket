<template>
  <div>
    <div style="position:fixed;top:50%;left:50%" v-show="showSpinner" >
          <b-spinner
          style="width: 5rem; height: 5rem;"
          variant="primary"
          type="grow"
          label="Loading..."></b-spinner>
    </div>
    <b-table hover :items="items" primary-key="id" dark >
      <template v-slot:cell(valor)="row">
        <b-form-input
        v-model="row.item.valor"
        type="number"
        @update="setOpcion(row.item.id, $event)
        "/>
      </template>
    </b-table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'opciones',
  data() {
    return {
      showSpinner: {
        type: Boolean,
        default: true,
      },
      items: null,
      /* items: [
        { age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
        { age: 21, first_name: 'Larsen', last_name: 'Shaw' },
        { age: 89, first_name: 'Geneva', last_name: 'Wilson' },
        { age: 38, first_name: 'Jami', last_name: 'Carney' },
      ], */
    };
  },
  mounted() {
  //  const that = this;
    this.recargar();
  },
  methods: {
    recargar() {
      this.showSpinner = true;
      axios
        .get('http://controller.manager.nodesocket.local:3001/getAllOpciones')
        .then((response) => {
          this.showSpinner = false;
          this.items = response.data.msg;
        })
        .catch((error) => {
          this.showSpinner = false;
          if (error.response) {
            /*
            * The request was made and the server responded with a
            * status code that falls out of the range of 2xx
            */
            this.error = error.response.statusText;
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            /*
            * The request was made but no response was received, `error.request`
            * is an instance of XMLHttpRequest in the browser and an instance
            * of http.ClientRequest in Node.js
            */
            this.error = error.message;
            console.log(error.request);
          } else {
            // Something happened in setting up the request and triggered an Error
            this.error = error.message;
          }
        });
    },
    setOpcion(id, valor) {
      axios
        .get(`http://controller.manager.nodesocket.local:3001/setOpcion/${id}/${valor}`)
        .then(() => {
        })
        .catch((error) => {
          this.showSpinner = false;
          if (error.response) {
            /*
            * The request was made and the server responded with a
            * status code that falls out of the range of 2xx
            */
            this.error = error.response.statusText;
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            /*
            * The request was made but no response was received, `error.request`
            * is an instance of XMLHttpRequest in the browser and an instance
            * of http.ClientRequest in Node.js
            */
            this.error = error.message;
            console.log(error.request);
          } else {
            // Something happened in setting up the request and triggered an Error
            this.error = error.message;
          }
        });
    },
  },
};
</script>
