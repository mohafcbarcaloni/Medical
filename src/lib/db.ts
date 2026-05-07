import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "db.json");

type Database = {
  bookings: any[];
  messages: any[];
  users: any[];
};

const defaultDb: Database = { bookings: [], messages: [], users: [] };

async function initDb() {
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
  await initDb();
  try {
    const data = await fs.readFile(DB_FILE, "utf-8");
    const db = JSON.parse(data);
    if (!db.bookings) db.bookings = [];
    if (!db.messages) db.messages = [];
    if (!db.users) db.users = [];
    return db;
  } catch (error) {
    console.error("Failed to read database", error);
    return defaultDb;
  }
}

export async function saveDb(data: Database): Promise<void> {
  await initDb();
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to write database", error);
    throw new Error("Database write failure");
  }
}

export async function addBooking(booking: any) {
  const db = await getDb();
  db.bookings.push(booking);
  await saveDb(db);
}

export async function addMessage(message: any) {
  const db = await getDb();
  db.messages.push(message);
  await saveDb(db);
}

export async function addUser(user: any) {
  const db = await getDb();
  db.users.push(user);
  await saveDb(db);
}

export async function findUserByEmail(email: string) {
  const db = await getDb();
  return db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
}

export async function updateUser(email: string, updates: any) {
  const db = await getDb();
  const index = db.users.findIndex((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (index !== -1) {
    db.users[index] = { ...db.users[index], ...updates };
    await saveDb(db);
  }
}
