import {getAll, getById, create, update, deleteByID} from "../controllers/adjustment_transaction"
import {middlewareOptions} from '../helpers/middleware'

const product: any[] = [
    {
        method: 'GET',
        path: '/adjustment-transactions',
        handler:  getAll,
        options: middlewareOptions
    },{
        method: 'GET',
        path: '/adjustment-transactions/{id}',
        handler:  getById,
        options: middlewareOptions
    },{
        method: 'POST',
        path: '/adjustment-transactions',
        handler:  create,
        options: middlewareOptions
    },{
        method: 'PUT',
        path: '/adjustment-transactions/{id}',
        handler:  update,
        options: middlewareOptions
    },{
        method: 'DELETE',
        path: '/adjustment-transactions/{id}',
        handler:  deleteByID,
        options: middlewareOptions
    }
];

export default product