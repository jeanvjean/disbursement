/* Replace with your SQL commands */

ALTER TABLE transactions_histories
    ADD transaction_id VARCHAR REFERENCES transactions(id) ON DELETE CASCADE;
