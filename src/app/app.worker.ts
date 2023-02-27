/// <reference lib="webworker" />

addEventListener('message', event => {
  let newNumber: BasedNumber = new BasedNumber(
    event.data.numberToTransform,
    event.data.baseOfNumberToTransform,
    event.data.desiredOutputBase
  );

  newNumber.compute();

  postMessage({ 
    outputBase: event.data.desiredOutputBase,
    output: newNumber.toString()
  })
});

class BasedNumber {
  inputNumber: any;
  baseOfInputNumber: any;
	desiredOutputBase: number;
  workingNumber: any;
	values: number[] = [];

	valueMap: string[] = [
		"0",
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"A",
		"B",
		"C",
		"D",
		"E",
		"F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P"
	]

	constructor(numberToTransform: any, baseOfNumberToTransform: any, desiredOutputBase: any) {
    this.inputNumber = numberToTransform;
    this.baseOfInputNumber = baseOfNumberToTransform;
		this.desiredOutputBase = desiredOutputBase;
    this.workingNumber = numberToTransform;
	}

  compute() {
    let iterations = 0;
    
    while (this.workingNumber != 0) {
      let mod = this.workingNumber % this.desiredOutputBase;
      this.values.push(mod);
      this.workingNumber -= mod;
      this.workingNumber /= this.desiredOutputBase;
      iterations++;
      if (iterations > 100) {
        break;
      }
    }
  }

	toString() {
    if (this.inputNumber == 0) {
      return "0";
    }
    
		let results: string[] = [];

    for (let i = (this.values.length - 1); i > -1; i--) {
      results.push(this.valueMap[this.values[i]]);
    }

		return results.join("");
	}
}
