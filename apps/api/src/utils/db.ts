// src/db.ts
import Database from "bun:sqlite";
import { mkdirSync } from "fs";

mkdirSync("src/data", { recursive: true });

export const db = new Database("src/data/kanban.db");

// enable good defaults
db.run("PRAGMA journal_mode = WAL;");
db.run("PRAGMA foreign_keys = ON;");

// create table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS boards (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL
  );
`);

db.run(`
CREATE TABLE IF NOT EXISTS columns (
  id TEXT PRIMARY KEY,
  board_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  position INTEGER NOT NULL,
  FOREIGN KEY(board_id) REFERENCES boards(id)
);
`);

// Cards
db.run(`
CREATE TABLE IF NOT EXISTS cards (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  column_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  position INTEGER NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(column_id) REFERENCES columns(id)
);
`);


export const statements = {
  boardByName: db.query("SELECT id FROM boards WHERE name = ?"),
  boardById: db.query("SELECT * FROM boards WHERE id = ?"),
  boardNameById: db.query("SELECT name FROM boards WHERE id = ?"),
  boardsAll: db.query("SELECT * FROM boards"),
  boardInsert: db.query(
    "INSERT INTO boards (id, name, slug) VALUES (?, ?, ?) RETURNING *"
  ),
  boardDelete: db.query("DELETE FROM boards WHERE id = ? RETURNING *"),
  columnsByBoard: db.query(
    "SELECT * FROM columns WHERE board_id = ? ORDER BY position"
  ),
  columnInsert: db.query(
    "INSERT INTO columns (id, board_id, name, position, type) VALUES (?, ?, ?, ?, ?) RETURNING *"
  ),
  columnDelete: db.query("DELETE FROM columns WHERE id = ? RETURNING *"),
  cardsByBoard: db.query(
    `
    SELECT cards.*
    FROM cards
    JOIN columns ON columns.id = cards.column_id
    WHERE columns.board_id = ?
    ORDER BY cards.position
  `
  ),
  cardInsert: db.query(
    "INSERT INTO cards (column_id, title, description, position) VALUES (?, ?, ?, ?) RETURNING *"
  ),
  cardUpdate: db.query(
    "UPDATE cards SET column_id = ?, position = ? WHERE id = ? RETURNING *"
  ),
};