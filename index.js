import { } from 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import {
    graphqlExpress,
    graphiqlExpress
} from 'graphql-server-express';
import schema from './api/schema';
import createLoaders from './api/loaders';

const app = express();
const GQL_PORT = 4000;

app.use('*', cors());

app.use('/graphql', (request, response, next) => {
    // TODO: Add firebase token validation
    next();
});

app.use('/graphql', bodyParser.json(), graphqlExpress({ 
    schema,
    context: { 
        loaders: createLoaders()
    }
}));

app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql'
 }));

app.listen(GQL_PORT, () => console.log(
    `GraphQL is now running on localhost:${GQL_PORT}/graphql`
));