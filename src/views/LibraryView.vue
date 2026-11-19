<script setup>
// Biblioteca: cartões prontos; "Adicionar" alterna entre adicionar e remover de "Meus cartões".
import { BIBLIOTECA } from '../data/biblioteca'
import { useCards } from '../composables/useCards'
import CardItem from '../components/CardItem.vue'
const { alternarBiblioteca, temOrigem } = useCards()
const MOSTRAR_NUM = location.href.includes('numeros') // dica: abra com ?numeros para ver o nº de cada imagem
const k = it => it.arquivo || it.texto
const num = it => (it.arquivo?.match(/(\d+)\.\w+$/) || [])[1]
const visual = it => it.arquivo ? { tipo: 'imagem', url: it.arquivo }
  : { tipo: 'texto', texto: it.texto, bg: it.bg || '#6c5ce7', cor: it.cor || '#fff', fonte: it.fonte || 'system-ui, sans-serif' }
</script>

<template>
  <section>
    <p class="sub">Cartões prontos. Toque em “Adicionar” para levar para os seus.</p>
    <p v-if="!BIBLIOTECA.length" class="empty">A biblioteca ainda está vazia.</p>
    <div class="grade">
      <div v-for="it in BIBLIOTECA" :key="k(it)" class="item">
        <CardItem :card="visual(it)" mini />
        <div class="tit">{{ it.titulo || (MOSTRAR_NUM && num(it) ? 'Nº ' + num(it) : '') }}</div>
        <button :class="{ ok: temOrigem(k(it)) }" @click="alternarBiblioteca(it)">
          {{ temOrigem(k(it)) ? '✓ Adicionado' : 'Adicionar' }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.grade{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.item{display:flex;flex-direction:column;gap:8px}
.tit{font-size:13px;text-align:center;color:var(--muted);min-height:16px}
.item button{border:1px solid var(--accent);background:none;color:var(--accent);border-radius:10px;padding:9px;font-weight:600;transition:background .2s,color .2s}
.item button.ok{background:var(--accent);color:#fff}
</style>
