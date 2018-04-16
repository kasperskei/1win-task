<template>
  <div id="app">
    <div class="nav">
      <router-link :to="{ name: 'calculator' }">Calculator</router-link> |
      <router-link :to="{ name: 'websocket' }">Websocket</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style>

</style>
