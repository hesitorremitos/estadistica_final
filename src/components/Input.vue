<template>
	<div>
		<label for="dataInput">Ingrese los datos (separados por espacios):</label>
		<textarea id="dataInput" v-model="inputData"></textarea>
		<button @click="handleGenerate">Generar Tabla de Frecuencias</button>
		<FrequencyTableComponent :frequencyTable="frequencyTable" v-if="frequencyTable" />
	</div>
</template>
  
<script>
import { ref } from 'vue';
import { filterData } from '../js/filter';
import FrequencyTable from '../js/FrecuencyTable.js';
import FrequencyTableComponent from './Table.vue';

export default {
	components: {
		FrequencyTableComponent
	},
	setup() {
		const inputData = ref('');
		const frequencyTable = ref(null);

		const handleGenerate = () => {
			const filteredData = filterData(inputData.value);
			frequencyTable.value = new FrequencyTable(filteredData);
		};

		return {
			inputData,
			frequencyTable,
			handleGenerate
		};
	}
};
</script>
  