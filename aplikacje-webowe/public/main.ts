class StatsApp {
  inputData: HTMLElement;
  initialData: HTMLInputElement;


  sumInput: HTMLInputElement;
  avgInput: HTMLInputElement;
  minInput: HTMLInputElement;
  maxInput: HTMLInputElement;

  dynamicElementIds: number[];
  loading: HTMLDivElement;

  constructor() {
    this.startApp();
  }

  private startApp() {
    this.getInputs();
    this.watchInputValues();
  }

  private getInputs() {
    this.initialData = document.querySelector('#data');
    this.inputData  = document.querySelector('.input-data');
    this.loading = document.querySelector('#loading');

    this.sumInput  = document.querySelector('#sum');
    this.avgInput  = document.querySelector('#avg');
    this.minInput  = document.querySelector('#min');
    this.maxInput  = document.querySelector('#max');
  }

  private watchInputValues() {
    this.initialData.addEventListener('input', () => this.generateInputs());
  }

  private computeData() {

    const arr: number[] = [];
    this.dynamicElementIds.forEach((el) => {
      let inputData: HTMLInputElement = document.querySelector(`#data${el}`);
      const value: string = inputData.value;
      value !== '' ? arr.push(+value) : 'Not a number, continue';
    });


    if (arr.some((el) => {
      return isNaN(el);
    })) {
      this.setLoadingIcon('none');
      return;
    }

    this.setLoadingIcon('inline-block');

    const sum: number = arr.reduce((el, next) =>  el + next, 0);
    const avg: number = sum / arr.length;
    const min: number = Math.min(...arr);
    const max: number = Math.max(...arr);

    this.setData(sum, avg, min, max);
  }

  private generateInputs() {
    this.dynamicElementIds = [];
    for (let i: number = 0; i < +this.initialData.value; i++) {
      let input: HTMLInputElement = document.createElement('input');
      const removeButton = this.createDynamicRemoveButton(input, i);
      this.dynamicElementIds.push(i);
      input.id = `data${i}`;
      input.addEventListener('input', () => this.computeData());
      this.inputData.appendChild(input);
      this.inputData.appendChild(removeButton);
    }
    this.initialData.style.display = 'none';
  }

  private setData(sum: number, avg: number, min: number, max: number) {
    this.sumInput.value = String(sum);
    this.avgInput.value = String(avg);
    this.minInput.value = String(min);
    this.maxInput.value = String(max);
  }

  private setLoadingIcon(mode: string) {
    this.sumInput.style.display = mode;
    this.avgInput.style.display = mode
    this.minInput.style.display = mode
    this.maxInput.style.display = mode
    this.loading.style.display = mode === 'none' ? 'inline-block' : 'none';
  }

  private createDynamicRemoveButton(input: HTMLInputElement, numberToDelete: number): HTMLButtonElement {
    let removeButton: HTMLButtonElement = document.createElement('button');
    removeButton.innerHTML = 'Delete';

    removeButton.addEventListener('click', () => {
      input.remove();
      removeButton.remove();
      this.dynamicElementIds.splice(this.dynamicElementIds.indexOf(numberToDelete), 1);
      this.computeData();
    });
    return removeButton;
  }

}
const statsApp = new StatsApp();
