DROP TYPE IF EXISTS categories CASCADE;

-- TYPE
CREATE TYPE categories AS ENUM (
    'basic',
    'indoor',
    'outdoor'
);
