import prismaClient from "../prisma";

interface GeraPagamentoUnicoProps {
    id: string;
    valor: number;
    data: Date;
    descricao: string;
}