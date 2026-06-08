# Estágio 1: Compilação
FROM node:20-alpine AS build

WORKDIR /usr/src/app

# Copia os arquivos de configuração de pacotes
COPY package*.json ./

# Instala as dependências do frontend
RUN npm install

# Copia todo o código do frontend e compila
COPY . .
RUN npm run build

# Estágio 2: Servidor Web de Produção (Nginx)
FROM nginx:alpine

# Copia os arquivos compilados do estágio anterior para a pasta do Nginx
# Nota: Se o seu framework gera a pasta "build" em vez de "dist", mude abaixo para ./build
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Expõe a porta padrão do servidor web
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]