import * as SQLite from 'expo-sqlite';

let cachedDb: SQLite.SQLiteDatabase | null = null;

export const openDatabase = async () => {
    if (!cachedDb) {
        const db = await SQLite.openDatabaseAsync('test.db');
        cachedDb = db;
    }
    return cachedDb;
};


export const saveDataInSQLite = async (
    db: SQLite.SQLiteDatabase,
    tableName: string,
    data: Array<Record<string, any>>
) => {
    if (!data.length) return console.warn(`No data to save in "${tableName}".`);

    try {
        const columns = Object.keys(data[0]);

        // Create table if it doesn't exist
        await db.execAsync(`
        CREATE TABLE IF NOT EXISTS ${tableName} (${columns.map((col) => `${col} TEXT`).join(", ")});
      `);

        // Clear existing data
        await db.execAsync(`DELETE FROM ${tableName};`);

        // Insert new data
        const insertSQL = `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${columns.map(() => "?").join(", ")});`;
        for (const item of data) {
            await db.runAsync(insertSQL, columns.map((col) => item[col] ?? null));
        }

        console.log(`Data successfully saved in "${tableName}".`);
    } catch (error) {
        console.error(`Error saving data in "${tableName}":`, error);
    }
};

