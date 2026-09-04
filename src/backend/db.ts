import Database from "better-sqlite3";

const db = new Database("app.db"); //add for debugging{ verbose: console.log }

db.pragma("journal_mode = WAL");

db.exec(/*sql*/ `CREATE TABLE IF NOT EXISTS messages(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
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
  /*sql*/ `INSERT INTO messages (user_id, content) VALUES (?,?)`,
);

export const saveMessage = db.transaction(
  /*sql*/ (userId: string, content: string) => {
    insertStmt.run(userId, content);
    pruneStmt.run();
  },
);

export function getMessageLog(limit: number = 100) {
  const initMessageLog = db.prepare(/*sql*/ `
      SELECT id, user_id AS username, content AS message 
      FROM (
        SELECT id, user_id, content 
        FROM messages 
        ORDER BY id DESC 
        LIMIT ?
      ) 
      ORDER BY id ASC
    `);

  return initMessageLog.all(limit);
}
