// import Json from './json-server';
import { getUsers, getItems, createUser, getTagsForItem, addItem } from './postgres-server';

const resolveFunctions = {
    Query: {
        users: () => {
            return getUsers();
        },

        user: (root, { id }, context) => {
            return context.loaders.GetUser.load(id);
        },

        items: () => {
           return getItems();
        },

        item: (root, { id }, context) => {
            return context.loaders.GetItem.load(id);
        }
    },

    Item: {
        itemowner: (item, { }, context) => { // may need to replace empty braces with args
           return context.loaders.GetUser.load(item.itemowner);
        },
        borrower: (item, { }, context) => {
            if (!item.borrower) return null;
            return context.loaders.GetUser.load(item.borrower);
        },
        tags: (item, { }, context) => {
            return getTagsForItem(item.id);
        }
    },

    User: {
        items: (user, args, context) => {
             return context.loaders.GetItemsShared.load(user.id);
            
        },
        borrowed: (user, args, context) => {
            return context.loaders.GetItemsBorrowed.load(user.id);
        }
    },

    Mutation: {
        addItem: (root, args, context) => {
            return addItem(args, context);
        },

        addUser: (root, args, context) => {
            return createUser(args, context);
        }
    }
};

export default resolveFunctions;