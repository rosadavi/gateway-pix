import axios from 'axios';
import { response } from 'express';

interface VerificacaoProps {
    numero: number;
}
interface CnpjResponse {
    fantasia: string;
    [key: string]: any; // Para outras propriedades dinâmicas que você pode não usar diretamente
  }

class VerificaCPFeCNPJService{
    async execute ({numero} : VerificacaoProps){
        if(numero.toString().length === 11){
            //utilizar api de cpf abaixo
            
            try {
                const response = await axios.get(`https://scpa-backend.prod.saude.gov.br/public/scpa-usuario/validacao-cpf/${numero}`);
                console.log('CPF válido:', response.data);
              
              
                return {status: 200, message: 'CPF Válido'};
              } catch (error) {
                console.error('Erro ao validar CPF:', error);
                return { status: 400, message: 'CPF inválido' }             
               }
              
        } else if (numero.toString().length === 14) {
            // Consumir a API https://receitaws.com.br/v1/cnpj/{cnpj}
            try {
                const response = await axios.get<CnpjResponse>(`https://receitaws.com.br/v1/cnpj/${numero}`);
                console.log(response.data);

                // Agora o TypeScript sabe que response.data tem o tipo CnpjResponse
                const nomeFantasia = response.data.fantasia;
                if (nomeFantasia == undefined) {
                    return { status: 400, message: 'CNPJ Inválido' };
                }

                return { status: 200, message: `Nome fantasia: ${nomeFantasia}` };
            } catch (error) {
                console.error('Erro ao validar CNPJ:', error);
                return { status: 500, message: 'Erro ao validar CNPJ', error: (error as any).message };
            }
        } else {
            return { status: 400, message: 'Número inválido' };
        }
    }
}


export { VerificaCPFeCNPJService };