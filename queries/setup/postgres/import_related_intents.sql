-- IMPORT CSV (not working with params $1, $2)
COPY Related_intents (
    i_id,
    intent_name
) FROM '/Users/Nicho/GitHub/IVE/data/related_intents.csv'
WITH CSV HEADER DELIMITER ',';
