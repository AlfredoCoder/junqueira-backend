/**
 * @swagger
 * components:
 *   schemas:
 *     FormaPagamento:
 *       type: object
 *       properties:
 *         codigo:
 *           type: integer
 *           description: "ID da forma de pagamento"
 *         designacao:
 *           type: string
 *           description: "Nome da forma de pagamento"
 *     PagamentoPrincipal:
 *       type: object
 *       properties:
 *         codigo:
 *           type: integer
 *           description: "ID do pagamento principal"
 *         data:
 *           type: string
 *           format: date
 *           description: "Data do pagamento"
 *         codigo_Aluno:
 *           type: integer
 *           description: ID do aluno
 *         status:
 *           type: integer
 *           description: Status do pagamento
 *         total:
 *           type: number
 *           description: Valor total
 *         valorEntregue:
 *           type: number
 *           description: Valor entregue
 *         dataBanco:
 *           type: string
 *           format: date
 *           description: Data do banco
 *         totalDesconto:
 *           type: number
 *           description: Total de desconto
 *         obs:
 *           type: string
 *           description: Observações
 *     
 *     DetalhePagamento:
 *       type: object
 *       properties:
 *         codigo:
 *           type: integer
 *           description: ID do detalhe de pagamento
 *         codigo_Aluno:
 *           type: integer
 *           description: ID do aluno
 *         codigo_Tipo_Servico:
 *           type: integer
 *           description: ID do tipo de serviço
 *         data:
 *           type: string
 *           format: date
 *           description: Data do pagamento
 *         n_Bordoro:
 *           type: string
 *           description: Número do borderô
 *         multa:
 *           type: number
 *           description: Valor da multa
 *         mes:
 *           type: string
 *           description: Mês de referência
 *         codigo_Utilizador:
 *           type: integer
 *           description: ID do utilizador
 *         observacao:
 *           type: string
 *           description: Observação
 *         ano:
 *           type: integer
 *           description: Ano de referência
 *         contaMovimentada:
 *           type: string
 *           description: Conta movimentada
 *         quantidade:
 *           type: integer
 *           description: Quantidade
 *         desconto:
 *           type: number
 *           description: Desconto aplicado
 *         totalgeral:
 *           type: number
 *           description: Total geral
 *         codigoPagamento:
 *           type: integer
 *           description: ID do pagamento principal
 *         tipoDocumento:
 *           type: string
 *           description: Tipo de documento
 *         fatura:
 *           type: string
 *           description: Número da fatura
 *         hash:
 *           type: string
 *           description: Hash do pagamento
 *         preco:
 *           type: number
 *           description: Preço unitário
 *     
 *     NotaCredito:
 *       type: object
 *       properties:
 *         codigo:
 *           type: integer
 *           description: ID da nota de crédito
 *         designacao:
 *           type: string
 *           description: Designação da nota
 *         fatura:
 *           type: string
 *           description: Número da fatura
 *         descricao:
 *           type: string
 *           description: Descrição da nota
 *         valor:
 *           type: string
 *           description: Valor da nota
 *         codigo_aluno:
 *           type: integer
 *           description: ID do aluno
 *         documento:
 *           type: string
 *           description: Número do documento
 *     
 *     MotivoAnulacao:
 *       type: object
 *       properties:
 *         codigo:
 *           type: integer
 *           description: ID do motivo
 *         designacao:
 *           type: string
 *           description: Descrição do motivo
 *     
 *     RelatorioFinanceiro:
 *       type: object
 *       properties:
 *         totalPagamentos:
 *           type: integer
 *           description: Total de pagamentos
 *         totalValor:
 *           type: number
 *           description: Valor total
 *         totalDesconto:
 *           type: number
 *           description: Total de descontos
 *         valorLiquido:
 *           type: number
 *           description: Valor líquido
 *     
 *     DashboardFinanceiro:
 *       type: object
 *       properties:
 *         resumo:
 *           type: object
 *           properties:
 *             totalPagamentosHoje:
 *               type: integer
 *             totalPagamentosMes:
 *               type: integer
 *             valorTotalMes:
 *               type: number
 *         formasPagamentoMaisUsadas:
 *           type: array
 *           items:
 *             type: object
 *         servicosMaisPagos:
 *           type: array
 *           items:
 *             type: object
 *   
 *   tags:
 *     - name: Gestão de Pagamentos - Formas de Pagamento
 *       description: "Operações relacionadas às formas de pagamento"
 *     - name: Gestão de Pagamentos - Pagamentos Principais
 *       description: "Operações relacionadas aos pagamentos principais"
 *     - name: Gestão de Pagamentos - Detalhes de Pagamento
 *       description: "Operações relacionadas aos detalhes de pagamento"
 *     - name: Gestão de Pagamentos - Notas de Crédito
 *       description: "Operações relacionadas às notas de crédito"
 *     - name: Gestão de Pagamentos - Motivos de Anulação
 *       description: "Operações relacionadas aos motivos de anulação"
 *     - name: Gestão de Pagamentos - Relatórios
 *       description: "Relatórios e dashboards financeiros"
 */

import express from 'express';
import { PaymentManagementController } from '../controller/payment-management.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import prisma from '../config/database.js';

const router = express.Router();

// ===============================
// FORMAS DE PAGAMENTO
// ===============================

/**
 * @swagger
 * /api/payment-management/formas-pagamento:
 *   post:
 *     summary: Criar forma de pagamento
 *     tags: [Gestão de Pagamentos - Formas de Pagamento]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - designacao
 *             properties:
 *               designacao:
 *                 type: string
 *                 maxLength: 45
 *                 example: "Dinheiro"
 *     responses:
 *       201:
 *         description: Forma de pagamento criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Forma de pagamento criada com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/FormaPagamento'
 *   get:
 *     summary: Listar formas de pagamento
 *     tags: [Gestão de Pagamentos - Formas de Pagamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Limite por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por designação
 *     responses:
 *       200:
 *         description: Lista de formas de pagamento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FormaPagamento'
 *                 pagination:
 *                   type: object
 */
