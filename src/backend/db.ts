import Database from "better-sqlite3";

const db = new Database("app.db"); //add for debugging{ verbose: console.log }

db.pragma("journal_mode = WAL");

db.exec(/*sql*/ `CREATE TABLE IF NOT EXISTS messages(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

const pruneStmt = db.prepare(/*sql*/ `
        DELETE FROM messages 
        WHERE id IN (
          SELECT id FROM messages 
          ORDER BY id DESC 
          LIMIT -1 OFFSET 10000
        )
      `);

const insertStmt = db.prepare(
  /*sql*/ `INSERT INTO messages (username, content) VALUES (?,?)`,
);

const selectStmt = db.prepare(/*sql*/ `SELECT * FROM messages WHERE id = ?`);

export const saveMessage = db.transaction(
  /*sql*/ (username: string, content: string) => {
    const info = insertStmt.run(username, content);
    pruneStmt.run();

    return selectStmt.get(info.lastInsertRowid);
  },
);

const deleteSpamStmt = db.prepare(
  /*sql */
  `DELETE FROM messages 
  WHERE id IN (
    SELECT id FROM messages 
    WHERE username = ? 
    ORDER BY created_at DESC 
    LIMIT 5
  ) RETURNING id`,
);

export function deleteSpam(username: string) {
  const deletedRows = deleteSpamStmt.all(username);

  const deletedRowsId = deletedRows.map((row: any) => row.id);

  return deletedRowsId;
}

export function getMessageLog(limit: number = 100) {
  const initMessageLog = db.prepare(/*sql*/ `
      SELECT id, username, content, created_at 
      FROM (
        SELECT id, username, content, created_at
        FROM messages 
        ORDER BY id DESC 
        LIMIT ?
      ) 
      ORDER BY id ASC
    `);

  return initMessageLog.all(limit);
}
