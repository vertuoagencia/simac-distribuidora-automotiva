import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

let allProducts = [];
let allCategories = [];
let allBrands = [];
let allSizes = [];
let filteredProducts = [];

const filters = {
  search: '',
  categories: new Set(['all']),
  brands: new Set(['all']),
  boxQuantities: new Set(['all']),
  sizes: new Set(['all']),
  sortBy: 'name-asc'
};

async function loadData() {
  try {
    // Se quiser forçar tabela específica, defina em .env.local:
    // VITE_SUPABASE_TABLE=nome_da_tabela
    const configuredTable = import.meta.env.VITE_SUPABASE_TABLE;

    const knownTableNames = ['products', 'produtos', 'produto', 'produto_simac', 'tbl_produtos', 'produtos_simac'];
    if (configuredTable) {
      knownTableNames.unshift(configuredTable);
    }

    let tableName;
    if (configuredTable) {
      console.log('Usando tabela configurada:', configuredTable);
      tableName = configuredTable;
    }

    let tableNames = [];
    try {
      const { data: tablesData, error: tableError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');

      if (!tableError && tablesData) {
        tableNames = tablesData.map(t => t.table_name);
      }
    } catch (error) {
      console.warn('Não foi possível consultar information_schema.tables:', error.message);
    }

    const found = knownTableNames.find(name => tableNames.includes(name));

    if (!tableName) {
      if (found) {
        tableName = found;
      } else {
        for (const candidate of knownTableNames) {
          const { data: testData, error: testError } = await supabase
            .from(candidate)
            .select('id')
            .limit(1);

          if (!testError && testData) {
            tableName = candidate;
            break;
          }
        }

        if (!tableName && tableNames.length > 0) {
          tableName = tableNames[0];
        }
      }
    }

    if (!tableName) {
      throw new Error('Nenhuma tabela de produtos encontrada. Configure VITE_SUPABASE_TABLE no .env.local ou revise o nome exato da tabela no Supabase.');
    }

    console.log('Tabela escolhida para produtos:', tableName);

    const { data: productsData, error: productsError } = await supabase
      .from(tableName)
      .select('*')
      .order('id', { ascending: true });

    if (productsError) {
      throw productsError;
    }

    // Transformar dados para o formato esperado pelo app
    const resolveField = (product, keys) => {
      for (const key of keys) {
        if (product[key] !== undefined && product[key] !== null && product[key] !== '') {
          return product[key];
        }
      }
      return '';
    };

    allProducts = (productsData || []).map(product => {
      const id = resolveField(product, ['id']);
      return {
        id,
        code: resolveField(product, ['codigo_sistema', 'code', 'codigo']),
        name: resolveField(product, ['nome_produto', 'name', 'nome']),
        brand: resolveField(product, ['marca', 'brand']),
        category: resolveField(product, ['categoria', 'category']),
        box_quantity: resolveField(product, ['quantidade_caixa', 'box_quantity', 'quantidade']),
        size: resolveField(product, ['quantidade_embalagem', 'size', 'volume']),
        specification: resolveField(product, ['especificacoes', 'specification']),
        indication: resolveField(product, ['indicacao', 'indication']),
        image_url: resolveField(product, ['image_url', 'foto', 'imagem']) || 'https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg?auto=compress&cs=tinysrgb&w=400',
      };
    });

    // Extrair categorias, marcas e tamanhos únicos dos dados
    allCategories = [...new Set(allProducts.map(p => p.category).filter(c => c))].sort();
    allBrands = [...new Set(allProducts.map(p => p.brand).filter(b => b))].sort();
    allSizes = [...new Set(allProducts.map(p => p.size).filter(s => s))].sort();

    console.log('Produtos carregados:', allProducts.length);
    console.log('Categorias:', allCategories);
    console.log('Marcas:', allBrands);
    console.log('Tamanhos:', allSizes);

    populateFilters();
    applyFilters();
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    showError('Erro ao carregar produtos. Verifique a conexão com o Supabase.');
  }
}

function populateFilters() {
  const categoryFiltersContainer = document.getElementById('categoryFilters');
  const brandFiltersContainer = document.getElementById('brandFilters');
  const boxQuantityFiltersContainer = document.getElementById('boxQuantityFilters');
  const sizeFiltersContainer = document.getElementById('sizeFilters');

  // Categorias
  categoryFiltersContainer.innerHTML = `
    <label class="filter-option">
      <input type="checkbox" name="category" value="all" checked />
      <span>Todas as categorias</span>
    </label>
  `;

  allCategories.forEach(category => {
    const label = document.createElement('label');
    label.className = 'filter-option';
    label.innerHTML = `
      <input type="checkbox" name="category" value="${category}" />
      <span>${category}</span>
    `;
    categoryFiltersContainer.appendChild(label);
  });

  // Marcas
  brandFiltersContainer.innerHTML = `
    <label class="filter-option">
      <input type="checkbox" name="brand" value="all" checked />
      <span>Todas as marcas</span>
    </label>
  `;

  allBrands.forEach(brand => {
    const label = document.createElement('label');
    label.className = 'filter-option';
    label.innerHTML = `
      <input type="checkbox" name="brand" value="${brand}" />
      <span>${brand}</span>
    `;
    brandFiltersContainer.appendChild(label);
  });

  // Quantidade por Caixa
  const boxQuantities = [...new Set(allProducts.map(p => p.box_quantity).filter(q => q))].sort((a, b) => a - b);

  boxQuantityFiltersContainer.innerHTML = `
    <label class="filter-option">
      <input type="checkbox" name="boxQuantity" value="all" checked />
      <span>Todas</span>
    </label>
  `;

  boxQuantities.forEach(quantity => {
    const label = document.createElement('label');
    label.className = 'filter-option';
    label.innerHTML = `
      <input type="checkbox" name="boxQuantity" value="${quantity}" />
      <span>${quantity} unidades</span>
    `;
    boxQuantityFiltersContainer.appendChild(label);
  });

  // Tamanho/Volume
  sizeFiltersContainer.innerHTML = `
    <label class="filter-option">
      <input type="checkbox" name="size" value="all" checked />
      <span>Todos os tamanhos</span>
    </label>
  `;

  allSizes.forEach(size => {
    const label = document.createElement('label');
    label.className = 'filter-option';
    label.innerHTML = `
      <input type="checkbox" name="size" value="${size}" />
      <span>${size}</span>
    `;
    sizeFiltersContainer.appendChild(label);
  });

  setupFilterListeners();
}

function setupFilterListeners() {
  // Busca
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', (e) => {
    filters.search = e.target.value.toLowerCase();
    applyFilters();
  });

  // Categoria
  document.querySelectorAll('input[name="category"]').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      handleCheckboxChange('categories', e.target);
    });
  });

  // Marca
  document.querySelectorAll('input[name="brand"]').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      handleCheckboxChange('brands', e.target);
    });
  });

  // Quantidade por Caixa
  document.querySelectorAll('input[name="boxQuantity"]').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      handleCheckboxChange('boxQuantities', e.target);
    });
  });

  // Tamanho/Volume
  document.querySelectorAll('input[name="size"]').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      handleCheckboxChange('sizes', e.target);
    });
  });

  // Ordenação
  const sortBySelect = document.getElementById('sortBy');
  sortBySelect.addEventListener('change', (e) => {
    filters.sortBy = e.target.value;
    applyFilters();
  });

  // Limpar Filtros
  const clearFiltersBtn = document.getElementById('clearFilters');
  clearFiltersBtn.addEventListener('click', clearAllFilters);
}