router.post('/formas-pagamento', PaymentManagementController.createFormaPagamento);
router.get('/formas-pagamento', PaymentManagementController.getFormasPagamento);

/**
 * @swagger
 * /api/payment-management/formas-pagamento/{id}:
 *   get:
 *     summary: Buscar forma de pagamento por ID
 *     tags: [Gestão de Pagamentos - Formas de Pagamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da forma de pagamento
 *     responses:
 *       200:
 *         description: Forma de pagamento encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/FormaPagamento'
 *   put:
 *     summary: Atualizar forma de pagamento
 *     tags: [Gestão de Pagamentos - Formas de Pagamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da forma de pagamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               designacao:
 *                 type: string
 *                 maxLength: 45
 *     responses:
 *       200:
 *         description: Forma de pagamento atualizada
 *   delete:
 *     summary: Excluir forma de pagamento
 *     tags: [Gestão de Pagamentos - Formas de Pagamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da forma de pagamento
 *     responses:
 *       200:
 *         description: Forma de pagamento excluída
 */
router.get('/formas-pagamento/:id', PaymentManagementController.getFormaPagamentoById);
router.put('/formas-pagamento/:id', PaymentManagementController.updateFormaPagamento);
router.delete('/formas-pagamento/:id', PaymentManagementController.deleteFormaPagamento);

// ===============================
// PAGAMENTOS PRINCIPAIS
// ===============================

/**
 * @swagger
 * /api/payment-management/pagamentos-principais:
 *   post:
 *     summary: Criar pagamento principal
 *     tags: [Gestão de Pagamentos - Pagamentos Principais]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - data
 *               - codigo_Aluno
 *               - status
 *               - valorEntregue
 *               - dataBanco
 *             properties:
 *               data:
 *                 type: string
 *                 format: date
 *                 description: Data do pagamento
 *                 example: "2024-01-15"
 *               codigo_Aluno:
 *                 type: integer
 *                 description: Código do aluno
 *                 example: 123
 *               status:
 *                 type: integer
 *                 description: Status do pagamento (1=Ativo, 2=Cancelado, etc)
 *                 example: 1
 *               total:
 *                 type: number
 *                 description: Valor total do pagamento
 *                 example: 15000
 *               valorEntregue:
 *                 type: number
 *                 description: Valor entregue pelo cliente
 *                 example: 15000
 *               dataBanco:
 *                 type: string
 *                 format: date
 *                 description: Data de processamento no banco
 *                 example: "2024-01-15"
 *               totalDesconto:
 *                 type: number
 *                 description: Total de desconto aplicado
 *                 default: 0
 *                 example: 500
 *               obs:
 *                 type: string
 *                 maxLength: 200
 *                 description: Observações do pagamento
 *                 example: "Pagamento referente à matrícula"
 *               borderoux:
 *                 type: string
 *                 maxLength: 200
 *                 description: Número do borderô
 *                 example: "BRD-2024-001"
 *               saldoAnterior:
 *                 type: number
 *                 description: Saldo anterior do aluno
 *                 default: 0
 *                 example: 0
 *               descontoSaldo:
 *                 type: number
 *                 description: Desconto aplicado no saldo
 *                 default: 0
 *                 example: 0
 *               saldo:
 *                 type: number
 *                 description: Saldo atual após pagamento
 *                 default: 0
 *                 example: 0
 *               codigoPagamento:
 *                 type: integer
 *                 description: Código de referência do pagamento
 *                 default: 0
 *                 example: 0
 *               saldoOperacao:
 *                 type: number
 *                 description: Saldo da operação
 *                 default: 0
 *                 example: 0
 *               codigoUtilizador:
 *                 type: integer
 *                 description: Código do utilizador que registrou o pagamento
 *                 example: 1
 *               hash:
 *                 type: string
 *                 maxLength: 1000
 *                 description: Hash de segurança do pagamento
 *                 example: "a1b2c3d4e5f6..."
 *               tipoDocumento:
 *                 type: string
 *                 maxLength: 50
 *                 description: Tipo de documento (Recibo, Fatura, etc)
 *                 example: "Recibo"
 *               totalIva:
 *                 type: number
 *                 description: Total de IVA
 *                 example: 2100
 *               nifCliente:
 *                 type: string
 *                 maxLength: 50
 *                 description: NIF do cliente
 *                 example: "123456789"
 *               troco:
 *                 type: number
 *                 description: Troco a devolver ao cliente
 *                 example: 0
 *     responses:
 *       201:
 *         description: Pagamento principal criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Pagamento principal criado com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     codigo:
 *                       type: integer
 *                       example: 1
 *                     data:
 *                       type: string
 *                       format: date
 *                     codigo_Aluno:
 *                       type: integer
 *                     status:
 *                       type: integer
 *                     total:
 *                       type: number
 *                     valorEntregue:
 *                       type: number
 *                     dataBanco:
 *                       type: string
 *                       format: date
 *                     totalDesconto:
 *                       type: number
 *                     obs:
 *                       type: string
 *                     borderoux:
 *                       type: string
 *                     saldoAnterior:
 *                       type: number
 *                     descontoSaldo:
 *                       type: number
 *                     saldo:
 *                       type: number
 *                     codigoPagamento:
 *                       type: integer
 *                     saldoOperacao:
 *                       type: number
 *                     codigoUtilizador:
 *                       type: integer
 *                     hash:
 *                       type: string
 *                     tipoDocumento:
 *                       type: string
 *                     totalIva:
 *                       type: number
 *                     nifCliente:
 *                       type: string
 *                     troco:
 *                       type: number
 *                     tb_pagamentos:
 *                       type: array
 *                       items:
 *                         type: object
 *                     tb_nota_credito:
 *                       type: array
 *                       items:
 *                         type: object
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Aluno ou utilizador não encontrado
 *       500:
 *         description: Erro interno do servidor
 *   get:
 *     summary: Listar pagamentos principais
 *     tags: [Gestão de Pagamentos - Pagamentos Principais]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: codigo_Aluno
 *         schema:
 *           type: integer
 *         description: Filtrar por aluno
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Data início (YYYY-MM-DD)
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date
 *         description: Data fim (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de pagamentos principais
 */
