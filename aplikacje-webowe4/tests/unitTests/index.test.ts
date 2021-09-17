import Notes from "../../src/Notes";
import Note from "../../src/Note";
import AppStorage from "../../src/AppStorage";
import {SaveModes} from "../../src/Enums";

describe('notes init test', () => {
    let note: Note;

    beforeAll(() => {
        note = new Note('test', 'test', 'black', 'test', '2021-05-30');
    });

    it('is note id correctly created', () => {
        expect(note.id.length).toBeTruthy();
    });

    it ('is note color black', () => {
        expect(note.color).toEqual('black');
    });

    it ('is note pinned', () => {
        expect(note.pinned).toEqual(false);
    });

    it ('is note dateCreated', () => {
        expect(note.dateCreated).toEqual('2021-05-30');
    });

    it ('is note body', () => {
        expect(note.body).toEqual('test');
    });
})


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