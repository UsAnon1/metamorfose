<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute(), router = useRouter()
const titulo = computed(() => route.meta.title || '')
const visivel = computed(() => !!route.meta.title) // some na tela inicial
// volta no histórico; se a página foi aberta direto, vai para o início
const voltar = () => (history.state?.back ? router.back() : router.push('/'))
</script>

<template>
  <header v-if="visivel">
    <button class="voltar" @click="voltar">← Voltar</button>
    <h1>{{ titulo }}</h1>
    <span />
  </header>
</template>

<style scoped>
header{display:grid;grid-template-columns:auto 1fr 72px;align-items:center;gap:6px;margin-bottom:8px}
h1{font-size:17px;text-align:center;line-height:1.2}
.voltar{justify-self:start;border:0;background:none;color:var(--accent);font-size:15px;font-weight:600;padding:8px 0}
</style>
