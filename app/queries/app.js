module.exports = {
  saveTransaction: (status) => `
        INSERT INTO transactions(phone_number, message_content, account_number, bank_name, account_name) VALUES($[phone_number], $[message_content], $[account_number], $[account_name]) RETURNING *;
    `,
  saveTransactionHistory: `
        INSERT INTO transactions_histories(
          transaction_id, 
          phone_number, 
          message_content, 
          account_number, 
          bank_name, 
          account_name, 
          status, 
          error_message
          ) 
          VALUES(
            $[transaction_id], 
            $[phone_number], 
            $[message_content], 
            $[account_number], 
            $[bank_name], 
            $[account_name], 
            $[status], 
            $[error_message]
            ) 
            RETURNING *
    `,
  saveTransaction: `
        INSERT INTO transactions(phone_number, message_content, account_number, bank_name, account_name, client_id) VALUES($[phone_number], $[message_content], $[account_number], $[bank_name], $[account_name], $[client_id]) RETURNING *;
    `,
  getAll: `
        SELECT 
          COALESCE(COUNT(id), 0)::integer AS total_sms_request,
          COALESCE(SUM(total_sms_retry), 0)::integer AS total_sms_resent,
          COALESCE(COUNT(id) FILTER (WHERE status = 'resolved'), 0)::integer AS total_successful_sms_request,
          COALESCE(COUNT(id) FILTER (WHERE status = 'approved'), 0)::integer AS total_transactions_resolved
        FROM transactions
        WHERE created_at > CURRENT_TIMESTAMP - INTERVAL '$[period] days' AND programme_id IN ($[programmes:csv])
    `,
  updateTransactionStatus: `
        UPDATE transactions SET status = $[status], bank_code = $[bank_code] WHERE id = $[id] RETURNING *;
    `,
  updateTransactionStatusAndAccountName: `
        UPDATE transactions SET status = $[status], account_name = $[account_name], bank_code = $[bank_code] WHERE id = $[id] RETURNING *;
    `,
  createAuditLog: `INSERT INTO audit_logs
    (client_ip, req_method, host, path, status_code, client_agent,
      response_message, user_id, user_email, user_type, referer, content_type, 
      content_encoding, user_agent, user_name, activity) 
      VALUES($[clientIp], $[req_method], $[host], $[path], $[statusCode], 
      $[client_agent], $[response_message], $[user_id], $[user_email] , $[user_type], $[referer],
       $[content_type], $[content_encoding], $[user_agent], $[user_name], $[activity]) RETURNING *;`,
  searchAuditLogPatchQuery: `
    AND to_tsvector(user_type || ' ' || user_name || ' ' || activity) @@ plainto_tsquery($[s])
  `,
  getAllAuditLogs: `
        SELECT *, COUNT(*) OVER() AS over_all_count
          FROM audit_logs
        WHERE deleted_at IS NULL
    `,

  createTransaction: `INSERT`
};
