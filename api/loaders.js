import DataLoader from 'dataloader';
import { getUser, getItem, getItemsShared, getItemsBorrowed } from './postgres-server';

export default function() {
    return {
        GetUser: new DataLoader(ids => (
            Promise.all(ids.map(id => getUser(id)))
        )),
        GetItem: new DataLoader(ids => (
            Promise.all(ids.map(id => getItem(id)))
        )),
        GetItemsShared: new DataLoader(ids => (
            Promise.all(ids.map(id => getItemsShared(id)))
        )),
        GetItemsBorrowed: new DataLoader(ids => (
            Promise.all(ids.map(id => getItemsBorrowed(id)))
        ))
    }; 
}