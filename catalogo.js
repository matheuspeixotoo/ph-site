/* ============================================================
   Over Pods — configuração do catálogo
   ------------------------------------------------------------
   Este é o ÚNICO arquivo que precisa ser editado para:
     • trocar o número do WhatsApp
     • adicionar / remover / renomear uma marca
     • apontar uma marca para outra aba da planilha (gid)
   Os produtos, preços, fotos e sabores continuam vindo da
   planilha do Google publicada em CSV — nada disso mora aqui.
   ============================================================ */

window.PH_CONFIG = {
  // Número no formato internacional, só dígitos.
  whatsapp: "5561984160056",

  // Mensagens prontas do WhatsApp.
  msgGeral: "Olá! Vim pelo site e quero fazer um pedido.",
  msgProduto: "Olá! Quero o {produto}.",
  msgSabor: "Olá! Quero o {produto} sabor {sabor}.",

  // Horário de atendimento exibido no rodapé. Deixe vazio para não exibir.
  horario: "",

  // Planilha publicada na web (Arquivo → Compartilhar → Publicar na web → CSV).
  // O "gid" de cada aba aparece na URL da planilha quando a aba está aberta.
  planilha:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTQKZXxrZJ45cmYrlNW2c06fxTZ9v8wKEJjNvj06zfP1g4Z3i9kbZ5raOw8aDWqo5jyChd7pg9tAEw3/pub?single=true&output=csv&gid=",

  // Aba que alimenta a seção "Lançamentos" da home e o selo "Novo" nos cards.
  novidades: { slug: "novidades", nome: "Lançamentos", gid: "1486437459" },

  // Quantos lançamentos aparecem em destaque na home (os primeiros da aba).
  destaquesNaHome: 3,

  // Marcas. `tipo` é "pod" (grade de marcas) ou "extra" (essências e acessórios).
  // `logo` é um PNG transparente em Assets/. `descricao` é opcional.
  // A ordem aqui é a ordem em que aparecem na home.
  marcas: [
    { slug: "elfbar",     nome: "Elfbar",          gid: "0",          logo: "elfbar.webp",     tipo: "pod" },
    { slug: "ignite",     nome: "Ignite",          gid: "997013394",  logo: "ignite.webp",     tipo: "pod" },
    { slug: "lostmary",   nome: "Lost Mary",       gid: "230216580",  logo: "lostmary.webp",   tipo: "pod" },
    { slug: "oxbar",      nome: "Oxbar",           gid: "756470832",  logo: "oxbar.webp",      tipo: "pod" },
    { slug: "hqd",        nome: "HQD",             gid: "166090721",  logo: "hqd.webp",        tipo: "pod" },
    { slug: "nikbar",     nome: "Nikbar",          gid: "220137051",  logo: "nikbar.webp",     tipo: "pod" },
    { slug: "dinnerlady", nome: "Dinner Lady",     gid: "1372642327", logo: "dinnerlady.webp", tipo: "pod" },
    { slug: "tbs",        nome: "The Black Sheep", gid: "1924852916", logo: "tbs.webp",        tipo: "pod" },
    { slug: "maskking",   nome: "Maskking",        gid: "2135591987", logo: "maskking.webp",   tipo: "pod" },
    { slug: "waka",       nome: "Waka",            gid: "932682983",  logo: "waka.webp",       tipo: "pod" },
    { slug: "lifepod",    nome: "Life Pod",        gid: "1583905982", logo: "lifepod.webp",    tipo: "pod" },
    { slug: "geekbar",    nome: "Geek Bar",        gid: "1878336922", logo: "geekbar.webp",    tipo: "pod" },
    { slug: "sexaddict",  nome: "Sex Addict",      gid: "754395625",  logo: "sexaddict.webp",  tipo: "pod" },
    { slug: "spaceman",   nome: "Spaceman",        gid: "1712685754", logo: "spaceman.webp",   tipo: "pod" },

    { slug: "refis",      nome: "Refis",           gid: "1250108556", logo: "refis.webp",      tipo: "extra",
      descricao: "Kits completos e refis para os dispositivos recarregáveis." },
    { slug: "nicsalt",    nome: "Nicsalt",         gid: "1781838836", logo: "nicsalt.webp",    tipo: "extra",
      descricao: "Essências com sal de nicotina para pods recarregáveis." },
    { slug: "juice",      nome: "Juice",           gid: "1494337050", logo: "juice.webp",      tipo: "extra",
      descricao: "Essências para vape livre." },
    { slug: "balas",      nome: "Balas",           gid: "1680341334", logo: "balas.webp",      tipo: "extra",
      descricao: "Balas de nicotina." },
  ],

  // Aviso de garantia: aparece uma vez por sessão na home e fica no link
  // "Garantia e trocas" do rodapé. Deixe `titulo: ""` para desativar.
  aviso: {
    titulo: "Garantia dos produtos",
    itens: [
      "O prazo máximo para reclamação e troca é de 24 horas após o recebimento do produto.",
      "Em caso de devolução por defeito, o produto precisa estar na embalagem original, sem marcas de queda, água ou sujeira e sem riscos, amassados ou rasgos na embalagem. Fora dessas condições não aceitamos a troca.",
      "Não efetuamos devolução do dinheiro em caso de troca ou insatisfação.",
    ],
    destaque: "Produtos só serão trocados por defeito de fábrica. Não aceitamos troca por insatisfação de sabor.",
    botao: "Entendi",
  },
};
