# Tiktok Dashboard

<div align="center">
  <img src="Images/dashboard.png" alt="Dashboard do TikTok Analytics" width="300">
</div>

    Sumário:
        1 - Definição do problema.
        2 - Definição do objetivo.
        3 - Coleta de dados.
        4 - Feature Engineering.
        5 - Ferramentas.
        6 - Dashboard.
        7 - Resultados.
        8 - Melhorias.

###  1 - Definição do problema.

Atualmente, sou criador de conteúdo no Tiktok e tive a necessidade de saber quais os melhores modelos de vídeos focar para ter mais sucesso em meu perfil e aumentar o engajamento.

###  2 - Definição dos objetivos.

- Avaliar o desempenho geral do meu perfil.
- Identificar a relação entre a duração dos vídeos e o número de visualizações.
- Determinar se quanto maior o tempo que o usuário passa no vídeo, maior é o engajamento
- Analisar quais tipos de vídeos trazem mais engajamento.

###  3 - Coleta de dados.

No Tiktok Studio, plataforma em que os criadores de conteúdo tem acesso, é possível baixar os dados do perfil do usuário em formato CSV. Porém, os dados são limitados e não possuem muitas informações. Desse modo, tive que coletar os dados de cada vídeo manualmente.
    
###  4 - Feature Engineering.

Uma métrica muito utilizada entre os criadores de conteúdo é o engajamento. O engajamento é a quantidade de interações que o vídeo recebeu. Para o Tiktok, o engajamento é medido pelo número de likes, comentários, compartilhamentos divido pelo número de visualizações. Assim, para cada vídeo, é possível calcular o engajamento e comparar com os outros vídeos independente do número de visualizações.
Além disso, eu criei 2 Tags diferentes para cada vídeo que representavam sobre qual era o tema do vídeo.
    
###  5 - Ferramentas.

Com o grande avanço das IA's, eu pude utilizar a plataforma Bolt.new para criar uma estrutura base para meu projeto usando JavaScript e Reactjs. Para fazer as alterações específicas que julguei necessárias, utilizei o Cursor.

###  6 - Dashboard.

Primeiramente, criei filtros globais para o dashboard, pois gostaria de ter o controle do período em que os vídeos eram e também a quantidade de visualizações que eles tinha. Pois, existem períodos em que os vídeos tem mais visualizações e outros em que tem menos, e, também, comparar padrões de desempenho em vídeos com diferentes visualizações.

Gráfico 1:

<div align="center">
  <img src="Images/grafico 1.png" alt="Gráfico de linha - Desempenho diário" width="600">
</div>

---

Gráfico de linha que mostra o número de visualizações, likes, comentários, compartilhamentos e de pessoas que acesssaram meu perifl naquele dia em específico.

Gráfico 2:

<div align="center">
  <img src="Images/grafico 2.png" alt="Gráfico Dotplot - Tempo do vídeo vs Visualizações" width="600">
</div>

Gráfico dotplot com o tempo do vídeo no eixo X e o número de views no eixo Y.

Gráfico 3:

<div align="center">
  <img src="Images/grafico 3.png" alt="Gráfico Dotplot - Engajamento vs Proporção média assistida" width="600">
</div>

Gráfico dotplot com o engajamento no eixo X e o proporção média assistida do vídeo no eixo Y.

Gráfico 4:

<div align="center">
  <img src="Images/grafico 4.png" alt="Gráfico Dotplot - Engajamento vs Proporção média assistida" width="600">
</div>

Gráfico dotplot com a combinação de tags no eixo X e engajamento no eixo Y.

Tabela:

Tabela com várias informações sobre os vídeos.

###  7 - Resultados.



###  8 - Melhorias.

- Implementar uma API para coletar os dados dos vídeos.
- Adicionar novas variáveis para o dashboard.
- Adicionar mais filtros para o dashboard.
- Criar abas para melhor organização.
- Adicionar mais gráficos para o dashboard.



    




