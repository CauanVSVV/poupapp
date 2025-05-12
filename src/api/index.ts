import axios from "axios";
import { ITransacao, IUsuario } from "../types";

const api = axios.create({
    baseURL: "http://localhost:5000",
})

export const obterUsuario = async (): Promise<IUsuario[]> => {
    const {data} = await api.get<IUsuario[]>("/usuarios")
    return data
}

export const criarUsuario = async (usuario: Omit<IUsuario, "id" | "orcamentoDiario">): Promise<IUsuario> => {
    const usuarioComOrcamentoDiario = {
        ...usuario,
        orcamentoDiario: usuario.renda / 30
    }

    const {data} = await api.post<IUsuario>("/usuarios", usuarioComOrcamentoDiario)
    return data
}

export const atualizarUsuario = async (id: string, dados: Partial<IUsuario>): Promise<IUsuario> => {
const {data} = await api.patch(`/usuarios/${id}`, dados)
    return data
}

export const obterTransacoes = async (): Promise<ITransacao[]> => {
    const {data} = await api.get<ITransacao[]>("/transacoes")
    return data
}

export const criarTransacao = async (transacao: Omit<ITransacao, "id" | "userId">, usuario: Omit<IUsuario, "nome">): Promise<{transacao: ITransacao, novoOrcamentoDiario: number}> => {
    const transacaoComId = { ...transacao, userId: usuario.id }
    const {data} = await api.post<ITransacao>("/transacoes", transacaoComId)

    const transacoes = await obterTransacoes()
    const saldo = calcularSaldo(transacoes)

    const novoOrcamentoDiario = usuario.renda / 30 + saldo
 
    await atualizarUsuario(usuario.id, { 
        orcamentoDiario: novoOrcamentoDiario 
    }).catch((error) => {
        console.log(error)
    })

    return {transacao: data, novoOrcamentoDiario}
}


const calcularSaldo = (transacoes: ITransacao[]): number => {
    return transacoes.reduce((total, transacao) => {
        return transacao.tipo === "receita" 
        ? total + transacao.valor 
        : total - transacao.valor
    }, 0)
}
