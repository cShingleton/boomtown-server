import DataLoader from 'dataloader';
import Json from './json-server';
import { getUser, getItem } from './postgres-server';

export default function() {
    return {
        GetUser: new DataLoader(ids => (
            Promise.all(ids.map(id => getUser(id)))
        )),
        GetItem: new DataLoader(ids => (
            Promise.all(ids.map(id => getItem(id)))
        )),
        GetItemsShared: new DataLoader(ids => (
            Promise.all(ids.map(id => Json.getItemsShared(id)))
        )),
        GetItemsBorrowed: new DataLoader(ids => (
            Promise.all(ids.map(id => Json.getItemsBorrowed(id)))
        ))
    }; 
}