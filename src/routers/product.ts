import {getAll, getById, create, update, deleteById, sync} from "../controllers/product"
import {middlewareOptions} from '../helpers/middleware'

const product: any[] = [
    {
        method: 'GET',
        path: '/products',
        handler:  getAll,
        options: middlewareOptions
    },{
        method: 'GET',
        path: '/products/{id}',
        handler:  getById,
        options: middlewareOptions
    },{
        method: 'POST',
        path: '/products',
        handler:  create,
        options: middlewareOptions
    },{
        method: 'PUT',
        path: '/products/{id}',
        handler:  update,
        options: middlewareOptions
    },{
        method: 'DELETE',
        path: '/products/{id}',
        handler:  deleteById,
        options: middlewareOptions
    },{
        method: 'POST',
        path: '/products/sync',
        handler:  sync,
        options: middlewareOptions
    }
];

export default product