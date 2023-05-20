module.exports = { 
    create: `
        INSERT INTO flagged_trasanctions_approved
            (transaction_id, user_id, transaction_status, amount, account_name, account_number, bank_name, programme_name, programme_id) 
        VALUES
            ($[transaction_id], $[user_id], $[transaction_status], $[amount], $[account_name], $[account_number], $[bank_name], $[programme_name], $[programme_id])
        RETURNING *
    `,
    all: `
        SELECT *, COUNT(*) OVER() AS over_all_count FROM flagged_trasanctions_approved AS f LEFT JOIN users AS u ON u.id = f.user_id WHERE f.deleted_at IS NULL
    `,
    get: `
        SELECT * FROM flagged_trasanctions_approved AS f LEFT JOIN users AS u ON u.id = f.user_id WHERE f.id = $[id] AND f.deleted_at IS NULL
    `,

    search: `
        AND to_tsvector(LOWER(concat_ws(' ', account_number, account_name, bank_name, transaction_status, amount))) @@ plainto_tsquery(LOWER($[s]))
    `,
}