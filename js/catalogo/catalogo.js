import { produtos } from './produtos-data.js';

let filteredProducts = [];

const filters = {
  search: '',
  categories: new Set(['all']),
  brands: new Set(['all']),
  boxQuantities: new Set(['all']),
  sizes: new Set(['all']),
  sortBy: 'name-asc',
};

// ── Derived filter options ───────────────────────────────────────────────────
const allCategories = [...new Set(produtos.map(p => p.category).filter(Boolean))].sort();
const allBrands     = [...new Set(produtos.map(p => p.brand).filter(Boolean))].sort();
const allSizes      = [...new Set(produtos.map(p => p.size).filter(Boolean))].sort();
const allBoxQtys    = [...new Set(produtos.map(p => p.box_quantity).filter(Boolean))].sort((a, b) => a - b);

// ── Bootstrap ────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  populateFilters();
  applyFilters();
  setupModal();
});

// ── Filters ──────────────────────────────────────────────────────────────────
function buildCheckboxGroup(containerId, name, values, getValue, getLabel, allLabel) {
  const container = document.getElementById(containerId);
  container.innerHTML = `
    <label class="filter-option">
      <input type="checkbox" name="${name}" value="all" checked />
      <span>${allLabel}</span>
    </label>
  `;
  values.forEach(v => {
    const label = document.createElement('label');
    label.className = 'filter-option';
    label.innerHTML = `<input type="checkbox" name="${name}" value="${getValue(v)}" /><span>${getLabel(v)}</span>`;
    container.appendChild(label);
  });
}

function populateFilters() {
  buildCheckboxGroup('categoryFilters',   'category',    allCategories, v => v,         v => v,                  'Todas as categorias');
  buildCheckboxGroup('brandFilters',      'brand',       allBrands,     v => v,         v => v,                  'Todas as marcas');
  buildCheckboxGroup('sizeFilters',       'size',        allSizes,      v => v,         v => v,                  'Todos os tamanhos');
  buildCheckboxGroup('boxQuantityFilters','boxQuantity', allBoxQtys,    v => String(v), v => `${v} unidades`,    'Todas');
  setupFilterListeners();
}

function setupFilterListeners() {
  document.getElementById('searchInput').addEventListener('input', e => {
    filters.search = e.target.value.toLowerCase();
    applyFilters();
  });

  const nameToKey = { category: 'categories', brand: 'brands', boxQuantity: 'boxQuantities', size: 'sizes' };
  Object.keys(nameToKey).forEach(name => {
    document.querySelectorAll(`input[name="${name}"]`).forEach(cb => {
      cb.addEventListener('change', () => handleCheckbox(nameToKey[name], cb));
    });
  });

  document.getElementById('sortBy').addEventListener('change', e => {
    filters.sortBy = e.target.value;
    applyFilters();
  });

  document.getElementById('clearFilters').addEventListener('click', clearAllFilters);
}

function handleCheckbox(filterKey, checkbox) {
  const { value, checked, name } = checkbox;
  if (value === 'all') {
    if (checked) {
      filters[filterKey] = new Set(['all']);
      document.querySelectorAll(`input[name="${name}"]:not([value="all"])`).forEach(cb => { cb.checked = false; });
    }
  } else {
    if (checked) {
      filters[filterKey].delete('all');
      filters[filterKey].add(value);
      document.querySelector(`input[name="${name}"][value="all"]`).checked = false;
    } else {
      filters[filterKey].delete(value);
    }
    if (filters[filterKey].size === 0) {
      filters[filterKey].add('all');
      document.querySelector(`input[name="${name}"][value="all"]`).checked = true;
    }
  }
  applyFilters();
}

function clearAllFilters() {
  filters.search = '';
  filters.categories = new Set(['all']);
  filters.brands = new Set(['all']);
  filters.boxQuantities = new Set(['all']);
  filters.sizes = new Set(['all']);
  filters.sortBy = 'name-asc';

  document.getElementById('searchInput').value = '';
  document.getElementById('sortBy').value = 'name-asc';
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = cb.value === 'all'; });
  applyFilters();
}

