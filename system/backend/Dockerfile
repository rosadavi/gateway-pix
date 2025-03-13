FROM node

# Instalar o curl para baixar o wait-for-it
RUN apt-get update && apt-get install -y curl

# Baixa o wait-for-it
RUN curl -sS https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -o /usr/local/bin/wait-for-it.sh && \
    chmod +x /usr/local/bin/wait-for-it.sh

# Cria e define o diretório de trabalho no contêiner
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia os arquivos da aplicação para o diretório de trabalho
COPY . .

# Expõe a porta que a aplicação vai rodar
EXPOSE 3000

# Define o comando para rodar a aplicação com wait-for-it
CMD ["sh", "-c", "/usr/local/bin/wait-for-it.sh container-mysql:3306 -- npx prisma db push && npx tsx watch src/server.ts"]
