const products = [
 {name:'Bansang',type:'Mesa de jantar',category:'Mesas',slug:'bansang',image:'bansang-01.jpg',designer:'Sung Sook Kim',description:'Base em metal pintado e tampo em lâmina de madeira ou laca. Disponível em formatos quadrados e retangulares, com prato giratório opcional.'},
 {name:'Patou',type:'Sofá',category:'Sofás',slug:'patou',image:'product-patou.jpg',designer:'Curadoria Clami',description:'Um sofá modular com base metálica pintada, assento e encosto estofados. A composição e as medidas são definidas sob consulta.'},
 {name:'Himalaya',type:'Cadeira',category:'Cadeiras',slug:'himalaya',image:'product-himalaya.jpg',designer:'Ricardo Bello Dias',description:'Madeira maciça tingida, assento e encosto estofados. Debrum e almofada opcionais. Uma criação de Ricardo Bello Dias.'},
 {name:'Mondrian',type:'Sofá',category:'Sofás',slug:'mondrian',image:'product-mondrian.jpg',designer:'Ricardo Bello Dias',description:'Sistema modular com base em couro, pés e quadro em lâmina, assento e encosto estofados. Opções de braço laminado, estofado ou misto.'},
 {name:'Mondrian',type:'Poltrona',category:'Poltronas',slug:'mondrian1',image:'product-mondrian1.jpg',designer:'Ricardo Bello Dias',description:'A poltrona da coleção Mondrian integra o acervo de design assinado por Ricardo Bello Dias. Consulte a Clami sobre acabamentos e medidas disponíveis.'},
 {name:'Matisse',type:'Mesa de jantar',category:'Mesas',slug:'jantar-matisse',image:'product-jantar-matisse.jpg',designer:'Ricardo Bello Dias',description:'Mesa de jantar da coleção Matisse, assinada por Ricardo Bello Dias. Consulte a equipe Clami para conhecer as configurações e os acabamentos.'},
 {name:'Pomme',type:'Sofá',category:'Sofás',slug:'pomme',image:'product-pomme.jpg',designer:'Curadoria Clami',description:'Sofá selecionado pela Curadoria Clami. Conheça pessoalmente as proporções, o conforto e as possibilidades para o seu ambiente.'},
 {name:'Matisse Orgânica',type:'Mesa de centro',category:'Mesas',slug:'matisse-organica',image:'product-matisse-organica.jpg',designer:'Ricardo Bello Dias',description:'Mesa de centro Matisse em formato orgânico, assinada por Ricardo Bello Dias. Acabamentos e medidas disponíveis sob consulta.'},
 {name:'Barcelona',type:'Mesa de cabeceira',category:'Mesas',slug:'barcelona',image:'product-barcelona.jpg',designer:'Curadoria Clami',description:'Mesa de cabeceira da Curadoria Clami. Consulte a equipe para escolher acabamentos e compor o seu ambiente.'},
 {name:'Mondrian',type:'Cama',category:'Camas',slug:'mondrian3',image:'product-mondrian3.jpg',designer:'Ricardo Bello Dias',description:'Cama da coleção Mondrian, assinada por Ricardo Bello Dias. Consulte a Clami para conhecer as configurações e os acabamentos.'},
 {name:'Mondrian',type:'Mesa de cabeceira',category:'Mesas',slug:'mondrian4',image:'product-mondrian4.jpg',designer:'Ricardo Bello Dias',description:'Mesa de cabeceira da coleção Mondrian, assinada por Ricardo Bello Dias. Consulte a equipe para compor o ambiente.'},
 {name:'Matisse',type:'Bandeja',category:'Acessórios',slug:'bandeja-matisse',image:'product-bandeja-matisse.jpg',designer:'Ricardo Bello Dias',description:'Coleção de bandejas Matisse, assinada por Ricardo Bello Dias. Conheça as possibilidades de composição nas lojas Clami.'}
];

// Future per-product AR assets: populate only after models are delivered and validated.
products.forEach(product => product.ar = { glb: null, usdz: null, enabled: false });
const contactConfig = { url: 'https://clami.com.br/contato/', whatsapp: null };
function contactUrl(product = '') {
 return contactConfig.whatsapp ? 'https://wa.me/' + contactConfig.whatsapp + '?text=' + encodeURIComponent('Olá! Gostaria de informações sobre ' + (product || 'os móveis Clami') + '.') : contactConfig.url;
}
