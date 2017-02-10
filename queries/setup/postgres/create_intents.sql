DROP TABLE IF EXISTS Intents CASCADE;


-- SCHEMA
CREATE TABLE Intents (

    -- General
    intent_id SERIAL PRIMARY KEY,
    created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

    -- Attributes
    intent_name CHARACTER VARYING(255) UNIQUE NOT NULL,
    category categories NOT NULL,
    description TEXT DEFAULT NULL

);
