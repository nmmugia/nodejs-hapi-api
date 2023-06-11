export interface product {
    id: bigint;
    sku: string;
    name: string;
    price: number;
    image: string;
    description: string;
    created_at: Date;
    created_by: string;
    updated_at: Date;
    updated_by: string;
}

export interface createProduct {
    sku: string;
    name: string;
    price: number;
    image: string;
    description: string;
}


export interface updateProduct {
    sku?: string;
    name?: string;
    price?: number;
    image?: string;
    description?: string;
}
