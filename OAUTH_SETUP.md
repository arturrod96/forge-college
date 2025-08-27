# 🔐 Configuração OAuth com Google e GitHub - Forge College

Este documento explica como configurar a autenticação OAuth com Google e GitHub usando Supabase no projeto Forge College.

## 📋 **Pré-requisitos**

- ✅ Projeto Supabase configurado
- ✅ Conta Google Cloud Console
- ✅ Conta GitHub Developer
- ✅ Projeto Forge College rodando localmente

## 🚀 **1. Configuração do Supabase**

### 1.1 **Obter Credenciais**
1. Acesse [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá para **Settings** → **API**
4. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 1.2 **Configurar URLs de Redirecionamento**
1. Vá para **Authentication** → **URL Configuration**
2. Configure:
   - **Site URL**: `http://localhost:8080` (desenvolvimento)
   - **Additional Redirect URLs**: `http://localhost:8080/auth/callback`

## 🔑 **2. Configuração do Google OAuth**

### 2.1 **Criar Projeto no Google Cloud Console**
1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto ou selecione existente
3. Ative a **Google+ API**

### 2.2 **Configurar OAuth Consent Screen**
1. Vá para **APIs & Services** → **OAuth consent screen**
2. Configure:
   - **User Type**: External
   - **App name**: Forge College
   - **User support email**: seu-email@exemplo.com
   - **Developer contact information**: seu-email@exemplo.com

### 2.3 **Criar Credenciais OAuth**
1. Vá para **APIs & Services** → **Credentials**
2. Clique em **Create Credentials** → **OAuth 2.0 Client IDs**
3. Configure:
   - **Application type**: Web application
   - **Name**: Forge College Web Client
   - **Authorized redirect URIs**: `https://<YOUR_PROJECT>.supabase.co/auth/v1/callback`

### 2.4 **Copiar Credenciais**
- **Client ID** → copie para Supabase
- **Client Secret** → copie para Supabase

## 🐙 **3. Configuração do GitHub OAuth**

### 3.1 **Criar OAuth App no GitHub**
1. Acesse [GitHub Developer Settings](https://github.com/settings/developers)
2. Clique em **New OAuth App**
3. Configure:
   - **Application name**: Forge College
   - **Homepage URL**: `http://localhost:8080`
   - **Authorization callback URL**: `https://<YOUR_PROJECT>.supabase.co/auth/v1/callback`

### 3.2 **Copiar Credenciais**
- **Client ID** → copie para Supabase
- **Client Secret** → copie para Supabase

## ⚙️ **4. Configuração no Supabase**

### 4.1 **Habilitar Provedores OAuth**
1. Vá para **Authentication** → **Providers**
2. **Google**:
   - ✅ Enable Google
   - Cole **Client ID** e **Client Secret**
   - **Redirect URL**: `https://<YOUR_PROJECT>.supabase.co/auth/v1/callback`

3. **GitHub**:
   - ✅ Enable GitHub
   - Cole **Client ID** e **Client Secret**
   - **Redirect URL**: `https://<YOUR_PROJECT>.supabase.co/auth/v1/callback`

### 4.2 **Configurar Políticas de Email**
1. Vá para **Authentication** → **Settings**
2. **Enable email confirmations**: ✅ (recomendado)
3. **Enable email change confirmations**: ✅ (recomendado)

## 🔧 **5. Configuração Local**

### 5.1 **Criar Arquivo .env.local**
```bash
# Copie o arquivo env.example para .env.local
cp env.example .env.local
```

### 5.2 **Editar .env.local**
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase

# Site URL for development
NEXT_PUBLIC_SITE_URL=http://localhost:8080
```

## 🧪 **6. Testando a Configuração**

### 6.1 **Iniciar o Servidor**
```bash
npm run dev
```

### 6.2 **Testar Fluxo OAuth**
1. Acesse: `http://localhost:8080/login-oauth`
2. Clique em **Continue with Google** ou **Continue with GitHub**
3. Complete o fluxo de autenticação
4. Verifique se é redirecionado para `/dashboard`

### 6.3 **Verificar no Supabase**
1. Vá para **Authentication** → **Users**
2. Verifique se o usuário foi criado
3. Confirme os metadados do usuário

## 🚨 **7. Troubleshooting**

### 7.1 **Erro: "Invalid redirect URI"**
- ✅ Verifique se a URL de callback está correta no Google/GitHub
- ✅ Confirme se está usando HTTPS para Supabase
- ✅ Verifique se não há espaços extras nas URLs

### 7.2 **Erro: "OAuth provider not enabled"**
- ✅ Verifique se o provedor está habilitado no Supabase
- ✅ Confirme se as credenciais estão corretas
- ✅ Verifique se não há erros de digitação

### 7.3 **Erro: "User not found"**
- ✅ Verifique se o usuário foi criado no Supabase
- ✅ Confirme se as políticas de email estão configuradas
- ✅ Verifique os logs do Supabase

## 🔒 **8. Segurança e Produção**

### 8.1 **Configurações de Produção**
- ✅ Atualize **Site URL** para seu domínio real
- ✅ Adicione domínio real em **Additional Redirect URLs**
- ✅ Configure **CORS** se necessário
- ✅ Use variáveis de ambiente seguras

### 8.2 **Políticas de Segurança**
- ✅ Configure **Row Level Security (RLS)** nas tabelas
- ✅ Defina políticas de acesso adequadas
- ✅ Monitore logs de autenticação
- ✅ Configure rate limiting se necessário

## 📚 **9. Recursos Adicionais**

### 9.1 **Documentação Oficial**
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Google OAuth](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth](https://docs.github.com/en/developers/apps/building-oauth-apps)

### 9.2 **Componentes Disponíveis**
- `LoginOAuth` - Página de login OAuth
- `AuthCallback` - Página de callback
- `useOAuth` - Hook de autenticação
- `LogoutButton` - Botão de logout
- `OAuthProvider` - Provider de contexto

### 9.3 **Rotas Configuradas**
- `/login-oauth` - Login OAuth
- `/auth/callback` - Callback OAuth
- `/dashboard` - Área protegida

## 🎯 **10. Checklist de Configuração**

- [ ] Credenciais Supabase configuradas
- [ ] Google OAuth configurado
- [ ] GitHub OAuth configurado
- [ ] URLs de redirecionamento configuradas
- [ ] Arquivo .env.local criado
- [ ] Servidor rodando localmente
- [ ] Fluxo OAuth testado
- [ ] Usuário criado no Supabase
- [ ] Logout funcionando
- [ ] Área protegida acessível

## 🆘 **11. Suporte**

Se encontrar problemas:
1. Verifique os logs do console do navegador
2. Confirme as configurações no Supabase
3. Verifique as credenciais OAuth
4. Teste com um provedor por vez
5. Consulte a documentação oficial

---

**🎉 Parabéns!** Seu sistema OAuth está configurado e funcionando!


