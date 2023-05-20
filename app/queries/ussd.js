module.exports = { 
    create: `
        INSERT INTO ussd
            (phone_number, service_code, duration, transaction_date, status) 
        VALUES
            ($[phone_number], $[service_code], $[duration], $[transaction_date], $[status])
        RETURNING *
    `,
    all: `
        SELECT * FROM ussd WHERE deleted_at IS NULL
    `,
    get: `
        SELECT * FROM ussd WHERE id = $[id] AND deleted_at IS NULL
    `
}