export interface adjustmentTransaction {
    id: bigint;
    sku: string;
    qty: number;
    amount: number;
    description: string;
    created_at: Date;
    created_by: string;
    updated_at: Date;
    updated_by: string;
}

export interface createAdjustmentTransaction {
    sku: string;
    qty: number;
    amount: number;
    description: string;
}

export interface updateAdjustmentTransaction {
    sku?: string;
    qty?: number;
    amount?: number;
    description?: string;
}
