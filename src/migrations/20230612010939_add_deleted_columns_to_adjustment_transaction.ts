import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('adjustment_transaction', function (table) {
    table.timestamp('deleted_at');
    table.string('deleted_by');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('adjustment_transaction', function (table) {
    table.dropColumn('deleted_at');
    table.dropColumn('deleted_by');
  });
}
