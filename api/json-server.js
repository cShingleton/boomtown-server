import fetch from 'node-fetch';

const Json = {
    usersUrl: 'http://localhost:3001/users',
    itemsUrl: 'http://localhost:3001/items'
};

// Json.getItems = () => {
//     return fetch(Json.itemsUrl)
//             .then(res => res.json())
//             .catch(err => console.log(err));
// };

// Json.getItem = (id) => {
//     return fetch(`${Json.itemsUrl}/${id}`)
//             .then(res => res.json())
//             .catch(err => console.log(err));
// };

// Json.getUsers = () => {
//     return fetch(Json.usersUrl)
//             .then(res => res.json())
//             .catch(err => console.log(err));
// }

// Json.getUser = (id) => {
//     return fetch(`${Json.usersUrl}/${id}`)
//             .then(res => res.json())
//             .catch(err => console.log(err));
// }

Json.getItemsShared = (userId) => {
    return fetch(`${Json.itemsUrl}/?itemOwner=${userId}`)
            .then(res => res.json())
            .catch(err => console.log(err));
}

Json.getItemsBorrowed = (userId) => {
    return fetch(`${Json.itemsUrl}/?borrower=${userId}`)
            .then(res => res.json())
            .catch(err => console.log(err));
}

Json.addItem = (itemToAdd) => {
    let postData = { 
        method: 'POST', 
        body: JSON.stringify(itemToAdd),
        headers: {
            "Content-Type": "application/json"
        }
    }
    fetch(Json.itemsUrl, postData)
        .then(res => res.json())
        .catch(err => console.log(err));
    return itemToAdd;
}

export default Json;

