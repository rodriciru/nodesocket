<template>
<div id="app">
  <nav-bar />
  <div class="container-fluid">
    <router-view />
  </div>
</div>
</template>

<style lang="scss">
body{
  background-color: #424242;
  color: #fff;
}
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #ececec;
}

#nav {
    padding: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}
.container-fluid{
  padding-top: 1rem;
}
</style>
