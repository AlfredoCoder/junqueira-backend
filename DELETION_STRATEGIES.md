# Estratégias de Exclusão de Dados - Sistema JoMorais

## 📋 Sumário
Este documento descreve as técnicas implementadas para exclusão segura de dados no sistema, especialmente para **Alunos** e **Encarregados**, considerando relacionamentos e integridade referencial.

---

## 🎯 Técnicas Implementadas

### 1. **SOFT DELETE (Exclusão Lógica)**
Exclusão lógica onde os dados **NÃO são removidos fisicamente** do banco de dados, mas marcados como "inativos" ou "excluídos".

#### ✅ Vantagens
- **Recuperação fácil**: Dados podem ser restaurados
- **Auditoria**: Histórico completo mantido
- **Segurança**: Evita perda acidental de dados
- **Integridade**: Mantém relacionamentos intactos

#### ❌ Desvantagens
- Aumenta o tamanho do banco de dados
- Requer filtros adicionais nas consultas
- Pode afetar performance em tabelas grandes

#### 📍 Implementado em: `tb_encarregados`

**Como funciona:**
```javascript
// Quando um encarregado tem alunos associados
await prisma.tb_encarregados.update({
  where: { codigo: parseInt(id) },
  data: { status: 0 }  // 0 = inativo/excluído, 1 = ativo
});
```

**Campo utilizado:**
- `status: 0` → Registro excluído logicamente
- `status: 1` → Registro ativo

---

### 2. **HARD DELETE (Exclusão Física)**
Exclusão física onde os dados são **removidos permanentemente** do banco de dados.

#### ✅ Vantagens
- Libera espaço no banco de dados
- Performance melhor (menos dados)
- Conformidade com LGPD/GDPR (direito ao esquecimento)

#### ❌ Desvantagens
- **Irreversível**: Dados não podem ser recuperados
- Pode causar problemas de integridade referencial
- Perde histórico de auditoria

#### 📍 Implementado em: `tb_encarregados` (sem dependências)

**Como funciona:**
```javascript
// Quando um encarregado NÃO tem alunos associados
await prisma.tb_encarregados.delete({
  where: { codigo: parseInt(id) }
});
```

---

### 3. **CASCADE DELETE (Exclusão em Cascata)**
Exclusão que remove automaticamente **todos os registros relacionados** em outras tabelas.

#### ✅ Vantagens
- Mantém integridade referencial
- Remove todas as dependências automaticamente
- Evita registros órfãos

#### ❌ Desvantagens
- Pode excluir muitos dados inadvertidamente
- Requer muito cuidado na implementação
- Operação pesada em termos de performance

#### 📍 Implementado em: `tb_alunos`

**Como funciona:**
```javascript
await prisma.$transaction(async (tx) => {
  // 1. Excluir confirmações
  await tx.tb_confirmacoes.deleteMany({ where: { ... } });
  
  // 2. Excluir notas de crédito
  await tx.tb_nota_credito.deleteMany({ where: { ... } });
  
  // 3. Excluir pagamentos secundários
  await tx.tb_pagamentos.deleteMany({ where: { ... } });
  
  // 4. Excluir pagamentos principais
  await tx.tb_pagamentoi.deleteMany({ where: { ... } });
  
  // 5. Excluir serviços
  await tx.tb_servico_aluno.deleteMany({ where: { ... } });
  
  // 6. Excluir transferências
  await tx.tb_transferencias.deleteMany({ where: { ... } });
  
  // 7. Excluir matrícula
  await tx.tb_matriculas.delete({ where: { ... } });
  
  // 8. Excluir aluno
  await tx.tb_alunos.delete({ where: { ... } });
  
  // 9. Verificar e excluir encarregado (se órfão)
  const outrosAlunos = await tx.tb_alunos.count({ ... });
  if (outrosAlunos === 0) {
    await tx.tb_encarregados.delete({ where: { ... } });
  }
});
```

---

## 🔄 Fluxograma de Decisão

### Exclusão de Encarregado

```
┌─────────────────────────────┐
│ Excluir Encarregado (ID)   │
└──────────┬──────────────────┘
           │
           ▼
    ┌──────────────┐
    │ Existe?      │───Não──► ❌ Erro 404
    └──────┬───────┘
           │Sim
           ▼
    ┌────────────────────┐
    │ Tem alunos         │
    │ associados?        │
    └──────┬─────────┬───┘
           │         │
          Sim       Não
           │         │
           ▼         ▼
    ┌──────────┐  ┌──────────────┐
    │ SOFT     │  │ HARD DELETE  │
    │ DELETE   │  │ (Permanente) │
    │(Status=0)│  └──────────────┘
    └──────────┘         │
           │             │
           ▼             ▼
    ✅ Desativado   ✅ Excluído
```

### Exclusão de Aluno