// ── Filter + Sort + Render ────────────────────────────────────────────────────
function applyFilters() {
  filteredProducts = produtos.filter(p => {
    if (filters.search) {
      const s = filters.search;
      const hit = p.name.toLowerCase().includes(s)
        || p.brand.toLowerCase().includes(s)
        || (p.specification && p.specification.toLowerCase().includes(s))
        || (p.indication && p.indication.toLowerCase().includes(s));
      if (!hit) return false;
    }
    if (!filters.categories.has('all') && !filters.categories.has(p.category))       return false;
    if (!filters.brands.has('all') && !filters.brands.has(p.brand))                  return false;
    if (!filters.boxQuantities.has('all') && !filters.boxQuantities.has(String(p.box_quantity))) return false;
    if (!filters.sizes.has('all') && p.size && !filters.sizes.has(p.size))           return false;
    return true;
  });

  sortProducts();
  renderProducts();
}

function sortProducts() {
  switch (filters.sortBy) {
    case 'name-asc':  filteredProducts.sort((a, b) => a.name.localeCompare(b.name)); break;
    case 'name-desc': filteredProducts.sort((a, b) => b.name.localeCompare(a.name)); break;
    case 'newest':    filteredProducts.sort((a, b) => a.id - b.id); break;
  }
}

function renderProducts() {
  const grid      = document.getElementById('productsGrid');
  const noResults = document.getElementById('noResults');
  const count     = document.getElementById('resultsCount');
  const n         = filteredProducts.length;

  count.textContent = n === 0 ? 'Nenhum produto encontrado'
    : n === 1 ? '1 produto encontrado'
    : `${n} produtos encontrados`;

  if (n === 0) {
    grid.innerHTML = '';
    noResults.style.display = 'block';
    return;
  }
  noResults.style.display = 'none';

  grid.innerHTML = filteredProducts.map(p => `
    <div class="product-card" data-id="${p.id}" role="button" tabindex="0" aria-label="Ver detalhes de ${p.name}">
      <img src="${p.image_url}" alt="${p.name}" class="product-image" loading="lazy" />
      <div class="product-brand">${p.brand}</div>
      <h3 class="product-name">${p.name}</h3>
      ${p.size ? `<p class="product-size">${p.size}</p>` : ''}
      <div class="product-details">
        <div class="product-detail-item">
          <span class="product-detail-label">Categoria:</span>
          <span class="product-detail-value">${p.category}</span>
        </div>
        ${p.box_quantity ? `
        <div class="product-detail-item">
          <span class="product-detail-label">Caixa:</span>
          <span class="product-detail-value">${p.box_quantity} un</span>
        </div>` : ''}
        ${p.specification ? `
        <div class="product-detail-item">
          <span class="product-detail-label">Especificação:</span>
          <span class="product-detail-value">${p.specification}</span>
        </div>` : ''}
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click',   () => openModal(Number(card.dataset.id)));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openModal(Number(card.dataset.id)); });
  });
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function setupModal() {
  const overlay = document.getElementById('productModal');
  document.getElementById('modalClose').addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

function openModal(id) {
  const p = produtos.find(item => item.id === id);
  if (!p) return;

  document.getElementById('modalImage').src              = p.image_url;
  document.getElementById('modalImage').alt              = p.name;
  document.getElementById('modalName').textContent       = p.name;
  document.getElementById('modalBrand').textContent      = p.brand      || '—';
  document.getElementById('modalCategory').textContent   = p.category   || '—';
  document.getElementById('modalBoxQty').textContent     = p.box_quantity ? `${p.box_quantity} unidades` : '—';
  document.getElementById('modalSize').textContent       = p.size        || '—';
  document.getElementById('modalSpec').textContent       = p.specification || '—';
  document.getElementById('modalIndication').textContent = p.indication  || '—';

  const overlay = document.getElementById('productModal');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  document.getElementById('modalClose').focus();
}

function closeModal() {
  document.getElementById('productModal').classList.remove('active');
  document.body.style.overflow = '';
}
