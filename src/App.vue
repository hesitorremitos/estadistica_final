<template>
  <div>

    <label for="dataInput">Ingrese los datos (separados por espacios):</label>
    <br>

    <br>
    <div class="form-floating">
      <textarea class="form-control" placeholder="Leave a comment here" id="datainput" style="height: 200px"
        v-model="inputData">

      </textarea>
      <label for="floatingTextarea2">Datos</label>
    </div>
    <button @click="generateFrequencyTable">Generar Tabla de Frecuencias</button>

    <div v-if="frequencyTable">


      <table class="table table-hover table-bordered">
        <thead>

          <tr class="">
            <th>i</th>
            <th>L<sub>i-1</sub> - L<sub>i</sub></th>
            <th>x<sub>i</sub></th>
            <th>f <sub>i</sub></th>
            <th>F<sub>i</sub></th>
            <th>F<sub>i</sub>^</th>
            <th>h<sub>i</sub></th>
            <th>H<sub>i</sub> </th>
            <th>H<sub>i</sub>^</th>

          </tr>
        </thead>
        <tbody>

          <tr v-for="(value, key) in frequencyTable.i" :key="key">
            <th scope="row">{{ value }}</th>
            <td> {{ frequencyTable.li_1[key] }} - {{ frequencyTable.li[key] }}</td>
            <td> {{ frequencyTable.x[key] }}</td>
            <td> {{ frequencyTable.fi[key] }}</td>
            <td> {{ frequencyTable.Fi[key] }}</td>
            <td> {{ frequencyTable.fracMayorFi[key] }}</td>
            <td> {{ frequencyTable.fr[key] }}</td>
            <td> {{ frequencyTable.Fr[key] }}</td>
            <td> {{ frequencyTable.fracMayorFr[key] }}</td>


          </tr>
        </tbody>

      </table>

    </div>
  </div>
  <div id="container"></div>
  <div id="histograma"></div>

  <div v-if="frequencyTable">
    <h4>Medidas de tendencia central</h4>
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th>Tipo de media</th>
          <th>Clasificados</th>
          <th>No Clasificados</th>
        </tr>
      </thead>
      <tbody>


        <tr>
          <td>Media</td>
          <td v-if="frequencyTable"> {{ frequencyTable.calculateClassifiedMean() }}</td>
          <td v-if="frequencyTable"> {{ frequencyTable.calculateUnclassifiedMean() }}</td>

        </tr>
        <tr>
          <td>Media Geometrica</td>
          <td v-if="frequencyTable"> {{ frequencyTable.calculateClassifiedGeometricMean() }}</td>
          <td v-if="frequencyTable"> {{ frequencyTable.calculateUnclassifiedGeometricMean() }}</td>
        </tr>

        <tr>
          <td>Media Armonica</td>
          <td v-if="frequencyTable"> {{ frequencyTable.calculateClassifiedHarmonicMean() }}</td>
          <td v-if="frequencyTable"> {{ frequencyTable.calculateUnclassifiedHarmonicMean() }}</td>
        </tr>


        <tr>
          <td>Media Cuadratica</td>
          <td v-if="frequencyTable"> {{ frequencyTable.calculateClassifiedQuadraticMean() }}</td>
          <td v-if="frequencyTable"> {{ frequencyTable.calculateUnclassifiedQuadraticMean() }}</td>
        </tr>

        <tr>
          <td>Mediana</td>
          <td v-if="frequencyTable"> {{ frequencyTable.calculateClassifiedMedian() }}</td>
          <td v-if="frequencyTable"> {{ frequencyTable.calculateUnclassifiedMedian() }}</td>
        </tr>

        <tr>
          <td>Moda</td>
          <td v-if="frequencyTable"> {{ frequencyTable.calculateClassifiedMode() }}</td>
          <td v-if="frequencyTable"> {{ frequencyTable.calculateUnclassifiedMode() }}</td>
        </tr>
      </tbody>

    </table>
  </div>
  <br>
  <div>
    <h4>Medidas de dispercion o variabilidad</h4>
    <div v-if="frequencyTable">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th></th>
            <th>Clasificados</th>
            <th>No Clasificados</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Varianza</td>
            <td v-if="frequencyTable"> {{ frequencyTable.calculateClassifiedVariance() }}</td>
            <td v-if="frequencyTable"> {{ frequencyTable.calculateUnclassifiedVariance() }}</td>
          </tr>

          <tr>
            <td>Desviacion estandar</td>
            <td v-if="frequencyTable"> {{ frequencyTable.calculateClassifiedStandardDeviation() }}</td>
            <td v-if="frequencyTable"> {{ frequencyTable.calculateUnclassifiedStandardDeviation() }}</td>
          </tr>

          <tr>
            <td>Coeficiente de variacion</td>
            <td v-if="frequencyTable"> {{ frequencyTable.calculateClassifiedCoefficientOfVariation() }}</td>
            <td v-if="frequencyTable"> {{ frequencyTable.calculateUnclassifiedCoefficientOfVariation() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { filterData } from './js/filter.js';
import FrequencyTable from './js/FrecuencyTable';
import Plotly from 'plotly.js-dist-min'



const inputData = ref('');
const frequencyTable = ref(null);

const generateFrequencyTable = () => {
  const filteredData = filterData(inputData.value);
  frequencyTable.value = new FrequencyTable(filteredData);
  console.log(frequencyTable.value.fi)
  console.log(frequencyTable.value.fr)

  var data = [{
    values: frequencyTable.value.fi,
    labels: frequencyTable.value.fr.map((label, key) => {
      return "x<sub>" + (key + 1) + "</sub>:" + Math.round(label * 100) + "%"
    }),
    text: frequencyTable.value.i.map((i, key) => {
      return "x<sub>" + i + "</sub>"
    }),  // Añade tu texto personalizado aquí
    textinfo: 'text+percent',
    texttemplate: '%{text}:%{percent}',
    sort: false,
    hoverinfo: "none",
    type: 'pie',

  }];

  var layout = {
    height: 400,
    width: 500
  };

  Plotly.newPlot('container', data, layout);


  // Primero, necesitamos algunos datos de ejemplo
  var intervalos = frequencyTable.value.li_1.map((inferior, key) => {
    return inferior + "-" + frequencyTable.value.li[key]
  });
  var frecuencias = frequencyTable.value.fi;
  var trace = {
    x: intervalos,
    y: frecuencias,
    type: 'bar',
    marker: {
      color: 'blue',
    }
  };

  var layout = {
    title: 'Histograma de Frecuencias',
    xaxis: { title: 'Intervalos' },
    yaxis: { title: 'Frecuencia' },
    bargap: 0.1
  };

  Plotly.newPlot('histograma', [trace], layout);


};

onMounted(() => {
})

</script>
