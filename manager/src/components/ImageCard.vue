<template>
  <div class="row">
    <div
    v-for="image in images" :key="image.id"
    class="col-2 mb-4"
  >
    <b-card
   title="Card Title"
   :img-src="'  http://images.obssocket.local/' + image.url"
   img-alt="Image"
   img-top
   tag="article"
   style="max-width: 20rem;"
   class="h-100"
 >
   <b-card-text>
     Some quick example text to build on the card title and make up the bulk of the card's content.
   </b-card-text>

   <b-button href="#" variant="primary">Go somewhere</b-button>
 </b-card>
  </div>

    <h1>{{ images }}</h1>
  </div>
</template>

<script>
export default {
  name: 'ImageCard',
  props: {
    images: Object,
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