router.post('/pagamentos-principais', PaymentManagementController.createPagamentoi);
router.get('/pagamentos-principais', PaymentManagementController.getPagamentois);

/**
 * @swagger
 * /api/payment-management/pagamentos-principais/{id}:
 *   get:
 *     summary: Buscar pagamento principal por ID
 *     tags: [Gestão de Pagamentos - Pagamentos Principais]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pagamento principal encontrado
 *   put:
 *     summary: Atualizar pagamento principal
 *     tags: [Gestão de Pagamentos - Pagamentos Principais]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pagamento principal atualizado
 *   delete:
 *     summary: Excluir pagamento principal
 *     tags: [Gestão de Pagamentos - Pagamentos Principais]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pagamento principal excluído
 */
router.get('/pagamentos-principais/:id', PaymentManagementController.getPagamentoiById);
router.put('/pagamentos-principais/:id', PaymentManagementController.updatePagamentoi);
router.delete('/pagamentos-principais/:id', PaymentManagementController.deletePagamentoi);

// ===============================
// DETALHES DE PAGAMENTO
// ===============================

/**
 * @swagger
 * /api/payment-management/pagamentos:
 *   post:
 *     summary: Criar detalhe de pagamento
 *     tags: [Gestão de Pagamentos - Detalhes de Pagamento]
 *     security:
 *       - bearerAuth: []
 *   get:
 *     summary: Listar detalhes de pagamento
 *     tags: [Gestão de Pagamentos - Detalhes de Pagamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nome do aluno, documento ou número da fatura
 *       - in: query
 *         name: codigo_Aluno
 *         schema:
 *           type: integer
 *         description: Filtrar por aluno
 *       - in: query
 *         name: codigo_Tipo_Servico
 *         schema:
 *           type: integer
 *         description: Filtrar por tipo de serviço (código)
 *       - in: query
 *         name: tipo_servico
 *         schema:
 *           type: string
 *           enum: [propina, outros]
 *         description: Filtrar por tipo de serviço (propina ou outros)
 */
router.post('/pagamentos', PaymentManagementController.createPagamento);
router.get('/pagamentos', PaymentManagementController.getPagamentos);

/**
 * @swagger
 * /api/payment-management/faturas:
 *   get:
 *     summary: Lista faturas (alias para pagamentos)
 *     tags: [Payment Management]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Lista de faturas
 */
router.get('/faturas', PaymentManagementController.getPagamentos);

/**
 * @swagger
 * /api/payment-management/pagamentos/{id}:
 *   get:
 *     summary: Buscar detalhe de pagamento por ID
 *     tags: [Gestão de Pagamentos - Detalhes de Pagamento]
 *     security:
 *       - bearerAuth: []
 *   put:
 *     summary: Atualizar detalhe de pagamento
 *     tags: [Gestão de Pagamentos - Detalhes de Pagamento]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Excluir detalhe de pagamento
 *     tags: [Gestão de Pagamentos - Detalhes de Pagamento]
 *     security:
 *       - bearerAuth: []
 */
router.get('/pagamentos/:id', PaymentManagementController.getPagamentoById);
router.put('/pagamentos/:id', PaymentManagementController.updatePagamento);
router.delete('/pagamentos/:id', PaymentManagementController.deletePagamento);

// ===============================
// NOTAS DE CRÉDITO
// ===============================

/**
 * @swagger
 * /api/payment-management/notas-credito:
 *   post:
 *     summary: Criar nota de crédito
 *     tags: [Gestão de Pagamentos - Notas de Crédito]
 *     security:
 *       - bearerAuth: []
 *   get:
 *     summary: Listar notas de crédito
 *     tags: [Gestão de Pagamentos - Notas de Crédito]
 *     security:
 *       - bearerAuth: []
 */
// Rota de teste primeiro
router.post('/notas-credito/test', PaymentManagementController.testNotaCredito);

// Rotas principais
router.post('/notas-credito', PaymentManagementController.createNotaCredito);
router.get('/notas-credito', PaymentManagementController.getNotasCredito);
router.get('/notas-credito/:id', PaymentManagementController.getNotaCreditoById);
router.put('/notas-credito/:id', PaymentManagementController.updateNotaCredito);
router.delete('/notas-credito/:id', PaymentManagementController.deleteNotaCredito);

// ===============================
// MOTIVOS DE ANULAÇÃO
// ===============================

/**
 * @swagger
 * /api/payment-management/motivos-anulacao:
 *   post:
 *     summary: Criar motivo de anulação
 *     tags: [Gestão de Pagamentos - Motivos de Anulação]
 *     security:
 *       - bearerAuth: []
 *   get:
 *     summary: Listar motivos de anulação
 *     tags: [Gestão de Pagamentos - Motivos de Anulação]
 *     security:
 *       - bearerAuth: []
 */
router.post('/motivos-anulacao', PaymentManagementController.createMotivoAnulacao);
router.get('/motivos-anulacao', PaymentManagementController.getMotivosAnulacao);

