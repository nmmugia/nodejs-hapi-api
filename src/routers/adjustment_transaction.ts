import {getAll, getById, create, update, deleteByID} from "../controllers/adjustment_transaction"

const product: any[] = [
    {
        method: 'GET',
        path: '/adjustment-transactions',
        handler:  getAll
    },{
        method: 'GET',
        path: '/adjustment-transactions/{id}',
        handler:  getById
    },{
        method: 'POST',
        path: '/adjustment-transactions',
        handler:  create
    },{
        method: 'PUT',
        path: '/adjustment-transactions',
        handler:  update
    },{
        method: 'DELETE',
        path: '/adjustment-transactions',
        handler:  deleteByID
    }
];

export default product