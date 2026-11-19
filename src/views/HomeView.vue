<script setup>
import { useRouter } from 'vue-router'
import { useTheme } from '../composables/useTheme'
const router = useRouter(), { alternar } = useTheme()
const BASE = import.meta.env.BASE_URL // funciona na raiz e em subpasta (usuario.github.io/Cards/)
</script>

<template>
  <section>
    <div class="topo">
      <button class="icone" aria-label="Configurações" @click="router.push('/config')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      </button>
      <button class="tema" role="switch" aria-label="Alternar entre tema claro e escuro" @click="alternar">
        <span class="bola" />
        <svg class="sol" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
        <svg class="lua" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      </button>
    </div>
    <div class="logo">
      <img class="claro" :src="BASE + 'logo-claro.png'" alt="Metamorfose">
      <img class="escuro" :src="BASE + 'logo-escuro.png'" alt="" aria-hidden="true">
    </div>
    <button class="grande" @click="router.push('/menu')"><span class="psi" aria-hidden="true">Ψ</span>Cartões de enfrentamento</button>
    <button class="grande" @click="router.push('/respiracao')"><span>🌬️</span>Respiração 4-7-8</button>
  </section>
</template>

<style scoped>
section{flex:1;display:flex;flex-direction:column}
.topo{display:flex;justify-content:space-between;align-items:center;padding-top:4px}
.icone{width:44px;height:44px;border-radius:50%;border:1px solid var(--line);background:var(--surface);color:var(--fg);display:flex;align-items:center;justify-content:center;padding:0}
.icone svg{width:22px;height:22px}
.tema{position:relative;width:72px;height:38px;border-radius:19px;border:1px solid var(--line);background:var(--surface);display:flex;align-items:center;justify-content:space-between;padding:0 9px}
.tema svg{width:20px;height:20px;position:relative;z-index:1;transition:color .25s}
.bola{position:absolute;top:3px;left:3px;width:30px;height:30px;border-radius:50%;background:var(--accent);transition:transform .25s}
.sol{color:#fff}.lua{color:var(--muted)}
:root[data-tema="escuro"] .bola{transform:translateX(34px)}
:root[data-tema="escuro"] .sol{color:var(--muted)}
:root[data-tema="escuro"] .lua{color:#fff}
.logo{display:flex;justify-content:center;margin:14px 0 20px}
.logo img{width:min(100%,300px);height:auto}
.escuro{display:none}
:root[data-tema="escuro"] .claro{display:none}
:root[data-tema="escuro"] .escuro{display:block}
.grande{width:100%;padding:30px 22px;border-radius:22px;border:1px solid var(--line);background:var(--surface);color:var(--fg);font-size:20px;font-weight:600;display:flex;align-items:center;gap:16px;margin-bottom:16px;box-shadow:0 6px 18px rgba(0,0,0,.08);text-align:left;transition:transform .1s}
.grande span{font-size:34px}
.grande .psi{font-family:Georgia,'Times New Roman',serif;font-weight:700;color:var(--accent);width:40px;text-align:center;line-height:1}
.grande:active{transform:scale(.98)}
</style>
