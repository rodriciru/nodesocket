<template>
  <div class="row">
    <div
    v-for="image in images" :key="image.id"
    class="col-2 mb-4"
    :id="'image'+image.id"
  >
    <b-card
   :title="image.url"
   :img-src="'http://imagenes.nodesocket.local/' + image.url"
   :img-alt="image.url"
   img-top
   tag="article"
   style="max-width: 20rem;"
   class="h-100"
 >
   <b-button-group>
      <b-button variant="danger" @click="showDeleteModal(image.id,image.url)">
        <font-awesome-icon icon="trash" />
      </b-button>
    </b-button-group>
 </b-card>
  </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ImageCard',
  props: {
    images: Array,
  },
  methods: {
    showDeleteModal(id, url) {
      const h = this.$createElement;
      // More complex structure
      const messageVNode = h('div', { class: ['foobar'] }, [
        h('b-alert', {
          props: {
            variant: 'danger',
            show: true,
          },
          domProps: {
            innerHTML: '<strong>Atención!</strong><p>Estas a punto de eliminar una imagen.<br/>Es una acción irreversible.</p>',
          },
        }),
      ]);
      this.$bvModal.msgBoxConfirm([messageVNode])
        .then((value) => {
          if (value) {
            this.deleteImage(id, url);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteImage(id, url) {
      axios
        .get(`http://controller.manager.nodesocket.local:3001/deleteImage/${id}/${url}`)
        .then(() => {
          this.$parent.recargar();
        })
        .catch((error) => {
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
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
