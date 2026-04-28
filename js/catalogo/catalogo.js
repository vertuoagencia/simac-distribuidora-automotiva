const supabaseUrl = 'https://updqzeidruylrupzetai.supabase.co';

const supabaseKey = 'COLE_SUA_CHAVE_ANON_AQUI';

const supabase = window.supabase.createClient(
  supabaseUrl,
  supabaseKey
);

/* ===========================================
   VARIÁVEIS
=========================================== */
let produtos = [];
let produtosFiltrados = [];

const filtros = {
  busca: '',
  categoria: 'all',
  marca: 'all',
  tamanho: 'all',
  caixa: 'all',
  ordenar: 'name-asc'
};

/* ===========================================
   INICIAR
=========================================== */
document.addEventListener('DOMContentLoaded', () => {
  carregarProdutos();
});

/* ===========================================
   BUSCAR PRODUTOS NO SUPABASE
=========================================== */
async function carregarProdutos() {
  try {
    const { data, error } = await supabase
      .from('Produtos SIMAC')
      .select('*')
      .order('nome_produto', { ascending: true });

    if (error) throw error;

    produtos = data || [];
    produtosFiltrados = [...produtos];

    montarFiltros();
    aplicarFiltros();

  } catch (erro) {
    console.error(erro);
    mostrarErro('Erro ao carregar produtos.');
  }
}

/* ===========================================
   FILTROS
=========================================== */
function montarFiltros() {
  criarFiltro(
    'categoryFilters',
    'categoria',
    [...new Set(produtos.map(p => p.categoria).filter(Boolean))],
    'Todas as categorias'
  );

  criarFiltro(
    'brandFilters',
    'marca',
    [...new Set(produtos.map(p => p.marca).filter(Boolean))],
    'Todas as marcas'
  );

  criarFiltro(
    'sizeFilters',
    'tamanho',
    [...new Set(produtos.map(p => p.quantidade_embalagem).filter(Boolean))],
    'Todos os tamanhos'
  );

  criarFiltro(
    'boxQuantityFilters',
    'caixa',
    [...new Set(produtos.map(p => p.quantidade_caixa).filter(Boolean))],
    'Todas'
  );

  ativarEventos();
}

function criarFiltro(id, nome, itens, textoAll) {
  const box = document.getElementById(id);

  box.innerHTML = `
    <label class="filter-option">
      <input type="radio" name="${nome}" value="all" checked>
      <span>${textoAll}</span>
    </label>
  `;

  itens.sort().forEach(item => {
    box.innerHTML += `
      <label class="filter-option">
        <input type="radio" name="${nome}" value="${item}">
        <span>${item}</span>
      </label>
    `;
  });
}

/* ===========================================
   EVENTOS
=========================================== */
function ativarEventos() {

  document.getElementById('searchInput').addEventListener('input', e => {
    filtros.busca = e.target.value.toLowerCase();
    aplicarFiltros();
  });

  document.getElementById('sortBy').addEventListener('change', e => {
    filtros.ordenar = e.target.value;
    aplicarFiltros();
  });

  document.getElementById('clearFilters').addEventListener('click', limparFiltros);

  document.querySelectorAll('input[name="categoria"]').forEach(el => {
    el.addEventListener('change', e => {
      filtros.categoria = e.target.value;
      aplicarFiltros();
    });
  });

  document.querySelectorAll('input[name="marca"]').forEach(el => {
    el.addEventListener('change', e => {
      filtros.marca = e.target.value;
      aplicarFiltros();
    });
  });

  document.querySelectorAll('input[name="tamanho"]').forEach(el => {
    el.addEventListener('change', e => {
      filtros.tamanho = e.target.value;
      aplicarFiltros();
    });
  });

  document.querySelectorAll('input[name="caixa"]').forEach(el => {
    el.addEventListener('change', e => {
      filtros.caixa = e.target.value;
      aplicarFiltros();
    });
  });
}

