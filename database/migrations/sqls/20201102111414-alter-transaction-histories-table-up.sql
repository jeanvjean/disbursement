/* Replace with your SQL commands */

CREATE TYPE source_enum AS enum('akupay', 'sos');
CREATE TYPE resolve_source_enum AS enum('system', 'user');

ALTER TABLE transactions_histories
    ADD source source_enum,
    ADD resolved_account_number_accuracy INTEGER DEFAULT 0,
    ADD resolved_bank_name_accuracy INTEGER DEFAULT 0,
    ADD resolve_source resolve_source_enum;
