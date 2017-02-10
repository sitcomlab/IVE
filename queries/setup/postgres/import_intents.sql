-- IMPORT CSV (not working with params $1, $2)
COPY Intents (
    intent_name,
    category,
    description
) FROM '/Users/Nicho/GitHub/IVE/data/intents.csv'
WITH CSV HEADER DELIMITER ',';