/**
 * @swagger
 * /api/payment-management/motivos-anulacao/{id}:
 *   get:
 *     summary: Buscar motivo de anulação por ID
 *     tags: [Gestão de Pagamentos - Motivos de Anulação]
 *     security:
 *       - bearerAuth: []
 *   put:
 *     summary: Atualizar motivo de anulação
 *     tags: [Gestão de Pagamentos - Motivos de Anulação]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Excluir motivo de anulação
 *     tags: [Gestão de Pagamentos - Motivos de Anulação]
 *     security:
 *       - bearerAuth: []
 */
router.get('/motivos-anulacao/:id', PaymentManagementController.getMotivoAnulacaoById);
router.put('/motivos-anulacao/:id', PaymentManagementController.updateMotivoAnulacao);
router.delete('/motivos-anulacao/:id', PaymentManagementController.deleteMotivoAnulacao);

// ===============================
// RELATÓRIOS E DASHBOARDS
// ===============================

/**
 * @swagger
 * /api/payment-management/relatorio:
 *   get:
 *     summary: Gerar relatório financeiro
 *     tags: [Gestão de Pagamentos - Relatórios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dataInicio
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Data início (YYYY-MM-DD)
 *         example: "2024-01-01"
 *       - in: query
 *         name: dataFim
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Data fim (YYYY-MM-DD)
 *         example: "2024-12-31"
 *       - in: query
 *         name: tipoRelatorio
 *         schema:
 *           type: string
 *           enum: [resumo, detalhado, por_aluno, por_servico]
 *           default: resumo
 *         description: Tipo de relatório
 *       - in: query
 *         name: codigo_Aluno
 *         schema:
 *           type: integer
 *         description: Filtrar por aluno específico
 *       - in: query
 *         name: codigo_FormaPagamento
 *         schema:
 *           type: integer
 *         description: Filtrar por forma de pagamento
 *     responses:
 *       200:
 *         description: Relatório financeiro gerado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Relatório financeiro gerado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/RelatorioFinanceiro'
 *                 filtros:
 *                   type: object
 */
router.get('/relatorio', PaymentManagementController.getRelatorioFinanceiro);

/**
 * @swagger
 * /api/payment-management/dashboard:
 *   get:
 *     summary: Obter dashboard financeiro
 *     tags: [Gestão de Pagamentos - Relatórios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard financeiro
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Dashboard financeiro obtido com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/DashboardFinanceiro'
 */
router.get('/dashboard', PaymentManagementController.getDashboardFinanceiro);

/**
 * @swagger
 * /api/payment-management/estatisticas:
 *   get:
 *     summary: Obter estatísticas de pagamentos
 *     tags: [Gestão de Pagamentos - Relatórios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: periodo
 *         description: "Período em dias (ex: 30, 60, 90)"
 *         schema:
 *           type: string
 *           default: "30"
 *         example: "30"
 *     responses:
 *       200:
 *         description: Estatísticas de pagamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Estatísticas de pagamentos obtidas com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     periodo:
 *                       type: string
 *                       example: "30 dias"
 *                     estatisticas:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           data:
 *                             type: string
 *                             format: date
 *                           totalPagamentos:
 *                             type: integer
 *                           valorTotal:
 *                             type: number
 */
router.get('/estatisticas', PaymentManagementController.getEstatisticasPagamentos);

// ===============================
// ALUNOS CONFIRMADOS
// ===============================

/**
 * @swagger
 * /api/payment-management/alunos-confirmados:
 *   get:
 *     summary: Buscar alunos confirmados para pagamentos
 *     tags: [Gestão de Pagamentos - Alunos]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nome ou documento
 *     responses:
 *       200:
 *         description: Lista de alunos confirmados
 */
