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
        6 - Gráficos.

<!-- 7 - Resultados. -->
<!-- 8 - Melhorias. O que faria diferente? -->
###  1 - Definição do problema.

Atualmente, sou criador de conteúdo no Tiktok e tive a necessidade de poder saber quais os melhores modelos de vídeos focar para ter mais sucesso em meu perfil e aumentar o engajamento.

###  2 - Definição dos objetivos.

- Como esta sendo o desempenho do meu perfil de modo geral?
- Existe uma relação entre o tempo do vídeo e o número de views?
- Quanto maior o tempo que o usuário passa no vídeo, maior é o engajamento?
- Qual tipo de video traz mais enjamento?

###  3 - Coleta de dados.

No Tiktok Studio, plataforma em que os criadores de conteúdo tem acesso, é possível baixar os dados do perfil do usuário em formato CSV. Porém, os dados são limitados e não possuem muitas informações. Desse modo, tive que coletar os dados de cada vídeo manualmente.
    
###  4 - Feature Engineering.

Uma métrica muito utilizada entre os criadores de conteúdo é o engajamento. O engajamento é a quantidade de interações que o vídeo recebeu. No caso do Tiktok, o engajamento é medido pelo número de likes, comentários, compartilhamentos divido pelo número de visualizações. Assim, para cada vídeo, é possível calcular o engajamento e comparar com os outros vídeos independente do número de visualizações.
Além disso, eu criei 2 Tags diferentes para cada vídeo, que representava sobre qual era o modelo do vídeo.
    
###  5 - Ferramentas.

Com o grande avanço das IA's, eu pude utilizar a plataforma Bolt.new para criar uma estrutura base para meu projeto usando JavaScript e Reactjs. Para fazer as alterações que julguei necessárias, eu utilizei o Cursor.

###  6 - Dashboard e Gráficos.

Primeiramente, eu criei filtros globais para o dashboard, pois gostaria de ter o controle do período em que os vídeos eram e também a quantidade de visualizações que eles tinha. Pois, existem períodos em que os vídeos tem mais visualizações e outros em que tem menos e....

Para cumprir o objetivo de saber como esta sendo o desempenho do meu perfil de modo geral, eu criei um gráfico de linha que mostra o número de visualizações, likes, comentários, compartilhamentos e de pessoas que acesssaram meu perifl naquele dia em específico.

Para cumprir o objetivo de saber se existe uma relação entre o tempo do vídeo e o número de views, eu criei um gráfico dotplot com o tempo do vídeo no eixo X e o número de views no eixo Y.

Para saber se o tempo do vídeo influencia no engajamento, eu criei um gráfico de linha que mostra o número de likes, comentários, compartilhamentos e de pessoas que acesssaram meu perifl naquele dia em específico.

Para cumprir o objetivo de saber qual tipo de video traz mais engajamento, 



<!-- ###  7 - Melhorias. O que faria diferente? -->

<!-- ###  8 - Resultados. -->
    




