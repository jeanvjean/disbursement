module.exports = {
  paginate: ({ limit, offset }) => `
        LIMIT ${limit} OFFSET ${offset}
    `,
  order: (column, order, alias = '') => `
    ORDER BY ${alias}${column} ${order}
  `,
  interval: (period, tableAlias = '') => `
    AND ${tableAlias}created_at > CURRENT_TIMESTAMP - INTERVAL '${period} days' 
  `,
  attachDateRange: (start_date, end_date,  tableAlias = '') => `
    AND ${tableAlias}created_at >= '${start_date}' AND ${tableAlias}created_at <= '${end_date}'
  `,
};