router.get('/alunos-confirmados', async (req, res) => {
  try {
    const { search = '', page = 1, limit = 50 } = req.query;
    
    console.log('🔍 Buscando alunos confirmados com confirmação mais recente');
    
    // Buscar confirmações mais recentes por aluno
    const confirmacoes = await prisma.tb_confirmacoes.findMany({
      include: {
        tb_matriculas: {
          include: {
            tb_alunos: true
          }
        },
        tb_turmas: {
          include: {
            tb_classes: true,
            tb_cursos: true
          }
        }
      },
      orderBy: {
        codigo: 'desc'
      }
    });

    // Agrupar por aluno e pegar apenas a confirmação mais recente de cada um
    const alunosMap = new Map();
    confirmacoes.forEach(confirmacao => {
      const alunoId = confirmacao.tb_matriculas.tb_alunos.codigo;
      if (!alunosMap.has(alunoId)) {
        alunosMap.set(alunoId, confirmacao);
      }
    });

    console.log(`📊 Encontrados ${alunosMap.size} alunos com confirmações mais recentes`);

    // Mapear dados usando APENAS a confirmação mais recente de cada aluno
    let alunosConfirmados = Array.from(alunosMap.values())
      .map(confirmacao => {
        const aluno = confirmacao.tb_matriculas.tb_alunos;
        
        return {
          codigo: aluno.codigo,
          nome: aluno.nome,
          n_documento_identificacao: aluno.n_documento_identificacao,
          email: aluno.email,
          telefone: aluno.telefone,
          dadosAcademicos: {
            classe: confirmacao.tb_turmas.tb_classes.designacao,
            curso: confirmacao.tb_turmas.tb_cursos.designacao,
            turma: confirmacao.tb_turmas.designacao,
            codigo_Classe: confirmacao.tb_turmas.tb_classes.codigo,
            codigo_Curso: confirmacao.tb_turmas.tb_cursos.codigo,
            codigo_Turma: confirmacao.tb_turmas.codigo,
            confirmacao_codigo: confirmacao.codigo
          }
        };
      });

    // Filtrar por busca se fornecida
    if (search) {
      alunosConfirmados = alunosConfirmados.filter(aluno => 
        aluno.nome.toLowerCase().includes(search.toLowerCase()) ||
        aluno.n_documento_identificacao.includes(search)
      );
    }

    console.log(`✅ Retornando ${alunosConfirmados.length} alunos com confirmações mais recentes`);

    res.json({
      success: true,
      message: "Alunos confirmados obtidos com sucesso",
      data: alunosConfirmados,
      pagination: {
        currentPage: parseInt(page),
        totalPages: 1,
        totalItems: alunosConfirmados.length,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('❌ Erro ao buscar alunos confirmados:', error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar alunos confirmados"
    });
  }
});

// Rota para buscar tipos de serviços compatíveis com aluno
router.get('/tipos-servicos-compatibles/:alunoId', async (req, res) => {
  try {
    const { alunoId } = req.params;
    const { categoria } = req.query;
    
    if (!categoria) {
      return res.status(400).json({
        success: false,
        message: "Categoria é obrigatória"
      });
    }

    console.log(`🔍 Buscando serviços para categoria ${categoria}`);

    // Primeiro, verificar se existem serviços gerais nesta categoria
    const servicosGerais = await prisma.tb_tipo_servicos.findMany({
      where: {
        status: "Activo",
        categoria: parseInt(categoria),
        codigo_Classe: null,
        codigo_Curso: null
      },
      orderBy: { designacao: 'asc' }
    });

    console.log(`📦 Encontrados ${servicosGerais.length} serviços gerais na categoria ${categoria}`);

    // Se há serviços gerais, retornar apenas eles (não precisa buscar dados do aluno)
    if (servicosGerais.length > 0) {
      console.log('✅ Retornando serviços gerais (sem restrições de classe/curso)');
      
      return res.json({
        success: true,
        message: `Encontrados ${servicosGerais.length} tipos de serviços compatíveis`,
        data: {
          tiposServicos: servicosGerais,
          alunoInfo: {
            nome: 'Serviços gerais - não requer dados acadêmicos',
            tipo: 'geral'
          },
          filtros: {
            categoria: parseInt(categoria),
            tipo: 'geral'
          }
        }
      });
    }

    // Se não há serviços gerais, buscar serviços específicos por classe/curso
    console.log(`🎓 Não há serviços gerais. Buscando serviços específicos para aluno ${alunoId}`);

    // Buscar dados acadêmicos do aluno através da confirmação mais recente
    const confirmacao = await prisma.tb_confirmacoes.findFirst({
      where: {
        tb_matriculas: {
          codigo_Aluno: parseInt(alunoId)
        }
      },
      include: {
        tb_matriculas: {
          include: {
            tb_alunos: true
          }
        },
        tb_turmas: {
          include: {
            tb_classes: true,
            tb_cursos: true
          }
        }
      },
      orderBy: {
        codigo: 'desc' // Pegar a confirmação mais recente
      }
    });

    if (!confirmacao) {
      console.log(`❌ Nenhuma confirmação encontrada para aluno ${alunoId}`);
      return res.status(404).json({
        success: false,
        message: "Aluno não encontrado ou não confirmado"
      });
    }

    console.log(`✅ Confirmação encontrada:`, {
      confirmacao: confirmacao.codigo,
      aluno: confirmacao.tb_matriculas.tb_alunos.nome,
      classe: confirmacao.tb_turmas.tb_classes.designacao,
      curso: confirmacao.tb_turmas.tb_cursos.designacao,
      turma: confirmacao.tb_turmas.designacao
    });

    // Buscar serviços específicos para classe/curso do aluno
    const servicosEspecificos = await prisma.tb_tipo_servicos.findMany({
      where: {
        status: "Activo",
        categoria: parseInt(categoria),
        OR: [
          // Serviços específicos para a classe do aluno
          {
            codigo_Classe: confirmacao.tb_turmas.tb_classes.codigo,
            codigo_Curso: null
          },
          // Serviços específicos para o curso do aluno
          {
            codigo_Classe: null,
            codigo_Curso: confirmacao.tb_turmas.tb_cursos.codigo
          },
          // Serviços específicos para classe E curso do aluno
          {
            codigo_Classe: confirmacao.tb_turmas.tb_classes.codigo,
            codigo_Curso: confirmacao.tb_turmas.tb_cursos.codigo
          }
        ]
      },
      orderBy: [
        // Priorizar serviços específicos para classe+curso
        { codigo_Classe: 'desc' },
        { codigo_Curso: 'desc' },
        { designacao: 'asc' }
      ]
    });

    console.log(`📋 Encontrados ${servicosEspecificos.length} serviços específicos para categoria ${categoria}`);
    
    // Se for categoria 1 (Propinas) e não encontrar nada, sugerir criar
    if (categoria === '1' && servicosEspecificos.length === 0) {
      console.log('⚠️ Nenhuma propina encontrada para esta classe/curso');
    }

    res.json({
      success: true,
      message: `Encontrados ${servicosEspecificos.length} tipos de serviços compatíveis`,
      data: {
        tiposServicos: servicosEspecificos,
        alunoInfo: {
          nome: confirmacao.tb_matriculas?.tb_alunos?.nome || 'Nome não encontrado',
          classe: confirmacao.tb_turmas.tb_classes.designacao,
          curso: confirmacao.tb_turmas.tb_cursos.designacao,
          turma: confirmacao.tb_turmas.designacao,
          codigoClasse: confirmacao.tb_turmas.tb_classes.codigo,
          codigoCurso: confirmacao.tb_turmas.tb_cursos.codigo,
          tipo: 'especifico'
        },
        filtros: {
          categoria: parseInt(categoria),
          codigoClasse: confirmacao.tb_turmas.tb_classes.codigo,
          codigoCurso: confirmacao.tb_turmas.tb_cursos.codigo,
          tipo: 'especifico'
        }
      }
    });
  } catch (error) {
    console.error('❌ Erro ao buscar tipos de serviços compatíveis:', error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar tipos de serviços compatíveis"
    });
  }
});

// Rota para buscar categorias de tipos de serviços
router.get('/categorias-servicos', async (req, res) => {
  try {
    // Buscar todas as categorias únicas dos tipos de serviços cadastrados
    const categoriasExistentes = await prisma.tb_tipo_servicos.findMany({
      where: {
        status: "Activo",
        categoria: {
          not: null
        }
      },
      select: {
        categoria: true
      },
      distinct: ['categoria']
    });

    console.log('Categorias encontradas na base:', categoriasExistentes);

    // Criar mapeamento das categorias encontradas
    const categoriasFormatadas = categoriasExistentes.map(item => ({
      codigo: item.categoria,
      designacao: getCategoriaName(item.categoria),
      requerMeses: getCategoriaRequerMeses(item.categoria)
    })).sort((a, b) => a.codigo - b.codigo);

    // Se não houver categorias na base, usar categorias padrão
    if (categoriasFormatadas.length === 0) {
      const categoriasDefault = [
        { codigo: 1, designacao: "Propinas", requerMeses: true },
        { codigo: 2, designacao: "Taxas Acadêmicas", requerMeses: false },
        { codigo: 3, designacao: "Serviços Extras", requerMeses: false },
        { codigo: 4, designacao: "Multas e Penalidades", requerMeses: false },
        { codigo: 5, designacao: "Certificados e Documentos", requerMeses: false }
      ];
      
      console.log('Usando categorias padrão:', categoriasDefault);
      
      res.json({
        success: true,
        message: "Categorias padrão retornadas",
        data: categoriasDefault
      });
    } else {
      console.log('Categorias formatadas:', categoriasFormatadas);
      
      res.json({
        success: true,
        message: "Categorias de serviços encontradas",
        data: categoriasFormatadas
      });
    }
  } catch (error) {
    console.error('❌ Erro ao buscar categorias:', error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar categorias de serviços"
    });
  }
});

