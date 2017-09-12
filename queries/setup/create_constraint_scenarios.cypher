// Unique Scenario Id
CREATE CONSTRAINT ON (scenario:Scenarios) ASSERT scenario.scenario_uuid IS UNIQUE;
