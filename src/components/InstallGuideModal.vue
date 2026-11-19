<script setup>
// Passo a passo ilustrado para instalar no iPhone/iPad (a Apple exige o toque manual).
import { usePwaInstall } from '../composables/usePwaInstall'
const { guiaAberto, iphone, emApp } = usePwaInstall()
</script>

<template>
  <Transition name="modal">
    <div v-if="guiaAberto" class="modal" @click.self="guiaAberto = false">
      <div class="sheet">
        <h2>Instalar no {{ iphone ? 'iPhone' : 'iPad' }}</h2>
        <p v-if="emApp" class="aviso">Você está num navegador dentro de outro app. Abra este endereço no <b>Safari</b> para conseguir instalar.</p>
        <ol>
          <li>
            <span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M8 7l4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg></span>
            <span>Toque em <b>Compartilhar</b> na barra do Safari ({{ iphone ? 'embaixo' : 'no alto' }} da tela).</span>
          </li>
          <li>
            <span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 8v8M8 12h8"/></svg></span>
            <span>Role o menu e toque em <b>Adicionar à Tela de Início</b>.</span>
          </li>
          <li>
            <span class="ic ok">✓</span>
            <span>Toque em <b>Adicionar</b>. O ícone aparece na sua tela inicial.</span>
          </li>
        </ol>
        <button class="btn" @click="guiaAberto = false">Entendi</button>
        <!-- seta apontando para o botão Compartilhar do Safari no iPhone -->
        <div v-if="iphone" class="seta" aria-hidden="true">↓</div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.aviso{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:10px 12px;font-size:14px;margin:0 0 14px}
ol{list-style:none;margin:0 0 18px;padding:0;display:flex;flex-direction:column;gap:14px}
li{display:flex;gap:14px;align-items:center;font-size:15px;line-height:1.4}
.ic{flex:none;width:44px;height:44px;border-radius:12px;background:var(--surface);border:1px solid var(--line);color:var(--accent);display:flex;align-items:center;justify-content:center;font-weight:700}
.ic svg{width:22px;height:22px}
.ic.ok{background:var(--accent);color:#fff;border:0}
.seta{position:fixed;left:50%;bottom:calc(6px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);font-size:34px;color:#fff;animation:pula 1s ease-in-out infinite;pointer-events:none;text-shadow:0 2px 8px rgba(0,0,0,.5)}
@keyframes pula{50%{transform:translate(-50%,8px)}}
</style>
