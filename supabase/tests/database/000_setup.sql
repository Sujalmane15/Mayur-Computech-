-- pgTAP test setup for Supabase schema
BEGIN;

-- Load the pgTAP extension
CREATE EXTENSION IF NOT EXISTS pgtap;

-- Set up test users and roles for testing
-- We'll create some test data in each test file as needed

-- No teardown needed as we rollback at end of each test
COMMIT;
