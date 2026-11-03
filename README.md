# Sobra

Aplicativo de controle de finanças pessoais para Android, iOS, computador (Windows, Linux e macOS) e navegador. Registra receitas e despesas, acompanha gastos fixos e limites por categoria, e calcula planos de poupança com base nos gastos reais do usuário.

Todos os dados ficam no próprio dispositivo. O app não tem servidor nem conta de usuário. O único acesso à internet é a consulta de taxas de câmbio, feita apenas ao registrar uma compra em outra moeda.

**Versão atual:** 1.1.1

## Sumário

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Requisitos](#requisitos)
- [Desenvolvimento](#desenvolvimento)
- [Build para web](#build-para-web)
- [Build para Android](#build-para-android)
- [Build para iOS](#build-para-ios)
- [Build para computador](#build-para-computador)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Dados e privacidade](#dados-e-privacidade)
- [Backup](#backup)
- [Regras de negócio](#regras-de-negócio)
- [Internacionalização](#internacionalização)
- [Tema e identidade visual](#tema-e-identidade-visual)

## Funcionalidades

| Área | Descrição |
| --- | --- |
| Primeira abertura | Configuração guiada de idioma, nome, tema e moeda, seguida de um tutorial de 14 passos com dados de exemplo. Ao final, o app oferece apagar os exemplos para começar com dados reais. Executada uma única vez. |
| Painel | Saudação, meta diária, gastos da semana, resumo do mês, gastos fixos pendentes, alertas e transações recentes. Os cartões levam às telas correspondentes. |
| Transações | Cadastro com calendário próprio, parcelamento, repetição mensal e compra em outra moeda com conversão automática. Edição, exclusão com opção de desfazer, busca, filtros, ordenação e paginação. |
| Gráficos | Gastos por categoria, histórico de seis meses e evolução do saldo acumulado, relativos ao mês selecionado. |
| Objetivos | Metas de poupança com valor, prazo, progresso, diagnóstico de viabilidade e sugestões de corte. |
| Fixos | Receitas e despesas recorrentes com dia previsto e marcação mensal de recebido ou pago, válidas a partir do mês em que foram criadas. |
| Limites | Limite de gasto mensal por categoria, com alertas e cópia do mês anterior. |
| Notificações | Central no app com alertas de orçamento, lembretes e dica diária. Não há notificações com o app fechado. |
| Definições | Idioma, tema, moeda, nome, salário, categorias personalizadas, backup e tutorial. |
| Navegação | Barra lateral no computador. No celular, barra inferior com Painel, Transações, Fixos, Objetivos e um menu Mais com Limites, Gráficos e Definições. O logo leva de volta ao painel. |

## Tecnologias

| Finalidade | Tecnologia |
| --- | --- |
| Interface | React 19 e TypeScript |
| Build | Vite 8 |
| Estilos | Tailwind CSS 3 com variáveis CSS |
| Gráficos | Recharts |
| Datas | date-fns |
| Ícones | lucide-react |
| Apps móveis | Capacitor 6 |
| App de computador | Electron 45 e electron-builder |

## Requisitos

- Node.js 22 e npm
- Android: JDK 17 e Android SDK com API 34
- iOS: macOS com Xcode e CocoaPods

O Capacitor 6 é usado por ser a versão compatível com o JDK 17. Versões mais recentes exigem JDK 21.

## Desenvolvimento

```bash
npm install
npm run dev
```

A aplicação fica disponível em <http://localhost:5173>.

| Comando | Ação |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Valida os tipos e gera a versão de produção em `dist/` |
| `npm run preview` | Serve localmente o conteúdo de `dist/` |
| `npm run lint` | Executa o ESLint |
| `npm run cap:sync` | Gera o build e copia o resultado para os projetos nativos |
| `npm run android:apk` | Gera o APK de release assinado |
| `npm run desktop` | Abre a versão de computador a partir do build atual |
| `npm run desktop:linux` | Gera AppImage e pacote `.deb` |
| `npm run desktop:win` | Gera o pacote para Windows |
| `npm run desktop:mac` | Gera o `.dmg` para macOS (exige macOS) |

Depois de alterar `tailwind.config.js` com o servidor em execução, reinicie o `npm run dev`.

## Build para web

```bash
npm run build
```

O conteúdo de `dist/` pode ser publicado em qualquer hospedagem estática com HTTPS, como Vercel, Netlify ou Cloudflare Pages. A aplicação deve ficar na raiz do domínio, pois o manifesto e o service worker usam caminhos absolutos.

A versão web é instalável como PWA. O service worker prioriza a rede e usa o cache apenas quando não há conexão.

## Build para Android

Defina as variáveis de ambiente, se ainda não estiverem configuradas:

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
```

Gere o APK:

```bash
npm run android:apk
```

O arquivo é gerado em `android/app/build/outputs/apk/release/app-release.apk`.

### Assinatura

A assinatura usa dois arquivos que não são versionados:

| Arquivo | Conteúdo |
| --- | --- |
| `android/sobra-release.jks` | Chave de assinatura |
| `android/keystore.properties` | Caminho, alias e senhas da chave |

Formato de `keystore.properties`:

```properties
storeFile=../sobra-release.jks
storePassword=<senha>
keyAlias=sobra
keyPassword=<senha>
```

**Guarde cópias desses dois arquivos em local seguro.** O Android só aceita atualizações assinadas com a mesma chave. Sem ela, é preciso desinstalar o app, o que apaga os dados salvos no aparelho.

### Nova versão

Em `android/app/build.gradle`, incremente `versionCode` e atualize `versionName` antes de gerar o APK. Mantenha também a versão de `package.json` alinhada.

### Instalação manual

1. Copie o APK para o aparelho.
2. Abra o arquivo e autorize a instalação de apps desconhecidos para o app usado na abertura.
3. Confirme a instalação. O Google Play Protect pode exibir um aviso, pois o app não vem da Play Store.

## Build para iOS

A compilação exige macOS e Xcode:

```bash
npm install
npm run cap:sync
cd ios/App && pod install && cd ../..
npx cap open ios
```

No Xcode, selecione o target **App**, defina a equipe em **Signing & Capabilities** e execute em um iPhone conectado. Para distribuir pelo TestFlight ou pela App Store, é necessária uma conta paga do Apple Developer Program.

Sem um Mac, a alternativa é publicar a versão web e abri-la no Safari do iPhone. Em **Compartilhar → Adicionar à Tela de Início**, ela passa a funcionar como um app.

## Build para computador

A versão de computador usa o Electron para abrir o mesmo build web numa janela própria. Os arquivos são servidos pelo endereço interno `app://sobra`, o que mantém o `localStorage` e as demais APIs do navegador funcionando como na web.

| Sistema | Comando | Resultado em `release/desktop/` |
| --- | --- | --- |
| Linux | `npm run desktop:linux` | `Sobra-<versão>.AppImage` e `sobra_<versão>_amd64.deb` |
| Windows | `npm run desktop:win` | `Sobra-<versão>-win.zip` |
| macOS | `npm run desktop:mac` | `Sobra-<versão>.dmg` |

Gerado no Linux, o pacote do Windows é um `.zip` portátil: basta extrair e abrir `Sobra.exe`. Um instalador `.exe` com ícone próprio exige o Wine. Com ele instalado (`sudo apt install wine`), gere o instalador com:

```bash
npm run build && npx electron-builder --win nsis -c.win.signAndEditExecutable=true
```

Os pacotes não são assinados. Por isso, o Windows SmartScreen e o Gatekeeper do macOS exibem um aviso na primeira abertura.

Os dados ficam na pasta de dados do usuário de cada sistema, como `~/.config/Sobra` no Linux e `%APPDATA%\Sobra` no Windows, e não são compartilhados com o navegador nem com o celular. Para levar dados de um dispositivo a outro, use a exportação e a importação de backup.

Se a janela não abrir quando iniciada por um terminal integrado do VS Code, remova a variável `ELECTRON_RUN_AS_NODE` do ambiente (`env -u ELECTRON_RUN_AS_NODE npm run desktop`).

## Estrutura do projeto

```text
.
├── android/                 Projeto nativo Android
├── electron/                Janela e ícone da versão de computador
├── ios/                     Projeto nativo iOS
├── public/                  Ícones, manifesto e service worker
├── src/
│   ├── components/
│   │   ├── Budget/          Limites por categoria
│   │   ├── Charts/          Gráficos
│   │   ├── Dashboard/       Cartões do painel
│   │   ├── Fixed/           Gastos fixos
│   │   ├── Goals/           Objetivos e planejamento
│   │   ├── Layout/          Navegação, cabeçalho e notificações
│   │   ├── Settings/        Definições
│   │   ├── Transactions/    Lista, filtros e formulário
│   │   ├── Tutorial/        Primeira abertura e tutorial guiado
│   │   └── UI/              Componentes genéricos
│   ├── contexts/            Estado global de preferências, finanças e notificações
│   ├── data/                Categorias padrão e dados de exemplo
│   ├── hooks/               Persistência em localStorage
│   ├── i18n/                Traduções
│   ├── pages/               Telas (Painel, Transações, Fixos, Objetivos, Limites, Gráficos, Definições)
│   ├── types/               Tipos de domínio
│   └── utils/               Cálculos, planejamento, formatação e arquivos
└── capacitor.config.json    Configuração dos apps nativos
```

## Dados e privacidade

Os dados são gravados no `localStorage` do navegador ou da WebView:

| Chave | Conteúdo |
| --- | --- |
| `app-financas-data` | Transações, limites, salários, categorias, objetivos e gastos fixos |
| `app-financas-prefs` | Idioma, tema, moeda, nome e estado do tutorial |
| `app-financas-notifications` | Notificações lidas e dispensadas, e data da primeira abertura |

As chaves mantêm o prefixo `app-financas` para preservar os dados de instalações anteriores à adoção do nome Sobra.

Os dados são apagados ao desinstalar o app ou limpar os dados do navegador. As versões web e nativa não compartilham armazenamento.

## Backup

Em **Definições**, a opção de exportar gera o arquivo `sobra-backup-AAAA-MM-DD.json`. No navegador, ele é baixado. Nos apps nativos, abre a folha de compartilhamento do sistema, que permite salvar em arquivos ou enviar para outro app.

A importação valida o arquivo e, após confirmação, substitui todos os dados atuais. Arquivos que não são backups do app são recusados sem alterar nada.

## Regras de negócio

**Perfil de gastos.** Usa a média dos últimos três meses completos com registros, ou o mês atual se não houver histórico. Gastos fixos sem pagamento nesse período são somados à média.

**Plano de um objetivo.** A capacidade mensal é o que sobra em média, descontada a necessidade mensal dos demais objetivos.

| Situação | Condição |
| --- | --- |
| No caminho certo | Necessário até 80% da capacidade |
| Apertado | Necessário entre 80% e 100% da capacidade |
| Precisa de ajustes | Necessário acima da capacidade |
| Estimativa | Objetivo sem prazo, com data calculada pela capacidade |

**Sugestões de corte.** Consideram apenas categorias flexíveis, como lazer, compras, alimentação e transporte, além das categorias personalizadas. Moradia, saúde, educação, contas e dívidas nunca são sugeridas.

**Meta diária.** Parte da renda esperada do mês: o maior valor entre a renda média e a renda já recebida somada às receitas fixas por receber. Desse valor saem a necessidade dos objetivos, as despesas fixas pendentes e o que já foi gasto antes de hoje. O resultado é dividido pelos dias restantes do mês.

**Saldo acumulado.** O saldo de um mês é o saldo do mês anterior somado às receitas e subtraídas as despesas do mês. O cartão de saldo mostra o valor transitado dos meses anteriores.

**Fixos.** Podem ser receitas ou despesas e valem a partir do mês em que foram criados. Marcar como pago ou recebido cria uma transação vinculada. Excluir essa transação faz com que o fixo volte a ficar pendente no mês. Fixos gravados por versões anteriores, sem tipo, são tratados como despesas.

**Parcelamento.** Uma compra parcelada gera uma transação por mês, a partir da data escolhida, com o total dividido em partes iguais. A diferença de arredondamento vai para a última parcela. Cada parcela é editada ou excluída individualmente.

**Repetição mensal.** Uma receita ou despesa marcada como "Todos os meses" cria um fixo a partir daquele mês e já o registra como recebido ou pago. O parcelamento está disponível apenas para despesas.

**Limites.** Ficam amarelos a partir de 70% e vermelhos a partir de 90%. Valem somente para o mês em que foram criados.

**Moeda.** A moeda do app altera apenas a exibição. Os valores salvos não são convertidos.

**Compras em outra moeda.** A taxa é obtida em [open.er-api.com](https://open.er-api.com) e guardada por 12 horas. Sem conexão, o app usa a última taxa conhecida ou pede a taxa manualmente. A transação é salva na moeda do app, com o valor, a moeda e a taxa originais anotados.

## Internacionalização

O app está disponível em português (pt-PT) e inglês. Os textos ficam em `src/i18n/translations.ts`, e o TypeScript recusa o build se uma tradução estiver faltando.

Para adicionar um idioma, inclua o dicionário em `TRANSLATIONS`, o código em `Language` (`src/types/index.ts`), o locale de datas em `src/utils/formatters.ts` e a opção em `src/components/UI/PreferencePickers.tsx`.

## Tema e identidade visual

As cores são variáveis CSS definidas em `src/index.css` e expostas ao Tailwind em `tailwind.config.js`. Os componentes usam nomes semânticos, como `bg-surface` e `text-muted`, em vez de cores fixas. Os temas disponíveis são claro, escuro e sistema.

| Elemento | Cor |
| --- | --- |
| Amarelo principal | `#FFC107` |
| Fundo do logo | `#1F1A0A` |

O logo está em `src/components/UI/Logo.tsx` e `public/favicon.svg`. Os ícones nativos ficam em `android/app/src/main/res` e `ios/App/App/Assets.xcassets`.
