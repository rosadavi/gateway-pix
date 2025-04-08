# Gateway de pagamento via PIX

# Gateway-Back
Back-End do Gatway de Pagamento do BR Fideliza

## Pre-requisitos
1. Nodejs
2. Npm
3. Mysql

## Instalação e Uso
1. Clone o repositório
2. Instale as dependências utilizando o comando `npm ci`
3. Crie um banco Mysql com a query 
```
CREATE DATABASE Gateway 
```
4. Criar o arquivo .env na raiz do projeto seguindo o modelo:
```
DATABASE_URL="mysql://user:password@address:port/Gateway"
JWT_SECRET="chave_secreta_1234"
PORT="3000"

```
5. Execute o comando `npx prisma db push` para aplicar a modelagem salva no prisma ao banco configurado
6. Execute o comando `npx run dev` para iniciar o servidor
7. Acesse o prisma studio com o comando `npx prisma studio` para visualizar o banco

## Lista de Comandos

```bash
npm ci // Instala as dependências
npm run dev // Inicia o servidor
npx prisma db pull // Importa a modelagem do banco para a conexao do prisma
npx prisma db push // Exporta a modelagem do prisma para o banco
npx prisma generate // Atualiza a modelagem interna do prisma com a externa
npx prisma studio // Abre o prisma studio para visualizar o banco
```
---
# Rodando em Docker

## Pre-requisitos
1. O arquivo **.env** deve estar preenchido com a URL do banco rodando no servidor.
2. Docker

## Instalação e Uso
1. No diretorio ``` gateway-pix/system/backend ``` insira do .env a seguir:
   
```
DATABASE_URL="mysql://wwtsco_app_gateway:OwHq7lKctityI9N@50.6.192.221:3306/wwtsco_fidelidade"
JWT_SECRET = "senha_forte_12345"
PORT = 3000
GTW_ID_PESSOA_REGISTROU_COB = -3 #Pessoa padrão gateway
GTW_STATUS_PEDIDO_CREATE = "A" #Aberto
GTW_NOME_CLIENTE_DEFAULT = "CLIENTE NÃO CADASTRADO GTW" #Nome padrão para cliente não cadastrado

```

2. Build a imagem
```bash
docker build -t imagem-gateway .
```

3. Rode o sistema
```bash
docker run -p 3000:3000 --name container-gateway imagem-gateway
```

4. Bonus - para aplicacao e remover
```bash
docker stop container-gateway

docker rm container-gateway
```
