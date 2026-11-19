<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <section>
    <button class="grande" @click="router.push('/cartoes')"><span class="psi" aria-hidden="true">Ψ</span>Meus cartões</button>
    <button class="grande" @click="router.push('/biblioteca')"><span>📚</span>Biblioteca</button>
  </section>
</template>

<style scoped>
section{margin-top:14px}
.grande{width:100%;padding:30px 22px;border-radius:22px;border:1px solid var(--line);background:var(--surface);color:var(--fg);font-size:20px;font-weight:600;display:flex;align-items:center;gap:16px;margin-bottom:16px;box-shadow:0 6px 18px rgba(0,0,0,.08);text-align:left;transition:transform .1s}
.grande span{font-size:34px}
.grande .psi{font-family:Georgia,'Times New Roman',serif;font-weight:700;color:var(--accent);width:40px;text-align:center;line-height:1}
.grande:active{transform:scale(.98)}
</style>
