SELECT * FROM Related_intents
WHERE i_id=$1
ORDER BY intent_name DESC;
