var button = getBy('name', 'search'),
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

function ajax(departement) {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://coronavirusapi-france.now.sh/LiveDataByDepartement?Departement=' + departement);
  xhr.send();
  xhr.onload = response;
}

function response() {
  if (this.responseText.charAt(0) !== '{') {
    console.log('error');
  }

  var response = JSON.parse(this.responseText);
  display.innerHTML = response.LiveDataByDepartement;

  console.log(response.LiveDataByDepartement);
}

button.addEventListener('click', () => {
  var input = getBy('name', 'departement').value;

  // filter input

  ajax(input);
});
