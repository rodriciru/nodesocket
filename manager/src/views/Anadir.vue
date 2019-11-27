<template>
  <div>
    <vue-dropzone
ref="myVueDropzone"
:useCustomSlot="true"
id="dropzone"
@vdropzone-upload-progress="uploadProgress"
:options="dropzoneOptions"
@vdropzone-file-added="fileAdded"
@vdropzone-sending-multiple="sendingFiles"
@vdropzone-success-multiple="success"
></vue-dropzone>
  </div>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone';
import 'vue2-dropzone/dist/vue2Dropzone.min.css';

export default {
  name: 'anadir',
  components: {
    vueDropzone: vue2Dropzone,
  },
  data() {
    return {
      ok: true,
      dropzoneOptions: {
        url: 'http://controller.manager.nodesocket.local:3001/addImagen',
        thumbnailWidth: 150,
        maxFilesize: 5,
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
  mounted() {
  //  const that = this;
    this.recargar();
  },
  methods: {
    recargar() {
    },
  },
};
</script>
