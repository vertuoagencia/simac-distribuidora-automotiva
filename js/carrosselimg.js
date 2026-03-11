// Banco de marcas
const brands = [
  { name: "ACDELCO", logo: "https://i.postimg.cc/J456xcB6/1.png", link: "#"},
  { name: "TRW VARGAS", logo: "https://i.postimg.cc/J456xcBx/2.png", link: "#"},
  { name: "BPROAUTO", logo: "https://i.postimg.cc/rFNnjCtg/3.png", link: "#"},
  { name: "CAROLLCLEAN", logo: "https://i.postimg.cc/15rCBcNv/4.png", link: "#"},
  { name: "MOBIL", logo: "https://i.postimg.cc/m2yXjNFd/5.png", link: "#"},
  { name: "PARAFLU", logo: "https://i.postimg.cc/5NS7gqFK/6.png", link: "#"},
  { name: "YPF", logo: "https://i.postimg.cc/vHtqhL6S/7.png", link: "#"},
  { name: "TECBRIL", logo: "https://i.postimg.cc/020WndJB/8.png", link: "#"},
  { name: "RADNAQ", logo: "https://i.postimg.cc/J0HwtT7s/9.png", link: "#"},
  { name: "MENZOIL", logo: "https://i.postimg.cc/SN86fWJ7/10.png", link: "#"},
  { name: "EVOQUE", logo: "https://i.postimg.cc/8PmK4Br9/11.png", link: "#"},
  { name: "HONDA", logo: "https://i.postimg.cc/J456xcBS/12.png", link: "#"},
  { name: "MOPAR", logo: "https://i.postimg.cc/MKmP5bjh/13.png", link: "#"},
  { name: "TOYOTA", logo: "https://i.postimg.cc/dtjH6mTb/14.png", link: "#"},
  { name: "IDEMITSU", logo: "https://i.postimg.cc/ncGR2YD8/15.png", link: "#"},
  { name: "MOTORCRAFT", logo: "https://i.postimg.cc/8PmK4B6Q/16.png", link: "#"},
  { name: "OMNICRAFT", logo: "https://i.postimg.cc/fTf2Cj9N/17.png", link: "#"},
  { name: "TIGER AUTO", logo: "https://i.postimg.cc/m2yXjNH4/18.png", link: "#"},
  { name: "MOTORLUB", logo: "https://i.postimg.cc/Gm3M58kf/19.png", link: "#"},
  { name: "SYNTHETIC", logo: "https://i.postimg.cc/JzpW6H2Y/20.png", link: "#"},
  { name: "CASTROL", logo: "https://i.postimg.cc/dVQWxk8z/21.png", link: "#"},
  { name: "SHELL", logo: "https://i.postimg.cc/BnZhVLT9/22.png", link: "#"},
  { name: "PETRONAS", logo: "https://i.postimg.cc/Fsfcs0jy/23.png", link: "#"},
  { name: "RADIBRAS", logo: "https://i.postimg.cc/3xrLc4XQ/24.png", link: "#"},
  { name: "IPIRANGA", logo: "https://i.postimg.cc/xCSgLtPk/25.png", link: "#"},
  { name: "ROYAL", logo: "https://i.postimg.cc/t4RrMZ3y/26.png", link: "#"},
  { name: "NISSAN", logo: "https://i.postimg.cc/QdN6y9Q3/27.png", link: "#"},
  { name: "LUBRAX", logo: "https://i.postimg.cc/2SjHKbQz/28.png", link: "#"},
  { name: "MOTRIO", logo: "https://i.postimg.cc/sgfnNQY3/29.png", link: "#"},
  { name: "FRAM", logo: "https://i.postimg.cc/FHFPBdyF/30.png", link: "#"},
  { name: "DELPHI TECHNOLOGIES", logo: "https://i.postimg.cc/13RWjnG5/31.png", link: "#"},
  { name: "W-FLEX", logo: "https://i.postimg.cc/RZCPD67F/32.png", link: "#"},
  { name: "FILTROS BRASIL", logo: "https://i.postimg.cc/rwyhP01p/33.png", link: "#"},
  { name: "ROAD FLEX", logo: "https://i.postimg.cc/Z5YfMB8C/34.png", link: "#"},
  { name: "ELF", logo: "https://i.postimg.cc/ht4C5zLX/35.png", link: "#"},
  { name: "TIRRENO", logo: "https://i.postimg.cc/Z5YfMB8B/36.png", link: "#"},
  { name: "FILTROS VOX", logo: "https://i.postimg.cc/W1p9HFGq/37.png", link: "#"},
  { name: "PERFORMANCE MAX", logo: "https://i.postimg.cc/2SHHRkG8/38.png", link: "#"},
  { name: "EXCEL AUTOMOTIVE", logo: "https://i.postimg.cc/vZPPFYhZ/39.png", link: "#"},
  { name: "NCA", logo: "https://i.postimg.cc/K899SGfz/40.png", link: "#"},
  { name: "VR LUB", logo: "https://i.postimg.cc/52PPd4gt/41.png", link: "#"},
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