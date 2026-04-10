# AGENTS.md

Este projeto e uma SPA em React + Vite para montagem de cestas de presentes do Emporio Sobreiro.

Regras do projeto:
- Usar JavaScript, nao TypeScript
- Manter compatibilidade com Vite
- Nao criar estrutura de Next.js ou CRA
- Usar React Router para navegacao
- Implementar uma etapa por vez
- Nao fazer tudo de uma vez
- Prioridade atual: MVP do cliente
- Fluxo principal: cesta -> produtos -> entrega -> revisao -> sucesso

Paginas principais:
- SelectBasketPage
- BuildBasketPage
- DeliveryPage
- ReviewPage
- SuccessPage

Regras de negocio importantes:
- A cesta tem capacidade maxima de itens
- O total = preco da cesta + soma dos produtos
- Os dados devem persistir temporariamente em localStorage
- Nao permitir envio duplicado do pedido
- Primeiro usar mock de dados quando necessario, depois integrar API

Estilo de implementacao:
- Codigo simples e organizado
- Componentes pequenos
- Explicar rapidamente o que foi alterado ao final
