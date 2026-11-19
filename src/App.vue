<script setup>
// Casca do app: cabeçalho + <RouterView> com transição entre telas.
import AppNavbar from './components/AppNavbar.vue'
import InstallPwaBanner from './components/InstallPwaBanner.vue'
</script>

<template>
  <div class="app">
    <AppNavbar />
    <main>
      <RouterView v-slot="{ Component, route }">
        <Transition name="tela" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>
    <InstallPwaBanner />
  </div>
</template>

<style scoped>
.app{width:100%;max-width:440px;min-height:100dvh;display:flex;flex-direction:column;padding:20px 20px 0}
main{flex:1;display:flex;flex-direction:column;padding-bottom:32px}
</style>
