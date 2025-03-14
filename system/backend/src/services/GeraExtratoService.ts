import prismaClient from "../prisma";

interface GeraExtratoProps {
    idEmpresa: number;
}

class GeraExtratoService {
    async execute({ idEmpresa }: GeraExtratoProps) {
        try {
            console.log(idEmpresa);
            const extrato = await prismaClient.pagamento.findMany({
                where: {
                    pedido: {
                        empresa_idEmpresa: idEmpresa
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

            if (extrato.length === 0) {
                throw new Error("not found: Nenhum pedido encontrado para a empresa");
            }

            return { status: 200, data: extrato };
        } catch (error: any) {
            console.error("Erro ao gerar extrato: ", error);
            if (error.message.includes("not found")) {
                throw new Error("not found: " + error.message);
            }
            throw new Error("Erro ao gerar extrato: " + error.message);
        }
    }
}

export { GeraExtratoProps, GeraExtratoService }