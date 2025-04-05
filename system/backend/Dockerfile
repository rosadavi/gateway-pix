FROM node

# Instalar o curl para baixar o wait-for-it
RUN apt-get update && apt-get install -y curl

# Cria e define o diretório de trabalho no contêiner
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm ci

# Copia os arquivos da aplicação para o diretório de trabalho
COPY . .

# Reinstala as dependências pra resolver conflitos de sistema operacional
RUN npm ci

# Expõe a porta que a aplicação vai rodar
EXPOSE 3000

# Define o comando para rodar a aplicação com wait-for-it
CMD ["sh", "-c", "npx tsx watch src/server.ts"]
