# API Controle Financeiro

  

<img  src="https://images2.imgbox.com/b1/4d/m2LdYYfs_o.png"  width="300px"/>

  

*******

  

<div  id='objetivo'/>

  

## Objetivo

  

Esta API Rest tem por objetivo fazer o controle financeiro, por meio do cadastro de Receitas e Despesas pessoais. É possível também gerar um relatório mensal mostrando receitas, despesas e saldo final. Desta forma é possível ver os gastos e ter mais controle sobre eles.

  

As despesas podem ser cadastradas em 8 categorias: "Alimentação", "Saúde", "Moradia", "Transporte", "Educação", "Lazer", "Imprevistos" e "Outros". Os gastos em cada categoria também são exibidas no relatório mensal.

  

A API tem também um sistema de autenticação de usuários que usa senhas criptografadas e gera tokens de acesso JWT.

  

*******

<div  id='objetivo'/>

  

Índice   
1. [Objetivo](#objetivo)   
2. [Índice](#indice)   
3. [Principais tecnologias](#tecnologias)   
4. [Instalação / Configuração](#install)   
    4.1. [Variável de Ambiente](#variavel)   
    4.2. [Banco de Dados](#sql)   
        -4.2.1. [Configurando API](#bdapi)   
        -4.2.2. [Schemas](#schemas)   
        -4.2.3. [Migrations](#migrations)   
        -4.2.4. [Triggers](#triggers)   
        -4.2.5. [Seeders](#seeders)   
5. [Iniciando API](#start)   
6. [Sistema de Autenticação Usuário](#auth)   
    6.1 [Redis](#redis)   
7. [Sistema de Envio de E-mails](#mail)   
8. [Rotas](#routes)   
    8.1. [Usuários](#routesUser)   
    8.2. [Receitas](#routesReceitas)   
    8.3. [Despesas](#routesDespesas)   
        -8.3.1 [Categorias ID](#categorias)   
    8.4. [Relatórios](#routesRelatorio)   
9. [Requisições / Respostas](#reqres)   
    9.1. [Usuários](#rrusuarios)   
    9.2. [Receitas](#rrreceitas)   
    9.3. [Despesas](#rrdespesas)   
    9.4. [Relatórios](#rrrelatorios)   
10. [Testes](#test)   
11. [Contato](#contato)   

*******

  

<div  id='tecnologias'/>

  

## Principais Tecnologias

- Node.js   
- Express   
- Sequelize   
- Jest   
- MySQL  
- Redis   
- Nodemailer   

*******

  

<div  id='install'/>

  

## Instalando / Configurando

  

Para instalar as dependências, entre no terminal, vá até o diretório raiz do projeto e execute o comandos abaixo:

  

```
npm install
```

  
  

<div  id='variavel'/>

  

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

  

*******

  

<div  id='sql'/>

  

### Banco de dados MySQL

  

<img  src="https://images2.imgbox.com/e5/b2/dqHTxXHS_o.png"  alt="Esquema Banco de dados"/></a>

  

Para o bom funcionamento da API é necessário que o banco de dados esteja de acordo com as funcionalidades da aplicação. Segue abaixo os passo-a-passo para implantar e configurar o banco de dados.

  

<div  id='bdapi'/>

  

#### - Configurando o banco de dados na API

  

Acesse o arquivo **api/config/config.json**

Configure o acesso ao banco de dados, em cada ambiente: "host", "username", "password" ...

  

<div  id='schemas'/>

  

#### - Schemas

  

No MySQL, crie o schema conforme abaixo:

  

```
CREATE SCHEMA `control_financeiro`;
```

  

<div  id='migrations'/>

  

#### - Migrations

  

O sequelize migra as tabelas automaticamente para o bando de dados. Pelo terminal, entre na pasta raiz do projeto e execute os comandos abaixo:

  

```
npx sequelize-cli db:migrate
```

  

<div  id='triggers'/>

  

#### - Triggers

  

Os triggers são reesposáveis pelos cálculos do relatório mensal com base nos dados das receitas e despesas.

  

<div  id='seeders'/>

  

#### - Seeders

  

O sequelize preenche algumas colunas com dados, adiciona as triggers e cálculos de colunas geradas. No terminal, entre na pasta raiz do projeto e execute os comandos abaixo:

  

```
npx sequelize-cli db:seed:all
```

  

*******

  

<div  id='start'/>

  

## Iniciando API

  

```
npm run start
```

  

*******

<div  id='auth'/>

  

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

  

<div  id='redis'/>

  

### Redis

O redis é usado para guardar os tokens com os seguintes prefixos:

  

- allowlist-refresh-token: "RefreshToken" criados no login que estão ativos.

- blocklist-acessToken: "AccessTokens" inutilizados por logout.

  

<div  id='mail'/>

  

*******

## Sistema de Envio de E-mails

  

<img  src="https://images2.imgbox.com/ab/38/tvEVU4Xs_o.png"  alt="Email de confirmação de e-mail"/></a>

  

A API envia e-mails de confirmação por meio de "nodemailer" em 2 situações:

-  **Ao criar um novo usuário:** O e-mail contém um endereço com um token, ao acessar o cliente verifica que seu email é valido e consegue fazer login na aplicação.

-  **Ao excluir um usuário:** O e-mail confirma a exclusão e fornece um link para recuperar a conta em até 5 dias, caso o cliente queira recuperar sua conta.

  

No ambiente de teste ou desenvolvimento os e-mails não são enviados, é feita apenas uma simulação de envio de email, podemos acessa-la atravez do link gerado no terminal.

  

*******

  

<div  id='routes'/>

  

## Rotas

  

<div  id='routesUser'/>

  

#### Usuários

  

| Método | Rotas | Ação |
|---|---|---|
| `POST` | /usuarios/ | Cria Usuário |
| `GET` | /usuarios/verifica_email/:token | Verificação de E-mail |
| `POST` | /usuarios/login | Faz Login |
| `GET` | /usuarios/atualiza_refresh | Atualiza Token Expirado |
| `PUT` | /usuarios/ | Atualiza dados Usuário |
| `DELETE` | /usuarios/ | Apaga Usuário |
| `GET` | /usuarios/restaura_usuario/:token | Restaura Usuário |
| `GET` | /usuarios/logout | Faz Logout |

  
  

<div  id='routesReceitas'/>

  

#### Receitas

| Método | Rotas | Ação |
|---|---|---|
| `POST` | /receitas | Cria Receita |
| `GET` | /receitas | Lista Receitas |
| `GET` | /receitas/11/2022 | Busca por mês/ano |
| `GET` | /receitas?busca=salario | Busca por Descrição |
| `PUT` | /receitas/:id | Atualiza dados Receita |
| `DELETE` | /receitas/:id | Apaga Receita |
| `POST` | /receitas/:id/restaura | Restaura Receita |

  

<div  id='routesDespesas'/>

  

#### Despesas

| Método | Rotas | Ação |
|---|---|---|
| `POST` | /despesas | Cria Despesa |
| `GET` | /despesas | Lista Despesas |
| `GET` | /despesas/11/2022 | Busca por mês/ano | Refresh Token |
| `GET` | /despesas?busca=mercado | Busca por Descrição |
| `PUT` | /despesas/:id | Atualiza dados Despesa 
| `DELETE` | /despesas/:id | Apaga Despesa |
| `POST` | /despesas/:id/restaura | Restaura Despesa |

  

<div  id='categorias'/>

  

##### Categorias ID

  

Cada despesa deve ter uma categoria especifica. Segue abaixo a lista das IDs das categorias.

  

| ID | Categoria | . | ID | Categoria |
|---|---|---|---|---|
| 1 | Alimentação | . | 5 | Educação |
| 2 | Saúde | . | 6 | Lazer|
| 3 | Moradia | . | 7 | Imprevistos |
| 4 | Transporte | . | 8 | Outros |

  

<div  id='routesRelatorio'/>

  

#### Relatórios

| Método | Rotas | Ação |
|---|---|---|
| `GET` | /relatorio | Lista Relatórios |
| `GET` | /relatorio/11/2022 | Busca por mês/ano |

  

<div  id='testes'/>

  

*******

  

<div  id='reqres'/>

  

## Requisições / Respostas

  

Alguns exemplos de como fazer as requisições em cada rota, e o que receberemos em resposta, formato JSON.

  

<div  id='rrusuarios'/>

  

### Usuários

  

| Método | Rota | Ação |
|---|---|---|
| `POST` | /usuarios/ | Cria Usuário |

  

**Requisição**

  

- Body:

```
{
    "nome": "userTest",
    "email": "usuario@deteste.com",
    "senha": "123456"
}
```

É enviado um e-mail para o endereço cadastrado, com um link de verificação de e-mail.

  

**Resposta**

  

- Status: `201` Created

  

*****

  

| Método | Rota | Ação |
|---|---|---|
| `GET` | /usuarios/verifica_email/:token | Verificação de E-mail |

  

**Requisição**

  

Ao criar um novo usuário a aplicação envia um e-mail para o endereço cadastrado.

O e-mail contém um link de verificação. Exemplo:

  

```
localhost:3000/usuarios/verifica_email/eyJhbGciOiJIkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNjk4NDAxNDZ9.059sDuDqtsfSf4uvdM8EhfyWG0
```

  

**Resposta**

  

- Status: `200` OK

  

- Body:

```
{
    email: verificado
}
```

  

*****

  

| Método | Rota | Ação |
|---|---|---|
| `POST` | /usuarios/login | Faz Login |

  

**Requisição**

  

- Body:

```
{
    "email": "usuario@deteste.com",
    "senha": "123456"
}
```

  

**Resposta**

  

- Status: `200` OK

  

- Headers: ("AccessToken")

```
Authorization Bearer - eyJhbGcCkpXVCJ9.eyJpZCI6Nk4MTQ1Njh9.tXqgmFT1BcKvYXI10
```

  

- Body: ("RefreshToken")

```
{
    "refreshToken": "19686b717444ff1007bb7fd1860869c9av8f3F96cc80a4eec2"
}
```

  

*****

  

| Método | Rota | Ação |
|---|---|---|
| `GET` | /usuarios/atualiza_refresh | Atualiza Token Expirado |

  

**Requisição**

  

- Body: ("RefreshToken" recebido no login ou atualizado)

```
{
    "refreshToken": "12239e410d5c3f3778f93aa80cd36f20fed44621c2f7c49331"
}
```

  

**Resposta**

  

- Status: `200` OK

  

- Headers: ("AccessToken" novo)

```
Authorization Bearer - eyJhbGcCkpXVCJ9.eyJpZCI6Nk4MTQ1Njh9.tXqgmFT1BcKvYXI10
```

  

- Body: ("RefreshToken" novo)

```
{
    "refreshToken": "19686b717444ff1007bb7fd1860869c9av8f3F96cc80a4eec2"
}
```

  

*****

  

| Método | Rota | Ação |
|---|---|---|
| `PUT` | /usuarios/ | Atualiza dados Usuário |

  

**Requisição**

  

- Body: (Alterando Nome)

```
{
    "nome": "João",
}
```

  

- Headers: ("AccessToken")

```
Authorization Bearer - eyJhbGcCkpXVCJ9.eyJpZCI6Nk4MTQ1Njh9.tXqgmFT1BcKvYXI10
```

  
  

**Resposta**

  

- Status: `200` OK

  

- Body:

  

```
{
    message: 'Atualizado com sucesso!'
}
```

  

*****

  

| Método | Rota | Ação |
|---|---|---|
| `DELETE` | /usuarios/ | Apaga Usuário |

  

**Requisição**

  

- Headers: ("AccessToken")

  

```
Authorization Bearer - eyJhbGcCkpXVCJ9.eyJpZCI6Nk4MTQ1Njh9.tXqgmFT1BcKvYXI10
```

  

**Resposta**

  

- Status: `200` OK

  

- Body:

```
{
    message: 'Usuario apagado'
}
```

  

****

  

| Método | Rota | Ação |
|---|---|---|
| `GET` | /usuarios/restaura_usuario/:token | Restaura Usuário |

  

**Requisição**

  

Ao apagar um usuário a aplicação envia um e-mail para o endereço cadastrado. Este e-mail confirmação da exclusão da conta e um link de recuperação caso o cliente deseje recuperar sua conta. A conta pode ser recuperada em até 5 dias. Exemplo do link de recuperação:

  

```
localhost:3000/usuarios/restaura_usuario/eyJhbGcIkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNjTUxMzl9.exEZtca9deeSsemRiohPfk
```

  

**Resposta**

  

- Status: `200` OK

  

- Body:

```
{
    "message": "Usuario restaurado(a) com sucesso!"
}
```

  

****

  

| Método | Rota | Ação |
|---|---|---|
| `GET` | /usuarios/logout | Faz Logout |

  

**Requisição**

  

- Body: ("RefreshToken")

```
{
    "refreshToken": "19686b717444ff1007bb7fd1860869c9av8f3F96cc80a4eec2"
}
```

  

- Headers: ("AccessToken")

```
Authorization Bearer - eyJhbGcCkpXVCJ9.eyJpZCI6Nk4MTQ1Njh9.tXqgmFT1BcKvYXI10
```

  

**Resposta**

  

- Status: `204` NO CONTENT

  

****

  

<div  id='rrreceitas'/>

  

### Receitas

  

| Método | Rota | Ação |
|---|---|---|
| `POST` | /receitas | Adiciona Receita |

  

**Requisição**

  

- Body:

```
{
    "descricao": "Salario",
    "valor": 1000,
    "data": "2022-12-01"
}
```

  

- Headers: ("AccessToken")

  

```
Authorization Bearer - eyJhbGcCkpXVCJ9.eyJpZCI6Nk4MTQ1Njh9.tXqgmFT1BcKvYXI10
```

  

**Resposta**

  

- Status: `200` OK

  

- Body:

```
{
    "message": "Receita Criada"
}
```

  

****

  

| Metodo | Rota | Ação |
|---|---|---|
| `GET` | /receitas | Lista Receitas |

  

**Requisição**

  

- Headers: ("AccessToken")

  

```
Authorization Bearer - eyJhbGcCkpXVCJ9.eyJpZCI6Nk4MTQ1Njh9.tXqgmFT1BcKvYXI10
```

  

**Resposta**

  

- Status: `200` OK

  

- Body:

```
[
    {
        "id": 5,
        "descricao": "Vendas",
        "valor": 90,
        "data": "2022-11-29T00:00:00.000Z",
        "createdAt": "2022-11-29T13:58:57.000Z",
        "updatedAt": "2022-11-29T13:58:57.000Z",
        "deletedAt": null,
        "usuario_id": 1
    }, {
        "id": 6,
        "descricao": "Salario",
        "valor": 1000,
        "data": "2022-12-28T00:00:00.000Z",
        "createdAt": "2022-12-29T13:59:28.000Z",
        "updatedAt": "2022-12-29T13:59:28.000Z",
        "usuario_id": 1
    }
]
```

  

****

  

| Método | Rota | Ação |
|---|---|---|
| `GET` | /receitas/11/2022 | Busca por mês/ano |

  

**Requisição**

  

- Headers: ("AccessToken")

  

```
Authorization Bearer - eyJhbGcCkpXVCJ9.eyJpZCI6Nk4MTQ1Njh9.tXqgmFT1BcKvYXI10
```

  

**Resposta**

  

- Status: `200` OK

  

- Body:

```
[
    {
        "id": 5,
        "descricao": "Vendas",
        "valor": 90,
        "data": "2022-11-29T00:00:00.000Z",
        "createdAt": "2022-11-29T13:58:57.000Z",
        "updatedAt": "2022-11-29T13:58:57.000Z",
        "deletedAt": null,
        "usuario_id": 1
    }
]
```

  

****

  

| Método | Rota | Ação |
|---|---|---|
| `GET` | /receitas?busca=salario | Busca por Descrição |

  

**Requisição**

  

- Headers: ("AccessToken")

  

```
Authorization Bearer - eyJhbGcCkpXVCJ9.eyJpZCI6Nk4MTQ1Njh9.tXqgmFT1BcKvYXI10
```

  

**Resposta**

  

- Status: `200` OK

  

- Body:

```
[
    {
        "id": 6,
        "descricao": "Salario",
        "valor": 1000,
        "data": "2022-12-28T00:00:00.000Z",
        "createdAt": "2022-11-29T13:59:28.000Z",
        "updatedAt": "2022-11-29T13:59:28.000Z",
        "usuario_id": 1
    }
]
```

  

****

  

| Método | Rota | Ação |
|---|---|---|
| `PUT` | /receitas/:id | Atualiza dados Receita |

  

**Requisição**

  

- Body: (Atualizando Valor)

```
{
    "valor": 500,
}
```

  

- Headers: ("AccessToken")

```
Authorization Bearer - eyJhbGcCkpXVCJ9.eyJpZCI6Nk4MTQ1Njh9.tXqgmFT1BcKvYXI10
```

  

**Resposta**

  

- Status: `200` OK

  

- Body:

```
{
    message: 'Receita atualizada'
}
```

  

****

  

| Método | Rota | Ação |
|---|---|---|
| `DELETE` | /receitas/:id | Apaga Receita |

  

**Requisição**

  

- Headers: ("AccessToken")

  

```
Authorization Bearer - eyJhbGcCkpXVCJ9.eyJpZCI6Nk4MTQ1Njh9.tXqgmFT1BcKvYXI10
```

  

**Resposta**

  

- Status: `200` OK

  

- Body: ("RefreshToken")

```
{
    message: "Receita deletada"
}
```

  

****

  

| Método | Rota | Ação |
|---|---|---|
| `POST` | /receitas/:id/restaura | Restaura Receita |

  

**Requisição**

  

- Headers: ("AccessToken")

  

```
Authorization Bearer - eyJhbGcCkpXVCJ9.eyJpZCI6Nk4MTQ1Njh9.tXqgmFT1BcKvYXI10
```

  

**Resposta**

  

- Status: `200` OK

  

- Body:

```
{
    message: "A receita foi restaurada com sucesso!"
}
```

  

****

  

<div  id='rrdespesas'/>

  

### Despesas

| Método | Rotas | Ação |
|---|---|---|
| `POST` | /despesas | Cria Despesa |

  

**Requisição**

  

- Body:

```
{
    "descricao": "Aluguel",
    "valor": 700,
    "data": "2022-11-10",
    "categoria_id": 3
}
```

  

- Headers: ("AccessToken")

  

```
Authorization Bearer - eyJhbGcCkpXVCJ9.eyJpZCI6Nk4MTQ1Njh9.tXqgmFT1BcKvYXI10
```

  

**Resposta**

  

- Status: `200` OK

  

- Body:

```
{
    "message": "Despesa Criada"
}
```

  

****

  

| Método | Rotas | Ação |
|---|---|---|
| `GET` | /despesas | Lista Despesas |

  

**Requisição**

  

- Headers: ("AccessToken")

  

```
Authorization Bearer - eyJhbGcCkpXVCJ9.eyJpZCI6Nk4MTQ1Njh9.tXqgmFT1BcKvYXI10
```

  

**Resposta**

  

- Status: `200` OK

  

- Body:

```
[
    {
        "id": 10,
        "descricao": "Aluguel",
        "valor": 700,
        "data": "2022-11-10T00:00:00.000Z",
        "createdAt": "2022-11-29T14:00:30.000Z",
        "updatedAt": "2022-11-29T14:00:30.000Z",
        "categoria_id": 3,
        "usuario_id": 1
        }, {
        "id": 11,
        "descricao": "Mercado",
        "valor": 152,
        "data": "2022-12-11T00:00:00.000Z",
        "createdAt": "2022-12-29T14:00:30.000Z",
        "updatedAt": "2022-12-29T14:00:30.000Z",
        "categoria_id": 1,
        "usuario_id": 1
    }
]
```

  

****

  

| Método | Rotas | Ação |
|---|---|---|
| `GET` | /despesas/12/2022 | Busca por mês/ano | Refresh Token |

  

**Requisição**

  

- Headers: ("AccessToken")

  

```
Authorization Bearer - eyJhbGcCkpXVCJ9.eyJpZCI6Nk4MTQ1Njh9.tXqgmFT1BcKvYXI10
```

  

**Resposta**

  

- Status: `200` OK

  

- Body:

```
[
    {
        "id": 11,
        "descricao": "Mercado",
        "valor": 152,
        "data": "2022-12-11T00:00:00.000Z",
        "createdAt": "2022-12-29T14:00:30.000Z",
        "updatedAt": "2022-12-29T14:00:30.000Z",
        "deletedAt": null,
        "categoria_id": 1,
        "usuario_id": 1
    }
]
```

  

****

  

| Método | Rotas | Ação |
|---|---|---|
| `GET` | /despesas?busca=aluguel | Busca por Descrição |

  

**Requisição**

  

- Headers: ("AccessToken")

  

```
Authorization Bearer - eyJhbGcCkpXVCJ9.eyJpZCI6Nk4MTQ1Njh9.tXqgmFT1BcKvYXI10
```

  

**Resposta**

  

- Status: `200` OK

  

- Body:

```
[
    {
        "id": 10,
        "descricao": "Aluguel",
        "valor": 700,
        "data": "2022-11-10T00:00:00.000Z",
        "createdAt": "2022-11-29T14:00:30.000Z",
        "updatedAt": "2022-11-29T14:00:30.000Z",
        "categoria_id": 3,
        "usuario_id": 1
    }
]
```

  

****

  

| Método | Rotas | Ação |
|---|---|---|
| `PUT` | /despesas/:id | Atualiza dados Despesa |

  

**Requisição**

  

- Body: (Atualizando Valor)

```
{
    "valor": 800,
}
```

  

- Headers: ("AccessToken")

```
Authorization Bearer - eyJhbGcCkpXVCJ9.eyJpZCI6Nk4MTQ1Njh9.tXqgmFT1BcKvYXI10
```

  

**Resposta**

  

- Status: `200` OK

  

- Body:

```
{
    message: 'Despesa atualizada'
}
```

  

****

  

| Método | Rotas | Ação |
|---|---|---|
| `DELETE` | /despesas/:id | Apaga Despesa |

  

**Requisição**

  

- Headers: ("AccessToken")

  

```
Authorization Bearer - eyJhbGcCkpXVCJ9.eyJpZCI6Nk4MTQ1Njh9.tXqgmFT1BcKvYXI10
```

  

**Resposta**

  

- Status: `200` OK

  

- Body:

```
{
    message: "Despesa apagada"
}
```

  

****

  

| Método | Rotas | Ação |
|---|---|---|
| `POST` | /despesas/:id/restaura | Restaura Despesa |

  

**Requisição**

  

- Headers: ("AccessToken")

  

```
Authorization Bearer - eyJhbGcCkpXVCJ9.eyJpZCI6Nk4MTQ1Njh9.tXqgmFT1BcKvYXI10
```

  

**Resposta**

  

- Status: `200` OK

  

- Body:

```
{
    message: "A despesa foi restaurada com sucesso!"
}
```

  

****

  

<div  id='rrrelatorios'/>

  

### Relatórios

  

| Método | Rotas | Ação |
|---|---|---|
| `GET` | /relatorio | Lista Relatórios |

  

**Requisição**

  

- Headers: ("AccessToken")

  

```
Authorization Bearer - eyJhbGcCkpXVCJ9.eyJpZCI6Nk4MTQ1Njh9.tXqgmFT1BcKvYXI10
```

  

**Resposta**

  

- Status: `200` OK

  

- Body:

```
[
    {
        "id": 4,
        "mes": 11,
        "ano": 2022,
        "receitas": 1090,
        "despesas": 45,
        "saldo": 1045,
        "alimentacao": 45,
        "saude": 0,
        "moradia": 0,
        "transporte": 0,
        "educacao": 0,
        "lazer": 0,
        "imprevistos": 0,
        "outros": 0,
        "createdAt": "2022-11-29T13:58:57.000Z",
        "updatedAt": "2022-11-29T13:58:57.000Z",
        "usuario_id": 1
    }, {
        "id": 5,
        "mes": 12,
        "ano": 2022,
        "receitas": 1090,
        "despesas": 45,
        "saldo": 1045,
        "alimentacao": 45,
        "saude": 0,
        "moradia": 0,
        "transporte": 0,
        "educacao": 0,
        "lazer": 0,
        "imprevistos": 0,
        "outros": 0,
        "createdAt": "2022-12-29T13:58:57.000Z",
        "updatedAt": "2022-12-29T13:58:57.000Z",
        "usuario_id": 1
    }
]
```

  

****

  

| Método | Rotas | Ação |
|---|---|---|
| `GET` | /relatorio/11/2022 | Busca por mês/ano |

  

**Requisição**

  

- Headers: ("AccessToken")

  

```
Authorization Bearer - eyJhbGcCkpXVCJ9.eyJpZCI6Nk4MTQ1Njh9.tXqgmFT1BcKvYXI10
```

  

**Resposta**

  

- Status: `200` OK

  

- Body:

```
{
    "id": 4,
    "mes": 11,
    "ano": 2022,
    "receitas": 1090,
    "despesas": 45,
    "saldo": 1045,
    "alimentacao": 45,
    "saude": 0,
    "moradia": 0,
    "transporte": 0,
    "educacao": 0,
    "lazer": 0,
    "imprevistos": 0,
    "outros": 0,
    "createdAt": "2022-11-29T13:58:57.000Z",
    "updatedAt": "2022-11-29T13:58:57.000Z",
    "deletedAt": null,
    "usuario_id": 1
}
```

  

****

  

<div  id='test'/>

  

## Testes

  

#### Resultado dos testes

  

<img  src="https://images2.imgbox.com/ba/9a/4vwPNHys_o.png"  alt="Test Coverage"/></a>

  

Foram realizados testes unitários nas rotas e funções importantes usando o Jest.

Acessando resultado dos testes pelo navegador:

  

```
/coverage/Icov-report/index.html
```

  

#### Logica de testes

  

A logica de testes simula um usuário se fazendo login, e em seguida fazendo interações com cada rota.

Foi configurado um servidor para testes na porta 8000 usando os Hooks do Jest, e o Supertest para acessar as rotas.

Segue abaixo o diretório de testes:

  

```
/api/test/
```

  

#### Executando testes

  

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

  
*******

  

<div  id='contato'/>

  

## Contato

  

<a  href="mailto:brrivolta@gmail.com"><img  src="https://img.icons8.com/plasticine/100/null/apple-mail.png"></a><a  href="https://github.com/BrunoRivolta"><img  src="https://img.icons8.com/plasticine/100/null/github-squared.png"></a><a  href="https://www.linkedin.com/in/brunorivolta/"><img  src="https://img.icons8.com/plasticine/100/null/linkedin.png"></a><a  href="https://www.youtube.com/channel/UC6XJ3aQvFBU7gqHvebolwJQ"><img  src="https://img.icons8.com/plasticine/100/null/youtube-play--v1.png"></a><a  href="https://devrivolta.blogspot.com/"><img  src="https://img.icons8.com/color/48/null/blogger.png"  width='90'></a>

  

*******