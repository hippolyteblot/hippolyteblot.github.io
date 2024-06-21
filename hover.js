
var i = 1;
var alreadyUse = 0;
var myChart;
const effectList = [
  `<p>Tu ne ressens pas spécialement d'effet. Peut-être une légère éphorie et
  une sociabilité accrue.</p>`,
  `<p>Ton rythme cardiaque s'accélère légèrement, tu te sens plus détendu(e) et
  tu es moins sensible à la douleur. Ton odorat et ta vue peuvent être
  légèrement modifiés.</p>`,
  `<p>Tes humeurs s'amplifient (+ heureux, ou l'inverse), tes sens perdent en 
  précision et tu risques d'être plus maladroit qu'à la normale. Tu as plus
  de mal à comprendre et à évaluer ton environnement.</p>`,
  `<p>Tes sens commencent à être visiblement diminué. Ta vitesse de réaction devient
  faible, tu as plus ou moins du mal à t'exprimer et ton humeur s'amplifie 
  fortement : tu es sois très heureux(se) de ce qui se passe, soit anxieux(se) et
  déprimé(e). Tu risques de te lâcher un peu trop et de faire des choses que tu
  pourrais regretter. Attention aux potentielle nausées...</p>`,
  `<p>Tu ne comprends plus grand chose à ce qui se passe... C'est d'ailleurs étonnant
  que tu ai réussi à remplir ce questionnaire. Tu nages surement en plein bonheur
  ou en pleine angoisse. Réfléchis bien à ce que tu fais car ta conscience de ton 
  environnement est plus que faible. Il est possible que tu ne te souviennes pas
  de tout demain. Conseil : évite de fermer les yeux si tu ne veux pas vomir.</p>`,
  `<p>On espère que tu n'as pas vraiment bu autant, sinon tu ferais bien d'arrêter
  maintenant. Tu te sens complètement perdu. Tu peux trouver ça agréable ou à
  l'inverse, tu ne peux pas t'empêcher de vomir. Tes réflexions sont probablement
  très "perchées" et "métaphysiques". Fais attention, tu risques de faire
  une intoxication...</p>`,
  `<p>Abuses pas, tu serais mort.</p>`
];

window.addEventListener("scroll",() => {
  if(window.scrollX != 0){
    window.scroll(0, window.scrollY);
  }
})

const element = document.getElementById("ajt-alcool");
element.addEventListener("click",() => {
  i++;
  document.querySelector(".topast").insertAdjacentHTML("beforeend",  `
    <div class="copie `+i+`">
    <h2>Boisson `+i+`</h2>
    <p>Quel volume as-tu bu ?</p>
    <div class="rep">
      <label><input type="number" id="quantite`+i+`"> cL</label>
    </div>

    <p>A quel degrés d'alcool était cette boisson ?</p>
    <div class="rep">
      <label><input type="number" id="degre`+i+`"> ° d'alcool</label>
    </div>
  </div>`);
})

const btn_result = document.getElementById("last");
btn_result.addEventListener("click",() => {


  var sexe = document.getElementById("sexe").value;
  var m = document.getElementById("poids").value;
  var jeun = document.getElementById("jeun").value;
  var V = []
  var p = []
  var indice = 1;

  var uniteAlcool = 0;
  while(indice <= i){
    V.push(document.getElementById("quantite"+indice).value);
    p.push(document.getElementById("degre"+indice).value);
    uniteAlcool += (V[indice-1] * p[indice-1] * 8) / 10;
    indice++;
  }
  uniteAlcool = uniteAlcool/100;
  if(sexe == 'h'){
    var K = 0.7;
    var elim = 0.125;
  }
  else {
    var K = 0.6;
    var elim = 0.0925;
  }
  var T = 0;
  indice = 0;
  while(indice < i){
    T += ((V[indice] * p[indice] * 0.8) / (K * m)) / 10;
    indice++;
  }
  T = Math.round(T*100)/100;
  if(T > 0){
    var graph_data = [0,
      T-elim*0.5+(elim*0.5*jeun),
      T-(elim*0.5*jeun),
      T-elim*0.5-(elim*0.5*jeun),
      T-elim-(elim*0.5*jeun),
      T-elim*1.5-(elim*0.5*jeun),
      T-elim*2-(elim*0.5*jeun),
      T-elim*2.5-(elim*0.5*jeun),
      T-elim*3-(elim*0.5*jeun),
      T-elim*3.5-(elim*0.5*jeun),
      T-elim*4-(elim*0.5*jeun),
      T-elim*4.5-(elim*0.5*jeun),
      T-elim*5-(elim*0.5*jeun)] 
  }
  else {
    var graph_data = [0,0,0,0,0,0,0,0,0,0,0,0,0] 
  }
  j = 0;
  while(j <= 12){
    if(graph_data[j] < 0){
      graph_data[j] = 0;
    }
    j+=1;
  }

  document.querySelector("#result").style.display = "flex";
  
  document.getElementById("number-result").innerHTML = T;

  if (uniteAlcool < 1){
    document.getElementById("effect").innerHTML = effectList[0];
  }
  else if (uniteAlcool >= 1 && uniteAlcool <= 2){
    document.getElementById("effect").innerHTML = effectList[1];
  }
  else if (uniteAlcool > 2 && uniteAlcool <= 7){
    document.getElementById("effect").innerHTML = effectList[2];
  }
  else if (uniteAlcool > 7 && uniteAlcool <= 14){
    document.getElementById("effect").innerHTML = effectList[3];
  }
  else if (uniteAlcool > 15 && uniteAlcool <= 20){
    document.getElementById("effect").innerHTML = effectList[4];
  }
  else if (uniteAlcool > 20 && uniteAlcool <= 30){
    document.getElementById("effect").innerHTML = effectList[5];
  }
  else if (uniteAlcool > 30){
    document.getElementById("effect").innerHTML = effectList[6];
  }

  document.getElementById("graph").innerHTML = "";
  if(alreadyUse == 1){
    myChart.destroy();
  }
  var graph = document.getElementById("graph").getContext('2d');
  alreadyUse = 1;
  myChart = new Chart(graph, {
    type: 'line',
    data: {
      datasets: [{
        type: 'line',
        label: "Gramme d'alcool par Litre de sang",
        data: graph_data,
        borderColor: '#6C4DB4',
        borderWidth: "3",
        tension: 0.3
    }, {
        type: 'line',
        label: "Limite légale pour conduire",
        data: [0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5],
        pointBorderWidth: 0,
        borderColor: 'rgb(0,0,0)',
        borderWidth: "3",
    },  {
        type: 'line',
        label: "Risque de mort",
        data: [3.8,3.8,3.8,3.8,3.8,3.8,3.8,3.8,3.8,3.8,3.8,3.8,3.8],
        pointBorderWidth: 0,
        borderColor: 'rgb(200,0,0)',
        borderWidth: "3",
    }],
    labels: ["0h", "",'1h',"", '2h', "", '3h', 
    "", '4h', "", '5h', "", '6h']
    },
    options: {
      scales: {
        y: {
            beginAtZero: true
        }
    },
      plugins: {
          legend: {
              labels: {
                  font: {
                      size: 20
                  }
              }
            
          }
      }
    }


  });
})



var modal = document.getElementById('id01');
modal.addEventListener("click", () => {
  modal.style.display = "none";
})
