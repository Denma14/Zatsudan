/*sql*/
import * as types from "../shared/types.js";

import Database from "better-sqlite3";

const db = new Database("app.db", { verbose: console.log });

db.pragma("journal_mode = WAL");

db.exec(`CREATE TABLE IF NOT EXISTS messages(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

const pruneStmt = db.prepare(`
        DELETE FROM messages 
        WHERE id IN (
          SELECT id FROM messages 
          ORDER BY id DESC 
          LIMIT -1 OFFSET 10000
        )
      `);

const insertStmt = db.prepare(
  "INSERT INTO messages (user_id, content) VALUES (?,?)",
);
export const saveMessage = db.transaction((userId: string, content: string) => {
  insertStmt.run(userId, content);
  pruneStmt.run();
});

export function getMessageLog(limit: number = 100) {
  const initMessageLog = db.prepare(
    "SELECT user_id AS id, content AS message FROM (SELECT * FROM messages ORDER BY id DESC LIMIT ?) ORDER BY id ASC",
  );
  return initMessageLog.all(limit);
}
