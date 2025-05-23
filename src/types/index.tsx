export interface IUsuario {
    id: string;
    nome: string;
    renda: number;
    orcamentoDiario: number;
}

export interface ITransacao {
    id: string;
    userId: string;
    nome: string;
    valor: number;
    tipo: "receita" | "despesa";
    categoria: string;
    data: string;
}
