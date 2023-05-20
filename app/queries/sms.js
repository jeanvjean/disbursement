module.exports = { 
    create: `
        INSERT INTO sms
            (phone_number, sms_content, sms_sent_at, type, status) 
        VALUES
            ($[phone_number], $[sms_content], $[sms_sent_at], $[type], $[status])
        RETURNING *
    `,
    all: `
        SELECT * FROM sms WHERE deleted_at IS NULL
    `,
    get: `
        SELECT * FROM sms WHERE id = $[id] AND deleted_at IS NULL
    `
}