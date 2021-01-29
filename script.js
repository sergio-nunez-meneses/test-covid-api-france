var departments = ['Ain', 'Aisne', 'Allier', 'Alpes-de-Haute-Provence', 'Hautes-Alpes', 'Alpes-Maritimes', 'Ardèche', 'Ardennes', 'Ariège', 'Aube', 'Aude', 'Aveyron', 'Bouches-du-Rhône', 'Calvados', 'Cantal', 'Charente', 'Charente-Maritime', 'Cher', 'Corrèze', 'Corse-du-Sud', 'Haute-Corse', "Côte-d'Or", "Côtes-d'Armor", 'Creuse', 'Dordogne', 'Doubs', 'Drôme', 'Eure', 'Eure-et-Loir', 'Finistère', 'Gard', 'Haute-Garonne', 'Gers', 'Gironde', 'Hérault', 'Ille-et-Vilaine', 'Indre', 'Indre-et-Loire', 'Isère', 'Jura', 'Landes', 'Loir-et-Cher', 'Loire', 'Haute-Loire', 'Loire-Atlantique', 'Loiret', 'Lot', 'Lot-et-Garonne', 'Lozère', 'Maine-et-Loire', 'Manche', 'Marne', 'Haute-Marne', 'Mayenne', 'Meurthe-et-Moselle', 'Meuse', 'Morbihan', 'Moselle', 'Nièvre', 'Nord', 'Oise', 'Orne', 'Pas-de-Calais', 'Puy-de-Dôme', 'Pyrénées-Atlantiques', 'Hautes-Pyrénées', 'Pyrénées-Orientales', 'Bas-Rhin', 'Haut-Rhin', 'RhôneNote', 'Haute-Saône', 'Saône-et-Loire', 'Sarthe', 'Savoie', 'Haute-Savoie', 'Paris', 'Seine-Maritime', 'Seine-et-Marne', 'Yvelines', 'Deux-Sèvres', 'Somme', 'Tarn', 'Tarn-et-Garonne', 'Var', 'Vaucluse', 'Vendée', 'Vienne', 'Haute-Vienne', 'Vosges', 'Yonne', 'Territoire de Belfort', 'Essonne', 'Hauts-de-Seine', 'Seine-Saint-Denis', 'Val-de-Marne', "Val-d'Oise", 'Guadeloupe', 'Martinique', 'Guyane', 'La Réunion', 'Mayotte'],
  search = getBy('name', 'search'),
  canvas = getBy('tag', 'canvas')[0],
  ctx = canvas.getContext('2d'),
  colors = [];

function getBy(attribute, value) {
  if (attribute === 'tag') {
    return document.getElementsByTagName(value);
  } else if (attribute === 'id') {
    return document.getElementById(value);
  } else if (attribute === 'name') {
    return document.getElementsByName(value)[0];
  } else if (attribute === 'class') {
    return document.getElementsByClassName(value);
  }
}

function randomHexColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

function generateColors(maxColors) {
  colors = [];

  for (var i = 0; i < maxColors; i++) {
    colors.push(randomHexColor());
  }
}

function chart(department, date, labels, data, colors) {
  var myChart = new Chart(ctx, {
    type: 'bar',
    // type: 'horizontalBar',
    data: {
      labels: labels,
      datasets: [{
        label: department + ' (' + date + ')',
        data: data,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [
          {
            stacked: true,
            gridLines:
            {
              display: true,
              color: 'rgba(255, 255, 255, 0.6)'
            },
            ticks: {
              beginAtZero: true
            }
          }
        ],
        xAxes: [
          {
            stacked: true,
            gridLines:
            {
              display: true
            }
          }
        ]
      }
    }
  });
}

function ajax(departement) {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://coronavirusapi-france.now.sh/LiveDataByDepartement?Departement=' + departement);
  xhr.send();
  xhr.onload = response;
}

function response() {
  if (this.responseText.charAt(0) !== '{') {
    console.log('not JSON');
    return;
  }

  var response = JSON.parse(this.responseText).LiveDataByDepartement[0],
    labels = ['guéris.es', 'hospitalisés.es', 'réanimation', 'décès', 'nouvelles hospitalisations', 'nouvelles réanimations'],
    data = [response.gueris, response.hospitalises, response.reanimation, response.deces, response.nouvellesHospitalisations, response.nouvellesReanimations];

  generateColors(data.length);
  chart(response.nom, response.date, labels, data, colors);
}

search.addEventListener('click', () => {
  // var input = getBy('name', 'department').value;
  var selectedOption = getBy('tag', 'select')[0].selectedOptions[0].value;

  ajax(selectedOption);
});

// populate <select>
for (var i = 0; i < departments.length; i++) {
  var option = document.createElement('option');
  option.value = departments[i];
  option.innerHTML = departments[i];
  getBy('tag', 'select')[0].appendChild(option);
}
