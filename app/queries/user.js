module.exports = {
  createUser: `
        INSERT INTO users(first_name, last_name, user_type, email, password, phone_number) VALUES($[first_name], $[last_name], $[user_type], $[email], $[password], $[phone_number]) RETURNING *;
    `,
  createInvitedUser: `
        INSERT INTO users(first_name, last_name, user_type, email, phone_number, forgot_password_token, forgot_password_token_expired_at) VALUES($[first_name], $[last_name], $[user_type], $[email], $[phone_number], $[forgot_password_token], (NOW() + INTERVAL '30 minutes')) RETURNING *;
  `,
  getAllUsers: `
    SELECT COUNT(*) OVER() AS over_all_count, id, first_name, last_name, user_type, email, CASE WHEN deactivate = false THEN 'active' ELSE 'deactivated' END AS status FROM users WHERE deleted_at IS NULL
  `,
  getAllUsersByUserType: `
  SELECT COUNT(*) OVER() AS over_all_count, id, first_name, last_name, user_type, email, CASE WHEN deactivate = false THEN 'active' ELSE 'deactivated' END AS status FROM users WHERE deleted_at IS NULL AND user_type = $[user_type]
    `,
  search: `
    AND to_tsvector(LOWER(concat_ws(' ', first_name, last_name, email))) @@ plainto_tsquery(LOWER($[s]))
  `,
  getUserById: `
        SELECT u.first_name, u.email, u.last_name, u.user_type, phone_number, u.deactivate, u.deactivate_at, u.id AS id 
        FROM users AS u
        WHERE u.id = $1 AND u.deleted_at IS NULL;
    `,
  getUserEmailByID: `
    SELECT email FROM users AS u WHERE u.id = $1 AND u.deleted_at IS NULL;
  `,
  updateUserById: `
    UPDATE users SET first_name = $2, last_name = $3, phone_number = $4 WHERE id = $1 RETURNING *
  `,
  updateProfile: `
      UPDATE users SET first_name = $2, last_name = $3, phone_number = $4 WHERE id = $1 RETURNING *
  `,
  deleteUser: `
        UPDATE users SET deleted_at = now() WHERE id = $1;
    `,
  deactivateUser: `
    UPDATE users SET deactivate = 'true', deactivate_at = now() WHERE id = $[id] RETURNING *;
  `,
  activateUser: `
    UPDATE users SET deactivate = 'false' WHERE id = $[id] RETURNING *;
  `,
  getUserEmailAndType: `
        SELECT * FROM users WHERE email = $[email] AND deleted_at IS NULL LIMIT 1;
    `,
  getAllUserDetailByID: `
    SELECT * FROM users WHERE id = $[id] AND deleted_at IS NULL LIMIT 1;
  `,
  getUserByEmail: `
        SELECT * FROM users WHERE email = $[email] AND deleted_at  IS NULL LIMIT 1;
    `,
  updateForgotPasswordToken: `
      UPDATE users SET forgot_password_token = $[forgot_password_token], forgot_password_token_expired_at = (NOW() + INTERVAL '30 minutes') WHERE id = $[id] RETURNING *;
    `,
  selectUserByForgotPasswordToken: `
      SELECT id FROM users WHERE forgot_password_token = $[token] AND forgot_password_token_expired_at > NOW() LIMIT 1;
    `,
  updatePassword: `
      UPDATE users SET password = $[password], forgot_password_token = NULL, forgot_password_token_expired_at = NULL WHERE id = $[id] AND deactivate IS FALSE RETURNING *;
    `,
  getUserPassword: `
      SELECT password FROM users WHERE id = $[id] LIMIT 1;
    `,
  selectAdminUserRandomly: `
      SELECT id FROM users WHERE user_type = 'administrator' ORDER BY RANDOM() LIMIT 1;
    `,
  createActivity: `
    INSERT INTO users_activities(user_id, activity) VALUES ($1, $2) RETURNING *;
  `,
  getUserActivity: `
      SELECT * FROM users_activities 
      WHERE user_id = $1;
  `,
  getUserLastLoginActivity: `
      SELECT * FROM users_activities 
      WHERE user_id = $[user_id] AND activity = $[activity] ORDER BY created_at DESC LIMIT 1;
  `,
  attachProgramme: `
    INSERT INTO users_programmes(user_id, programme_id, programme_name) VALUES($[user_id], $[programme_id], $[programme_name]) RETURNING *;
  `,
  detachProgramme: `
    DELETE FROM users_programmes WHERE id = $[id];
  `,
  getUserProgrammes: `
    SELECT id AS attachment_id, programme_id AS id, programme_name AS name FROM users_programmes WHERE user_id = $[user_id];
  `
};
