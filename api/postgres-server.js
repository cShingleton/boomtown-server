import pool from '../database/index';
import admin from '../database/firebase';

// READ METHODS
export function getUser(id) {
    return new Promise(async (resolve, reject) => {
        try {
            const firebaseUser = await admin.auth().getUser(id);
            let pgUser = await pool.query(`SELECT * from user_profiles WHERE id='${id}'`);
            pgUser = (pgUser.rows)[0];
            pgUser = { ...pgUser, email: firebaseUser.email };
            resolve(pgUser);
        } catch (e) {
            console.log(e);
            reject(e);
        }
    })
}

export function getUsers() {
    return pool.query(`SELECT * from public.user_profiles`)
                .then(response => {
                    return (response.rows);
                })
                .catch(errors => console.log(errors));
}

export function getItems() {
    return pool.query(`SELECT * FROM public.items`)
                .then(response => {
                    return response.rows;
                })
                .catch(errors => console.log(errors));
}

export function getItem(id) {
    return pool.query(`SELECT * from public.items WHERE id='${id}'`)
                .then(response => {
                    return response.rows[0];
                });
}

export function getItemsShared(id) {
    return pool.query(`SELECT * from public.items WHERE itemowner='${id}'`)
                .then(response => {
                    return response.rows;
                }).catch(err => console.log(err));
}

export function getItemsBorrowed(id) {
    return pool.query(`SELECT * from public.items WHERE borrower='${id}'`)
                .then(response => {
                    return response.rows;
                }).catch(err => console.log(err));
}

export function getTagsForItem(id) {
    return pool.query(`SELECT t.title
                        FROM tags t
                            INNER JOIN itemtags it ON t.id = it.item_tag
                                WHERE it.tagged_item = ${id}`)
                .then(response => {
                    return response.rows;
                }).catch(err => console.log(err));
}

// TO DO: FIX THIS FUNCTION
export function getItemsViaTag(id) {
    return pool.query(`SELECT i.id, i.title, i.description, i.created, i.itemowner, i.borrower
                        FROM items i
                            INNER JOIN itemtags it ON i.id = it.tagged_item
                                WHERE it.item_tag = ${id}`)
                .then(response => {
                    return response.rows;
                }).catch(err => console.log(err));
}


// WRITE METHODS
export function createUser(args, context) {
    return new Promise(async (resolve, reject) => {
        try {
            const fbUser = await admin.auth().createUser({
                email: args.email,
                password: args.password
            });
            const query = {
                text: `INSERT INTO user_profiles(fullname, bio, id) VALUES($1, $2, $3) RETURNING *`,
                values: [args.fullname, args.bio, fbUser.uid]
            };
            const pgUser = await pool.query(query);
            const newUser = { ...pgUser.rows[0], email: fbUser.email, id: fbUser.uid };
            // set token header
            // context.response.set('FireBase-Token', context.token);
            resolve(newUser);
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
}

export function addItem(args, context) {
    return new Promise(async (resolve, reject) => {
        try {
            const itemQuery = {
                text: `INSERT INTO items(
                title,
                imageurl,
                description,
                itemowner)
                    VALUES($1, $2, $3, $4) RETURNING *`,
                values: [args.title, args.imageurl, args.description, args.itemowner]
            };
            const newItem = await pool.query(itemQuery);
            function insertTags(tags) {
                return tags.map(tag => {
                    return `(${newItem.rows[0].id}, ${tag.id})`
                }).join(', ');
            }
            const tagsQuery = {
                text: `INSERT INTO itemtags(tagged_item, item_tag) VALUES ${insertTags(args.tags)} RETURNING *`
            };
            const assignedTag = await pool.query(tagsQuery);
            resolve({ id: newItem.rows[0].id });
        } catch(e) {
            console.log(e);
            reject(e);
        }
    });
};
