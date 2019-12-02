<template>
  <div class="row">
    <div class="col-sm-4">
<h2>Instrucciones</h2>
<p>
  Arrastra una imagen o pincha en el cuadro, para añadir una imagen.<br/>
  Hay un limite de tamaño de {{maxFileSize}}MB.<br/>
  La imagen se creará como visible por defecto.
</p>
    </div>
    <vue-dropzone
ref="myVueDropzone"
:useCustomSlot="true"
id="dropzone"
:options="dropzoneOptions"
class="col-sm-8"
></vue-dropzone>
  </div>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone';
import 'vue2-dropzone/dist/vue2Dropzone.min.css';
import axios from 'axios';


export default {
  name: 'anadir',
  components: {
    vueDropzone: vue2Dropzone,
  },
  data() {
    return {
      maxFileSize: {
        type: String,
        default: '1',
      },
      ok: true,
      dropzoneOptions: {
        url: `${this.axiosHost}:3001/addImagen`,
        thumbnailWidth: 150,
        maxFilesize: this.maxFileSize,
        headers: { 'My-Awesome-Header': 'header value' },
        addRemoveLinks: true,
      },
      fileAdded: false,
      filesAdded: false,
      success: false,
      error: false,
      removedFile: false,
      sending: false,
      successMultiple: false,
      sendingMultiple: false,
      queueComplete: false,
      uploadProgress: false,
      progress: false,
      myProgress: 0,
      isMounted: false,
      dDrop: false,
      dStarted: false,
      dEnded: false,
      dEntered: false,
      dOver: false,
      dLeave: false,
      dDuplicate: false,
    };
  },
  beforeMount() {
    this.getOpcion('maxFileSize');
  },
  methods: {
    getOpcion(nombre) {
      axios
        .get(`${this.axiosHost}:3001/getOpcion/${nombre}`)
        .then((response) => {
          this.maxFileSize = response.data.msg[0].valor;
        })
        .catch((error) => {
          if (error.response) {
            /*
            * The request was made and the server responded with a
            * status code that falls out of the range of 2xx
            */
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            /*
            * The request was made but no response was received, `error.request`
            * is an instance of XMLHttpRequest in the browser and an instance
            * of http.ClientRequest in Node.js
            */
            console.log(error.request);
          } else {
            // Something happened in setting up the request and triggered an Error
          }
        });
    },
  },
};
</script>