function handleCheckboxChange(filterType, checkbox) {
  const value = checkbox.value;
  const isChecked = checkbox.checked;

  if (value === 'all') {
    if (isChecked) {
      filters[filterType] = new Set(['all']);
      document.querySelectorAll(`input[name="${checkbox.name}"]:not([value="all"])`).forEach(cb => {
        cb.checked = false;
      });
    }
  } else {
    if (isChecked) {
      filters[filterType].delete('all');
      filters[filterType].add(value);
      document.querySelector(`input[name="${checkbox.name}"][value="all"]`).checked = false;
    } else {
      filters[filterType].delete(value);
    }

    if (filters[filterType].size === 0) {
      filters[filterType].add('all');
      document.querySelector(`input[name="${checkbox.name}"][value="all"]`).checked = true;
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

  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.checked = checkbox.value === 'all';
  });

  applyFilters();
}

function applyFilters() {
  filteredProducts = allProducts.filter(product => {
    // Busca por nome, marca ou especificações
    if (filters.search) {
      const searchLower = filters.search;
      const matchesSearch = 
        product.name.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower) ||
        (product.specification && product.specification.toLowerCase().includes(searchLower)) ||
        (product.indication && product.indication.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }

    // Categoria
    if (!filters.categories.has('all') && !filters.categories.has(product.category)) {
      return false;
    }

    // Marca
    if (!filters.brands.has('all') && !filters.brands.has(product.brand)) {
      return false;
    }

    // Quantidade por Caixa
    if (!filters.boxQuantities.has('all') && !filters.boxQuantities.has(String(product.box_quantity))) {
      return false;
    }

    // Tamanho/Volume
    if (!filters.sizes.has('all') && product.size && !filters.sizes.has(product.size)) {
      return false;
    }

    return true;
  });

  sortProducts();
  renderProducts();
}

