module.exports = { 
    create: `
        INSERT INTO users_funds_logs
            (fund_id, user_id, status, amount, programme_name, programme_id) 
        VALUES
            ($[fund_id], $[user_id], $[status], $[amount], $[programme_name], $[programme_id])
        RETURNING *
    `,
    all: `
       SELECT *, f.created_at AS created_at FROM users_funds_logs AS f INNER JOIN users AS u ON u.id = f.user_id WHERE f.deleted_at IS NULL
    `,
    search: `
        AND to_tsvector(LOWER(concat_ws(' ', fund_id, user_id, programme_name, programme_id, first_name, last_name, email, phone_number  ))) @@ plainto_tsquery(LOWER($[s]))
    `,
    filterByStatus: `
        AND f.status = $[status]
    `,
    getLogsTotal: `
        SELECT count(*) as over_all_count 
            FROM users_funds_logs as f
        INNER JOIN users AS u
            ON f.user_id = u.id
    `
}