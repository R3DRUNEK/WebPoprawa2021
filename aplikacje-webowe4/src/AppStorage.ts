import firebase from "firebase";
import {firebaseConfig} from './FirebaseConfig';
import {SaveModes} from "./Enums";

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();

export interface IAppStorage {
}

class AppStorageTools {
    protected static getLocalData(key: string) {
        const data = localStorage.getItem(key);
        if (data !== null && Object.keys(data).length !== 0 && data.length !== 0) {
            return JSON.parse(data);
        } else {
            return [];
        }
    }

    protected static async getRemoteData() {
        const res = await db.collection('notes').get();
        let response = res.docs.map((res) => ({
            data: res.data(),
            id: res.id
        }));
        return response.map((el) => ({
            ...el.data,
            id: el.id
        }));
    }


    protected static async deleteLocalData(data: any) {
        await AppStorage.saveData(data, 'notes', SaveModes.LocalStorage);
    }

    protected static async deleteRemoteData(id: string) {
        await db.collection('notes').doc(id).delete();
    }

    protected static async saveRemoteData(note: object) {
        await db.collection('notes').add(note);
    }

    protected static saveLocalData(data: any, key: string): void {
        localStorage.setItem(key, JSON.stringify(data));
    }

    protected static async updateLocalData(data: any) {
        await AppStorage.saveData(data, 'notes', SaveModes.LocalStorage);
    }

    protected static async updateRemoteData(id: string, note: any) {
        await db.collection('notes').doc(id).update(note);
    }
}

export default class AppStorage extends AppStorageTools implements IAppStorage{
    private static instance: IAppStorage;

    public static getInstance(): IAppStorage {
        if (!AppStorage.instance) {
            AppStorage.instance = new AppStorage();
        }

        return AppStorage.instance;
    }

    static async saveData(data: any, key: string, storageMode: SaveModes): Promise<void> {
        switch (storageMode) {
            case SaveModes.LocalStorage:
                AppStorageTools.saveLocalData(data, key);
                break;
            case SaveModes.FireStore:
                await AppStorage.saveRemoteData(Object.assign({}, data[0]));
                break;
        }
    }

    static async getData(key: string, storageMode: SaveModes): Promise<any> {
        switch (storageMode) {
            case SaveModes.LocalStorage:
                return AppStorageTools.getLocalData(key);
            case SaveModes.FireStore:
                return await AppStorageTools.getRemoteData()
        }
    }

    static async deleteData(id: string, storageMode: SaveModes, data: any = []) {
        switch (storageMode) {
            case SaveModes.LocalStorage:
                return AppStorageTools.deleteLocalData(data);
            case SaveModes.FireStore:
                return await AppStorageTools.deleteRemoteData(id);
        }
    }

    static async updateData(data: any, storageMode: SaveModes, dataLocal: any = []) {
        switch (storageMode) {
            case SaveModes.LocalStorage:
               return AppStorageTools.updateLocalData(dataLocal);
            case SaveModes.FireStore:
                return await AppStorageTools.updateRemoteData(data.id, Object.assign({}, data));
        }
    }

}
