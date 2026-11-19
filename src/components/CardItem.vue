<script setup>
// Desenha UM cartão (imagem com fundo desfocado, ou texto colorido).
// `mini` = versão miniatura (biblioteca / lista de configurações).
import { ref } from 'vue'
const props = defineProps({ card: { type: Object, required: true }, mini: Boolean })
const quebrada = ref(false)
const BASE = import.meta.env.BASE_URL
// imagens da biblioteca são caminhos relativos; as importadas são data: URLs
const src = u => (u.startsWith('data:') ? u : BASE + u)
</script>

<template>
  <div class="cartao" :class="{ mini, quebrada }"
    :style="card.tipo === 'texto' ? { background: card.bg, color: card.cor, fontFamily: card.fonte } : null">
    <template v-if="card.tipo === 'imagem'">
      <p v-if="quebrada">Imagem não encontrada</p>
      <template v-else>
        <img class="bg" :src="src(card.url)" alt="" :loading="mini ? 'lazy' : 'eager'">
        <img class="fg" :src="src(card.url)" alt="" :loading="mini ? 'lazy' : 'eager'" @error="quebrada = true">
      </template>
    </template>
    <div v-else class="txt">
      <small v-if="card.categoria" class="cat">{{ card.categoria }}</small>
      <strong v-if="card.titulo" class="tit">{{ card.titulo }}</strong>
      <span>{{ card.texto }}</span>
    </div>
  </div>
</template>

<style scoped>
.cartao{position:relative;border-radius:24px;display:flex;align-items:center;justify-content:center;padding:28px;text-align:center;font-size:24px;line-height:1.35;overflow:hidden;user-select:none;background:var(--surface);border:1px solid var(--line)}
.cartao.mini{aspect-ratio:2/3;border-radius:16px;padding:12px;font-size:14px}
.quebrada{color:var(--muted);font-size:12px}
img{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.fg{object-fit:contain}
.bg{object-fit:cover;filter:blur(18px) brightness(.85);transform:scale(1.25)}
.txt{display:flex;flex-direction:column;gap:8px;max-width:100%;overflow-wrap:anywhere}
.cat{font-size:.5em;letter-spacing:.08em;text-transform:uppercase;opacity:.75}
.tit{font-size:1.1em}
.mini .cat,.mini .tit{font-size:1em}
</style>
