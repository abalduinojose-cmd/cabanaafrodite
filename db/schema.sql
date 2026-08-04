-- Estrutura do banco de reservas da Cabana Afrodite.
--
-- Rode uma vez no seu Postgres (Neon, Supabase, Vercel Postgres, o que for):
--   psql "$DATABASE_URL" -f db/schema.sql

CREATE EXTENSION IF NOT EXISTS btree_gist;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS reservas (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Período da estadia. Intervalo semiaberto '[)': a data final é o dia da
  -- saída e fica livre para o próximo hóspede, igual à convenção do iCal.
  periodo         daterange NOT NULL,

  hospede_nome    text NOT NULL,
  hospede_email   text NOT NULL,
  hospede_fone    text NOT NULL,
  hospedes        smallint NOT NULL CHECK (hospedes BETWEEN 1 AND 4),

  -- Valores em centavos: dinheiro nunca em ponto flutuante.
  noites          smallint NOT NULL CHECK (noites > 0),
  valor_total     integer NOT NULL CHECK (valor_total > 0),
  valor_cobrado   integer NOT NULL CHECK (valor_cobrado > 0),

  status          text NOT NULL DEFAULT 'pendente'
                    CHECK (status IN ('pendente', 'confirmada', 'cancelada')),

  mp_preference_id text,
  mp_payment_id    text,

  -- Pendente segura a data por alguns minutos; depois disso ela volta ao mapa.
  expira_em       timestamptz NOT NULL,
  criada_em       timestamptz NOT NULL DEFAULT now(),
  atualizada_em   timestamptz NOT NULL DEFAULT now(),

  -- O banco é quem garante que não existem duas estadias sobrepostas.
  -- Não depende da aplicação nem de ordem de chegada: duas requisições
  -- simultâneas para a mesma noite, uma passa e a outra recebe erro.
  CONSTRAINT sem_sobreposicao
    EXCLUDE USING gist (periodo WITH &&)
    WHERE (status IN ('pendente', 'confirmada'))
);

CREATE INDEX IF NOT EXISTS reservas_periodo_idx ON reservas USING gist (periodo);
CREATE INDEX IF NOT EXISTS reservas_status_idx ON reservas (status);
CREATE INDEX IF NOT EXISTS reservas_pagamento_idx ON reservas (mp_payment_id);

-- Toda notificação recebida do Mercado Pago, para não processar a mesma
-- duas vezes (o webhook reenvia até receber 200).
CREATE TABLE IF NOT EXISTS webhooks_recebidos (
  id            bigserial PRIMARY KEY,
  payment_id    text NOT NULL UNIQUE,
  payload       jsonb NOT NULL,
  recebido_em   timestamptz NOT NULL DEFAULT now()
);
