(function(){
  var CENTRO=[-22.762,-43.425]; // vista inicial entre Belford Roxo e Nova Iguaçu
  var mapa=L.map('mapa',{zoomControl:false}).setView(CENTRO,12);
  L.control.zoom({position:'topright'}).addTo(mapa);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,
    attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(mapa);

  var camada=L.layerGroup().addTo(mapa), userMarker=null;
  var painel=document.getElementById('painel'), conteudo=document.getElementById('conteudo');
  var FAVKEY='oav_favoritas';

  function favs(){try{return JSON.parse(localStorage.getItem(FAVKEY))||[]}catch(e){return []}}
  function salvaFavs(l){try{localStorage.setItem(FAVKEY,JSON.stringify(l))}catch(e){}}
  function esc(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML}
  function abre(html){conteudo.innerHTML=html;painel.hidden=false}
  function fecha(){painel.hidden=true}
  document.getElementById('fechar').onclick=fecha;
  document.getElementById('btn-mapa').onclick=function(){fecha();camada.clearLayers();mapa.setView(CENTRO,12)};

  function porId(id){return window.LINHAS.filter(function(l){return l.id===id})[0]}

  function itemLinha(l){
    return '<button class="item" data-linha="'+l.id+'"><b>'+esc(l.numero)+'</b> '+
      (l.status!=='confirmada'?'<span class="tag">não confirmada</span>':'')+
      '<small>'+esc(l.nome)+'</small></button>';
  }
  function ligaItens(){
    conteudo.querySelectorAll('[data-linha]').forEach(function(b){b.onclick=function(){detalhe(b.dataset.linha)}});
    conteudo.querySelectorAll('[data-lugar]').forEach(function(b){
      b.onclick=function(){var p=JSON.parse(b.dataset.lugar);marca(p.lat,p.lon,p.nome)}});
  }

  function marca(lat,lon,nome){
    camada.clearLayers();
    L.marker([lat,lon]).addTo(camada).bindPopup(esc(nome)).openPopup();
    mapa.setView([lat,lon],16);fecha();
  }

  function geocodifica(texto){
    var url='https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=br&q='+encodeURIComponent(texto);
    return fetch(url,{headers:{'Accept-Language':'pt-BR'}}).then(function(r){return r.json()});
  }

  function detalhe(id){
    var l=porId(id); if(!l)return;
    var ehFav=favs().indexOf(id)>=0;
    var h='<h2>'+esc(l.numero)+'</h2>'+
      (l.status!=='confirmada'?'<p><span class="tag">Linha ainda não confirmada em fonte oficial</span></p>':'')+
      '<p><b>Origem:</b> '+esc(l.origem)+'<br><b>Destino:</b> '+esc(l.destino)+'</p>'+
      '<p><b>Trajeto:</b> '+(l.trajeto.length?l.trajeto.length+' pontos':'<span class="nd">dados não disponíveis</span>')+'<br>'+
      '<b>Paradas:</b> '+(l.paradas.length?l.paradas.length:'<span class="nd">dados não disponíveis</span>')+'<br>'+
      '<b>Horários:</b> <span class="nd">dados não disponíveis</span><br>'+
      '<b>Ônibus ao vivo:</b> <span class="nd">sem fonte de GPS confirmada</span></p>'+
      '<button class="btn" id="b-fav">'+(ehFav?'★ Remover favorita':'☆ Favoritar')+'</button>'+
      (l.consultas&&l.consultas.length?'<button class="btn" id="b-ref">Ver locais de referência</button>':'')+
      '<p id="msg-ref"></p>'+
      (l.fonte?'<p><small>Fonte: '+esc(l.fonte)+'</small></p>':'');
    abre(h);
    document.getElementById('b-fav').onclick=function(){
      var f=favs(),i=f.indexOf(id); if(i>=0)f.splice(i,1); else f.push(id);
      salvaFavs(f);detalhe(id)};
    desenha(l);
    var br=document.getElementById('b-ref');
    if(br)br.onclick=function(){referencias(l)};
  }

  function desenha(l){
    camada.clearLayers();
    if(l.trajeto.length){var p=L.polyline(l.trajeto,{color:'#13315c',weight:5}).addTo(camada);mapa.fitBounds(p.getBounds())}
    l.paradas.forEach(function(p){L.circleMarker([p.lat,p.lng],{radius:6,color:'#13315c',fillColor:'#8da9c4',fillOpacity:1}).addTo(camada).bindPopup(esc(p.nome))});
  }

  function referencias(l){
    var msg=document.getElementById('msg-ref');msg.textContent='Buscando no OpenStreetMap…';
    Promise.all(l.consultas.map(function(c){return geocodifica(c.texto)})).then(function(rs){
      camada.clearLayers();var pts=[],achou=[];
      rs.forEach(function(r,i){
        if(r&&r[0]){var lat=+r[0].lat,lon=+r[0].lon;pts.push([lat,lon]);
          L.marker([lat,lon]).addTo(camada).bindPopup(esc(l.consultas[i].rotulo)+' (aproximado)');
        } else achou.push(l.consultas[i].rotulo);
      });
      if(pts.length)mapa.fitBounds(pts,{padding:[50,50],maxZoom:15});
      msg.innerHTML=(pts.length?'Locais aproximados exibidos. <b>Não são paradas oficiais.</b> ':'')+
        (achou.length?'<span class="nd">Não encontrado: '+esc(achou.join(', '))+'.</span>':'');
    }).catch(function(){msg.textContent='Não foi possível buscar agora. Verifique a internet.'});
  }

  // Busca: linhas locais primeiro, depois lugares no OpenStreetMap
  document.getElementById('busca').onsubmit=function(e){
    e.preventDefault();
    var q=document.getElementById('q').value.trim(); if(!q)return;
    var t=q.toLowerCase();
    var achadas=window.LINHAS.filter(function(l){
      return (l.numero+' '+l.nome+' '+l.origem+' '+l.destino).toLowerCase().indexOf(t)>=0});
    var h='<h2>Resultados para “'+esc(q)+'”</h2>'+
      (achadas.length?achadas.map(itemLinha).join(''):'<p class="nd">Nenhuma linha cadastrada com esse termo.</p>')+
      '<p id="lugares">Buscando lugares…</p>';
    abre(h);ligaItens();
    geocodifica(q+', Baixada Fluminense, RJ').then(function(r){
      var el=document.getElementById('lugares');if(!el)return;
      if(r&&r[0]){var p={lat:+r[0].lat,lon:+r[0].lon,nome:r[0].display_name};
        el.outerHTML='<button class="item" data-lugar=\''+JSON.stringify(p).replace(/'/g,'&#39;')+'\'>📍 '+esc(p.nome)+'<small>Lugar no mapa (não é parada confirmada)</small></button>';
        ligaItens();
      } else el.textContent='Nenhum lugar encontrado.';
    }).catch(function(){var el=document.getElementById('lugares');if(el)el.textContent='Busca de lugares indisponível agora.'});
  };

  document.getElementById('btn-fav').onclick=function(){
    var f=favs().map(porId).filter(Boolean);
    abre('<h2>Linhas favoritas</h2>'+(f.length?f.map(itemLinha).join(''):'<p class="nd">Nenhuma favorita ainda. Abra uma linha e toque em “Favoritar”.</p>'));
    ligaItens();
  };

  document.getElementById('btn-local').onclick=function(){
    if(!navigator.geolocation){abre('<p>Seu navegador não oferece localização.</p>');return}
    navigator.geolocation.getCurrentPosition(function(p){
      var ll=[p.coords.latitude,p.coords.longitude];
      if(userMarker)mapa.removeLayer(userMarker);
      userMarker=L.circleMarker(ll,{radius:9,color:'#fff',weight:3,fillColor:'#1d7af3',fillOpacity:1}).addTo(mapa).bindPopup('Você está aqui');
      mapa.setView(ll,15);
    },function(){abre('<p>Não foi possível obter sua localização. Permita o acesso à localização no navegador (ícone de cadeado na barra de endereço).</p>')},
    {enableHighAccuracy:true,timeout:10000});
  };
})();
