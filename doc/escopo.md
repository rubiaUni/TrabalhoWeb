# Plano Estratégico: Inteligência Preditiva para E-commerce de Notebooks

## 0. Contexto e Justificativa (O "Porquê" do Projeto)
* **A Dor das PMEs:** Pequenas empresas sofrem com a escassez de dados, o que torna modelos de IA tradicionais imprecisos e o tráfego pago (ads) extremamente caro e arriscado no início.
* **A Tese do Augmentation:** O uso de dados sintéticos (CTGAN) permite que uma base pequena (500 contatos) atinja o "volume crítico" necessário para treinar uma inteligência que entenda o comportamento de consumo, sem esperar anos para coletar dados organicamente.
* **Inteligência Orgânica vs. Gestor de Tráfego:** Contratar um gestor de tráfego profissional é um investimento alto para quem está começando. Este modelo permite uma abordagem "orgânica preditiva": em vez de gastar fortunas em anúncios genéricos, a empresa usa o modelo para minerar sua própria base e leads de entrada, priorizando o esforço humano onde a conversão é estatisticamente provável.

* **Objetivo:** Modelo de IA preditivo para ranqueamento e auxilio no funil de vendas de forma organica (sem custo).

## 1. Preparação e Limpeza (Data Wrangling)
* **Tratamento do CSV:** Normalização de datas, padronização de nomes de cidades e encoding de variáveis categóricas.
* **Feature Engineering:** Criação de métricas como "Dias de Base" e "Score de Localização".
    * **How:** Scripts Python (Pandas/Polars) para limpeza e Scikit-learn para Label/One-Hot Encoding.
    * **Why:** Garante que o modelo receba dados consistentes e sem ruídos, evitando o efeito "garbage in, garbage out".
    * **Who:** Data Engineer / Desenvolvedor Python.

## 2. Enriquecimento e Dados Sintéticos (Augmentation)
* **Variáveis Demográficas:** Inclusão de idade e sexo via distribuições estatísticas.
* **CTGAN (Conditional GAN):** Geração de 10.000 registros sintéticos.
    * **How:** Utilizando a biblioteca CTGAN para aprender as correlações da base de 500 e expandir estatisticamente.
    * **Why:** Pequenas empresas têm poucos dados. O augmentation cria o volume necessário para o aprendizado de máquina.
    * **Who:** Machine Learning Engineer.

## 3. Modelo Base (Foundation Tabular Model)
* **Algoritmo:** XGBoost ou LightGBM.
* **Objetivo:** Lead Scoring baseado no perfil e situação do cliente.
    * **How:** Treino supervisionado com validação cruzada e ajuste de hiperparâmetros.
    * **Why:** Identifica padrões globais de comportamento de compra e risco de crédito na base expandida.
    * **Who:** Data Scientist.

## 4. Especialização e Fine-Tuning
* **Segmento Gamer:** Foco em público jovem e logística ágil.
* **B2B (Corporativo):** Otimização para conversão de Pessoas Jurídicas.
    * **How:** Ajuste de thresholds de decisão e pesos de features específicos para cada persona.
    * **Why:** Permite uma segmentação fina sem depender de algoritmos opacos de plataformas de ads.
    * **Who:** ML Specialist / Business Analyst.

## 5. Implementação e Stack Tecnológica
* **Backend:** API em FastAPI containerizada com Docker.
* **Interface:** Dashboard em Streamlit ou React para visualização de leads.
    * **How:** Deploy de containers via Docker Compose integrando o modelo treinado ao backend.
    * **Why:** Democratiza o acesso à IA para empresas que não podem pagar grandes agências de tráfego.
    * **Who:** Full-stack Developer / DevOps.

## 6. Ciclo de Melhoria Contínua
* **Feedback Loop:** Alimentação do modelo com dados de vendas reais.
* **Evolução:** Redução da dependência de dados sintéticos.
    * **How:** Pipeline de MLOps para retreino periódico conforme novos dados de e-commerce entram no sistema.
    * **Why:** O sistema se torna um ativo próprio da empresa, crescendo em inteligência de forma orgânica e sustentável.
    * **Who:** MLOps Engineer.
