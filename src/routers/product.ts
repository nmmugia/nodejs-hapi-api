import productController from "../controllers/product"

const product: any[] = [
    {
        method: 'GET',
        path: '/products',
        handler:  productController.getAll
    },{
        method: 'GET',
        path: '/product/{id}',
        handler:  productController.getById
    },{
        method: 'POST',
        path: '/products',
        handler:  productController.create
    },{
        method: 'PUT',
        path: '/products',
        handler:  productController.update
    },{
        method: 'DELETE',
        path: '/products',
        handler:  productController.delete
    },{
        method: 'POST',
        path: '/products/sync',
        handler:  productController.sync
    }
];

export default product