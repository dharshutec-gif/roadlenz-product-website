import "server-only";

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { buildSeedDb } from "./seed";
import { adminStore } from "./admin-store";
import { queueSupabaseSnapshot, flushSupabaseQueue } from "./supabase-sync";

import {
  ENTITY_KEYS,
  type Db,
  type EntityKey,
} from "./types";

/* =========================================================
   DATABASE LOCATION
========================================================= */

const DATA_DIR = path.join(
  process.cwd(),
  "data",
);

const DB_PATH = path.join(
  DATA_DIR,
  "db.json",
);

/* =========================================================
   MEMORY CACHE
========================================================= */

let cache: {
  mtimeMs: number;
  db: Db;
} | null = null;

/* =========================================================
   HELPERS
========================================================= */

function ensureDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, {
      recursive: true,
    });
  }
}

function isArray(
  value: unknown,
): value is unknown[] {
  return Array.isArray(value);
}

/* =========================================================
   SAFE DATABASE UPGRADE

   IMPORTANT:
   - Existing products are preserved
   - Existing customers are preserved
   - Existing website CMS data is preserved
   - Existing users are preserved
   - No demo records are inserted
========================================================= */

function normalizeDb(db: Db): {
  db: Db;
  changed: boolean;
} {
  let changed = false;
  if (!db.admin) {
    adminStore(db);
    changed = true;
  }

  /*
   * Make sure all CMS entity collections exist.
   * We NEVER replace an existing collection.
   */
  for (const key of ENTITY_KEYS) {
    if (!isArray(db[key])) {
      (
        db as unknown as Record<
          string,
          unknown
        >
      )[key] = [];

      changed = true;
    }
  }

  /* Authentication */

  if (!Array.isArray(db.users)) {
    db.users = [];
    changed = true;
  }

  if (!Array.isArray(db.sessions)) {
    db.sessions = [];
    changed = true;
  }

  /* Customer profiles */

  if (
    !db.customers ||
    typeof db.customers !== "object" ||
    Array.isArray(db.customers)
  ) {
    db.customers = {};
    changed = true;
  }

  /*
   * Add new customer fields without removing
   * anything from existing profiles.
   */
  for (const profile of Object.values(
    db.customers,
  )) {
    if (
      !Array.isArray(
        profile.registeredProducts,
      )
    ) {
      profile.registeredProducts = [];
      changed = true;
    }

    if (
      !Array.isArray(
        profile.savedProductSlugs,
      )
    ) {
      profile.savedProductSlugs = [];
      changed = true;
    }

    if (!Array.isArray(profile.quotes)) {
      profile.quotes = [];
      changed = true;
    }

    if (!Array.isArray(profile.tickets)) {
      profile.tickets = [];
      changed = true;
    }

    if (
      !Array.isArray(
        profile.installations,
      )
    ) {
      profile.installations = [];
      changed = true;
    }

    if (
      !Array.isArray(
        profile.warranties,
      )
    ) {
      profile.warranties = [];
      changed = true;
    }

    if (
      !Array.isArray(
        profile.notifications,
      )
    ) {
      profile.notifications = [];
      changed = true;
    }

    if (
      !Array.isArray(
        profile.addresses,
      )
    ) {
      profile.addresses = [];
      changed = true;
    }

    if (
      typeof profile.fleetPlatformUrl !==
      "string"
    ) {
      profile.fleetPlatformUrl = "";
      changed = true;
    }
  }

  /* Commerce */

  if (!Array.isArray(db.orders)) {
    db.orders = [];
    changed = true;
  }

  if (!Array.isArray(db.invoices)) {
    db.invoices = [];
    changed = true;
  }

  /*
   * Upgrade version number only.
   * Do NOT replace existing content.
   */
  if (
    typeof db.version !== "number" ||
    db.version < 14
  ) {
    db.version = 14;
    changed = true;
  }

  return {
    db,
    changed,
  };
}

/* =========================================================
   DATABASE PATH
========================================================= */

export function dbPath(): string {
  return DB_PATH;
}

/* =========================================================
   RAW WRITE
========================================================= */

function writeDbRaw(db: Db): void {
  ensureDirectory();

  db.updatedAt =
    new Date().toISOString();

  const temporaryPath =
    `${DB_PATH}.${process.pid}.${crypto.randomBytes(4).toString("hex")}.tmp`;

  fs.writeFileSync(
    temporaryPath,
    JSON.stringify(
      db,
      null,
      2,
    ),
    "utf8",
  );

  fs.renameSync(
    temporaryPath,
    DB_PATH,
  );

  cache = null;
  queueSupabaseSnapshot(db);
  // The on-disk outbox survives interruption; admin reads and a manual retry also drain it.
  void flushSupabaseQueue();
}

/* =========================================================
   READ DATABASE
========================================================= */

export function readDb(
  force = false,
): Db {
  ensureDirectory();

  /*
   * First installation only.
   *
   * Existing db.json is NEVER replaced here.
   */
  if (!fs.existsSync(DB_PATH)) {
    const initialDb =
      buildSeedDb();

    writeDbRaw(initialDb);

    return initialDb;
  }

  const stat =
    fs.statSync(DB_PATH);

  /*
   * Return cached copy when the file
   * has not changed.
   */
  if (
    !force &&
    cache &&
    cache.mtimeMs === stat.mtimeMs
  ) {
    return cache.db;
  }

  /*
   * Read existing database.
   *
   * Parsing errors are deliberately NOT
   * converted into an empty database because
   * that could destroy production data.
   */
  const raw =
    fs.readFileSync(
      DB_PATH,
      "utf8",
    );

  let parsed: Db;

  try {
    parsed =
      JSON.parse(raw) as Db;
  } catch (error) {
    console.error(
      "RoadLenz database JSON is invalid:",
      error,
    );

    throw new Error(
      `Unable to read ${DB_PATH}. The database file contains invalid JSON.`,
    );
  }

  const normalized =
    normalizeDb(parsed);

  /*
   * Persist only structural upgrades.
   */
  if (normalized.changed) {
    writeDbRaw(
      normalized.db,
    );

    const updatedStat =
      fs.statSync(DB_PATH);

    cache = {
      mtimeMs:
        updatedStat.mtimeMs,

      db: normalized.db,
    };

    return normalized.db;
  }

  cache = {
    mtimeMs:
      stat.mtimeMs,

    db: normalized.db,
  };

  return normalized.db;
}

