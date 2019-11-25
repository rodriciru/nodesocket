<template>
  <div class="row">
    <div class="col-12">
        <image-card :images="images"/>
    </div>
    <portal to="destination">
      <b-button-group>
        <b-button variant="success" v-on:click="recargar">Recargar</b-button>
        <b-button variant="info">Info</b-button>
        <b-button variant="warning">Warning</b-button>
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
    axios
      .get('http://controller.manager.obssocket.local/managerHandler.php?getAllImages')
      .then((response) => { this.images = response.data.msg; });
  },
  methods: {
    recargar() {
      axios
        .get('http://controller.manager.obssocket.local/managerHandler.php?getAllImages')
        .then((response) => { this.images = response.data.msg; });
    },
  },
};
</script>
