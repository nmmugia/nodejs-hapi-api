import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {

  function addAuthorColumns(table: Knex.CreateTableBuilder): void {
    table.timestamp('created_at').defaultTo(knex.fn.now()).index();
    table.string('created_by').defaultTo(knex.raw('CURRENT_USER'));
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.string('updated_by').defaultTo(knex.raw('CURRENT_USER'));
  }

  await knex.schema.createTable('product', (table) => {
    table.bigIncrements('id').primary();
    table.string('sku').notNullable();
    table.string('name').notNullable();
    table.decimal('price');
    table.text('image');
    table.text('description');
    addAuthorColumns(table);
  });

  await knex.schema.raw('CREATE UNIQUE INDEX product_sku_uindex ON product (sku)');

  await knex.schema.createTable('adjustment_transaction', (table) => {
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

  await knex.schema.createTable('product_stock', (table) => {
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
  await knex.schema.alterTable('product_stock', (table) => {
    table.index('product_id');
    table.index('transaction_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('product_stock');
  await knex.schema.dropTableIfExists('adjustment_transaction');
  await knex.schema.dropTableIfExists('product');

}
