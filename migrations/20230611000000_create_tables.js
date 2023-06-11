"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
function up(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        function addAuthorColumns(table) {
            table.timestamp('created_at').defaultTo(knex.fn.now()).index();
            table.string('created_by').defaultTo(knex.raw('CURRENT_USER'));
            table.timestamp('updated_at').defaultTo(knex.fn.now());
            table.string('updated_by').defaultTo(knex.raw('CURRENT_USER'));
            // table.timestamp('deleted_at');
            // table.string('deleted_by');
        }
        yield knex.schema.createTable('product', (table) => {
            table.bigIncrements('id').primary();
            table.string('sku').notNullable();
            table.string('name').notNullable();
            table.string('price');
            table.text('image');
            table.text('description');
            addAuthorColumns(table);
        });
        yield knex.schema.raw('CREATE UNIQUE INDEX product_sku_uindex ON product (sku)');
        yield knex.schema.createTable('adjustment_transaction', (table) => {
            table.bigIncrements('id').primary();
            table.string('sku').notNullable();
            table
                .foreign('sku')
                .references('sku')
                .inTable('product')
                .onDelete('cascade');
            table.integer('qty').notNullable();
            table.decimal('amount').notNullable();
            table.text('description');
            addAuthorColumns(table);
        });
        yield knex.schema.createTable('product_stock', (table) => {
            table.bigIncrements('id').primary();
            table.bigInteger('product_id').notNullable();
            table
                .foreign('product_id')
                .references('id')
                .inTable('product')
                .onDelete('cascade');
            table.bigInteger('transaction_id').notNullable();
            table
                .foreign('transaction_id')
                .references('id')
                .inTable('adjustment_transaction');
            table.text('description');
            table.bigInteger('previous_product_stock');
            table.integer('previous_qty');
            table.integer('last_qty');
            table.integer('qty_changes');
            addAuthorColumns(table);
        });
        // to make fetch with these columns as condition faster 
        yield knex.schema.alterTable('product_stock', (table) => {
            table.index('product_id');
            table.index('transaction_id');
        });
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        yield knex.schema.dropTableIfExists('product_stock');
        yield knex.schema.dropTableIfExists('adjustment_transaction');
        yield knex.schema.dropTableIfExists('product');
    });
}
exports.down = down;