function sortProducts() {
  switch (filters.sortBy) {
    case 'name-asc':
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'newest':
      filteredProducts.sort((a, b) => a.id - b.id);
      break;
    default:
      break;
  }
}

function renderProducts() {
  const productsGrid = document.getElementById('productsGrid');
  const noResults = document.getElementById('noResults');
  const resultsCount = document.getElementById('resultsCount');

  const count = filteredProducts.length;
  resultsCount.textContent = count === 0 ? 'Nenhum produto encontrado' :
    count === 1 ? '1 produto encontrado' : `${count} produtos encontrados`;

  if (count === 0) {
    productsGrid.innerHTML = '';
    noResults.style.display = 'block';
    return;
  }

  noResults.style.display = 'none';

  productsGrid.innerHTML = filteredProducts.map(product => {
    return `
      <div class="product-card">
        <img src="${product.image_url}" alt="${product.name}" class="product-image" />
        <div class="product-brand">${product.brand}</div>
        <h3 class="product-name">${product.name}</h3>
        ${product.size ? `<p class="product-size">${product.size}</p>` : ''}
        <div class="product-details">
          <div class="product-detail-item">
            <span class="product-detail-label">Categoria:</span>
            <span class="product-detail-value">${product.category}</span>
          </div>
          ${product.box_quantity ? `
            <div class="product-detail-item">
              <span class="product-detail-label">Caixa:</span>
              <span class="product-detail-value">${product.box_quantity} un</span>
            </div>
          ` : ''}
          ${product.specification ? `
            <div class="product-detail-item">
              <span class="product-detail-label">Especificação:</span>
              <span class="product-detail-value">${product.specification}</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function showError(message) {
  const productsGrid = document.getElementById('productsGrid');
  productsGrid.innerHTML = `
    <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #dc3545; font-family: 'DM Sans', sans-serif;">
      <h3>${message}</h3>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  loadData();
});

function populateFilters() {
  const categoryFiltersContainer = document.getElementById('categoryFilters');
  const brandFiltersContainer = document.getElementById('brandFilters');
  const boxQuantityFiltersContainer = document.getElementById('boxQuantityFilters');
  const sizeFiltersContainer = document.getElementById('sizeFilters');

  // Categorias
  categoryFiltersContainer.innerHTML = `
    <label class="filter-option">
      <input type="checkbox" name="category" value="all" checked />
      <span>Todas as categorias</span>
    </label>
  `;

  allCategories.forEach(category => {
    const label = document.createElement('label');
    label.className = 'filter-option';
    label.innerHTML = `
      <input type="checkbox" name="category" value="${category.id}" />
      <span>${category.name}</span>
    `;
    categoryFiltersContainer.appendChild(label);
  });

  // Marcas
  brandFiltersContainer.innerHTML = `
    <label class="filter-option">
      <input type="checkbox" name="brand" value="all" checked />
      <span>Todas as marcas</span>
    </label>
  `;

  allBrands.forEach(brand => {
    const label = document.createElement('label');
    label.className = 'filter-option';
    label.innerHTML = `
      <input type="checkbox" name="brand" value="${brand.id}" />
      <span>${brand.name}</span>
    `;
    brandFiltersContainer.appendChild(label);
  });

  // Quantidade por Caixa
  const boxQuantities = [...new Set(allProducts.map(p => p.box_quantity).filter(q => q))].sort((a, b) => a - b);

  boxQuantityFiltersContainer.innerHTML = `
    <label class="filter-option">
      <input type="checkbox" name="boxQuantity" value="all" checked />
      <span>Todas</span>
    </label>
  `;

  boxQuantities.forEach(quantity => {
    const label = document.createElement('label');
    label.className = 'filter-option';
    label.innerHTML = `
      <input type="checkbox" name="boxQuantity" value="${quantity}" />
      <span>${quantity} unidades</span>
    `;
    boxQuantityFiltersContainer.appendChild(label);
  });

  // Tamanho/Volume
  const sizes = [...new Set(allProducts.map(p => p.size || p.specification).filter(s => s))].sort();

  sizeFiltersContainer.innerHTML = `
    <label class="filter-option">
      <input type="checkbox" name="size" value="all" checked />
      <span>Todos os tamanhos</span>
    </label>
  `;

  sizes.forEach(size => {
    const label = document.createElement('label');
    label.className = 'filter-option';
    label.innerHTML = `
      <input type="checkbox" name="size" value="${size}" />
      <span>${size}</span>
    `;
    sizeFiltersContainer.appendChild(label);
  });

  setupFilterListeners();
}

function setupFilterListeners() {
  // Busca
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', (e) => {
    filters.search = e.target.value.toLowerCase();
    applyFilters();
  });

  // Categoria
  document.querySelectorAll('input[name="category"]').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      handleCheckboxChange('categories', e.target);
    });
  });

  // Marca
  document.querySelectorAll('input[name="brand"]').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      handleCheckboxChange('brands', e.target);
    });
  });

  // Quantidade por Caixa
  document.querySelectorAll('input[name="boxQuantity"]').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      handleCheckboxChange('boxQuantities', e.target);
    });
  });

  // Tamanho/Volume
  document.querySelectorAll('input[name="size"]').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      handleCheckboxChange('sizes', e.target);
    });
  });

  // Ordenação
  const sortBySelect = document.getElementById('sortBy');
  sortBySelect.addEventListener('change', (e) => {
    filters.sortBy = e.target.value;
    applyFilters();
  });

  // Limpar Filtros
  const clearFiltersBtn = document.getElementById('clearFilters');
  clearFiltersBtn.addEventListener('click', clearAllFilters);
}

function handleCheckboxChange(filterType, checkbox) {
  const value = checkbox.value;
  const isChecked = checkbox.checked;

  if (value === 'all') {
    if (isChecked) {
      filters[filterType] = new Set(['all']);
      document.querySelectorAll(`input[name="${checkbox.name}"]:not([value="all"])`).forEach(cb => {
        cb.checked = false;
      });
    }
  } else {
    if (isChecked) {
      filters[filterType].delete('all');
      filters[filterType].add(value);
      document.querySelector(`input[name="${checkbox.name}"][value="all"]`).checked = false;
    } else {
      filters[filterType].delete(value);
    }

    if (filters[filterType].size === 0) {
      filters[filterType].add('all');
      document.querySelector(`input[name="${checkbox.name}"][value="all"]`).checked = true;
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

  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.checked = checkbox.value === 'all';
  });

  applyFilters();
}

function applyFilters() {
  filteredProducts = allProducts.filter(product => {
    // Busca
    if (filters.search && !product.name.toLowerCase().includes(filters.search) &&
        !product.description?.toLowerCase().includes(filters.search)) {
      return false;
    }

    // Categoria
    if (!filters.categories.has('all') && !filters.categories.has(product.category_id)) {
      return false;
    }

    // Marca
    if (!filters.brands.has('all') && !filters.brands.has(product.brand_id)) {
      return false;
    }

    // Quantidade por Caixa
    if (!filters.boxQuantities.has('all') && !filters.boxQuantities.has(String(product.box_quantity))) {
      return false;
    }

    // Tamanho/Volume
    const productSize = product.size || product.specification;
    if (!filters.sizes.has('all') && productSize && !filters.sizes.has(productSize)) {
      return false;
    }

    return true;
  });

  sortProducts();
  renderProducts();
}

function sortProducts() {
  switch (filters.sortBy) {
    case 'name-asc':
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'newest':
      filteredProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      break;
    default:
      break;
  }
}

function renderProducts() {
  const productsGrid = document.getElementById('productsGrid');
  const noResults = document.getElementById('noResults');
  const resultsCount = document.getElementById('resultsCount');

  const count = filteredProducts.length;
  resultsCount.textContent = count === 0 ? 'Nenhum produto encontrado' :
    count === 1 ? '1 produto encontrado' : `${count} produtos encontrados`;

  if (count === 0) {
    productsGrid.innerHTML = '';
    noResults.style.display = 'block';
    return;
  }

  noResults.style.display = 'none';

  productsGrid.innerHTML = filteredProducts.map(product => {
    const categoryName = product.category?.name || 'Sem categoria';
    const brandName = product.brand?.name || 'Sem marca';
    const imageUrl = product.image_url || 'https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg?auto=compress&cs=tinysrgb&w=400';
    const productSize = product.size || product.specification || '';

    return `
      <div class="product-card">
        <img src="${imageUrl}" alt="${product.name}" class="product-image" />
        <div class="product-brand">${brandName}</div>
        <h3 class="product-name">${product.name}</h3>
        ${productSize ? `<p class="product-size">${productSize}</p>` : ''}
        <div class="product-details">
          <div class="product-detail-item">
            <span class="product-detail-label">Categoria:</span>
            <span class="product-detail-value">${categoryName}</span>
          </div>
          ${product.box_quantity ? `
            <div class="product-detail-item">
              <span class="product-detail-label">Caixa:</span>
              <span class="product-detail-value">${product.box_quantity} un</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function showError(message) {
  const productsGrid = document.getElementById('productsGrid');
  productsGrid.innerHTML = `
    <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #dc3545; font-family: 'DM Sans', sans-serif;">
      <h3>${message}</h3>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  loadData();
});
