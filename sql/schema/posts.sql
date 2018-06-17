CREATE TABLE Posts (
    post_id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_uuid TEXT NOT NULL UNIQUE,
    created TEXT NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')),
    updated TEXT NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')),
    comment TEXT DEFAULT NULL,
    rating INTEGER DEFAULT NULL
);
