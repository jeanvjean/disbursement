module.exports = { 
    create: `
        INSERT INTO beneficiaries
            (phone_number, first_name, last_name, amount_credited, date_of_transaction, account_number, bank_name, bank_code, status) 
        VALUES
            ($[phone_number], $[first_name], $[last_name], $[amount_credited], $[date_of_transaction], $[account_number], $[bank_name], $[bank_code], $[status])
        RETURNING *
    `,
    all: `
        SELECT * FROM beneficiaries WHERE deleted_at IS NULL
    `,
    get: `
        SELECT * FROM beneficiaries WHERE id = $[id] AND deleted_at IS NULL
    `
}