// Rota para buscar propina automática baseada na confirmação mais recente
router.get('/aluno/:alunoId/propina-automatica', async (req, res) => {
  try {
    const { alunoId } = req.params;

    console.log(`🎯 Buscando propina automática para aluno ${alunoId}`);

    // Buscar confirmação mais recente do aluno
    const confirmacao = await prisma.tb_confirmacoes.findFirst({
      where: {
        tb_matriculas: {
          codigo_Aluno: parseInt(alunoId)
        }
      },
      include: {
        tb_matriculas: {
          include: {
            tb_alunos: true
          }
        },
        tb_turmas: {
          include: {
            tb_classes: true,
            tb_cursos: true
          }
        }
      },
      orderBy: {
        codigo: 'desc' // Confirmação mais recente
      }
    });

    if (!confirmacao) {
      return res.status(404).json({
        success: false,
        message: "Aluno não encontrado ou não confirmado"
      });
    }

    const codigoClasse = confirmacao.tb_turmas.tb_classes.codigo;
    const codigoCurso = confirmacao.tb_turmas.tb_cursos.codigo;

    console.log(`📚 Dados da confirmação mais recente:`, {
      aluno: confirmacao.tb_matriculas.tb_alunos.nome,
      classe: confirmacao.tb_turmas.tb_classes.designacao,
      curso: confirmacao.tb_turmas.tb_cursos.designacao,
      codigoClasse,
      codigoCurso
    });

    // Buscar propina (categoria 1) em ordem de prioridade
    let propinaSelecionada = null;
    let tipoCompatibilidade = '';

    // 1. Buscar propina específica para classe E curso
    propinaSelecionada = await prisma.tb_tipo_servicos.findFirst({
      where: {
        status: "Activo",
        categoria: 1, // Categoria propinas
        codigo_Classe: codigoClasse,
        codigo_Curso: codigoCurso
      },
      orderBy: {
        codigo: 'desc' // Mais recente primeiro
      }
    });

    if (propinaSelecionada) {
      tipoCompatibilidade = 'especifica';
      console.log(`✅ Propina específica encontrada: ${propinaSelecionada.designacao}`);
    } else {
      // 2. Buscar por classe apenas
      propinaSelecionada = await prisma.tb_tipo_servicos.findFirst({
        where: {
          status: "Activo",
          categoria: 1,
          codigo_Classe: codigoClasse,
          codigo_Curso: null
        },
        orderBy: {
          codigo: 'desc'
        }
      });

      if (propinaSelecionada) {
        tipoCompatibilidade = 'porClasse';
        console.log(`✅ Propina por classe encontrada: ${propinaSelecionada.designacao}`);
      } else {
        // 3. Buscar por curso apenas
        propinaSelecionada = await prisma.tb_tipo_servicos.findFirst({
          where: {
            status: "Activo",
            categoria: 1,
            codigo_Classe: null,
            codigo_Curso: codigoCurso
          },
          orderBy: {
            codigo: 'desc'
          }
        });

        if (propinaSelecionada) {
          tipoCompatibilidade = 'porCurso';
          console.log(`✅ Propina por curso encontrada: ${propinaSelecionada.designacao}`);
        } else {
          // 4. Buscar propina geral
          propinaSelecionada = await prisma.tb_tipo_servicos.findFirst({
            where: {
              status: "Activo",
              categoria: 1,
              codigo_Classe: null,
              codigo_Curso: null
            },
            orderBy: {
              codigo: 'desc'
            }
          });

          if (propinaSelecionada) {
            tipoCompatibilidade = 'geral';
            console.log(`✅ Propina geral encontrada: ${propinaSelecionada.designacao}`);
          }
        }
      }
    }

    if (!propinaSelecionada) {
      console.log(`⚠️ Nenhuma propina encontrada para classe ${codigoClasse} e curso ${codigoCurso}`);
      return res.json({
        success: false,
        message: "Nenhuma propina encontrada para esta classe e curso",
        data: {
          propina: null,
          alunoInfo: {
            nome: confirmacao.tb_matriculas.tb_alunos.nome,
            classe: confirmacao.tb_turmas.tb_classes.designacao,
            curso: confirmacao.tb_turmas.tb_cursos.designacao,
            turma: confirmacao.tb_turmas.designacao,
            codigoClasse: codigoClasse,
            codigoCurso: codigoCurso
          },
          compatibilidade: {
            tipo: 'nenhuma',
            especifica: false,
            porClasse: false,
            porCurso: false,
            geral: false
          }
        }
      });
    }

    res.json({
      success: true,
      message: `Propina automática encontrada (${tipoCompatibilidade})`,
      data: {
        propina: propinaSelecionada,
        alunoInfo: {
          nome: confirmacao.tb_matriculas.tb_alunos.nome,
          classe: confirmacao.tb_turmas.tb_classes.designacao,
          curso: confirmacao.tb_turmas.tb_cursos.designacao,
          turma: confirmacao.tb_turmas.designacao,
          codigoClasse: codigoClasse,
          codigoCurso: codigoCurso
        },
        compatibilidade: {
          tipo: tipoCompatibilidade,
          especifica: tipoCompatibilidade === 'especifica',
          porClasse: tipoCompatibilidade === 'porClasse',
          porCurso: tipoCompatibilidade === 'porCurso',
          geral: tipoCompatibilidade === 'geral'
        }
      }
    });

  } catch (error) {
    console.error('❌ Erro ao buscar propina automática:', error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar propina automática"
    });
  }
});