```
┌─────────────────────────────┐
│ Excluir Aluno (ID)         │
└──────────┬──────────────────┘
           │
           ▼
    ┌──────────────┐
    │ Existe?      │───Não──► ❌ Erro 404
    └──────┬───────┘
           │Sim
           ▼
    ┌─────────────────────────┐
    │ Iniciar TRANSAÇÃO       │
    │ (Tudo ou Nada)          │
    └──────┬──────────────────┘
           │
           ▼
    ┌─────────────────────────┐
    │ 1. Excluir confirmações │
    └──────┬──────────────────┘
           ▼
    ┌─────────────────────────┐
    │ 2. Excluir notas créd.  │
    └──────┬──────────────────┘
           ▼
    ┌─────────────────────────┐
    │ 3. Excluir pagamentos   │
    └──────┬──────────────────┘
           ▼
    ┌─────────────────────────┐
    │ 4. Excluir serviços     │
    └──────┬──────────────────┘
           ▼
    ┌─────────────────────────┐
    │ 5. Excluir transferênc. │
    └──────┬──────────────────┘
           ▼
    ┌─────────────────────────┐
    │ 6. Excluir matrícula    │
    └──────┬──────────────────┘
           ▼
    ┌─────────────────────────┐
    │ 7. Excluir ALUNO        │
    └──────┬──────────────────┘
           ▼
    ┌─────────────────────────┐
    │ 8. Encarregado órfão?   │
    └──────┬─────────┬────────┘
          Sim       Não
           │         │
           ▼         ▼
    ┌──────────┐  ┌──────────┐
    │ Excluir  │  │ Manter   │
    │Encarreg. │  │Encarreg. │
    └──────────┘  └──────────┘
           │         │
           ▼         ▼
    ✅ CASCADE DELETE COMPLETO
```

---

## 📊 Resposta da API

### Soft Delete (Encarregado com alunos)
```json
{
  "success": true,
  "message": "Encarregado desativado com sucesso (possui alunos associados)",
  "tipo": "soft_delete",
  "alunosAssociados": 3,
  "info": "O encarregado foi desativado porque possui 3 aluno(s) associado(s). Para excluir permanentemente, remova os alunos primeiro."
}
```

### Hard Delete (Encarregado sem alunos)
```json
{
  "success": true,
  "message": "Encarregado excluído permanentemente com sucesso",
  "tipo": "hard_delete"
}
```

### Cascade Delete (Aluno)
```json
{
  "success": true,
  "message": "Aluno e todas as dependências excluídos com sucesso",
  "tipo": "cascade_delete",
  "detalhes": {
    "confirmacoes": 2,
    "notasCredito": 1,
    "pagamentos": 15,
    "pagamentosPrincipais": 10,
    "servicos": 3,
    "transferencias": 0,
    "matricula": 1,
    "encarregadoExcluido": true
  },
  "info": "Exclusão em cascata: todas as dependências do aluno foram removidas de forma segura."
}
```

### Cascade Delete (Matrícula com confirmações)
```json
{
  "success": true,
  "message": "Matrícula e confirmações excluídas com sucesso",
  "tipo": "cascade_delete",
  "detalhes": {
    "confirmacoes": 3
  },
  "info": "Exclusão em cascata: matrícula e confirmações removidas."
}
```

### Hard Delete (Confirmação)
```json
{
  "success": true,
  "message": "Confirmação excluída com sucesso",
  "tipo": "hard_delete",
  "detalhes": {
    "alunoNome": "João Silva",
    "eraUltimaConfirmacao": true
  },
  "info": "Esta era a última confirmação da matrícula"
}
```

### Hard Delete (Transferência recente)
```json
{
  "success": true,
  "message": "Transferência excluída com sucesso",
  "tipo": "hard_delete",
  "detalhes": {
    "alunoNome": "Maria Santos",
    "diasDesdeTransferencia": 3,
    "dataTransferencia": "2025-10-21"
  },
  "info": "Esta transferência foi realizada recentemente"
}
```

### Soft Delete (Proveniência)
```json
{
  "success": true,
  "message": "Proveniência desativada com sucesso",
  "tipo": "soft_delete"
}
```

---

## � Resumo de Implementação por Entidade

| Entidade | Técnica | Motivo | Status |
|----------|---------|--------|--------|
| **Encarregado** | Soft Delete (com alunos)<br>Hard Delete (sem alunos) | Preservar histórico quando há dependências | ✅ Implementado |
| **Aluno** | Cascade Delete | Remover todas as dependências em cadeia | ✅ Implementado |
| **Matrícula** | Cascade Delete (com confirmações)<br>Hard Delete (sem confirmações) | Limpar confirmações relacionadas | ✅ Implementado |
| **Confirmação** | Hard Delete com validação | Avisar se é última confirmação | ✅ Implementado |
| **Transferência** | Hard Delete com validação | Avisar se é transferência recente | ✅ Implementado |
| **Proveniência** | Soft Delete (com status)<br>Hard Delete (sem status) | Configuração importante | ✅ Implementado |

### Detalhamento por Entidade

#### 1. **Encarregado** (`deleteEncarregado`)
- **Com alunos associados**: Soft Delete (status = 0)
- **Sem alunos**: Hard Delete
- **Dependências**: tb_alunos
- **Retorno**: Informa quantos alunos estão associados

