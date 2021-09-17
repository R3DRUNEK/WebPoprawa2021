import Notes from "../../src/Notes";
import Note from "../../src/Note";
import {INoteGen} from "../../src/interfaces";
import AppStorage from "../../src/AppStorage";
import {SaveModes} from "../../src/Enums";

describe('Note', () => {
    it('completeNote', () => {
        let note = {
            id: 'tests',
            body: 'test',
            title: 'testtitle',
            dateCreated: (new Date).toLocaleDateString(),
            color: 'black',
            pinned: true
        };
        Notes.notesLocal = [];
        Notes.createNote(note.title, note.body, note.color);
        expect(Notes.notesLocal[0]).toEqual(expect.objectContaining({
            id: note.id,
            title: note.title,
            body: note.body,
            color: note.color,
            pinned: note.pinned,
            dateCreated: note.dateCreated
        }));
    })
})

describe('notes init test', () => {
    let note: INoteGen;

    beforeAll(() => {
        note = new Note('test', 'test', 'black', 'test', 'test');
    });

    it('is note id correctly created', () => {
        expect(note.id.length).toBeTruthy();
    });

    it ('is note color black', () => {
      expect(note.color).toEqual('black');
    });

    it ('is note color black', () => {
        expect(note.pinned).toEqual(false);
    });
})

describe('local storage test', () => {
    let note: any;
    let data: any;
    let storage: AppStorage;

    beforeAll(async () => {
        storage = AppStorage.getInstance();
        await AppStorage.saveData([{id: '1'}], 'notes', SaveModes.LocalStorage);
        data = await AppStorage.getData('notes', SaveModes.LocalStorage);
    });

    it('is note id correctly created', () => {
        expect(data[0].id).toEqual('1');
    });
})