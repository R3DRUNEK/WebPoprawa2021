import {INoteGen} from "./interfaces";

export default class Note implements INoteGen {
    id: string;
    title: string;
    color: string;
    body: string;
    pinned: boolean;
    dateCreated: string;

    constructor(id: string, title: string, color: string, body: string, dateCreated: string) {
        this.id = id;
        this.title = title;
        this.color = color;
        this.body = body;
        this.dateCreated = dateCreated;
        this.pinned = false;
    }
}