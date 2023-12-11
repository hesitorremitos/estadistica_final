export default class FrequencyTable {
	constructor(data) {
		this.data = data;
		this.n = data.length;
		this.minValue = data[0];
		this.maxValue = data[data.length - 1];
		this.R = this.maxValue - this.minValue;
		this.K = Math.round(1 + 3.3 * Math.log10(this.n));
		this.a = this.R / this.K;
		this.a = Math.ceil(this.a);

		this.i = (() => {
			let data = [];
			for (let j = 1; j <= this.K; j++) {
				data.push(j);
			}
			return data;
		})();

		this.li_1 = [];
		this.li = [];
		this.x = [];
		this.fi = [];
		this.Fi = [];
		this.fr = [];
		this.Fr = [];
		this.fracMayorFi = [];
		this.fracMayorFr = [];

		let lowerLimit = this.minValue;
		let FiAcum = 0;
		let FrAcum = 0;
		let total = this.n;

		for (let j = 0; j < this.K; j++) {
			let upperLimit = lowerLimit + this.a;
			let midpoint = (lowerLimit + upperLimit) / 2;
			this.fracMayorFr.push((1 - FrAcum).toFixed(2));

			this.li_1.push(lowerLimit);
			this.li.push(upperLimit);
			this.x.push(midpoint);

			let frequency = this.data.filter(
				(value) => (value >= lowerLimit && value < upperLimit)// Corrección: cambia el límite superior
			).length;
			this.fi.push(frequency);
			FiAcum += frequency;
			this.Fi.push(FiAcum);

			let relFrequency = frequency / total;
			this.fr.push(relFrequency.toFixed(2));
			FrAcum += relFrequency;

			this.Fr.push(FrAcum.toFixed(2));



			lowerLimit = upperLimit;
		}

		let acumulado = 0
		for (let j = 0; j < this.K; j++) {
			acumulado += this.fi[this.K - j - 1]
			this.fracMayorFi.unshift(acumulado)
		}


		this.calculateClassifiedMean = () => {
			let sum = 0;
			for (let i = 0; i < this.K; i++) {
				sum += this.x[i] * this.fi[i];
			}
			return (sum / this.n).toFixed(2);
		};

		this.calculateUnclassifiedMean = () => {
			let sum = 0;
			for (let i = 0; i < this.n; i++) {
				sum += this.data[i];
			}
			return (sum / this.n).toFixed(2);
		};

		this.calculateClassifiedGeometricMean = () => {
			let product = 1;
			for (let i = 0; i < this.K; i++) {
				product *= Math.pow(this.x[i], this.fi[i]);
			}
			return Math.pow(product, 1 / this.n).toFixed(2);
		};

		this.calculateUnclassifiedGeometricMean = () => {
			let product = 1;
			for (let i = 0; i < this.n; i++) {
				product *= this.data[i];
			}
			return Math.pow(product, 1 / this.n).toFixed(2);
		};

		this.calculateClassifiedHarmonicMean = () => {
			let sum = 0;
			for (let i = 0; i < this.K; i++) {
				sum += this.fi[i] / (1 / this.x[i]);
			}
			return (this.n / sum).toFixed(2);
		};

		this.calculateUnclassifiedHarmonicMean = () => {
			let sum = 0;
			for (let i = 0; i < this.n; i++) {
				sum += 1 / this.data[i];
			}
			return (this.n / sum).toFixed(2);
		};

		this.calculateClassifiedQuadraticMean = () => {
			let sum = 0;
			for (let i = 0; i < this.K; i++) {
				sum += Math.pow(this.x[i], 2) * this.fi[i];
			}
			return Math.sqrt(sum / this.n).toFixed(2);
		};

		this.calculateUnclassifiedQuadraticMean = () => {
			let sum = 0;
			for (let i = 0; i < this.n; i++) {
				sum += Math.pow(this.data[i], 2);
			}
			return Math.sqrt(sum / this.n).toFixed(2);
		};

		this.calculateClassifiedMedian = () => {
			let medianPosition = this.n / 2;
			let cumulativeFrequency = 0;

			for (let i = 0; i < this.K; i++) {
				cumulativeFrequency += this.fi[i];
				if (cumulativeFrequency >= medianPosition) {
					return this.x[i].toFixed(2);
				}
			}
			return "No se encontró la mediana";
		};

		this.calculateUnclassifiedMedian = () => {
			let sortedData = this.data.slice().sort((a, b) => a - b);
			let mid = Math.floor(this.n / 2);

			if (this.n % 2 !== 0) {
				return sortedData[mid].toFixed(2);
			} else {
				return ((sortedData[mid - 1] + sortedData[mid]) / 2).toFixed(2);
			}
		};

		this.calculateClassifiedMode = () => {
			let maxFrequency = Math.max(...this.fi);
			let modes = [];
			for (let i = 0; i < this.K; i++) {
				if (this.fi[i] === maxFrequency) {
					modes.push(this.x[i]);
				}
			}

			if (modes.length === this.K) {
				return "No hay moda";
			} else if (modes.length === 1) {
				return modes[0].toFixed(2);
			} else {
				return modes.map((mode) => mode.toFixed(2)).join(', ');
			}
		};

		this.calculateUnclassifiedMode = () => {
			let frequencyMap = {};
			let maxFrequency = 0;
			let modes = [];

			for (let i = 0; i < this.n; i++) {
				frequencyMap[this.data[i]] = (frequencyMap[this.data[i]] || 0) + 1;
				if (frequencyMap[this.data[i]] > maxFrequency) {
					maxFrequency = frequencyMap[this.data[i]];
				}
			}

			for (const key in frequencyMap) {
				if (frequencyMap[key] === maxFrequency) {
					modes.push(parseFloat(key));
				}
			}

			if (modes.length === this.n) {
				return "No hay moda";
			} else if (modes.length === 1) {
				return modes[0].toFixed(2);
			} else {
				return modes.map((mode) => mode.toFixed(2)).join(', ');
			}
		};

		// MEDIDAS DE DISPERSION
		this.calculateClassifiedVariance = () => {
			let sum = 0;
			for (let i = 0; i < this.K; i++) {
				sum += Math.pow(this.x[i], 2) * this.fi[i];
			}
			let mean = this.calculateClassifiedMean();
			return ((sum / this.n) - Math.pow(mean, 2)).toFixed(2);
		};

		this.calculateUnclassifiedVariance = () => {
			let sum = 0;
			for (let i = 0; i < this.n; i++) {
				sum += Math.pow(this.data[i], 2);
			}
			let mean = this.calculateUnclassifiedMean();
			return ((sum / this.n) - Math.pow(mean, 2)).toFixed(2);
		};

		this.calculateClassifiedStandardDeviation = () => {
			return Math.sqrt(this.calculateClassifiedVariance()).toFixed(2);
		};

		this.calculateUnclassifiedStandardDeviation = () => {
			return Math.sqrt(this.calculateUnclassifiedVariance()).toFixed(2);
		};

		this.calculateClassifiedCoefficientOfVariation = () => {
			let mean = this.calculateClassifiedMean();
			let standardDeviation = this.calculateClassifiedStandardDeviation();
			return ((standardDeviation / mean) * 100).toFixed(2) + "%";
		};

		this.calculateUnclassifiedCoefficientOfVariation = () => {
			let mean = this.calculateUnclassifiedMean();
			let standardDeviation = this.calculateUnclassifiedStandardDeviation();
			return ((standardDeviation / mean) * 100).toFixed(2) + "%";
		};

	}



}