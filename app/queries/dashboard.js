module.exports = {
  dashboardSummary: `
    SELECT 
        COALESCE(SUM(t.id), 0)::integer AS total_sms,
        COALESCE(COUNT(t.id) FILTER (WHERE t.status = 'process_for_approval'), 0)::integer AS total_sms_corrected,
    WHERE date_trunc($1, created_at) = date_trunc($1, current_date)
    `,
  dashboardCharts: `
      SELECT id, phone_number, account_number, bank_name, account_name, status FROM transactions WHERE id = $1;
    `,
};
