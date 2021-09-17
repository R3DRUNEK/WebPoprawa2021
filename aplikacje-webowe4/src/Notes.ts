import Note from "./Note";
import AppStorage from "./AppStorage";
import {SaveModes} from "./Enums";

export default class Notes {
    static notesLocal: Note[];
    static saveMode: SaveModes;

    public static createNote(title: string, body: string, color: string) {
        if (!title || !body) {
            alert('Uzupelnij dane');
            return;
        }
        const now = new Date();
        const idRef = title + now.toLocaleTimeString();
        const note: Note = new Note (idRef, title, color, body, now.toLocaleDateString());
        Notes.saveNotes([note], Notes.saveMode);
    }


    public static saveNotes(notes: Note[], saveMode: SaveModes) {
        notes.forEach((note: Note) => {
            if (Notes.notesLocal.find((el: { id: string; }) => el.id === note.id) === undefined) {
                Notes.notesLocal.push(note);
                Notes.createNoteElements([note]);
            }
        })
        const dataToSave = saveMode === SaveModes.LocalStorage ? Notes.notesLocal : notes
        AppStorage.saveData(dataToSave, 'notes', saveMode);
    }

    static createNoteElements(notes: Note[]) {
        notes.forEach((note: Note) => {
            const noteDiv = document.createElement('div');
            noteDiv.className = 'note';
            const pin = document.createElement('div');
            pin.className = 'pin';
            const title = document.createElement('div');
            title.className = 'title';
            title.innerHTML = note.title;
            const body = document.createElement('input');
            body.className = 'body';
            body.value = note.body;
            const date = document.createElement('div');
            date.className = 'date';
            date.innerHTML = note.dateCreated;
            const remove = document.createElement('div');
            remove.addEventListener('click', () => this.removeNote(note.id, noteDiv));
            remove.className = 'remove';
            remove.innerHTML = ' Usuń ';
            const editButton = document.createElement('button');
            editButton.className = 'editButton'
            editButton.innerHTML = 'Edytuj'

            noteDiv.appendChild(pin);
            noteDiv.appendChild(title);
            noteDiv.appendChild(body);
            noteDiv.appendChild(date);
            noteDiv.appendChild(editButton);
            noteDiv.appendChild(remove);

            noteDiv.style.backgroundColor = note.color;
            pin.addEventListener('click', () => this.pinNote(noteDiv, pin, note.id));
            if (!note.pinned) {
                pin.innerHTML = 'Przypnij';
                document.querySelector('#notes').appendChild(noteDiv);
            }
            else {
                pin.innerHTML = 'Odepnij';
                document.querySelector('#pinnedNotes').appendChild(noteDiv);
            }


            editButton.addEventListener('click', () => this.updateNote(body, note));
        })
    }
    private static updateNote(body: HTMLInputElement, note: Note) {
        const savedNoteIndex = Notes.findNoteIndex(note.id);
        Notes.notesLocal[savedNoteIndex].body = body.value;
        AppStorage.updateData(Notes.notesLocal[savedNoteIndex], Notes.saveMode, Notes.notesLocal);
    }

    private static pinNote(noteDiv: HTMLDivElement, pin: HTMLDivElement, id: string) {
        const notesId = Notes.findNoteIndex(id);
        const pinned = Notes.notesLocal[notesId].pinned;
        const notesSelector: HTMLDivElement = document.querySelector('#notes');
        const notesPinnedSelector: HTMLDivElement = document.querySelector('#pinnedNotes');
        if (!pinned) {
            if (notesSelector.contains(noteDiv))
                notesSelector.removeChild(noteDiv);
            pin.innerHTML = 'Odepnij';
            notesPinnedSelector.appendChild(noteDiv);
        } else {
            if (notesPinnedSelector.contains(noteDiv))
                notesPinnedSelector.removeChild(noteDiv);
            pin.innerHTML = 'Przypnij';
            notesSelector.appendChild(noteDiv);
        }
        Notes.updatePinned(id, pinned);
    }

    private static removeNote(id: string, noteDiv: HTMLDivElement) {
        const notesId = Notes.findNoteIndex(id);
        if (notesId === -1) {
            return;
        }
        Notes.notesLocal.splice(notesId, 1);
        noteDiv.remove();
        AppStorage.deleteData(id, Notes.saveMode, Notes.notesLocal);
    }


    private static updatePinned(id: string, mode: boolean) {
        const savedNoteIndex = Notes.findNoteIndex(id);
        Notes.notesLocal[savedNoteIndex].pinned = !mode;
        AppStorage.updateData(Notes.notesLocal[savedNoteIndex], Notes.saveMode, Notes.notesLocal);
    }

    private static findNoteIndex(id: string) {
        return Notes.notesLocal.findIndex((el: { id: string; }) => {
            return el.id === id;
        });
    }

}