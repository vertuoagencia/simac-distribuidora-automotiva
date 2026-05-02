// Banco de dados local de produtos
// Cada objeto pode ter campos com nomes variados — use resolveField() para normalizar

function resolveField(product, keys) {
  for (const key of keys) {
    if (product[key] !== undefined && product[key] !== null && product[key] !== '') {
      return product[key];
    }
  }
  return '';
}

const DEFAULT_IMAGE = 'https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg?auto=compress&cs=tinysrgb&w=400';

function normalizeProduct(raw) {
  return {
    id:            resolveField(raw, ['id']),
    code:          resolveField(raw, ['codigo_sistema', 'code', 'codigo']),
    name:          resolveField(raw, ['nome_produto', 'name', 'nome']),
    brand:         resolveField(raw, ['marca', 'brand']),
    category:      resolveField(raw, ['categoria', 'category']),
    box_quantity:  resolveField(raw, ['quantidade_caixa', 'box_quantity', 'quantidade']),
    size:          resolveField(raw, ['quantidade_embalagem', 'size', 'volume']),
    specification: resolveField(raw, ['especificacoes', 'specification']),
    indication:    resolveField(raw, ['indicacao', 'indication']),
    image_url:     resolveField(raw, ['image_url', 'foto', 'imagem']) || DEFAULT_IMAGE,
  };
}

const rawProducts = [
  {
    id: 1,
    codigo_sistema: 'OL-001',
    nome_produto: 'Óleo Motor 5W30 Sintético',
    marca: 'Mobil',
    categoria: 'Óleos Lubrificantes',
    quantidade_caixa: 12,
    quantidade_embalagem: '1L',
    especificacoes: 'API SN/CF, ACEA A3/B4',
    indicacao: 'Motores a gasolina e diesel modernos',
    image_url: 'https://images.pexels.com/photos/1244952/pexels-photo-1244952.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 2,
    codigo_sistema: 'OL-002',
    nome_produto: 'Óleo Motor 10W40 Semi-Sintético',
    marca: 'Castrol',
    categoria: 'Óleos Lubrificantes',
    quantidade_caixa: 12,
    quantidade_embalagem: '1L',
    especificacoes: 'API SL/CF',
    indicacao: 'Motores gasolina, álcool e flex',
    image_url: 'https://images.pexels.com/photos/1599791/pexels-photo-1599791.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 3,
    codigo_sistema: 'OL-003',
    nome_produto: 'Óleo Motor 15W40 Mineral',
    marca: 'Shell',
    categoria: 'Óleos Lubrificantes',
    quantidade_caixa: 6,
    quantidade_embalagem: '5L',
    especificacoes: 'API CI-4/SL',
    indicacao: 'Motores diesel com e sem turbo',
    image_url: 'https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 4,
    codigo_sistema: 'FI-001',
    nome_produto: 'Filtro de Óleo Spin-On',
    marca: 'FRAM',
    categoria: 'Filtros',
    quantidade_caixa: 24,
    quantidade_embalagem: 'Unidade',
    especificacoes: 'Rosca 3/4-16 UNF',
    indicacao: 'Veículos leves a gasolina e flex',
    image_url: 'https://images.pexels.com/photos/4489702/pexels-photo-4489702.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 5,
    codigo_sistema: 'FI-002',
    nome_produto: 'Filtro de Ar Elemento Seco',
    marca: 'Filtros Brasil',
    categoria: 'Filtros',
    quantidade_caixa: 12,
    quantidade_embalagem: 'Unidade',
    especificacoes: 'Alta eficiência de filtragem',
    indicacao: 'Motores 1.0 a 2.0 flex',
    image_url: 'https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 6,
    codigo_sistema: 'FI-003',
    nome_produto: 'Filtro de Combustível Gasolina',
    marca: 'Filtros VOX',
    categoria: 'Filtros',
    quantidade_caixa: 24,
    quantidade_embalagem: 'Unidade',
    especificacoes: 'Pressão máx. 8 kgf/cm²',
    indicacao: 'Sistemas de injeção eletrônica',
    image_url: 'https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 7,
    codigo_sistema: 'FI-004',
    nome_produto: 'Filtro de Cabine Anti-Alérgico',
    marca: 'Filtros Brasil',
    categoria: 'Filtros',
    quantidade_caixa: 12,
    quantidade_embalagem: 'Unidade',
    especificacoes: 'Retém pólen, poeira e fuligem',
    indicacao: 'Ar-condicionado de veículos leves',
    image_url: 'https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 8,
    codigo_sistema: 'AD-001',
    nome_produto: 'Aditivo Radiador Concentrado',
    marca: 'Paraflu',
    categoria: 'Aditivos',
    quantidade_caixa: 12,
    quantidade_embalagem: '1L',
    especificacoes: 'Proteção até -37°C, base etileno glicol',
    indicacao: 'Sistemas de arrefecimento em geral',
    image_url: 'https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 9,
    codigo_sistema: 'AD-002',
    nome_produto: 'Descarbonizante Motor Spray',
    marca: 'Tecbril',
    categoria: 'Aditivos',
    quantidade_caixa: 12,
    quantidade_embalagem: '300ml',
    especificacoes: 'Remove depósitos de carbono',
    indicacao: 'Limpeza de injetores e câmara de combustão',
    image_url: 'https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 10,
    codigo_sistema: 'LU-001',
    nome_produto: 'Fluido de Freio DOT 4',
    marca: 'Motrio',
    categoria: 'Fluidos',
    quantidade_caixa: 12,
    quantidade_embalagem: '500ml',
    especificacoes: 'FMVSS 116 DOT 4, ponto de ebulição 230°C',
    indicacao: 'Sistemas de freio ABS e convencionais',
    image_url: 'https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 11,
    codigo_sistema: 'LU-002',
    nome_produto: 'Fluido de Transmissão ATF',
    marca: 'Idemitsu',
    categoria: 'Fluidos',
    quantidade_caixa: 12,
    quantidade_embalagem: '1L',
    especificacoes: 'Dexron III / Mercon V',
    indicacao: 'Câmbios automáticos em geral',
    image_url: 'https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 12,
    codigo_sistema: 'OL-004',
    nome_produto: 'Óleo de Câmbio Manual 75W90',
    marca: 'YPF',
    categoria: 'Óleos Lubrificantes',
    quantidade_caixa: 12,
    quantidade_embalagem: '1L',
    especificacoes: 'API GL-4/GL-5',
    indicacao: 'Câmbios manuais e diferenciais',
    image_url: 'https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

const produtos = rawProducts.map(normalizeProduct);

export { produtos, normalizeProduct, resolveField, DEFAULT_IMAGE };
