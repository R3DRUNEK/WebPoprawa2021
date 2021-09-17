class MusicApp {
  sounds: Object = {
    percSound: {
      element: HTMLAudioElement,
      trigger: 'q',
      data: 'boom'
    },
    kickSound: {
      element: HTMLAudioElement,
      trigger: 'w',
      data: 'clap'
    },
    clapSound: {
      element: HTMLAudioElement,
      trigger: 'e',
      data: 'hihat'
    },
    shakerSound: {
      element: HTMLAudioElement,
      trigger: 'r',
      data: 'kick'
    },
    openHatSound: {
      element: HTMLAudioElement,
      trigger: 'a',
      data: 'openhat'
    },
    tomSound: {
      element: HTMLAudioElement,
      trigger: 's',
      data: 'ride'
    },
    snareSound: {
      element: HTMLAudioElement,
      trigger: 'd',
      data: 'snare'
    },
    boomSound: {
      element: HTMLAudioElement,
      trigger: 'f',
      data: 'tink'
    },
  }
  track1Checbkox: HTMLInputElement;
  track2Checkbox: HTMLInputElement;
  track3Checkbox: HTMLInputElement;
  track4Checkbox: HTMLInputElement;
  playSelect1: HTMLButtonElement;
  playSelect2: HTMLButtonElement;
  playSelect3: HTMLButtonElement;
  playSelect4: HTMLButtonElement;
  playSelectALl: HTMLButtonElement;
  checkedButtons = [];
  channels: any[] = [
    [],
    [],
    [],
    []
  ]


  constructor() {
    this.startApp();
  }

  private startApp(): void {
    this.prepareData();
    for (const sound in this.sounds) {
      this.sounds[sound].element = document.querySelector(`[data-sound = "${this.sounds[sound].data}"]`)
    }
    this.setListeners();
  }

  private playSound(key: string): void {
    let soundToPlay: HTMLAudioElement;
    for (const sound in this.sounds) {
      if (this.sounds[sound].trigger !== key) continue;
      soundToPlay = this.sounds[sound].element;
    }
    if (soundToPlay === undefined) {
      return;
    }
    soundToPlay.currentTime = 0;
    soundToPlay.play();
  }

  private onKeyPress(ev: KeyboardEvent): void {
    const keyS = ev.key;
    const time = ev.timeStamp;


    [this.track1Checbkox, this.track2Checkbox, this.track3Checkbox, this.track4Checkbox].forEach((el, key) => {
      if (el.checked) {
        this.channels[key].push({keyS, time})
      }
    });

    this.playSound(keyS);
  }


  private playSelected(numbers): void {
    for (const number in numbers) {
      for (const sound in this.channels[numbers[number]]) {
        setTimeout(() => this.playSound(this.channels[numbers[number]][sound].keyS), this.channels[numbers[number]][sound].time - this.channels[numbers[number]][0].time);
      }
    }
  }

  private prepareData(): void {
    this.track1Checbkox = document.querySelector('#track1Checkbox');
    this.track2Checkbox = document.querySelector('#track2Checkbox');
    this.track3Checkbox = document.querySelector('#track3Checkbox');
    this.track4Checkbox = document.querySelector('#track4Checkbox');

    this.playSelect1 = document.querySelector('#track1Play');
    this.playSelect2 = document.querySelector('#track2Play');
    this.playSelect3 = document.querySelector('#track3Play');
    this.playSelect4 = document.querySelector('#track4Play');

    this.playSelectALl = document.querySelector('#PlaySelectedButton');
  }

  private setListeners(): void {
    document.addEventListener('keypress', (event) => this.onKeyPress(event));

    [this.playSelect1, this.playSelect2, this.playSelect3, this.playSelect4].forEach((el, key) => {
      el.addEventListener('click', () => this.playSelected([key]));
    });

    [this.track1Checbkox, this.track2Checkbox, this.track3Checkbox, this.track4Checkbox].forEach((el, key) => {
        el.addEventListener('click', () => this.checkboxHandler(el, key))
    });

    this.playSelectALl.addEventListener('click', () => this.playSelected(this.checkedButtons));
  }

  private checkboxHandler(checkbox: HTMLInputElement, number: number) {
      checkbox.checked ?  this.checkedButtons.push(number) :   this.checkedButtons.splice(this.checkedButtons.indexOf(number), 1);
  }
}

const statsApp = new MusicApp();