// Rota para buscar meses do ano letivo (setembro a julho)
router.get('/aluno/:alunoId/meses-ano-letivo/:anoLetivoId', async (req, res) => {
  try {
    const { alunoId, anoLetivoId } = req.params;

    console.log(`📅 Buscando meses do ano letivo ${anoLetivoId} para aluno ${alunoId}`);

    // Buscar ano letivo para determinar período
    const anoLetivo = await prisma.tb_ano_lectivo.findUnique({
      where: { codigo: parseInt(anoLetivoId) }
    });

    if (!anoLetivo) {
      return res.status(404).json({
        success: false,
        message: "Ano letivo não encontrado"
      });
    }

    // Definir meses do ano letivo (setembro a julho)
    const mesesAnoLetivo = [
      { numero: 9, nome: 'Setembro', abrev: 'Set' },
      { numero: 10, nome: 'Outubro', abrev: 'Out' },
      { numero: 11, nome: 'Novembro', abrev: 'Nov' },
      { numero: 12, nome: 'Dezembro', abrev: 'Dez' },
      { numero: 1, nome: 'Janeiro', abrev: 'Jan' },
      { numero: 2, nome: 'Fevereiro', abrev: 'Fev' },
      { numero: 3, nome: 'Março', abrev: 'Mar' },
      { numero: 4, nome: 'Abril', abrev: 'Abr' },
      { numero: 5, nome: 'Maio', abrev: 'Mai' },
      { numero: 6, nome: 'Junho', abrev: 'Jun' },
      { numero: 7, nome: 'Julho', abrev: 'Jul' }
    ];

    // Buscar pagamentos de propina do aluno para este ano letivo
    let pagamentosPropina = [];
    try {
      pagamentosPropina = await prisma.tb_pagamentos.findMany({
        where: {
          codigo_Aluno: parseInt(alunoId),
          codigo_Ano_Lectivo: parseInt(anoLetivoId),
          tb_tipo_servicos: {
            categoria: 1 // Categoria propinas
          }
        },
        include: {
          tb_tipo_servicos: true
        }
      });
    } catch (pagamentosError) {
      console.warn('⚠️ Erro ao buscar pagamentos, continuando sem eles:', pagamentosError);
      pagamentosPropina = [];
    }

    console.log(`💰 Encontrados ${pagamentosPropina.length} pagamentos de propina`);

    // Extrair meses pagos dos pagamentos
    const mesesPagos = new Set();
    pagamentosPropina.forEach(pagamento => {
      if (pagamento.meses) {
        // Se o campo meses contém uma string como "1,2,3" ou array
        const mesesPagamento = typeof pagamento.meses === 'string' 
          ? pagamento.meses.split(',').map(m => parseInt(m.trim()))
          : Array.isArray(pagamento.meses) 
            ? pagamento.meses 
            : [pagamento.meses];
        
        mesesPagamento.forEach(mes => {
          if (mes && mes >= 1 && mes <= 12) {
            mesesPagos.add(mes);
          }
        });
      }
    });

    // Mapear status dos meses
    const mesesComStatus = mesesAnoLetivo.map(mes => ({
      ...mes,
      pago: mesesPagos.has(mes.numero),
      pendente: !mesesPagos.has(mes.numero)
    }));

    const mesesPendentes = mesesComStatus.filter(mes => mes.pendente);
    const totalPago = mesesComStatus.filter(mes => mes.pago).length;
    const totalPendente = mesesPendentes.length;

    console.log(`📊 Status: ${totalPago} pagos, ${totalPendente} pendentes`);

    res.json({
      success: true,
      message: `Meses do ano letivo ${anoLetivo.designacao}`,
      data: {
        anoLetivo: {
          codigo: anoLetivo.codigo,
          designacao: anoLetivo.designacao,
          dataInicio: anoLetivo.data_inicio,
          dataFim: anoLetivo.data_fim
        },
        meses: mesesComStatus,
        mesesPendentes: mesesPendentes,
        resumo: {
          totalMeses: mesesAnoLetivo.length,
          mesesPagos: totalPago,
          mesesPendentes: totalPendente,
          percentualPago: Math.round((totalPago / mesesAnoLetivo.length) * 100)
        },
        pagamentos: pagamentosPropina.map(p => ({
          codigo: p.codigo,
          valor: p.valor,
          meses: p.meses,
          dataVencimento: p.data_vencimento,
          tipoServico: p.tb_tipo_servicos.designacao
        }))
      }
    });

  } catch (error) {
    console.error('❌ Erro ao buscar meses do ano letivo:', error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar meses do ano letivo"
    });
  }
});

