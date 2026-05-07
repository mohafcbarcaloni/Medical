import fs from "fs/promises";
import path from "path";
import { createPool } from "@vercel/postgres";

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "db.json");

type Database = {
  bookings: any[];
  messages: any[];
  users: any[];
};

const defaultDb: Database = { bookings: [], messages: [], users: [] };

// Use Vercel Postgres if available, otherwise fallback to local JSON
const pool = process.env.POSTGRES_URL ? createPool() : null;

async function initDb() {
  if (pool) {
    try {
      await pool.sql`CREATE TABLE IF NOT EXISTS bookings (id SERIAL PRIMARY KEY, data JSONB NOT NULL)`;
      await pool.sql`CREATE TABLE IF NOT EXISTS messages (id SERIAL PRIMARY KEY, data JSONB NOT NULL)`;
      await pool.sql`CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, email TEXT UNIQUE NOT NULL, data JSONB NOT NULL)`;
    } catch (error) {
      console.error("Postgres init failed:", error);
    }
    return;
  }

  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DB_FILE);
    } catch {
      await fs.writeFile(DB_FILE, JSON.stringify(defaultDb, null, 2), "utf-8");
    }
  } catch (error) {
    console.error("Failed to initialize database", error);
  }
}

export async function getDb(): Promise<Database> {
  if (pool) {
    const { rows: b } = await pool.sql`SELECT data FROM bookings`;
    const { rows: m } = await pool.sql`SELECT data FROM messages`;
    const { rows: u } = await pool.sql`SELECT data FROM users`;
    return {
      bookings: b.map(r => r.data),
      messages: m.map(r => r.data),
      users: u.map(r => r.data)
    };
  }

  await initDb();
  try {
    const data = await fs.readFile(DB_FILE, "utf-8");
    const db = JSON.parse(data);
    return {
      bookings: db.bookings || [],
      messages: db.messages || [],
      users: db.users || []
    };
  } catch (error) {
    console.error("Failed to read database", error);
    return defaultDb;
  }
}

export async function addBooking(booking: any) {
  if (pool) {
    await pool.sql`INSERT INTO bookings (data) VALUES (${JSON.stringify(booking)})`;
    return;
  }
  const db = await getDb();
  db.bookings.push(booking);
  await saveDb(db);
}

export async function addMessage(message: any) {
  if (pool) {
    await pool.sql`INSERT INTO messages (data) VALUES (${JSON.stringify(message)})`;
    return;
  }
  const db = await getDb();
  db.messages.push(message);
  await saveDb(db);
}

export async function addUser(user: any) {
  if (pool) {
    await pool.sql`INSERT INTO users (email, data) VALUES (${user.email.toLowerCase()}, ${JSON.stringify(user)})`;
    return;
  }
  const db = await getDb();
  db.users.push(user);
  await saveDb(db);
}

export async function findUserByEmail(email: string) {
  if (pool) {
    const { rows } = await pool.sql`SELECT data FROM users WHERE email = ${email.toLowerCase()}`;
    return rows[0]?.data || null;
  }
  const db = await getDb();
  return db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
}

export async function updateUser(email: string, updates: any) {
  if (pool) {
    const user = await findUserByEmail(email);
    if (user) {
      const updated = { ...user, ...updates };
      await pool.sql`UPDATE users SET data = ${JSON.stringify(updated)} WHERE email = ${email.toLowerCase()}`;
    }
    return;
  }
  const db = await getDb();
  const index = db.users.findIndex((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (index !== -1) {
    db.users[index] = { ...db.users[index], ...updates };
    await saveDb(db);
  }
}

async function saveDb(data: Database): Promise<void> {
  if (pool) return;
  await initDb();
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to write database", error);
    throw new Error("Database write failure");
  }
}
