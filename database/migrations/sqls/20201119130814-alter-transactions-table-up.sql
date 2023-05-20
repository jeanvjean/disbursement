/* Replace with your SQL commands */

ALTER TABLE transactions  
    ADD total_sms_retry NUMERIC DEFAULT 0,
    ADD last_sms_resent_at TIMESTAMPTZ DEFAULT NULL;