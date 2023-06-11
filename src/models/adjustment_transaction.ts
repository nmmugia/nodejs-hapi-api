export interface adjustmentTransaction {
    id: number;
    sku: string;
    qty: number;
    amount: number;
    description: string;
    created_at: Date;
    created_by: string;
    updated_at: Date;
    updated_by: string;
}

export interface createAdjustmentTransactionForm {
    sku: string;
    qty: number;
    amount: number;
    description: string;
}

export interface updateAdjustmentTransactionForm {
    sku?: string;
    qty?: number;
    amount?: number;
    description?: string;
}
