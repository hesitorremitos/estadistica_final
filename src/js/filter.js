
export function filterData(data, separator = /\s+/) {
	var numbers = data.split(separator).filter(Boolean)
	numbers = numbers.map(Number)
	numbers.sort((a, b) => a - b)
	return numbers
}
