import pool from '../db.js';

// ── GET ALL USERS (admin only) ───────────────────────────────────────────────
export const getAllUsers = async (req, res) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.page_size) || 10;
    const offset = (page - 1) * pageSize;

    let countQuery = 'SELECT COUNT(*) AS total FROM users';
    let dataQuery = `
      SELECT u.id, u.username, u.email, u.is_admin, u.is_active, u.created_at,
             COUNT(t.id) AS total_tests
      FROM users u
      LEFT JOIN test_results t ON t.user_id = u.id
    `;
    const params = [];
    const countParams = [];

    if (search) {
      const like = `%${search}%`;
      countQuery += ' WHERE username LIKE ? OR email LIKE ?';
      dataQuery += ' WHERE (u.username LIKE ? OR u.email LIKE ?)';
      params.push(like, like);
      countParams.push(like, like);
    }

    dataQuery += ' GROUP BY u.id ORDER BY u.created_at DESC LIMIT ? OFFSET ?';
    params.push(pageSize, offset);

    const [[{ total }]] = await pool.execute(countQuery, countParams);
    const [users] = await pool.execute(dataQuery, params);

    return res.json({
      users: users.map(u => ({ ...u, is_admin: !!u.is_admin, is_active: !!u.is_active })),
      total,
      page,
      page_size: pageSize,
      pages: Math.ceil(total / pageSize),
    });
  } catch (err) {
    console.error('Get all users error:', err);
    return res.status(500).json({ error: err.message });
  }
};

// ── GET USER DETAILS + their TEST RESULTS (admin only) ───────────────────────
export const getUserDetails = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const [userRows] = await pool.execute(
      'SELECT id, username, email, is_admin, is_active, created_at FROM users WHERE id = ?',
      [userId]
    );
    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userRows[0];
    user.is_admin = !!user.is_admin;
    user.is_active = !!user.is_active;

    const [results] = await pool.execute(
      `SELECT id, user_id, text_result, voice_result, face_result,
              fusion_result, modalities_used, created_at, updated_at
       FROM test_results WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    const parsedResults = results.map(parseJsonFields);

    return res.json({
      ...user,
      total_tests: parsedResults.length,
      results: parsedResults,
      profile: {
        total_tests: parsedResults.length,
        last_test_date: parsedResults[0]?.created_at || null,
      },
    });
  } catch (err) {
    console.error('Get user details error:', err);
    return res.status(500).json({ error: err.message });
  }
};

// ── GET ALL TEST RESULTS (admin only) ────────────────────────────────────────
export const getAllResults = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.page_size) || 20;
    const offset = (page - 1) * pageSize;

    const [[{ total }]] = await pool.execute('SELECT COUNT(*) AS total FROM test_results');
    const [rows] = await pool.execute(
      `SELECT t.id, t.user_id, u.username, u.email,
              t.text_result, t.voice_result, t.face_result,
              t.fusion_result, t.modalities_used, t.created_at
       FROM test_results t
       JOIN users u ON u.id = t.user_id
       ORDER BY t.created_at DESC LIMIT ? OFFSET ?`,
      [pageSize, offset]
    );

    return res.json({
      results: rows.map(parseJsonFields),
      total,
      page,
      page_size: pageSize,
      pages: Math.ceil(total / pageSize),
    });
  } catch (err) {
    console.error('Get all results error:', err);
    return res.status(500).json({ error: err.message });
  }
};

// ── ADMIN STATS ───────────────────────────────────────────────────────────────
export const getStats = async (req, res) => {
  try {
    const [[{ total_users }]] = await pool.execute('SELECT COUNT(*) AS total_users FROM users WHERE is_admin = 0');
    const [[{ total_tests }]] = await pool.execute('SELECT COUNT(*) AS total_tests FROM test_results');
    const [[{ tests_today }]] = await pool.execute(
      'SELECT COUNT(*) AS tests_today FROM test_results WHERE DATE(created_at) = CURDATE()'
    );
    const [[{ users_today }]] = await pool.execute(
      'SELECT COUNT(*) AS users_today FROM users WHERE DATE(created_at) = CURDATE()'
    );

    return res.json({ total_users, total_tests, tests_today, users_today });
  } catch (err) {
    console.error('Stats error:', err);
    return res.status(500).json({ error: err.message });
  }
};

function parseJsonFields(row) {
  const fields = ['text_result', 'voice_result', 'face_result', 'fusion_result', 'modalities_used'];
  const parsed = { ...row };
  for (const f of fields) {
    if (parsed[f] && typeof parsed[f] === 'string') {
      try { parsed[f] = JSON.parse(parsed[f]); } catch (_) {}
    }
  }
  return parsed;
}
