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

export const atualizarUsuario = async (id: string, dados: IUsuario): Promise<IUsuario> => {
const {data} = await api.patch(`/usuarios/${id}`, dados)
    return data
}

export const obterTransacoes = async (): Promise<ITransacao[]> => {
    const {data} = await api.get<ITransacao[]>("/transacoes")
    return data
}

export const criarTransacao = async (transacao: Omit<ITransacao, "id">): Promise<ITransacao> => {
    const {data} = await api.post<ITransacao>("/transacoes", transacao)
    return data
}