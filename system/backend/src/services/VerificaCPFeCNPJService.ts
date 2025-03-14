import axios from 'axios';

interface VerificacaoProps {
    numero: number;
}

interface CnpjResponse {
    fantasia: string;
    [key: string]: any; // Para outras propriedades dinâmicas que você pode não usar diretamente
}

class VerificaCPFeCNPJService {
    async execute({ numero }: VerificacaoProps) {
        if (numero.toString().length === 11) {
            // Utilizar API de CPF
            try {
                const response = await axios.get(`https://scpa-backend.prod.saude.gov.br/public/scpa-usuario/validacao-cpf/${numero}`);
                console.log('CPF válido:', response.data);
                return { status: 200, message: 'CPF Válido' };
            } catch (error: any) {
                console.error('Erro ao validar CPF:', error);
                if (error.response && error.response.status === 404) {
                    throw new Error("not found: CPF não encontrado");
                }
                throw new Error("Erro ao validar CPF: " + error.message);
            }
        } else if (numero.toString().length === 14) {
            // Consumir a API https://receitaws.com.br/v1/cnpj/{cnpj}
            try {
                const response = await axios.get<CnpjResponse>(`https://receitaws.com.br/v1/cnpj/${numero}`);
                console.log(response.data);

                const nomeFantasia = response.data.fantasia;
                if (!nomeFantasia) {
                    throw new Error("not found: CNPJ não encontrado");
                }

                return { status: 200, message: `Nome fantasia: ${nomeFantasia}` };
            } catch (error: any) {
                console.error('Erro ao validar CNPJ:', error);
                if (error.response && error.response.status === 404) {
                    throw new Error("not found: CNPJ não encontrado");
                }
                throw new Error("Erro ao validar CNPJ: " + error.message);
            }
        } else {
            throw new Error("validation: Número inválido");
        }
    }
}

export { VerificaCPFeCNPJService };