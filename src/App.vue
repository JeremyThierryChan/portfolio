<template>
  <div id="app">
    <Navbar />
    <router-view />
    <Footer />
  </div>
</template>

<script>
import Navbar from './components/NavigationBar.vue';
import Footer from './components/PageFooter.vue';

export default {
  components: {
    Navbar,
    Footer,
  },
};
</script>

<style>
/* 全局样式 */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}
</style>
