export interface product {
    id: number;
    sku: string;
    name: string;
    price: string;
    image: any;
    description: string;
    created_at: Date;
    created_by: string;
    updated_at: Date;
    updated_by: string;
}

export interface createProductForm {
    sku: string;
    name: string;
    price: number;
    image: string;
    description: string;
}


export interface updateProductForm {
    sku?: string;
    name?: string;
    price?: number;
    image?: string;
    description?: string;
}