/* =========================================================
   MUTATE DATABASE

   All Admin / Customer writes should go through this
   function so the data is written atomically.
========================================================= */

export function mutateDb<T>(
  fn: (db: Db) => T,
): T {
  ensureDirectory();
  const lockPath = `${DB_PATH}.lock`;
  const deadline = Date.now() + 3000;
  let lock: number;
  while (true) {
    try { lock = fs.openSync(lockPath, "wx"); break; }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST" || Date.now() >= deadline) throw new Error("The database is busy. Please retry this change.");
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 20);
    }
  }
  try {
    // A rejected mutation must not leak its partially edited object into the read cache.
    const db = structuredClone(readDb(true));
    const result = fn(db);
    if (result && typeof result === "object" && "then" in result) throw new Error("Database mutations must be synchronous.");
    writeDbRaw(db);
    return result;
  } finally {
    fs.closeSync(lock);
    fs.unlinkSync(lockPath);
  }
}

/* =========================================================
   ID GENERATOR
========================================================= */

export function newId(
  prefix: string,
): string {
  return `${prefix}_${crypto
    .randomBytes(8)
    .toString("hex")}`;
}

/* =========================================================
   LIST CMS ENTITY
========================================================= */

export function listEntity<
  T = Record<string, unknown>,
>(
  db: Db,
  key: EntityKey,
): T[] {
  const items =
    db[key] as unknown as {
      id: string;
      order: number;
    }[];

  return [...items].sort(
    (a, b) =>
      (a.order ?? 0) -
      (b.order ?? 0),
  ) as unknown as T[];
}

/* =========================================================
   PUBLISHED CONTENT
========================================================= */

export function publishedOf<T>(
  items: T[],
): T[] {
  return items.filter(
    (item) =>
      (
        item as {
          published?: boolean;
        }
      ).published === true,
  );
}

/* =========================================================
   CREATE CMS ENTITY
========================================================= */

export function createEntity(
  db: Db,
  key: EntityKey,
  data: Record<
    string,
    unknown
  >,
) {
  const items =
    db[key] as unknown as {
      id: string;
      order: number;
    }[];

  const now =
    new Date().toISOString();

  const id = newId(key);

  const order =
    items.length > 0
      ? Math.max(
          ...items.map(
            (item) =>
              item.order ?? 0,
          ),
        ) + 1
      : 1;

  const item = {
    id,

    order,

    published: true,

    createdAt: now,

    updatedAt: now,

    ...data,
  };

  (
    db[
      key
    ] as unknown as unknown[]
  ).push(item);

  return item;
}

/* =========================================================
   UPDATE CMS ENTITY
========================================================= */

export function updateEntity(
  db: Db,
  key: EntityKey,
  id: string,
  data: Record<
    string,
    unknown
  >,
) {
  const items =
    db[key] as unknown as {
      id: string;
      updatedAt?: string;
      [key: string]: unknown;
    }[];

  const item =
    items.find(
      (entry) =>
        entry.id === id,
    );

  if (!item) {
    return null;
  }

  /*
   * Prevent API payload from changing
   * the permanent database ID.
   */
  const {
    id: _ignoredId,
    createdAt:
      _ignoredCreatedAt,
    ...safeData
  } = data;

  Object.assign(
    item,
    safeData,
    {
      id: item.id,

      updatedAt:
        new Date().toISOString(),
    },
  );

  return item;
}

/* =========================================================
   DELETE CMS ENTITY
========================================================= */

export function deleteEntity(
  db: Db,
  key: EntityKey,
  id: string,
): boolean {
  const items =
    db[key] as unknown as {
      id: string;
      order: number;
    }[];

  const index =
    items.findIndex(
      (item) =>
        item.id === id,
    );

  if (index === -1) {
    return false;
  }

  items.splice(index, 1);

  /*
   * Re-number display order after deletion.
   */
  items.forEach(
    (item, itemIndex) => {
      item.order =
        itemIndex + 1;
    },
  );

  return true;
}

/* =========================================================
   REORDER CMS ENTITIES
========================================================= */

export function reorderEntity(
  db: Db,
  key: EntityKey,
  ids: string[],
): void {
  const items =
    db[key] as unknown as {
      id: string;
      order: number;
    }[];

  const itemMap =
    new Map(
      items.map(
        (item) => [
          item.id,
          item,
        ],
      ),
    );

  ids.forEach(
    (id, index) => {
      const item =
        itemMap.get(id);

      if (item) {
        item.order =
          index + 1;
      }
    },
  );

  /*
   * Any records not included in ids retain
   * their relative position after the
   * explicitly reordered records.
   */

  const orderedIds =
    new Set(ids);

  const remaining =
    items
      .filter(
        (item) =>
          !orderedIds.has(
            item.id,
          ),
      )
      .sort(
        (a, b) =>
          a.order - b.order,
      );

  remaining.forEach(
    (item, index) => {
      item.order =
        ids.length +
        index +
        1;
    },
  );
}
