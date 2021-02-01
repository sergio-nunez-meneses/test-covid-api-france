var departments = ['Ain', 'Aisne', 'Allier', 'Alpes-de-Haute-Provence', 'Hautes-Alpes', 'Alpes-Maritimes', 'Ardèche', 'Ardennes', 'Ariège', 'Aube', 'Aude', 'Aveyron', 'Bouches-du-Rhône', 'Calvados', 'Cantal', 'Charente', 'Charente-Maritime', 'Cher', 'Corrèze', 'Corse-du-Sud', 'Haute-Corse', "Côte-d'Or", "Côtes-d'Armor", 'Creuse', 'Dordogne', 'Doubs', 'Drôme', 'Eure', 'Eure-et-Loir', 'Finistère', 'Gard', 'Haute-Garonne', 'Gers', 'Gironde', 'Hérault', 'Ille-et-Vilaine', 'Indre', 'Indre-et-Loire', 'Isère', 'Jura', 'Landes', 'Loir-et-Cher', 'Loire', 'Haute-Loire', 'Loire-Atlantique', 'Loiret', 'Lot', 'Lot-et-Garonne', 'Lozère', 'Maine-et-Loire', 'Manche', 'Marne', 'Haute-Marne', 'Mayenne', 'Meurthe-et-Moselle', 'Meuse', 'Morbihan', 'Moselle', 'Nièvre', 'Nord', 'Oise', 'Orne', 'Pas-de-Calais', 'Puy-de-Dôme', 'Pyrénées-Atlantiques', 'Hautes-Pyrénées', 'Pyrénées-Orientales', 'Bas-Rhin', 'Haut-Rhin', 'RhôneNote', 'Haute-Saône', 'Saône-et-Loire', 'Sarthe', 'Savoie', 'Haute-Savoie', 'Paris', 'Seine-Maritime', 'Seine-et-Marne', 'Yvelines', 'Deux-Sèvres', 'Somme', 'Tarn', 'Tarn-et-Garonne', 'Var', 'Vaucluse', 'Vendée', 'Vienne', 'Haute-Vienne', 'Vosges', 'Yonne', 'Territoire de Belfort', 'Essonne', 'Hauts-de-Seine', 'Seine-Saint-Denis', 'Val-de-Marne', "Val-d'Oise", 'Guadeloupe', 'Martinique', 'Guyane', 'La Réunion', 'Mayotte'],
  buttons = getBy('tag', 'button'),
  search = getBy('name', 'search'),
  canvas = getBy('tag', 'canvas')[0],
  ctx = canvas.getContext('2d'),
  colors = [],
  barsChart;

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
  if (typeof barsChart !== 'undefined') {
    barsChart.destroy();
  }

  barsChart = new Chart(ctx, {
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
      responsive: true,
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 15,
          bottom: 0
        }
      },
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
      },
      hover: {
        animationDuration: 10
      },
      animation: {
        onComplete: function() {
          var chartInstance = this.chart,
            ctx = chartInstance.ctx;

          ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';

          this.data.datasets.forEach((dataset, i) => {
            var meta = chartInstance.controller.getDatasetMeta(i);

            meta.data.forEach((bar, index) => {
              if (dataset.data[index] > 0) {
                var data = dataset.data[index];

                ctx.fillText(data, bar._model.x, bar._model.y);
              }
            });
          });
        }
      }
    }
  });
}

// function ajax(departement) {
//   let xhr = new XMLHttpRequest();
//   xhr.open('GET', 'https://coronavirusapi-france.now.sh/LiveDataByDepartement?Departement=' + departement);
//   xhr.send();
//   xhr.onload = response;
// }

function executeRequest(url) {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.send();
  xhr.onload = displayLog
}

function displayLog() {
  let response = JSON.parse(this.responseText);
  console.log(response);
}

function request(dataType) {
  let url;

  if (dataType === 'global-data') {
    url = 'https://coronavirusapi-france.now.sh/FranceLiveGlobalData';
  } else if (dataType === 'departments-data') {
    url = 'https://coronavirusapi-france.now.sh/AllLiveData';
  } else if (dataType === 'search') {
    let selectedOption = getBy('tag', 'select')[0].selectedOptions[0].value;
    url = 'https://coronavirusapi-france.now.sh/LiveDataByDepartement?Departement=' + selectedOption; // department name
  } else if (dataType === 'date-data') {
    url = 'https://coronavirusapi-france.now.sh/AllDataByDate?date='; // YYYY-mm-dd
  }

  executeRequest(url);
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

// search.addEventListener('click', () => {
//   // var input = getBy('name', 'department').value;
//   var selectedOption = getBy('tag', 'select')[0].selectedOptions[0].value;
//
//   ajax(selectedOption);
// });

// add event listener to all <button>
for (let button of buttons) {
  button.addEventListener('click', () => {
    request(button.name);
  });
}

// populate <select>
for (var i = 0; i < departments.length; i++) {
  var option = document.createElement('option');
  option.value = departments[i];
  option.innerHTML = departments[i];
  getBy('tag', 'select')[0].appendChild(option);
}
