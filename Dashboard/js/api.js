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

}

let load = (data) => { 
   plot(data);
}

(
    function () {
      let meteo = localStorage.getItem('meteo');
      if(meteo == null) {
        let URL='https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m&daily=uv_index_max&timezone=auto';
        fetch(URL)
        .then(response => response.json())
        .then(data => {
          let timezone =data["timezone"];
          let timezoneHTML = document.getElementById("timezone");
          timezoneHTML = timezone;
          load(data)
          /* GUARDAR DATA EN LA MEMORIA */
          localStorage.setItem("meteo", JSON.stringify(data))
        })
        .catch(console.error)
      } else {
        /* CARGAR DATA DESDE LA MEMORIA */
        load(JSON.parse(meteo))
      }
    }
)();