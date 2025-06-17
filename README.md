
# Sistema de Locação de Veículos (Frontend)

Projeto desenvolvido como trabalho acadêmico, consiste no frontend de um sistema para locação de veículos. Implementado em React.js, permite aos usuários visualizar veículos disponíveis, realizar cadastro/login e simular reservas com pagamento.

---

## 📌 Sumário

- [Visão Geral](#visão-geral)  
- [Funcionalidades](#funcionalidades)  
- [Tecnologias](#tecnologias)  
- [Pré-requisitos](#pré-requisitos)  
- [Instalação e Execução](#instalação-e-execução)
- [Como Contribuir](#como-contribuir)

---

## Visão Geral

O frontend se comunica com um backend por meio de chamadas REST (fetch/axios) para:

1. Exibir lista de veículos disponíveis para locação.  
2. Permitir cadastro e login de usuários.  
3. Gerenciar reservas e processar pagamentos simulados (dummy).

A interface foi construída pensando em usabilidade e fluxo típico de locação: consulta → reserva → pagamento.

---

## Funcionalidades

- **Listagem de veículos** com fotos, descrição, preço por dia e filtros (categoria, disponibilidade).  
- **Autenticação de usuários**: cadastro, login, logout.  
- **Reservas simuladas**: seleção de veículo, datas, simulação de pagamento.  
- **Área do usuário**: histórico de reservas, status e detalhes.  

---

## Tecnologias

- **React.js** – biblioteca principal para construção das views.  
- **React Router** – navegação entre páginas do app.  
- **Axios** – para interagir com o backend via chamadas REST.  
- **CSS Modules / Styled Components** *(ajuste conforme implementação real)* – gerenciamento de estilos.

---

## Pré-requisitos

Antes de começar, verifique se você tem instalado:

- **Node.js** (>=14.x)  
- **npm** ou **yarn**  
- Backend da aplicação configurado e em execução em `http://localhost:3001` *(ajuste conforme sua configuração)*

---

## Instalação e Execução

1. Clone este repositório:
   ```bash
   git clone https://github.com/jomatheux/aluguel-carros-frontend.git
   cd aluguel-carros-frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Configure `.env` (caso necessário):
   ```
   REACT_APP_API_URL=http://localhost:3001/api
   ```

4. Inicie a aplicação:
   ```bash
   npm start
   # ou
   yarn start
   ```

5. Abra `http://localhost:3000` no navegador para acessar o frontend.

---

## Como Contribuir

1. Faça um fork deste repositório.  
2. Crie uma branch com sua feature:  
   ```bash
   git checkout -b feature/nome-da-minha-feature
   ```  
3. Implemente sua melhoria.  
4. Abra um pull request descrevendo sua contribuição.  
5. Mantenha-se alinhado ao padrão de código existente.

---

## Contato

Caso tenha dúvidas sobre o projeto, entre em contato pelo perfil do GitHub do autor ou pelo e‑mail utilizado no cadastro.

---
