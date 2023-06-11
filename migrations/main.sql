create database test;

create table product
(
	id bigserial not null
		constraint product_pk
			primary key,
	sku varchar not null,
	name varchar not null,
	price numeric,
	image text,
	description text
);

create unique index product_sku_uindex
	on product (sku);

create table adjustment_transaction
(
    id          bigserial not null
        constraint adjustment_transaction_pk
            primary key,
    sku         varchar   not null
        constraint adjustment_transaction_product_sku_fk
		foreign key (sku) references product (sku)
			on delete cascade;,
    qty         integer   not null,
    amount      numeric   not null,
    description text
);


create table product_stock
(
	id bigserial not null
		constraint product_stock_pk
			primary key,
	product_id bigint not null
		constraint product_stock_product_id_fk
			references product,
	transaction_id bigint not null
		constraint product_stock_adjustment_transaction_id_fk
			references adjustment_transaction,
	description text,
	previous_product_stock bigint,
	previous_qty int,
	last_qty int,
	qty_changes int
);

