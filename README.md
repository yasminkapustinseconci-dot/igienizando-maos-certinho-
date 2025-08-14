# Mãos de Ouro - Jogo de Higienização das Mãos

## Descrição
Jogo interativo educacional para ensinar a técnica correta de higienização das mãos de forma lúdica e interativa. O jogo oferece duas modalidades: higienização com água e sabão (40-60 segundos) e higienização com álcool 70% (20-30 segundos).

## Características do Jogo

### Funcionalidades Principais
- **Duas modalidades de higienização**: Água e sabão / Álcool 70%
- **Cronômetro em tempo real**: Controla o tempo de execução
- **Sistema de pontuação**: Baseado na precisão e tempo adequado
- **Feedback interativo**: Mensagens de sucesso/erro em tempo real
- **Áreas clicáveis**: Simulação das áreas das mãos para fricção
- **Barra de progresso**: Acompanhamento visual do progresso
- **Tela de resultados**: Pontuação final com estrelas e detalhes

### Estrutura do Jogo

#### Tela de Boas-Vindas
- Título "Mãos de Ouro"
- Texto explicativo sobre a importância da higienização
- Botões para escolher a modalidade

#### Cenário 1: Água e Sabão (40-60 segundos)
1. Molhar as mãos (clicar na torneira)
2. Aplicar sabão (clicar no sabonete)
3. Friccionar as palmas (clicar na área destacada)
4. Friccionar entre os dedos (clicar na área destacada)
5. Friccionar o dorso (clicar na área destacada)
6. Friccionar os polegares (clicar na área destacada)
7. Friccionar as unhas (clicar na área destacada)
8. Enxaguar (clicar na torneira)
9. Secar (clicar no papel toalha)

#### Cenário 2: Álcool 70% (20-30 segundos)
1. Aplicar álcool 70% (clicar no frasco)
2. Friccionar as palmas (clicar na área destacada)
3. Friccionar entre os dedos (clicar na área destacada)
4. Friccionar o dorso (clicar na área destacada)
5. Friccionar os polegares (clicar na área destacada)
6. Friccionar as unhas (clicar na área destacada)

#### Tela de Feedback
- Pontuação final
- Sistema de estrelas (1-5)
- Detalhes do desempenho
- Opções para jogar novamente ou voltar ao menu

## Arquivos do Projeto

```
hand-hygiene-game/
├── index.html          # Estrutura principal do jogo
├── style.css           # Estilos e layout responsivo
├── script.js           # Lógica do jogo e interações
├── README.md           # Documentação do projeto
└── assets/             # Recursos visuais
    ├── hand_dirty.png      # Imagem da mão suja
    ├── hand_clean.png      # Imagem da mão limpa
    ├── icon_faucet.png     # Ícone da torneira
    ├── icon_soap.png       # Ícone do sabonete
    ├── icon_alcohol.png    # Ícone do álcool 70%
    ├── icon_towel.png      # Ícone do papel toalha
    ├── area_palms.png      # Área das palmas
    ├── area_fingers.png    # Área entre os dedos
    ├── area_back.png       # Área do dorso
    ├── area_thumbs.png     # Área dos polegares
    └── area_nails.png      # Área das unhas
```

## Tecnologias Utilizadas
- **HTML5**: Estrutura semântica
- **CSS3**: Estilização responsiva com gradientes e animações
- **JavaScript**: Lógica interativa, cronômetro e sistema de pontuação

## Características Técnicas

### Responsividade
- Design adaptável para desktop e mobile
- Layout flexível que se ajusta a diferentes tamanhos de tela
- Controles touch-friendly para dispositivos móveis

### Sistema de Pontuação
- Pontos por passo completado corretamente
- Bônus por tempo adequado (dentro do intervalo recomendado)
- Penalidades por tempo inadequado (muito rápido ou muito lento)
- Classificação por estrelas baseada na pontuação final

### Feedback Visual
- Áreas destacadas com animação pulsante
- Cores diferenciadas para cada estado (ativo, completado, erro)
- Mensagens popup para feedback imediato
- Barra de progresso animada

## Integração com Rise (Articulate)

### Opções de Integração
1. **Embed HTML**: Incorporar como conteúdo web no Rise
2. **SCORM Package**: Converter para pacote SCORM se necessário
3. **Link Externo**: Hospedar externamente e linkar no Rise

### Instruções para Rise
1. Faça upload de todos os arquivos para um servidor web
2. No Rise, adicione um bloco "Conteúdo Web"
3. Insira a URL do arquivo index.html
4. Configure as dimensões recomendadas: 1024x768px mínimo
5. Teste a funcionalidade em diferentes dispositivos

## Personalização

### Modificações Possíveis
- Alterar cores no arquivo `style.css`
- Modificar textos e instruções no arquivo `index.html`
- Ajustar tempos e pontuações no arquivo `script.js`
- Substituir imagens na pasta `assets/`

### Configurações de Tempo
```javascript
// No arquivo script.js, seção gameModes
soap: {
    minTime: 40,  // Tempo mínimo em segundos
    maxTime: 60   // Tempo máximo em segundos
},
alcohol: {
    minTime: 20,  // Tempo mínimo em segundos
    maxTime: 30   // Tempo máximo em segundos
}
```

## Compatibilidade
- Navegadores modernos (Chrome, Firefox, Safari, Edge)
- Dispositivos móveis (iOS, Android)
- Tablets e desktops
- Funciona offline após carregamento inicial

## Suporte
Para dúvidas ou modificações, consulte os comentários no código-fonte ou entre em contato com a equipe de desenvolvimento.

