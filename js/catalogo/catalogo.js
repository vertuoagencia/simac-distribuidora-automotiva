import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://updqzeidruylrupzetai.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwZHF6ZWlkcnV5bHJ1cHpldGFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NjkzNDYsImV4cCI6MjA2MTQ0NTM0Nn0.MV1GMF7e71bGBEMYaTJQAqkU5Db73lHrpWRGKVFOZIA';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const DEFAULT_IMAGE = 'https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg?auto=compress&cs=tinysrgb&w=400';

let allProducts = [];
let filteredProducts = [];

const filters = {
  search: '',
  categories: new Set(['all']),
  brands: new Set(['all']),
  sizes: new Set(['all']),
  boxQuantities: new Set(['all']),
  sortBy: 'name-asc'
};

async function loadProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('nome_produto', { ascending: true });

    if (error) throw error;

    allProducts = (data || []).map(p => ({
      id: p.id,
      name: p.nome_produto || '',
      brand: p.marca || '',
      category: p.categoria || '',
      box_quantity: p.quantidade_caixa || '',
      size: p.quantidade_embalagem || '',
      specification: p.especificacoes || '',
      indication: p.indicacao || '',
      image_url: p.image_url || DEFAULT_IMAGE,
    }));

    populateFilters();
    applyFilters();
  } catch (err) {
    console.error('Erro ao carregar produtos:', err);
    showError('Nao foi possivel carregar os produtos. Verifique a conexao.');
  }
}

function getUniqueValues(key) {
  return [...new Set(allProducts.map(p => p[key]).filter(v => v && v.toString().trim()))].sort();
}

function populateFilters() {
  buildCheckboxGroup('categoryFilters', 'category', 'Todas as categorias', getUniqueValues('category'));
  buildCheckboxGroup('brandFilters', 'brand', 'Todas as marcas', getUniqueValues('brand'));
  buildCheckboxGroup('sizeFilters', 'size', 'Todos os tamanhos', getUniqueValues('size'));
  buildCheckboxGroup('boxQuantityFilters', 'boxQuantity', 'Todas', getUniqueValues('box_quantity'));
  setupFilterListeners();
}