/* ===========================================
   LIMPAR
=========================================== */
function limparFiltros() {

  filtros.busca = '';
  filtros.categoria = 'all';
  filtros.marca = 'all';
  filtros.tamanho = 'all';
  filtros.caixa = 'all';
  filtros.ordenar = 'name-asc';

  document.getElementById('searchInput').value = '';
  document.getElementById('sortBy').value = 'name-asc';

  document.querySelectorAll('input[type="radio"]').forEach(input => {
    input.checked = input.value === 'all';
  });

  aplicarFiltros();
}

/* ===========================================
   FILTRAR
=========================================== */
function aplicarFiltros() {

  produtosFiltrados = produtos.filter(produto => {

    const nome = (produto.nome_produto || '').toLowerCase();
    const marca = (produto.marca || '').toLowerCase();

    if (filtros.busca) {
      const encontrou =
        nome.includes(filtros.busca) ||
        marca.includes(filtros.busca);

      if (!encontrou) return false;
    }

    if (filtros.categoria !== 'all' &&
        produto.categoria !== filtros.categoria) {
      return false;
    }

    if (filtros.marca !== 'all' &&
        produto.marca !== filtros.marca) {
      return false;
    }

    if (filtros.tamanho !== 'all' &&
        produto.quantidade_embalagem != filtros.tamanho) {
      return false;
    }

    if (filtros.caixa !== 'all' &&
        produto.quantidade_caixa != filtros.caixa) {
      return false;
    }

    return true;
  });

  ordenarProdutos();
  renderizarProdutos();
}

/* ===========================================
   ORDENAR
=========================================== */
function ordenarProdutos() {

  if (filtros.ordenar === 'name-asc') {
    produtosFiltrados.sort((a, b) =>
      a.nome_produto.localeCompare(b.nome_produto)
    );
  }

  if (filtros.ordenar === 'name-desc') {
    produtosFiltrados.sort((a, b) =>
      b.nome_produto.localeCompare(a.nome_produto)
    );
  }

  if (filtros.ordenar === 'newest') {
    produtosFiltrados.sort((a, b) => b.id - a.id);
  }
}

/* ===========================================
   MOSTRAR PRODUTOS
=========================================== */
function renderizarProdutos() {

  const grid = document.getElementById('productsGrid');
  const contador = document.getElementById('resultsCount');
  const noResults = document.getElementById('noResults');

  contador.textContent =
    produtosFiltrados.length === 1
      ? '1 produto encontrado'
      : `${produtosFiltrados.length} produtos encontrados`;

  if (produtosFiltrados.length === 0) {
    grid.innerHTML = '';
    noResults.style.display = 'block';
    return;
  }

  noResults.style.display = 'none';

  grid.innerHTML = produtosFiltrados.map(produto => `
    <div class="product-card">

      <img
        src="https://via.placeholder.com/400x250?text=SIMAC"
        alt="${produto.nome_produto}"
        class="product-image"
      >

      <div class="product-brand">${produto.marca || ''}</div>

      <h3 class="product-name">${produto.nome_produto || ''}</h3>

      <p class="product-size">
        ${produto.quantidade_embalagem || ''}
      </p>

      <div class="product-details">

        <div class="product-detail-item">
          <span class="product-detail-label">Categoria:</span>
          <span class="product-detail-value">
            ${produto.categoria || '-'}
          </span>
        </div>

        <div class="product-detail-item">
          <span class="product-detail-label">Caixa:</span>
          <span class="product-detail-value">
            ${produto.quantidade_caixa || '-'}
          </span>
        </div>

        <div class="product-detail-item">
          <span class="product-detail-label">Código:</span>
          <span class="product-detail-value">
            ${produto.codigo_sistema || '-'}
          </span>
        </div>

      </div>
    </div>
  `).join('');
}

/* ===========================================
   ERRO
=========================================== */
function mostrarErro(msg) {
  document.getElementById('productsGrid').innerHTML = `
    <div style="
      grid-column:1/-1;
      padding:40px;
      text-align:center;
      color:red;
      font-weight:bold;
    ">
      ${msg}
    </div>
  `;
}