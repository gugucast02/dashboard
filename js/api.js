let plot = (data) => { 
  const ctx = document.getElementById('myChart');
  const dataset = {
    labels: data.hourly.time, /* ETIQUETA DE DATOS */
    datasets: [{
        label: 'Temperatura semanal', /* ETIQUETA DEL GRÁFICO */
        data: data.hourly.temperature_2m, /* ARREGLO DE DATOS */
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
    }]
  };
  const config = {
    type: 'line',
    data: dataset,
  };
  const chart = new Chart(ctx, config)
  // Zonas horarias
  let zonaHoraria = document.getElementById('zona-horaria');
  zonaHoraria.innerHTML = data["timezone"];
  // Latitud 
  let latitud = document.getElementById('latitud');
  latitud.innerHTML = data["latitude"];
  // Longitud
  let longitud = document.getElementById('longitud');
  longitud.innerHTML = data["longitude"];
  // Elevacion
  let elevacion = document.getElementById('elevacion');
  elevacion.innerHTML = data["elevation"];
}

let loadTablaMarea = (data) => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(data, "text/html");
  let contenedorMareas = xml.getElementsByClassName('container-fluid')[0];
  let contenedorHTML = document.getElementById('table-container');
  contenedorHTML.innerHTML = contenedorMareas;
}

let load = (data) => { 
   plot(data);
}

let loadInocar = () => {
  let mareas = localStorage.getItem('mareas');
  if(mareas == null){
    let URL_proxy = 'https://cors-anywhere.herokuapp.com/';
    let URL = URL_proxy+'https://www.inocar.mil.ec/mareas/consultan.php';
    fetch(URL)
      .then(response => response.text())
      .then(data => {
        /* GUARDAMOS LA DATA EN LA MEMORIA*/
        localStorage.setItem("mareas", JSON.stringify(data))
      })
      .catch(console.error);
  } else{
    /*CARGAR DATA DESDE LA MEMORIA*/
    loadTablaMarea(JSON.parse(mareas))
  }
}

/*FUNCION AUTOEJECUTABLE*/
(
    function () {
      let meteo = localStorage.getItem('meteo');
      if(meteo == null) {
        let URL='https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m&timezone=auto';
        fetch(URL)
        .then(response => response.json())
        .then(data => {
          load(data)
          /* GUARDAR DATA EN LA MEMORIA */
          localStorage.setItem("meteo", JSON.stringify(data))
        })
        .catch(console.error)
      } else {
        /* CARGAR DATA DESDE LA MEMORIA */
        load(JSON.parse(meteo))
      }
      loadInocar();
    }
)();
