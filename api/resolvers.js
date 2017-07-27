import Json from './json-server';
import { getUsers, getItems, createUser } from './postgres-server';

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
        itemOwner: (item, { }, context) => { // may need to replace empty braces with args
           return context.loaders.GetUser.load(item.itemOwner);
        },
        borrower: (item, { }, context) => {
            if (!item.borrower) return null;
            return context.loaders.GetUser.load(item.borrower);
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
        addItem: (root, args) => {
            const newItem = {
                title: args.title,
                description: args.description,
                imageUrl: args.imageUrl,
                tags: args.tags,
                itemOwner: args.itemOwner,
                createdOn: Math.floor(Date.now() / 1000),
                available: true,
                borrower: null
            }
            return Json.addItem(newItem);
        },

        addUser: (root, args, context) => {
            return createUser(args, context);
        }
    }
};

export default resolveFunctions;