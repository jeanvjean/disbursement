module.exports = {
  getAllSMSTransactionsByPeriod: `
    SELECT COUNT(*) OVER() AS over_all_count, id, phone_number, message_content, account_number, bank_name, account_name, status, account_resolved_by, created_at FROM transactions WHERE created_at > CURRENT_TIMESTAMP - INTERVAL '$[period] days'
  `,
  getAllPendingResolveSMSTransactions: `
    SELECT COUNT(*) OVER() AS over_all_count, id, phone_number, message_content, account_number, bank_name, account_name, status, account_resolved_by, created_at FROM transactions WHERE status IN ('pending', 'resolved', 'not_resolved') AND created_at > CURRENT_TIMESTAMP - INTERVAL '$[period] days'
  `,
  getAllPendingApprovalSMSTransactions: `
  SELECT COUNT(*) OVER() AS over_all_count, id, phone_number, message_content, account_number, bank_name, account_name, status, account_resolved_by, created_at FROM transactions WHERE status IN ('process_for_approval') AND created_at > CURRENT_TIMESTAMP - INTERVAL '$[period] days'
  `,
  searchPatchQuery: `
    AND to_tsvector(LOWER(concat_ws(' ', phone_number, message_content, account_number,  bank_name, account_name, status, account_resolved_by))) @@ plainto_tsquery(LOWER($[s]))
  `,
  filterByStatus: `
    AND status = $[status]
  `,
  getTransactionById: `
    SELECT id, phone_number, account_number, bank_name, account_name, status, last_sms_resent_at, client_id, resolved_account_number, resolved_account_name, resolved_bank_name, bank_code FROM transactions WHERE id = $1;
  `,
  getTransactionHistoryByTransactionId: `
    SELECT id, phone_number, account_number, bank_name, account_name, status FROM transactions_histories WHERE transaction_id = $1;
  `,
  getLastTransactionHistoryByTransactionId: `
    SELECT 
      id, phone_number, account_number, bank_name, account_name, status, resolved_account_number_accuracy, resolved_bank_name_accuracy
    FROM transactions_histories 
    WHERE transaction_id = $1 
    ORDER BY created_at DESC 
    LIMIT 1;
  `,
  getTransactionByArrayId: `
    SELECT id, phone_number, account_number, bank_name, account_name, status FROM transactions WHERE id IN ($1:csv);
  `,
  updateTransactionStatusById: `
    UPDATE transactions SET status = $2 WHERE id = $1;
  `,
  updateTransactionStatusByIdAndResolver: `
    UPDATE transactions 
    SET 
    status = $2, 
    account_resolved_by = $3, 
    bank_code = $4, 
    approved_by = $5, 
    resolved_account_number = $6, 
    resolved_account_name = $7, 
    resolved_bank_name = $8 
    WHERE id = $1;
  `,
  updateTransactionStatusByIdAndApprover: `
    UPDATE transactions SET status = $2, approved_by = $3 WHERE id = $1;
  `,
  addTransactionHistory: `
    INSERT INTO transactions_histories(phone_number, message_content, account_number, bank_name,
      account_name, status, account_resolved_by, resolved_account_number_accuracy, 
      resolved_bank_name_accuracy, resolve_source, source, error_message, transaction_id) 
      VALUES($[phone_number], $[message_content], $[account_number], $[bank_name], 
        $[account_name], $[status], $[account_resolved_by], $[resolved_account_number_accuracy], 
        $[resolved_bank_name_accuracy], $[resolve_source], $[source], $[error_message], $[transaction_id]) RETURNING *;
  `,
  getTransactionHistoriesByValidation: `
    SELECT resolve_source, phone_number, id FROM transactions_histories WHERE transaction_id = $[transaction_id] AND resolve_source IN ('user', 'system'); 
  `,
  selectChartData: `
    SELECT to_char(date_trunc('month', created_at), 'Mon') AS month, 
      COALESCE(COUNT(id), 0)::integer AS total_sms_request,
      COALESCE(SUM(total_sms_retry), 0)::integer AS total_sms_resent,
      COALESCE(COUNT(id) FILTER (WHERE status = 'approved'), 0)::integer AS total_sms_resolved
    FROM transactions
    GROUP BY date_trunc('month', created_at)
  `,
  updateTransactionSmsSent: `
    UPDATE transactions SET total_sms_retry = total_sms_retry + 1, last_sms_resent_at = NOW() WHERE id = $[id];
  `,
  getTransactionByIdByLastSms: `
    SELECT id, phone_number, account_number, bank_name, account_name, status, client_id FROM transactions WHERE id = $1 AND status != 'resolved' AND last_sms_resent_at < CURRENT_TIMESTAMP - INTERVAL '24 hours';
  `,
  updateTransactionProgramme: `
        UPDATE transactions SET programme_id = $[programme_id] WHERE id = $[id] RETURNING *;
  `
};
