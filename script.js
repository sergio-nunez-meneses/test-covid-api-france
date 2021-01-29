var search = getBy('name', 'search'),
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
    console.log('not JSON');
    return;
  }

  var response = JSON.parse(this.responseText).LiveDataByDepartement[0];
  display.innerHTML = JSON.stringify(response, undefined, 2);
  console.log(response);
}

search.addEventListener('click', () => {
  var input = getBy('name', 'department').value;

  // filter input

  ajax(input);
});
