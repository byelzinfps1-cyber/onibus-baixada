# Ônibus Ao Vivo — Baixada Fluminense

Site (HTML, CSS e JavaScript) com mapa Leaflet + OpenStreetMap, começando por Belford Roxo e Nova Iguaçu.

## Arquivos
- `index.html` — estrutura da tela
- `style.css` — visual (azul-escuro e azul-claro)
- `app.js` — mapa, busca, favoritas, localização
- `dados.js` — lista de linhas (só dados confirmados)
- `README.md` — este guia

## Estado dos dados (pesquisa de 28/10/2026)
- **GPS em tempo real:** nenhuma fonte pública confirmada para linhas municipais/intermunicipais de Belford Roxo, Nova Iguaçu ou Baixada. A API aberta de GPS conhecida é a da Prefeitura do Rio (município do Rio), e um projeto de lei na Alerj (out/2026) apenas *propõe* divulgar a localização das linhas intermunicipais. O site mostra o aviso e **não simula ônibus**.
- **Linha 445/445I:** não encontrei confirmação do número nem do itinerário. Está cadastrada como "não confirmada", sem paradas nem trajeto.
- **Próximos passos:** pedir dados ao DETRO-RJ e às prefeituras (GTFS/GPS, via Lei de Acesso à Informação) e conferir o OpenStreetMap (OSM) para trajetos de linhas.

## Publicar no GitHub Pages
1. No repositório: **Settings → Pages**.
2. Em **Build and deployment**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)` → **Save**.
3. Aguarde 1–2 minutos. O endereço será `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

## Testar
Abra o endereço no celular: o mapa deve carregar, a busca por "445" deve mostrar a linha com a etiqueta "não confirmada", e "Minha localização" pede permissão.

## Regras
Não coloque chaves de API ou senhas neste repositório (ele é público).
