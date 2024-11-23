import prismaClient from "../prisma";

interface GeraExtratoProps {
    idEmpresa: number;
    }

class GeraExtratoService {
    async execute({ idEmpresa }: GeraExtratoProps) {
        console.log(idEmpresa);
        const extrato = await prismaClient.pagamento.findMany({
            where: {
                pedido: {
                    empresa_idEmpresa : idEmpresa
                }
            },
            select: {
                pag_data_registro: true,
                pag_tipo: true,
                pag_valor: true,
                pag_descricao: true,
                pag_status: true,
                parcela_numero: true,
                cliente_telefone: true,
                pedido: {
                    select: {
                        empresa_idEmpresa: true,
                    }
                }
            }
        });
        

        return extrato;
    }
}

export { GeraExtratoService };