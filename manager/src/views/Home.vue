<template>
  <div class="row">
  <div style="position:fixed;top:50%;left:50%" v-show="showSpinner" >
        <b-spinner
        style="width: 5rem; height: 5rem;"
        variant="primary"
        type="grow"
        label="Loading..."></b-spinner>
  </div>
    <div class="col-12">
        <image-card :images="images"/>
        <b-alert variant="danger" :show="showErrorAlert">
          <strong>ERROR: </strong>{{error}}
        </b-alert>
    </div>

 <b-modal id="obtenerDeDir" title="obtenerDeDir" @ok="obtenerDeDir">
   <b-alert variant="danger" show><strong>Atención!</strong></b-alert>
   <p>Estas a punto de recargar todas las imágenes por las que están en el servidor.<br/>
     La base de datos se borrara y se creara con las imágenes existentes ahora ahí,<br/>
     por lo que perderás todos los cambios irreversiblemente.</p>
 </b-modal>
    <portal to="destination">
      <b-button-group>
        <b-button variant="success" v-on:click="recargar">Recargar</b-button>
        <b-button variant="danger" v-b-modal.obtenerDeDir>Remplazar desde directorio</b-button>
      </b-button-group>
</portal>
  </div>

</template>

<script>
// @ is an alias to /src
import axios from 'axios';
import ImageCard from '@/components/ImageCard.vue';

export default {
  name: 'home',
  props: {
    test: {
      type: String,
      default: 'Homeview',
    },
    error: {
      type: String,
    },
    showErrorAlert: {
      type: Boolean,
      default: false,
    },
    showSpinner: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      images: null,
    };
  },
  components: {
    ImageCard,
  },
  mounted() {
  //  const that = this;
    this.recargar();
  },
  methods: {
    recargar() {
      this.showSpinner = true;
      this.showErrorAlert = false;
      axios
        .get('http://controller.manager.nodesocket.local:3001/getAllImages')
        .then((response) => {
          this.showSpinner = false;
          this.images = response.data.msg;
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
          this.showErrorAlert = true;
        });
    },
    obtenerDeDir() {
      axios
        .get('http://controller.manager.nodesocket.local:3001/updateImagesDbFromDir')
        .then((response) => {
          if (response.data.ok === 1) {
            this.recargar();
          }
        });
    },
  },
};
</script>
