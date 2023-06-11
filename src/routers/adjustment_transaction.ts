import {getAll, getBySku, create, update, deleteByID} from "../controllers/adjustment_transaction"

const product: any[] = [
    {
        method: 'GET',
        path: '/adjustment-transaction',
        handler:  getAll
    },{
        method: 'GET',
        path: '/adjustment-transaction/{sku}',
        handler:  getBySku
    },{
        method: 'POST',
        path: '/adjustment-transaction',
        handler:  create
    },{
        method: 'PUT',
        path: '/adjustment-transaction',
        handler:  update
    },{
        method: 'DELETE',
        path: '/adjustment-transaction',
        handler:  deleteByID
    }
];

export default product