#### 2. **Aluno** (`deleteAluno`)
- **Sempre**: Cascade Delete em transação
- **Ordem de exclusão**:
  1. Confirmações (via matrícula)
  2. Notas de crédito
  3. Pagamentos secundários
  4. Pagamentos principais
  5. Serviços do aluno
  6. Transferências
  7. Matrícula
  8. Aluno
  9. Encarregado (se órfão)
- **Retorno**: Detalhes de tudo que foi excluído

#### 3. **Matrícula** (`deleteMatricula`)
- **Com confirmações**: Cascade Delete em transação
- **Sem confirmações**: Hard Delete
- **Dependências**: tb_confirmacoes
- **Retorno**: Quantidade de confirmações excluídas

#### 4. **Confirmação** (`deleteConfirmacao`)
- **Sempre**: Hard Delete
- **Validação**: Avisa se é a última confirmação da matrícula
- **Retorno**: Nome do aluno e se era última confirmação

#### 5. **Transferência** (`deleteTransferencia`)
- **Sempre**: Hard Delete
- **Validação**: Avisa se foi realizada nos últimos 7 dias
- **Retorno**: Dados da transferência e há quantos dias foi feita

#### 6. **Proveniência** (`deleteProveniencia`)
- **Com campo status**: Soft Delete (codigoStatus = 0)
- **Sem campo status**: Hard Delete
- **Dependências**: Nenhuma direta
- **Retorno**: Tipo de exclusão realizada

---

## �🔒 Integridade e Segurança

### Transações ACID
Todas as operações de exclusão em cascata são envolvidas em **transações Prisma**:
```javascript
await prisma.$transaction(async (tx) => {
  // Todas as operações aqui
  // Se uma falhar, TODAS são revertidas
});
```

#### Propriedades ACID:
- **A**tomicidade: Tudo ou nada
- **C**onsistência: Banco sempre em estado válido
- **I**solamento: Operações isoladas
- **D**urabilidade: Mudanças permanentes após commit

### Logs Detalhados
Todas as operações geram logs para auditoria:
```
[DELETE ALUNO] Iniciando exclusão em cascata do aluno 123
[DELETE ALUNO] ✓ Excluídas 2 confirmações
[DELETE ALUNO] ✓ Excluídas 1 notas de crédito
[DELETE ALUNO] ✓ Excluídos 15 pagamentos secundários
...
[DELETE ALUNO] ✓ Exclusão em cascata concluída com sucesso
```

---

## 🛠️ Manutenção e Evolução

### Adicionar Soft Delete em outras tabelas

1. **Adicionar campo `status` na tabela** (se não existir):
```prisma
model tb_exemplo {
  codigo Int @id
  nome   String
  status Int @default(1)  // 1 = ativo, 0 = inativo
}
```

2. **Modificar método de exclusão**:
```javascript
static async deleteExemplo(id) {
  // Verificar dependências
  const temDependencias = await verificarDependencias(id);
  
  if (temDependencias) {
    // Soft delete
    await prisma.tb_exemplo.update({
      where: { codigo: id },
      data: { status: 0 }
    });
    return { tipo: 'soft_delete' };
  } else {
    // Hard delete
    await prisma.tb_exemplo.delete({
      where: { codigo: id }
    });
    return { tipo: 'hard_delete' };
  }
}
```

3. **Filtrar registros ativos nas consultas**:
```javascript
const ativos = await prisma.tb_exemplo.findMany({
  where: { status: 1 }  // Apenas ativos
});
```

---

## 📚 Referências e Boas Práticas

### Quando usar cada técnica:

| Técnica | Usar quando |
|---------|-------------|
| **Soft Delete** | - Dados têm valor histórico<br>- Pode precisar restaurar<br>- Auditoria obrigatória<br>- Tem dependências complexas |
| **Hard Delete** | - Direito ao esquecimento (LGPD)<br>- Dados sensíveis<br>- Otimização de espaço<br>- Sem valor histórico |
| **Cascade Delete** | - Dados sem valor isolado<br>- Forte relacionamento<br>- Integridade crítica<br>- Dados temporários |

### Recomendações:
1. ✅ **Sempre use transações** para operações complexas
2. ✅ **Registre logs** de todas as exclusões
3. ✅ **Confirme com usuário** antes de excluir
4. ✅ **Implemente backups** automáticos
5. ✅ **Teste em ambiente de desenvolvimento** primeiro
6. ✅ **Documente** todas as dependências

---

## 🧪 Testes Recomendados

### Testar Soft Delete
```bash
# Excluir encarregado com alunos
DELETE /api/student-management/encarregados/:id

# Verificar que status = 0
GET /api/student-management/encarregados/:id

# Alunos ainda devem estar vinculados
GET /api/student-management/alunos?encarregado=:id
```

### Testar Cascade Delete
```bash
# Excluir aluno com todas as dependências
DELETE /api/student-management/alunos/:id

# Verificar que todas as dependências foram excluídas
# (deve retornar 404 ou array vazio)
```

---

## 📞 Suporte

Para dúvidas sobre implementação:
- Consulte o código em: `src/services/student-management.services.js`
- Métodos: `deleteEncarregado()` e `deleteAluno()`

---

**Última atualização:** 24 de outubro de 2025
**Desenvolvedor:** Sistema JoMorais