// Rota de debug para verificar tipos de serviços
router.get('/debug/tipos-servicos', async (req, res) => {
  try {
    const tiposServicos = await prisma.tb_tipo_servicos.findMany({
      select: {
        codigo: true,
        designacao: true,
        categoria: true,
        status: true,
        preco: true
      },
      orderBy: {
        categoria: 'asc'
      }
    });

    const categorias = [...new Set(tiposServicos.map(t => t.categoria).filter(c => c !== null))];
    
    res.json({
      success: true,
      message: "Debug tipos de serviços",
      data: {
        totalTipos: tiposServicos.length,
        tiposServicos: tiposServicos,
        categoriasUnicas: categorias,
        categoriasCount: categorias.length
      }
    });
  } catch (error) {
    console.error('❌ Erro no debug:', error);
    res.status(500).json({
      success: false,
      message: "Erro no debug"
    });
  }
});

// ========== NOVAS ROTAS PARA GESTÃO FINANCEIRA ==========

/**
 * @swagger
 * /api/payment-management/pagamentos:
 *   post:
 *     summary: Criar novo pagamento
 *     tags: [Pagamentos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigo_Aluno
 *               - codigo_Tipo_Servico
 *               - mes
 *               - ano
 *               - preco
 *             properties:
 *               codigo_Aluno:
 *                 type: integer
 *                 description: ID do aluno
 *               codigo_Tipo_Servico:
 *                 type: integer
 *                 description: ID do tipo de serviço
 *               mes:
 *                 type: string
 *                 description: Mês do pagamento
 *               ano:
 *                 type: integer
 *                 description: Ano do pagamento
 *               preco:
 *                 type: number
 *                 description: Valor do pagamento
 *               observacao:
 *                 type: string
 *                 description: Observações
 *               codigo_FormaPagamento:
 *                 type: integer
 *                 description: ID da forma de pagamento
 *     responses:
 *       201:
 *         description: Pagamento criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
// Rota duplicada removida - já existe acima

/**
 * @swagger
 * /api/payment-management/alunos-confirmados:
 *   get:
 *     summary: Listar alunos confirmados em turmas
 *     tags: [Alunos Financeiro]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Itens por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nome do aluno
 *       - in: query
 *         name: turma
 *         schema:
 *           type: integer
 *         description: Filtrar por turma
 *       - in: query
 *         name: curso
 *         schema:
 *           type: integer
 *         description: Filtrar por curso
 *     responses:
 *       200:
 *         description: Lista de alunos confirmados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 */
router.get('/alunos-confirmados', PaymentManagementController.getAlunosConfirmados);

/**
 * @swagger
 * /api/payment-management/aluno/{id}/financeiro:
 *   get:
 *     summary: Obter dados financeiros de um aluno
 *     tags: [Alunos Financeiro]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do aluno
 *       - in: query
 *         name: ano_lectivo
 *         schema:
 *           type: integer
 *         description: ID do ano letivo
 *     responses:
 *       200:
 *         description: Dados financeiros do aluno
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     aluno:
 *                       type: object
 *                     mesesPropina:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           mes:
 *                             type: string
 *                           status:
 *                             type: string
 *                           valor:
 *                             type: number
 *                           dataPagamento:
 *                             type: string
 *                     historicoFinanceiro:
 *                       type: array
 *                       items:
 *                         type: object
 *       404:
 *         description: Aluno não encontrado
 */
router.get('/aluno/:id/financeiro', PaymentManagementController.getDadosFinanceirosAluno);

/**
 * @swagger
 * /api/payment-management/pagamento/{id}/fatura:
 *   get:
 *     summary: Gerar PDF da fatura de pagamento
 *     tags: [Faturas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pagamento
 *     responses:
 *       200:
 *         description: PDF da fatura
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Pagamento não encontrado
 */
router.get('/pagamento/:id/fatura', PaymentManagementController.gerarFaturaPDF);

// Rotas auxiliares
router.get('/tipos-servico', PaymentManagementController.getTiposServico);
router.get('/formas-pagamento', PaymentManagementController.getFormasPagamento);
router.get('/anos-lectivos', PaymentManagementController.getAnosLectivos);
router.get('/aluno/:id/completo', PaymentManagementController.getAlunoCompleto);
router.get('/aluno/:id/tipo-servico-turma', PaymentManagementController.getTipoServicoTurmaAluno);
router.get('/aluno/:id/meses-pendentes', PaymentManagementController.getMesesPendentesAluno);
router.get('/aluno/:id/propina-classe/:anoLectivoId', PaymentManagementController.getPropinaClasse);
router.post('/validate-bordero', PaymentManagementController.validateBordero);

// Rotas de notas de crédito
router.post('/notas-credito', PaymentManagementController.createNotaCredito);
router.get('/notas-credito', PaymentManagementController.getNotasCredito);
router.get('/notas-credito/:id', PaymentManagementController.getNotaCreditoById);
router.put('/notas-credito/:id', PaymentManagementController.updateNotaCredito);
router.delete('/notas-credito/:id', PaymentManagementController.deleteNotaCredito);

// Rotas de relatórios de vendas por funcionário
router.get('/relatorios/vendas-funcionarios', PaymentManagementController.getRelatorioVendasFuncionarios);
router.get('/relatorios/vendas-funcionario/:funcionarioId', PaymentManagementController.getRelatorioVendasDetalhado);
router.get('/funcionarios', PaymentManagementController.getAllFuncionarios);

export default router;
