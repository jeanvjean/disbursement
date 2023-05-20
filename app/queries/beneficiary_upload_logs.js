module.exports = { 
    create: `
        INSERT INTO beneficiary_upload_logs
            (user_id, file_path, type, file_name, programme_id, programme_name) 
        VALUES
            ($[user_id], $[file_path], $[type], $[file_name], $[programme_id], $[programme_name])
        RETURNING *
    `,
    all: `
        SELECT * FROM beneficiary_upload_logs WHERE deleted_at IS NULL
    `,
    get: `
        SELECT * FROM beneficiary_upload_logs WHERE id = $[id] AND deleted_at IS NULL
    `,
    allWithJoin: `
        SELECT bul.*, first_name, last_name, email, phone_number FROM beneficiary_upload_logs as bul INNER JOIN users AS u ON u.id = bul.user_id WHERE bul.deleted_at IS NULL
`,
    search: `
        AND to_tsvector(LOWER(concat_ws(' ', bul.id, bul.programme_name, programme_id, user_id, type, first_name, last_name, email, phone_number))) @@ plainto_tsquery(LOWER($[s]))
    `,
    filterByType: `
        AND type = $[type]
    `,
    getLogsTotal: `
        SELECT count(*) as over_all_count 
            FROM beneficiary_upload_logs as bul
        INNER JOIN users AS u
            ON bul.user_id = u.id
    `,
}