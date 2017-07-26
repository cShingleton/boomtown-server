import pool from '../database/index';
import admin from '../database/firebase';

function renameId(respRows) {
    return respRows.map(row => Object.keys(row).reduce((acc, user) => {
        acc = { ...row, id: row.userid };
        delete acc.userid;
        return acc;
    }), {});
}

export function getUser(id) {
    return new Promise(async (resolve, reject) => {
        try {
            const firebaseUser = await admin.auth().getUser(id);
            let pgUser = await pool.query(`SELECT * from user_profiles WHERE userid='${id}'`);
            pgUser = renameId(pgUser.rows)[0];
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
                    return renameId(response.rows);
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

