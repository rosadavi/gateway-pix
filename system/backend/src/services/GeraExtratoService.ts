import prismaClient from "../prisma";

interface GeraExtratoProps {
    empresa_id_empresa: number;
    }

class GeraExtratoService {
    async execute({ empresa_id_empresa }: GeraExtratoProps) {
        const extrato = await prismaClient.vw_cobranca.findMany({
            where: {
                empresa_id_empresa
            }
        });

        return extrato;
    }
}

export { GeraExtratoService };