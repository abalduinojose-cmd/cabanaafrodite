import "server-only";

export type Periodo = { readonly inicio: string; readonly fim: string };

export type NovaReserva = {
  readonly entrada: string;
  readonly saida: string;
  readonly nome: string;
  readonly email: string;
  readonly telefone: string;
  readonly hospedes: number;
  readonly noites: number;
  readonly valorTotal: number;
  readonly valorCobrado: number;
};

export type Reserva = {
  readonly id: string;
  readonly entrada: string;
  readonly saida: string;
  readonly nome: string;
  readonly noites: number;
  readonly valorTotal: number;
  readonly valorCobrado: number;
  readonly status: "pendente" | "confirmada" | "cancelada";
};

/** Erro esperado: as datas foram ocupadas antes desta reserva chegar. */
export class DatasIndisponiveis extends Error {
  constructor() {
    super("As datas escolhidas acabaram de ser ocupadas.");
    this.name = "DatasIndisponiveis";
  }
}

/**
 * Contrato que as duas implementações cumprem: Postgres em produção,
 * memória enquanto o banco não existe.
 */
export type Repositorio = {
  readonly criarPendente: (dados: NovaReserva, minutosParaPagar: number) => Promise<Reserva>;
  readonly buscar: (id: string) => Promise<Reserva | null>;
  readonly periodosOcupados: () => Promise<readonly Periodo[]>;
  readonly anotarPreferencia: (id: string, preferenceId: string) => Promise<void>;
  readonly confirmar: (id: string, paymentId: string) => Promise<void>;
  readonly cancelar: (id: string, paymentId: string | null) => Promise<void>;
  /** Falso quando a notificação já tinha sido processada antes. */
  readonly registrarWebhook: (paymentId: string, payload: unknown) => Promise<boolean>;
};
