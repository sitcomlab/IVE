DROP TABLE IF EXISTS Related_intents CASCADE;


-- SCHEMA
CREATE TABLE Related_intents (

    -- General
    related_intent_id SERIAL PRIMARY KEY,
    created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

    -- Attributes
    i_id CHARACTER VARYING(255) NOT NULL, -- reference to Neo4j
    intent_name CHARACTER VARYING(255) NOT NULL REFERENCES Intents(intent_name) ON UPDATE CASCADE ON DELETE CASCADE

);
