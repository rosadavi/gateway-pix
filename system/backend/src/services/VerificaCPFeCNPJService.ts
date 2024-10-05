import axios from 'axios';

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
            



        }else if(numero.toString().length === 14){
            //consumir a api https://receitaws.com.br/v1/cnpj/{cnpj}

            try {
                const response = await axios.get<CnpjResponse>(`https://receitaws.com.br/v1/cnpj/${numero}`);
                console.log('CNPJ válido:', response.data);
              
                // Agora o TypeScript sabe que response.data tem o tipo CnpjResponse
                const nomeFantasia = response.data.fantasia;
              
                return `Nome fantasia: ${nomeFantasia}`;
              } catch (error) {
                console.error('Erro ao validar CNPJ:', error);
              }

    }
}
}

export {VerificaCPFeCNPJService};