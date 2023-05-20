/* Replace with your SQL commands */

ALTER TABLE clients 
    ADD webhook_url VARCHAR DEFAULT NULL,
    ADD api_key_field VARCHAR DEFAULT NULL,
    ADD api_key_value VARCHAR DEFAULT NULL;