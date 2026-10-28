// Dados das linhas. REGRA: só entra aqui o que for confirmado em fonte oficial.
// status: "confirmada" | "nao_confirmada"
// paradas/trajeto: listas [lat, lng]; deixe vazio [] enquanto não houver fonte.
window.LINHAS = [
  {
    id: "445-ref",
    numero: "445 / 445I (a confirmar)",
    nome: "Referência do projeto: Belford Roxo → Nova Iguaçu (via Via Light?)",
    status: "nao_confirmada",
    origem: "Supermarket Santa Amélia, Av. Joaquim da Costa Lima, Belford Roxo",
    destino: "SENAI Nova Iguaçu",
    // Locais de referência (buscados no mapa pelo OpenStreetMap, NÃO são paradas confirmadas):
    consultas: [
      { rotulo: "Origem de referência", texto: "Supermarket Santa Amélia, Belford Roxo, RJ" },
      { rotulo: "Destino de referência", texto: "SENAI Nova Iguaçu, RJ" }
    ],
    paradas: [],
    trajeto: [],
    fonte: null
  }
];
