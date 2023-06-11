import {getAll, getById, create, update, deleteById, sync} from "../controllers/product"

const product: any[] = [
    {
        method: 'GET',
        path: '/products',
        handler:  getAll
    },{
        method: 'GET',
        path: '/products/{id}',
        handler:  getById
    },{
        method: 'POST',
        path: '/products',
        handler:  create
    },{
        method: 'PUT',
        path: '/products/{id}',
        handler:  update
    },{
        method: 'DELETE',
        path: '/products/{id}',
        handler:  deleteById
    },{
        method: 'POST',
        path: '/products/sync',
        handler:  sync
    }
];

export default product