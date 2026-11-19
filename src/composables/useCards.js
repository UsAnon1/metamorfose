import { ref, watch } from 'vue'
import { BIBLIOTECA, PADRAO } from '../data/biblioteca'

// Estado global dos cartões (fila circular), salvo no localStorage do navegador.
export const FONTES = ['system-ui, sans-serif', 'Georgia, serif', "'Courier New', monospace", 'cursive']
const HEX = /^#[0-9a-fA-F]{6}$/
const fila = ref([])
let uid = Date.now()
const novoId = () => uid++
const chave = it => it.arquivo || it.texto
const numDe = it => { const m = (it.arquivo || '').match(/(\d+)\.\w+$/); return m ? +m[1] : null }
const STORAGE = 'reflexo_v1'

export const padrao = () => PADRAO
  .map(n => BIBLIOTECA.find(x => numDe(x) === n)).filter(Boolean)
  .map(it => ({ id: novoId(), tipo: 'imagem', url: it.arquivo, origem: chave(it) }))

// carrega ao iniciar (ou usa os cartões padrão na primeira vez)
try { const d = JSON.parse(localStorage.getItem(STORAGE)); fila.value = Array.isArray(d) ? d : padrao() }
catch { fila.value = padrao() }

watch(fila, (v) => {
  try { localStorage.setItem(STORAGE, JSON.stringify(v)) }
  catch { alert('Armazenamento do navegador cheio. Exclua algumas imagens importadas.') }
}, { deep: true })

// aceita só dados conhecidos e seguros de um arquivo importado
function limparItem(r) {
  if (!r || typeof r !== 'object') return null
  const n = {}
  if (r.tipo === 'texto' && typeof r.texto === 'string' && r.texto.trim()) {
    Object.assign(n, { tipo: 'texto', texto: r.texto.slice(0, 500),
      bg: HEX.test(r.bg) ? r.bg : '#6c5ce7', cor: HEX.test(r.cor) ? r.cor : '#ffffff',
      fonte: FONTES.includes(r.fonte) ? r.fonte : FONTES[0] })
    if (typeof r.titulo === 'string') n.titulo = r.titulo.slice(0, 60)
    if (typeof r.categoria === 'string') n.categoria = r.categoria.slice(0, 40)
  } else if (r.tipo === 'imagem' && typeof r.url === 'string' &&
    (/^data:image\/(jpeg|png|webp|gif);base64,/.test(r.url) || /^cartoes\/[\w\-.]+$/.test(r.url))) {
    Object.assign(n, { tipo: 'imagem', url: r.url })
  } else return null
  if (typeof r.origem === 'string') n.origem = r.origem.slice(0, 300)
  return n
}

export function useCards() {
  const temOrigem = k => fila.value.some(x => x.origem === k)
  function alternarBiblioteca(it) { // adiciona/remove um cartão da biblioteca
    const k = chave(it)
    if (temOrigem(k)) fila.value = fila.value.filter(x => x.origem !== k)
    else fila.value.unshift(it.arquivo
      ? { id: novoId(), tipo: 'imagem', url: it.arquivo, origem: k }
      : { id: novoId(), tipo: 'texto', texto: it.texto, bg: it.bg || '#6c5ce7', cor: it.cor || '#fff', fonte: it.fonte || FONTES[0], origem: k })
  }
  function salvarTexto(dados, id) { // cria (sem id) ou edita (com id)
    const r = id && fila.value.find(x => x.id === id)
    if (r) Object.assign(r, dados)
    else fila.value.unshift({ id: novoId(), tipo: 'texto', ...dados })
  }
  const remover = id => { fila.value = fila.value.filter(x => x.id !== id) }
  const avancar = () => fila.value.push(fila.value.shift())
  const voltar = () => fila.value.unshift(fila.value.pop())
  const restaurar = () => { fila.value = padrao() }

  function importarImagem(file) { // redimensiona (máx. 1000px) e guarda como JPEG
    return new Promise((ok, erro) => {
      const url = URL.createObjectURL(file), img = new Image()
      img.onload = () => {
        const sc = Math.min(1, 1000 / Math.max(img.width, img.height))
        const c = document.createElement('canvas')
        c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc)
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
        fila.value.unshift({ id: novoId(), tipo: 'imagem', url: c.toDataURL('image/jpeg', 0.82) })
        URL.revokeObjectURL(url); ok()
      }
      img.onerror = () => erro(new Error('Não consegui ler essa imagem. Tente um arquivo JPG ou PNG.'))
      img.src = url
    })
  }
  function exportar() {
    const blob = new Blob([JSON.stringify({ app: 'reflexo', versao: 1, cartoes: fila.value })], { type: 'application/json' })
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'cartoes-de-enfrentamento.json' })
    document.body.appendChild(a); a.click(); a.remove()
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
  }
  async function lerBackup(file) { // devolve a lista validada ou lança erro
    let d; try { d = JSON.parse(await file.text()) } catch { throw new Error('Esse arquivo não é válido.') }
    if (!d || d.app !== 'reflexo' || !Array.isArray(d.cartoes)) throw new Error('Esse arquivo não é um backup de Cartões de enfrentamento.')
    const novos = d.cartoes.slice(0, 500).map(limparItem).filter(Boolean)
    if (!novos.length) throw new Error('Não encontrei cartões válidos nesse arquivo.')
    return novos
  }
  function aplicarBackup(novos, substituir) { // devolve quantos foram adicionados
    const base = substituir ? [] : fila.value, vistos = new Set()
    const ch = r => r.tipo + '|' + (r.origem || r.url || r.texto)
    base.forEach(r => vistos.add(ch(r)))
    const add = novos.filter(r => !vistos.has(ch(r)) && vistos.add(ch(r)))
    add.forEach(r => { r.id = novoId() })
    fila.value = base.concat(add)
    return add.length
  }
  return { fila, temOrigem, alternarBiblioteca, salvarTexto, remover, avancar, voltar, restaurar,
    importarImagem, exportar, lerBackup, aplicarBackup }
}
