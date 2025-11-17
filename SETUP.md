# 🛠️ Configuração e Setup - Viana's Pet Shop

## 📋 Lista de Verificação Pré-Lançamento

### ✅ Conteúdo Obrigatório

#### 📸 Imagens (Substituir Placeholders)
- [ ] **Logo da empresa** (`assets/logo.png`)
  - Formato: PNG com fundo transparente
  - Tamanho recomendado: 200x80px
  - Resolução: 300 DPI

- [ ] **Foto principal** (`assets/hero-pet.jpg`)
  - Pets felizes, ambiente acolhedor
  - Tamanho: 1200x800px mínimo
  - Qualidade: Alta resolução

- [ ] **Foto da equipe/loja** (`assets/about-us.jpg`)
  - Equipe ou instalações da pet shop
  - Tamanho: 800x600px
  - Transmitir profissionalismo e carinho

#### 🏢 Informações da Empresa
- [ ] **Endereço completo** (atualizar no index.html linha ~730)
- [ ] **Telefones reais** (atualizar nas linhas ~740, ~1010, etc.)
- [ ] **Email corporativo** (configurar e atualizar)
- [ ] **Horário de funcionamento** (confirmar e atualizar)
- [ ] **Número do WhatsApp** (substituir 5585999998888)

#### 🛍️ Catálogo de Produtos
- [ ] **Preços atualizados** (verificar seção produtos)
- [ ] **Descrições corretas** dos serviços
- [ ] **Fotos reais dos produtos** (racões, brinquedos, etc.)

### 🔧 Configurações Técnicas

#### 📍 Google Maps
1. Acesse [Google Maps](https://maps.google.com)
2. Procure pelo endereço real da loja
3. Clique em "Compartilhar" > "Incorporar um mapa"
4. Copie o código iframe
5. Substitua na linha ~800 do index.html

#### 📱 WhatsApp Integration
```javascript
// Localizar no arquivo js/script.js (linha ~290)
const whatsappNumber = '5585999998888'; // SUBSTITUIR
const defaultMessage = 'Olá! Gostaria de agendar um serviço para meu pet.';
```

#### 📧 Formulário de Contato
**Opção 1 - FormSpree (Recomendado):**
1. Acesse [formspree.io](https://formspree.io)
2. Crie uma conta gratuita
3. Configure um formulário
4. Substitua no código:
```html
<form action="https://formspree.io/f/SEU_ID" method="POST">
```

**Opção 2 - Netlify Forms:**
1. Adicione `netlify` ao formulário
2. Configure notificações no painel Netlify

#### 🔍 Google Analytics
```html
<!-- Adicionar antes do </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 🌐 Publicação do Site

#### 🆓 Opções Gratuitas

**Netlify (Recomendado):**
1. Acesse [netlify.com](https://netlify.com)
2. Conecte repositório GitHub ou faça upload dos arquivos
3. Configure domínio personalizado
4. Configurações automáticas de SSL

**Vercel:**
1. Acesse [vercel.com](https://vercel.com)
2. Importe projeto
3. Deploy automático

**GitHub Pages:**
1. Crie repositório GitHub
2. Upload dos arquivos
3. Ative GitHub Pages nas configurações

#### 💰 Hospedagem Paga (Brasileira)

**Hostinger:**
- Plano básico: R$ 8,99/mês
- SSL gratuito
- Suporte em português

**HostGator:**
- Plano básico: R$ 7,99/mês
- WordPress opcional
- Backup automático

**Locaweb:**
- Plano básico: R$ 16,90/mês
- Suporte telefônico
- Email profissional incluído

### 🏷️ Registro de Domínio

**Sugestões de domínio:**
- vianaspetshop.com.br
- vianaspetpassare.com.br
- petshopviana.com.br

**Registradores confiáveis:**
- Registro.br (domínios .br)
- Hostinger
- GoDaddy
- Namecheap

### 📊 SEO Local

#### Google My Business
1. Acesse [business.google.com](https://business.google.com)
2. Crie perfil da empresa
3. Adicione fotos, horários, serviços
4. Solicite avaliações dos clientes

#### Palavras-chave importantes
- "pet shop Passaré"
- "banho e tosa Passaré"
- "veterinário Passaré"
- "ração para cães Fortaleza"
- "loja de animais Passaré"

### 📱 Redes Sociais

#### Links para atualizar
```html
<!-- Localizar no footer (linha ~970) -->
<a href="https://facebook.com/vianaspetshop" target="_blank">
<a href="https://instagram.com/vianaspetshop" target="_blank">
```

#### Estratégia de conteúdo
- Fotos dos pets clientes
- Dicas de cuidados
- Promoções e novidades
- Bastidores da pet shop

### 🔒 Segurança e Backup

#### SSL Certificate
- Certificado automático no Netlify/Vercel
- Let's Encrypt para hospedagem própria

#### Backup Regular
- Backup semanal dos arquivos
- Backup do banco de dados (se houver)
- Versionamento no GitHub

### 📈 Monitoramento

#### Google Search Console
1. Acesse [search.google.com/search-console](https://search.google.com/search-console)
2. Adicione propriedade do site
3. Submeta sitemap
4. Monitore performance de busca

#### PageSpeed Insights
- Teste regularmente em [pagespeed.web.dev](https://pagespeed.web.dev)
- Mantenha score acima de 90

### 📞 Suporte Técnico

#### Configuração de Email Profissional
```
contato@vianaspetshop.com.br
agendamento@vianaspetshop.com.br
vendas@vianaspetshop.com.br
```

#### Configuração SMTP
- Use Gmail, Outlook ou serviço da hospedagem
- Configure autoresposta
- Assinatura profissional

### ⚡ Otimizações Adicionais

#### Compressão de Imagens
- Use [tinypng.com](https://tinypng.com)
- Formato WebP quando possível
- Lazy loading já implementado

#### Cache do Navegador
```html
<!-- Adicionar no .htaccess (Apache) -->
<IfModule mod_expires.c>
ExpiresActive On
ExpiresByType text/css "access plus 1 month"
ExpiresByType application/javascript "access plus 1 month"
ExpiresByType image/png "access plus 1 month"
ExpiresByType image/jpeg "access plus 1 month"
</IfModule>
```

### 📱 PWA (Progressive Web App)
Para transformar em PWA:
1. Criar manifest.json
2. Implementar Service Worker
3. Ícones para diferentes dispositivos

### 🎯 Marketing Digital

#### Google Ads Local
- Campanhas para "pet shop perto de mim"
- Segmentação por bairro
- Budget baixo para começar

#### Facebook/Instagram Ads
- Público-alvo: donos de pets em Fortaleza
- Raio de 10km do Passaré
- Conteúdo visual atrativo

---

## 📧 Checklist Final Antes do Lançamento

- [ ] Todas as imagens substituídas
- [ ] Informações de contato corretas
- [ ] Links das redes sociais funcionando
- [ ] Formulário de contato testado
- [ ] WhatsApp redirecionando corretamente
- [ ] Google Maps com localização correta
- [ ] SSL certificado ativo
- [ ] Site testado em diferentes dispositivos
- [ ] Google Analytics configurado
- [ ] Google My Business criado
- [ ] Backup realizado

**Data prevista de lançamento:** ___/___/2024

**Responsável pela configuração:** _________________

**Aprovação final:** _________________

---

💡 **Dica:** Mantenha este checklist e risque cada item conforme for completando. Em caso de dúvidas, consulte a documentação ou entre em contato com o suporte técnico.