function buildCheckboxGroup(containerId, name, allLabel, values) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <label class="filter-option">
      <input type="checkbox" name="${name}" value="all" checked />
      <span>${allLabel}</span>
    </label>
  `;

  values.forEach(value => {
    const label = document.createElement('label');
    label.className = 'filter-option';
    label.innerHTML = `
      <input type="checkbox" name="${name}" value="${escapeAttr(value)}" />
      <span>${escapeHtml(value)}</span>
    `;
    container.appendChild(label);
  });
}

function setupFilterListeners() {
  document.getElementById('searchInput').addEventListener('input', e => {
    filters.search = e.target.value.toLowerCase().trim();
    applyFilters();
  });

  [
    { name: 'category', key: 'categories' },
    { name: 'brand', key: 'brands' },
    { name: 'size', key: 'sizes' },
    { name: 'boxQuantity', key: 'boxQuantities' }
  ].forEach(({ name, key }) => {
    document.querySelectorAll(`input[name="${name}"]`).forEach(cb => {
      cb.addEventListener('change', e => handleCheckboxChange(key, e.target));
    });
  });

  document.getElementById('sortBy').addEventListener('change', e => {
    filters.sortBy = e.target.value;
    applyFilters();
  });

  document.getElementById('clearFilters').addEventListener('click', clearAllFilters);
}

function handleCheckboxChange(filterKey, checkbox) {
  const value = checkbox.value;

  if (value === 'all') {
    if (checkbox.checked) {
      filters[filterKey] = new Set(['all']);
      document.querySelectorAll(`input[name="${checkbox.name}"]:not([value="all"])`).forEach(cb => cb.checked = false);
    } else {
      checkbox.checked = true;
    }
  } else {
    if (checkbox.checked) {
      filters[filterKey].delete('all');
      filters[filterKey].add(value);
      document.querySelector(`input[name="${checkbox.name}"][value="all"]`).checked = false;
    } else {
      filters[filterKey].delete(value);
      if (filters[filterKey].size === 0) {
        filters[filterKey].add('all');
        document.querySelector(`input[name="${checkbox.name}"][value="all"]`).checked = true;
      }
    }
  }

  applyFilters();
}

function clearAllFilters() {
  filters.search = '';
  filters.categories = new Set(['all']);
  filters.brands = new Set(['all']);
  filters.sizes = new Set(['all']);
  filters.boxQuantities = new Set(['all']);
  filters.sortBy = 'name-asc';

  document.getElementById('searchInput').value = '';
  document.getElementById('sortBy').value = 'name-asc';
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.checked = cb.value === 'all';
  });

  applyFilters();
}

function applyFilters() {
  filteredProducts = allProducts.filter(product => {
    if (filters.search) {
      const q = filters.search;
      const matches =
        product.name.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.specification.toLowerCase().includes(q) ||
        product.indication.toLowerCase().includes(q);
      if (!matches) return false;
    }

    if (!filters.categories.has('all') && !filters.categories.has(product.category)) return false;
    if (!filters.brands.has('all') && !filters.brands.has(product.brand)) return false;
    if (!filters.sizes.has('all') && !filters.sizes.has(product.size)) return false;
    if (!filters.boxQuantities.has('all') && !filters.boxQuantities.has(product.box_quantity)) return false;

    return true;
  });

  sortProducts();
  renderProducts();
}

function sortProducts() {
  switch (filters.sortBy) {
    case 'name-asc':
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
      break;
    case 'name-desc':
      filteredProducts.sort((a, b) => b.name.localeCompare(a.name, 'pt-BR'));
      break;
    case 'newest':
      filteredProducts.sort((a, b) => b.id - a.id);
      break;
  }
}

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const noResults = document.getElementById('noResults');
  const resultsCount = document.getElementById('resultsCount');
  const count = filteredProducts.length;

  if (count === 0) {
    resultsCount.textContent = 'Nenhum produto encontrado';
    grid.innerHTML = '';
    noResults.style.display = 'block';
    return;
  }

  noResults.style.display = 'none';
  resultsCount.textContent = count === 1 ? '1 produto encontrado' : `${count} produtos encontrados`;

  grid.innerHTML = filteredProducts.map(product => `
    <div class="product-card">
      <img
        src="${escapeAttr(product.image_url)}"
        alt="${escapeAttr(product.name)}"
        class="product-image"
        onerror="this.src='${DEFAULT_IMAGE}'"
      />
      <div class="product-brand">${escapeHtml(product.brand)}</div>
      <h3 class="product-name">${escapeHtml(product.name)}</h3>
      ${product.size ? `<p class="product-size">${escapeHtml(product.size)}</p>` : ''}
      <div class="product-details">
        ${product.category ? `
          <div class="product-detail-item">
            <span class="product-detail-label">Categoria:</span>
            <span class="product-detail-value">${escapeHtml(product.category)}</span>
          </div>` : ''}
        ${product.box_quantity ? `
          <div class="product-detail-item">
            <span class="product-detail-label">Caixa:</span>
            <span class="product-detail-value">${escapeHtml(product.box_quantity)} un</span>
          </div>` : ''}
        ${product.specification ? `
          <div class="product-detail-item">
            <span class="product-detail-label">Especificacao:</span>
            <span class="product-detail-value">${escapeHtml(product.specification)}</span>
          </div>` : ''}
      </div>
    </div>
  `).join('');
}

function showError(message) {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = `
    <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #dc3545; font-family: 'DM Sans', sans-serif;">
      <h3>${escapeHtml(message)}</h3>
      <p style="margin-top:8px;color:#666;">Tente recarregar a pagina.</p>
    </div>
  `;
  document.getElementById('resultsCount').textContent = '';
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(str) {
  if (!str) return '';
  return String(str).replace(/"/g, '&quot;');
}

document.addEventListener('DOMContentLoaded', loadProducts);
