import prismaClient from "../prisma";

interface GeraExtratoProps {
    empresa_idEmpresa: number;
    }

class GeraExtratoService {
    async execute({ empresa_idEmpresa }: GeraExtratoProps) {
        const extrato = await prismaClient.pagamento.findMany({
            where: {
                pedido: {
                    empresa_idEmpresa: empresa_idEmpresa
                }
            },
            select: {
                pag_data_registro: true,
                pag_tipo: true,
                pag_valor: true,
                pag_descricao: true,
                pag_status: true,
                parcela_numero: true,
                cliente_telefone:true,
            } 
        });

        return extrato;
    }
}

export { GeraExtratoService };