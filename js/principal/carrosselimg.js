// Banco de marcas
const brands = [
  { name: "ACDELCO", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/01-acdelco.svg", link: "#" },
  { name: "TRW VARGA", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/02-trw-varga.svg", link: "#" },
  { name: "BPROAUTO", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/03-bproauto.svg", link: "#" },
  { name: "CAROLLCLEAN", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/04-carollclean.svg", link: "#" },
  { name: "MOBIL", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/05-mobil.svg", link: "#" },
  { name: "PARAFLU", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/06-paraflu.svg", link: "#" },
  { name: "YPF", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/07-ypf.svg", link: "#" },
  { name: "TECBRIL", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/08-tecbril.svg", link: "#" },
  { name: "RADNAQ", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/09-radnaq.svg", link: "#" },
  { name: "MENZOIL", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/10-menzoil.svg", link: "#" },
  { name: "EVOQUE", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/11-evoque.svg", link: "#" },
  { name: "HONDA", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/12-honda.svg", link: "#" },
  { name: "MOPAR", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/13-mopar.svg", link: "#" },
  { name: "TOYOTA", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/14-toyota.svg", link: "#" },
  { name: "IDEMITSU", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/15-idemitsu.svg", link: "#" },
  { name: "MOTORCRAFT", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/16-motorcraft.svg", link: "#" },
  { name: "OMNICRAFT", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/17-omnicraft.svg", link: "#" },
  { name: "TIGER AUTO", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/18-tiger-auto.svg", link: "#" },
  { name: "MOTORLUB", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/19-motorlub.png", link: "#" },
  { name: "SYNTHETIC", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/20-synthetic.svg", link: "#" },
  { name: "CASTROL", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/21-castrol.svg", link: "#" },
  { name: "SHELL", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/22-shell.svg", link: "#" },
  { name: "PETRONAS", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/23-petronas.svg", link: "#" },
  { name: "RADIBRAS", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/24-radibras.svg", link: "#" },
  { name: "IPIRANGA", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/25-ipiranga.svg", link: "#" },
  { name: "ROYAL", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/26-royal.svg", link: "#" },
  { name: "NISSAN", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/27-nissan.svg", link: "#" },
  { name: "LUBRAX", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/28-lubrax.svg", link: "#" },
  { name: "MOTRIO", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/29-motrio.svg", link: "#" },
  { name: "BARDAHL", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/30-bardahl.svg", link: "#" },
  { name: "FRAM", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/31-fram.svg", link: "#" },
  { name: "DELPHI TECHNOLOGIES", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/32-delphi-technolies.png", link: "#" },
  { name: "W-FLEX", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/33-w-flex.png", link: "#" },
  { name: "FILTROS BRASIL", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/34-filtros-brasil.png", link: "#" },
  { name: "ROAD FLEX", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/35-road-flex.png", link: "#" },
  { name: "ELF", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/36-elf.png", link: "#" },
  { name: "TIRRENO", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/37-tirreno.png", link: "#" },
  { name: "FILTROS VOX", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/38-vox-filtros.png", link: "#" },
  { name: "WEGA ORIGINAL QUALITY", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/39-wega-original-quality.png", link: "#" },
  { name: "EXCEL AUTOMOTIVE", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/40-excel-automotive.png", link: "#" },
  { name: "NCA", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/41-nca.png", link: "#" },
  { name: "VR LUB", logo: "https://vertuoagencia.github.io/simac-automotiva-dados/img/carrossel/42-vr-lub.png", link: "#" },
];

document.addEventListener("DOMContentLoaded", () => {
  const brandTrack = document.getElementById("brandTrack");

  brands.forEach(brand => {
    const brandItem = document.createElement("a");
    brandItem.href = brand.link;
    brandItem.classList.add("brand-item");
    brandItem.target = "_blank";

    const img = document.createElement("img");
    img.src = brand.logo;
    img.alt = brand.name;

    brandItem.appendChild(img);
    brandTrack.appendChild(brandItem);
  });

  // Duplica para efeito infinito
  brandTrack.innerHTML += brandTrack.innerHTML;
});