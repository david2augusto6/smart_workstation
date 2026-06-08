FROM node:20-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala apenas as dependências necessárias de produção
RUN npm install --only=production

# Copia o restante do código fonte do backend
COPY . .

# Comando para iniciar a aplicação
CMD ["node", "server.js"]