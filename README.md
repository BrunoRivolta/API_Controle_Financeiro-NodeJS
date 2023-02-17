# API Controle Financeiro

![HTML5](https://img.shields.io/badge/html5-%23323330.svg?style=for-the-badge&logo=html5&logoColor=orange) 
![CSS3](https://img.shields.io/badge/CSS3-%23323330.svg?style=for-the-badge&logo=CSS3&logoColor=%230390fc)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-%23323330.svg?style=for-the-badge&logo=node.js&logoColor=green) 
![jQuery](https://img.shields.io/badge/Jquery-%23323330.svg?style=for-the-badge&logo=jQuery&logoColor=%2361DAFB) 
![Bootstrap](https://img.shields.io/badge/bootstrap-%23323330.svg?style=for-the-badge&logo=bootstrap&logoColor=%23fc0398) 
![Mysql](https://img.shields.io/badge/mysql-%23323330.svg?style=for-the-badge&logo=mysql&logoColor=%2303dbfc) 
![Redis](https://img.shields.io/badge/redis-%23323330.svg?style=for-the-badge&logo=Redis&logoColor=red) 
![AWS](https://img.shields.io/badge/aws-%23323330.svg?style=for-the-badge&logo=AmazonAWS&logoColor=orange) 

***
![Controle Financeiro](https://images2.imgbox.com/53/73/ffwGQYUG_o.png)
***

## Acesse agora

http://3.83.226.180/

***

<div  id='objetivo'></div>

## Objetivo

Esta API Rest tem por objetivo fazer o controle financeiro, por meio do cadastro de Receitas e Despesas pessoais. É possível também gerar um relatório mensal mostrando receitas, despesas e saldo final. Desta forma é possível ver os gastos e ter mais controle sobre eles.

As despesas podem ser cadastradas em 8 categorias: "Alimentação", "Saúde", "Moradia", "Transporte", "Educação", "Lazer", "Imprevistos" e "Outros". Os gastos em cada categoria também são exibidas no relatório mensal.

A API conta com um sistema de autenticação de usuários que usa senhas criptografadas e gera tokens de acesso JWT.

***
  
<div  id='indice'></div>
  
## Índice   
1. [Objetivo](#objetivo)   
2. [Índice](#indice)    
3. [Instalação / Configuração](#install)   
    3.1. [Variável de Ambiente](#variavel)   
    3.2. [Banco de Dados](#sql)   
        -3.2.1. [Configurando API](#bdapi)   
        -3.2.2. [Schemas](#schemas)   
        -3.2.3. [Migrations](#migrations)   
        -3.2.4. [Triggers](#triggers)   
        -3.2.5. [Seeders](#seeders)   
4. [Iniciando API](#start)   
5. [Sistema de Autenticação Usuário](#auth)   
    6.1 [Redis](#redis)   
6. [Sistema de Envio de E-mails](#mail)   
7. [Rotas](#routes)   
    7.1. [Usuários](#routesUser)   
    7.2. [Receitas](#routesReceitas)   
    7.3. [Despesas](#routesDespesas)   
        -7.3.1 [Categorias ID](#categorias)   
    7.4. [Relatórios](#routesRelatorio)   
8. [Documentação Swagger](#reqres)   
9. [Testes](#test)  
10. [Front-end](#front) 
11. [Contato](#contato)   

***


<div  id='install'><div>

## Instalando / Configurando

Para instalar as dependências, entre no terminal, vá até o diretório raiz do projeto e execute o comandos abaixo:

```
npm install
```


<div  id='variavel'>

### Configurando a Variável de Ambiente

Crie o arquivo **.env**, no diretório raiz conforme abaixo.

- Opções de ambiente "NODE_ENV": Opções "development", "test" ou "production"

- Criando "CHAVE_JWT": Esta é a chave de segurança da sua aplicação, usada para gerar tokens de acesso. Como opção, execute o código abaixo pelo terminal no diretório raiz, para gerar uma chave segura:

```
node -e "console.log( require('crypto').randomBytes(256).toString('base64'))"
```

- Configurações de envio de e-mail: são usadas para envio de e-mail de confirmação de cadastro e também para recuperação de conta apaga.

```
NODE_ENV="development"
CHAVE_JWT=""

BASE_URL="localhost:3000"

EMAIL_HOST=""
EMAIL_USUARIO=""
EMAIL_SENHA=""
```

Caso esteja trabalhando no ambiente "development" ou "test", a API não envia e-mail, apenas gera um link simulando um e-mail.

No ambiente "production" é necessário preencher as configurações de e-mail: "HOST", "USUARIO" e "SENHA".

***


<div  id='sql'></div>


### Banco de dados MySQL

![Esquema Banco de dados](https://images2.imgbox.com/e5/b2/dqHTxXHS_o.png)

Para o bom funcionamento da API é necessário que o banco de dados esteja de acordo com as funcionalidades da aplicação. Segue abaixo os passo-a-passo para implantar e configurar o banco de dados.


<div  id='bdapi'></div>

#### - Configurando o banco de dados na API

Acesse o arquivo **api/config/config.json**

Configure o acesso ao banco de dados, em cada ambiente: "host", "username", "password" ...

  
<div  id='schemas'></div>

#### - Schemas

No MySQL, crie o schema conforme abaixo:

```
CREATE SCHEMA `control_financeiro`;
```
  

<div  id='migrations'></div>
  
#### - Migrations

O sequelize migra as tabelas automaticamente para o bando de dados. Pelo terminal, entre na pasta raiz do projeto e execute os comandos abaixo:

```
npx sequelize-cli db:migrate
```


<div  id='triggers'></div>

#### - Triggers

Os triggers são reesposáveis pelos cálculos do relatório mensal com base nos dados das receitas e despesas.


<div  id='seeders'></div>

#### - Seeders

O sequelize preenche algumas colunas com dados, adiciona as triggers e cálculos de colunas geradas. No terminal, entre na pasta raiz do projeto e execute os comandos abaixo:

```
npx sequelize-cli db:seed:all
```
***


<div  id='start'></div>

## Iniciando API

```
npm run start
```
***


<div  id='auth'></div>

## Sistema de Autenticação de usuários


-  **Fazendo login**

Recebemos em resposta o "AccessToken" no HEADERS / Authorization, este token nos da acesso a outras rotas e tem validade de 15 minutos.

Recebemos também o "RefreshToken" no "BODY", este token com validade de 2 dias, o objetivo dele é gerar um novo "AccessToken" quando o mesmo tem seu tempo expirado.

O "RefreshToken" é adicionado ao Redis como token ativo.


-  **Acessando Rotas**

Ao acessar uma rota envie o "AccessToken" recebido no login, em HEADERS / Authorization Bearer.

A aplicação verifica se o "AccessToken" esta como bloqueado no Redis, se não estiver, ele da acesso a rota.


-  **AccessToken Expirado**

Ao expirar o tempo do "AccessToken", o mesmo é enviado para o Redis como token bloqueado.

Devemos renovar o "AccessToken" enviando:

No BODY o "RefreshToken". A aplicação verifica se e token esta ativo no Redis.

E resposta receberemos "AccessToken" e "RefreshToken" novos.

O novo "RefreshToken" é adicionado ao Redis como token ativo, o antigo é eliminado.


-  **Fazendo logout**

Ao fazer logout devemos enviar o "AccessToken" no HEADERS / Authorization Bearer e o "RefreshToken" no BODY.

No redis o "AccessToken" é adicionado a lista de bloqueados, e o "RefreshToken" é eliminado da lista de tokens ativos.

  
<div  id='redis'></div> 

### Redis

O redis é usado para guardar os tokens com os seguintes prefixos:

- allowlist-refresh-token: "RefreshToken" criados no login que estão ativos.

- blocklist-acessToken: "AccessTokens" inutilizados por logout.

***


<div  id='mail'></div>

## Sistema de Envio de E-mails

![Email de confirmação](https://images2.imgbox.com/ab/38/tvEVU4Xs_o.png)

A API envia e-mails de confirmação por meio de "nodemailer" em 2 situações:

-  **Ao criar um novo usuário:** O e-mail contém um endereço com um token, ao acessar o cliente verifica que seu email é valido e consegue fazer login na aplicação.

-  **Ao excluir um usuário:** O e-mail confirma a exclusão e fornece um link para recuperar a conta em até 5 dias, caso o cliente queira recuperar sua conta.

No ambiente de teste ou desenvolvimento os e-mails não são enviados, é feita apenas uma simulação de envio de email, podemos acessa-la atravez do link gerado no terminal.

***


<div id='routes'></div>

## Rotas
  
<div id='routesUser'></div>

### Usuários

| Método | Rotas | Ação |
|---|---|---|
| `POST` | /usuarios/ | Cria Usuário |
| `GET` | /usuarios/verifica_email/:token | Verificação de E-mail |
| `POST` | /usuarios/login | Faz Login |
| `GET` | /usuarios/atualiza_refresh | Atualiza Token Expirado |
| `PUT` | /usuarios/ | Atualiza dados Usuário |
| `GET` | /usuarios/logout | Faz Logout |

  
<div id='routesReceitas'></div>

### Receitas

| Método | Rotas | Ação |
|---|---|---|
| `POST` | /receitas | Cria Receita |
| `GET` | /receitas | Lista Receitas |
| `GET` | /receitas/11/2022 | Busca por mês/ano |
| `GET` | /receitas?busca=salario | Busca por Descrição |
| `PUT` | /receitas/:id | Atualiza dados Receita |
| `DELETE` | /receitas/:id | Apaga Receita |


<div id='routesDespesas'></div>

### Despesas

| Método | Rotas | Ação |
|---|---|---|
| `POST` | /despesas | Cria Despesa |
| `GET` | /despesas | Lista Despesas |
| `GET` | /despesas/11/2022 | Busca por mês/ano | Refresh Token |
| `GET` | /despesas?busca=mercado | Busca por Descrição |
| `PUT` | /despesas/:id | Atualiza dados Despesa 
| `DELETE` | /despesas/:id | Apaga Despesa |


<div  id='categorias'></div>

### Categorias ID

Cada despesa deve ter uma categoria especifica. Segue abaixo a lista das IDs das categorias.

| ID | Categoria | . | ID | Categoria |
|---|---|---|---|---|
| 1 | Alimentação | . | 5 | Educação |
| 2 | Saúde | . | 6 | Lazer|
| 3 | Moradia | . | 7 | Imprevistos |
| 4 | Transporte | . | 8 | Outros |

  
<div  id='routesRelatorio'></div>

### Relatórios

| Método | Rotas | Ação |
|---|---|---|
| `GET` | /relatorio | Lista Relatórios |
| `GET` | /relatorio/05/2023 | Busca por mês/ano |

***


<div  id='reqres'></div>

## Documentação Swagger

![Documentação Swagger](https://images2.imgbox.com/5a/8f/6sDFq6gF_o.gif)

A documentação contém infomações de requisição e resposta de todas as rotas da aplicação. Nela você poderá interagir diretamente com a API em tempo real.

Acesse agora: http://3.83.226.180/api-docs/

***

<div  id='test'></div>

## Testes

### Resultado dos testes
  
![Test Coverage](https://images2.imgbox.com/ba/9a/4vwPNHys_o.png)

Foram realizados testes unitários nas rotas e funções importantes usando o Jest.

Acessando resultado dos testes pelo navegador:

```
/coverage/Icov-report/index.html
```

### Logica de testes

A logica de testes simula um usuário se fazendo login, e em seguida fazendo interações com cada rota.

Foi configurado um servidor para testes na porta 8000 usando os Hooks do Jest, e o Supertest para acessar as rotas.

Segue abaixo o diretório de testes:

```
/api/test/
```


### Executando testes

- Para executar os testes é necessário criar um schema de testes no banco de dados, desta forma o schema padrão não sofrerá nenhuma alteração.

```
CREATE SCHEMA `control_finan_test`;
```

- Fazendo as migrações das tabelas:

```
npx sequelize-cli db:migrate --env test
```

- Para fazer os seeders no bando de dados de teste:

Mude a variável de ambiente, no arquivo .env, alterar para "test" (NODE_ENV="test")

```
npx sequelize-cli db:seed:all
```

Após o termino, desfazer a alteração da variável de ambiente.

- Teste

No terminal, vá até o diretório raiz da API e digite o comando:

```
npm run test
```
  
***

<div  id='front'></div>

## Front-end

O framework Bootstrap para estilizar a aplicação.

A biblioteca Jquery foi usada nesta aplicação principalmente para manupulação com o DOM e para fazer requisições com Ajax.

***

<div  id='contato'></div>

## Redes Sociais /Contato

[![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/brunorivolta/)
[![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?logo=YouTube&logoColor=white)](https://www.youtube.com/channel/UC6XJ3aQvFBU7gqHvebolwJQ) 
[![Blogger](https://img.shields.io/badge/Blogger-%23FF5722.svg?logo=Blogger&logoColor=white)](https://devrivolta.blogspot.com/) 
[![GitHub](https://img.shields.io/badge/GitHub-%23FFFFFF.svg?logo=GitHub&logoColor=black)](https://github.com/BrunoRivolta) 

***