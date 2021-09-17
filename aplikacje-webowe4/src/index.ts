import './main.scss';
import AppStorage from "./AppStorage";
import Notes from "./Notes";
import {SaveModes} from "./Enums";

window.addEventListener('load', async () => {
    Notes.saveMode = SaveModes.FireStore;
    const notes = AppStorage.getData('notes', Notes.saveMode);
    Notes.notesLocal = await AppStorage.getData('notes',  Notes.saveMode);
    Notes.createNoteElements(await notes);
});



class App {
    titleInput: HTMLInputElement;
    contentInput: HTMLInputElement;
    addSubmitInput: HTMLInputElement;
    colorInput: HTMLSelectElement;

    constructor() {
        this.prepareData();
        this.setListeners();
    }

    private prepareData() {
        this.titleInput = document.querySelector('#inputTitle');
        this.contentInput = document.querySelector('#inputText');
        this.addSubmitInput = document.querySelector('#submitButton');
        this.colorInput = document.querySelector('#colorSelect');
    }

    private setListeners() {
        this.addSubmitInput.addEventListener('click',() => Notes.createNote(
            this.titleInput.value,
            this.contentInput.value,
            this.colorInput.value
        ))
    }
}

const app = new App();