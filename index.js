import { } from 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import admin from './database/firebase';
import {
    graphqlExpress,
    graphiqlExpress
} from 'graphql-server-express';
import schema from './api/schema';
import createLoaders from './api/loaders';

const app = express();
const GQL_PORT = 4000;

app.use('*', cors());
app.use(bodyParser.json());

// TODO: CHECK TOKEN GENERATION IS WORKING
// app.use('/graphql', (request, response, next) => {
//     const { operationName, variables } = request.body;
//     if (operationName && operationName === 'addUser') {
//         admin.auth().createCustomToken(variables.email).then(function(token) {
//             request.body.token = token;
//             next();
//         }).catch(err => {
//             console.log(err);
//             next();
//         });
//     } else {
//         next();
//     }
// });

app.use('/graphql', graphqlExpress(function(request, response) {
    return { 
        schema,
        context: { 
            loaders: createLoaders(),
            // token: request.body.token,
            // response: response
        }
    };
}));

app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql'
 }));

app.listen(GQL_PORT, () => console.log(
    `GraphQL is now running on localhost:${GQL_PORT}/graphql`
));