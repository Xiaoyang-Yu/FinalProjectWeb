<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import AppMain from '@/layout/components/AppMain'
export default {
  name: 'App',
  components: { AppMain }
}
</script>

<style>
.app-main{
  padding: 10px;
}
.el-card{
  margin-bottom: 10px;
}
</style>
