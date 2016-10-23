# Instruções de utilização

## Estruturas de pastas
```
Root/ # Raiz
 index.js # Arquivo de entrada
 jsconfig.json # Arquivo do VSCode para sugestões de código
 modules/ # Módulos específicos
 package.json # Arquivo de pacote NPM
 public/ # Diretório do site exemplo
 routes/ # Arquivos de rotas
```

## Iniciando o repositório

O repositório utiliza Node.js, será necessário baixá-lo.

Primeiro ao clonar execute `npm install` e `npm install --only=dev` para instalar todas as dependencias, tanto de desenvolvimento quanto de produção.

- `npm start`: irá executar o watcher de desenvolvimento (apenas para o modo de desenvolvedor)
- `npm run build`: irá compilar os arquivos para o formato ES2015 aceito atualmente pelas versões mais comuns do node e coloca-los todos em uma pasta dist/, esta pasta terá o código de produção

Alguns valores de conexões estão _hardcoded_ nos arquivos, como os dados de conexão para mySQL, outros estão no arquivo package.json como é o caso do _redis_ para a AWS ElastiCache basta alterar os valores antes de executar o `build`
