/* Replace with your SQL commands */

ALTER TABLE transactions  
    ADD approved_by VARCHAR DEFAULT NULL,
    ADD bank_code VARCHAR DEFAULT NULL;