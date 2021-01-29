var ctx = getBy('tag', 'canvas')[0].getContext('2d'),
  search = getBy('name', 'search'),
  display = getBy('id', 'code');

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

function randomRGBA() {
  let color = 'rgba(' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.random() + ')';

  if (!(color < 'rgba(0, 0, 0, 1)' && color > 'rgba(0, 0, 0, 0)')) {
    return color;
  }
}

function chart(department, date, labels, data) {
  var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: labels,
          datasets: [{
              label: department + ' (au ' + date + ')',
              data: data,
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
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
    labels = ['guéris.es', 'hospitalisés.es', 'reanimation', 'décès', 'nouvelles hospitalisations', 'nouvelles reanimations'],
    data = [response.gueris, response.hospitalises, response.reanimation, response.deces, response.nouvellesHospitalisations, response.nouvellesReanimations];

  chart(response.nom, response.date, labels, data);
}

search.addEventListener('click', () => {
  var input = getBy('name', 'department').value,
    filteredInput;

  ajax(input);
});
