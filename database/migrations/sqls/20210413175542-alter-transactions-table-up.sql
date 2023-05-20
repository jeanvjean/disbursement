/* Replace with your SQL commands */

ALTER TABLE transactions
    ADD IF NOT EXISTS programme_id VARCHAR DEFAULT NULL;
    