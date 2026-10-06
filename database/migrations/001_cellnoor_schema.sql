-- CellNoor Supabase / PostgreSQL Production Migration 001
-- Multi-Tenant RLS & pgvector target similarity search schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- Tenant context schema
CREATE TABLE IF NOT EXISTS tenants (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    uei VARCHAR(32) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO tenants (id, name, uei)
VALUES ('horizon-commerce-llc', 'Horizon Commerce LLC', 'NY9AHGK2BBZ7')
ON CONFLICT (id) DO NOTHING;

-- Claims table
CREATE TABLE IF NOT EXISTS claims (
    claim_id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) REFERENCES tenants(id),
    statement TEXT NOT NULL,
    confidence VARCHAR(32) NOT NULL,
    supporting_evidence JSONB NOT NULL,
    contradicting_evidence JSONB NOT NULL,
    weakest_link_note TEXT,
    provenance JSONB NOT NULL,
    baselines_beaten JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Target embeddings for semantic vector search
CREATE TABLE IF NOT EXISTS target_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id VARCHAR(64) REFERENCES tenants(id),
    target_gene VARCHAR(32) NOT NULL,
    disease_context VARCHAR(128) NOT NULL,
    embedding vector(1536),
    depmap_score FLOAT NOT NULL,
    hsc_tpm FLOAT NOT NULL,
    dvr_score FLOAT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Simulation runs history
CREATE TABLE IF NOT EXISTS simulation_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id VARCHAR(64) REFERENCES tenants(id),
    sample_id VARCHAR(128) NOT NULL,
    u_menin FLOAT NOT NULL,
    u_bcl2 FLOAT NOT NULL,
    u_aza FLOAT NOT NULL,
    teratoma_hazard_score FLOAT NOT NULL,
    teratoma_passed BOOLEAN NOT NULL,
    fim_min_eigenvalue FLOAT NOT NULL,
    dvr_score FLOAT NOT NULL,
    status VARCHAR(32) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Enablement
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE target_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_runs ENABLE ROW LEVEL SECURITY;

-- RLS Tenant Isolation Policies
CREATE POLICY tenant_claims_isolation ON claims
    FOR ALL USING (tenant_id = current_setting('app.current_tenant', true));

CREATE POLICY tenant_embeddings_isolation ON target_embeddings
    FOR ALL USING (tenant_id = current_setting('app.current_tenant', true));

CREATE POLICY tenant_simulations_isolation ON simulation_runs
    FOR ALL USING (tenant_id = current_setting('app.current_tenant', true));
