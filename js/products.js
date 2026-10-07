const products = [
  //  CROCHÊ & AMIGURUMI (category: "croche") - IDs 1 a 6
  {
    id: 1,
    title: "E-book & Molde: Amigurumi Ursinho Boho",
    category: "croche",
    price: 24.9,
    image: "assets/img/Amigurumi-Ursinho-Boho.png",
    description:
      "Receita passo a passo em PDF com fotos detalhadas e lista de fios.",
  },
  {
    id: 2,
    title: "Guia de Crochê: Tapetes Modernos",
    category: "croche",
    price: 29.9,
    image: "assets/img/Tapetes-Modernos.jpg",
    description:
      "Padrões geométricos e gráficos para renovar a decoração da casa.",
  },
  {
    id: 3,
    title: "E-book Bolsa de Fio de Malha no Crochê",
    category: "croche",
    price: 27.5,
    image: "assets/img/Bolsa-de-Croche-com-Fio-de-Malha.jpeg",
    description:
      "Aprenda a estruturar bolsas estilosas com pontos estruturados.",
  },
  {
    id: 4,
    title: "Coleção Amigurumi: Bichinhos da Floresta",
    category: "croche",
    price: 39.9,
    image: "assets/img/Bichinhos-da-Floresta.png",
    description:
      "Pacote com 5 receitas exclusivas: raposa, cervo, urso, coelho e esquilo.",
  },
  {
    id: 5,
    title: "Manual de Pontos Fantasia em Crochê",
    category: "croche",
    price: 19.9,
    image: "assets/img/Pontos-Fantasia-em-Crochê.png",
    description:
      "Guia visual com 30 variações de pontos e dicas de arremate perfeito.",
  },
  {
    id: 6,
    title: "Apostila de Crochê Terapêutico",
    category: "croche",
    price: 31.9,
    image: "assets/img/croche-terapeutico.png",
    description:
      "Aprenda a tecer tops, quimonos e saídas de praia com caimento impecável.",
  },

  // BORDADO & COSTURA (category: "bordado") - IDs 7 a 12
  {
    id: 7,
    title: "Apostila de Bordado Livre para Iniciantes",
    category: "bordado",
    price: 29.9,
    image: "assets/img/Bordado-Livre-para-Iniciantes.jpg",
    description:
      "Guia ilustrado com 12 pontos fundamentais e 5 riscos prontos para imprimir.",
  },
  {
    id: 8,
    title: "Kit Digital: Moldes de Costura Criativa",
    category: "bordado",
    price: 34.9,
    image: "assets/img/Moldes-de-Costura-Criativa.jpg",
    description:
      "Moldes em tamanho real para bolsas, estojos e organizadores de tecido.",
  },
  {
    id: 9,
    title: "Guia Botânico de Bordado em Bastidor",
    category: "bordado",
    price: 32.0,
    image: "assets/img/Botânico-de-Bordado-em-Bastidor.png",
    description: "Riscos de flores e folhagens com paletas de cores indicadas.",
  },
  {
    id: 10,
    title: "E-book Costura do Zero: Roupas Leves",
    category: "bordado",
    price: 45.0,
    image: "assets/img/Costura-do-Zero-Roupas-Leves.png",
    description:
      "Aprenda a cortar, costurar e dar acabamento em saias e blusas simples.",
  },
  {
    id: 11,
    title: "Coleção Riscos de Aquarela para Bordar",
    category: "bordado",
    price: 22.9,
    image: "assets/img/Coleção-Riscos-de-Aquarela-para-Bordar.png",
    description:
      "Técnica mista de pintura em tecido combinada com pontos de bordado.",
  },
  {
    id: 12,
    title: "Apostila de Punch Needle & Agulha Mágica",
    category: "bordado",
    price: 26.5,
    image: "assets/img/punch-needle.png",
    description:
      "Guia prático para criar quadros em relevo e flâmulas decorativas.",
  },

  // CERÂMICA & DECORAÇÃO (category: "ceramica") - IDs 13 a 18
  {
    id: 13,
    title: "Guia de Cerâmica",
    category: "ceramica",
    price: 39.9,
    image: "assets/img/Guia-de-Cerâmica.png",
    description:
      "Técnicas de modelagem sem forno profissional e dicas de acabamento.",
  },
  {
    id: 14,
    title: "E-book Macramê Moderno: Painéis e Suportes",
    category: "ceramica",
    price: 27.5,
    image: "assets/img/Macramê-Moderno.jpg",
    description:
      "Aprenda os nós principais e crie peças decorativas incríveis para casa.",
  },
  {
    id: 15,
    title: "Apostila de Vela Artesanal Aromática",
    category: "ceramica",
    price: 31.9,
    image: "assets/img/Vela-Artesanal-Aromática.jpg",
    description:
      "Passo a passo para produção de velas ecológicas de cera de soja.",
  },
  {
    id: 16,
    title: "Guia Prático de Saboaria Natural",
    category: "ceramica",
    price: 35.0,
    image: "assets/img/Saboaria-Natural.png",
    description:
      "Formulações para sabonetes artesanais, fitoterápicos e esfoliantes.",
  },
  {
    id: 17,
    title: "Manual de Kintsugi: A Arte da Restauração",
    category: "ceramica",
    price: 28.0,
    image: "assets/img/Kintsugi.jpg",
    description:
      "Técnica japonesa de reparar cerâmicas quebradas com detalhes em ouro.",
  },
  {
    id: 18,
    title: "E-book Pintura em Cerâmica & Terracota",
    category: "ceramica",
    price: 23.9,
    image: "assets/img/ceramica-terracota.png",
    description:
      "Passo a passo para impermeabilizar, pintar e decorar vasos e pratos artesanais.",
  },

  // PAPELARIA & ORGANIZAÇÃO (category: "papelaria") - IDs 19 a 24
  {
    id: 19,
    title: "Kit Ideias de Planner: Como enfeitar seu mês",
    category: "papelaria",
    price: 19.9,
    image: "assets/img/ideias-planner.png",
    description: "Ideias para enfeitar seu planner mensal.",
  },
  {
    id: 20,
    title: "Kit Encadernação Artesanal & Coptas",
    category: "papelaria",
    price: 33.9,
    image: "assets/img/Encadernação-Artesanal-Coptas.png",
    description:
      "Aprenda a produzir seus próprios cadernos, agendas e Sketchbooks.",
  },
  {
    id: 21,
    title: "Guia de Lettering para Iniciantes",
    category: "papelaria",
    price: 25.0,
    image: "assets/img/Lettering-para-Iniciantes.png",
    description:
      "Exercícios de caligrafia e desenho de letras para quadros e convites.",
  },
  {
    id: 22,
    title: "Guia Bullet Journal",
    category: "papelaria",
    price: 14.9,
    image: "assets/img/bullet-journal.png",
    description: "Ideias para criar e enfeitar seu bullet journal",
  },
  {
    id: 23,
    title: "E-book Origami & Arte em Papel",
    category: "papelaria",
    price: 21.9,
    image: "assets/img/Origami-Arte-em-Papel.png",
    description:
      "Diagramas passo a passo de dobras tradicionais e esculturas de papel.",
  },
  {
    id: 24,
    title: "Apostila de Cartonagem e Caixas Personalizadas",
    category: "papelaria",
    price: 29.9,
    image: "assets/img/cartonagem.png",
    description:
      "Técnicas de corte e revestimento para criar caixas rígidas de presente e organizadores.",
  },
];
