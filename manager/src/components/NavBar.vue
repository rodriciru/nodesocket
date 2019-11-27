<template>
  <div>
  <b-navbar toggleable="lg" type="dark" variant="dark">
    <b-navbar-brand href="#">OBS Socket Manager</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item to="/">Gestionar</b-nav-item>
        <b-nav-item to="/anadir">Añadir</b-nav-item>
        <b-nav-item to="/opciones">Opciones</b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <portal-target name="destination"></portal-target>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</div>
</template>

<script>

export default {
  name: 'NavBar',
};
</script>
