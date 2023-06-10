import adjustmentTransactionController from "../controllers/adjustmentTransaction"

const product: any[] = [
    {
        method: 'GET',
        path: '/adjustment-transaction',
        handler:  adjustmentTransactionController.getAll
    },{
        method: 'GET',
        path: '/adjustment-transaction',
        handler:  adjustmentTransactionController.getBySku
    },{
        method: 'POST',
        path: '/adjustment-transaction',
        handler:  adjustmentTransactionController.create
    },{
        method: 'PUT',
        path: '/adjustment-transaction',
        handler:  adjustmentTransactionController.update
    },{
        method: 'DELETE',
        path: '/adjustment-transaction',
        handler:  adjustmentTransactionController.delete
    }
];

export default product