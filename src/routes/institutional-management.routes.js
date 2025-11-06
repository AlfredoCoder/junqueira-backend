/**
 * @swagger
 * components:
 *   schemas:
 *     RegimeIvaCreate:
 *       type: object
 *       required:
 *         - designacao
 *       properties:
 *         designacao:
 *           type: string
 *           maxLength: 100
 *           description: Designação do regime de IVA
 *           example: "Regime Geral"
 *         designacao_regime:
 *           type: string
 *           maxLength: 100
 *           description: Alternativa para designação
 *         nome:
 *           type: string
 *           maxLength: 100
 *           description: Alternativa para designação
 *     
 *     RegimeIvaUpdate:
 *       type: object
 *       properties:
 *         designacao:
 *           type: string
 *           maxLength: 100
 *           description: Nova designação do regime de IVA
 *     
 *     DadosInstituicaoCreate:
 *       type: object
 *       properties:
 *         nome:
 *           type: string
 *           maxLength: 450
 *           description: Nome da instituição
 *           example: "Escola Secundária Jomorais"
 *         nome_escola:
 *           type: string
 *           description: Alternativa para nome
 *         director:
 *           type: string
 *           maxLength: 145
 *           description: Nome do diretor
 *         diretor:
 *           type: string
 *           description: Alternativa para director
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 145
 *           description: Email da instituição
 *         telefone_Fixo:
 *           type: string
 *           maxLength: 45
 *           description: Telefone fixo
 *         telefone_Movel:
 *           type: string
 *           maxLength: 45
 *           description: Telefone móvel
 *         nif:
 *           type: string
 *           maxLength: 45
 *           description: NIF da instituição
 *         contribuinte:
 *           type: string
 *           maxLength: 45
 *           description: Número de contribuinte
 *         localidade:
 *           type: string
 *           maxLength: 145
 *           description: Localidade
 *         provincia:
 *           type: string
 *           maxLength: 45
 *           description: Província
 *         municipio:
 *           type: string
 *           maxLength: 45
 *           description: Município
 *         contaBancaria1:
 *           type: string
 *           maxLength: 45
 *           description: Primeira conta bancária
 *         taxaIva:
 *           type: integer
 *           description: ID do regime de IVA
 *     
 *     ParametroCreate:
 *       type: object
 *       required:
 *         - descricao
 *       properties:
 *         designacao:
 *           type: string
 *           maxLength: 545
 *           description: Designação do parâmetro
 *         nome:
 *           type: string
 *           description: Alternativa para designação
 *         valor:
 *           type: number
 *           description: Valor numérico do parâmetro
 *         value:
 *           type: number
 *           description: Alternativa para valor
 *         descricao:
 *           type: string
 *           maxLength: 105
 *           description: Descrição do parâmetro
 *           example: "Taxa de matrícula"
 *         description:
 *           type: string
 *           description: Alternativa para descrição
 *     
 *     StatusEscolaCreate:
 *       type: object
 *       required:
 *         - designacao
 *       properties:
 *         designacao:
 *           type: string
 *           maxLength: 45
 *           description: Designação do status
 *           example: "Ativo"
 *     
 *     NumeracaoDocumentoCreate:
 *       type: object
 *       properties:
 *         designacao:
 *           type: string
 *           maxLength: 50
 *           description: Designação do documento
 *           example: "Certificado"
 *         next:
 *           type: integer
 *           minimum: 0
 *           description: Próximo número da sequência
 *           example: 1
 *     
 *     ItemGuiaCreate:
 *       type: object
 *       required:
 *         - designacao
 *       properties:
 *         designacao:
 *           type: string
 *           maxLength: 100
 *           description: Designação do item da guia
 *           example: "Matrícula"
 *     
 *     BatchParametroCreate:
 *       type: object
 *       required:
 *         - parametros
 *       properties:
 *         parametros:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ParametroCreate'
 *           description: Lista de parâmetros para criar
 *     
 *     BatchItemGuiaCreate:
 *       type: object
 *       required:
 *         - itens
 *       properties:
 *         itens:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ItemGuiaCreate'
 *           description: Lista de itens da guia para criar
 */

import express from 'express';
import { InstitutionalManagementController } from '../controller/institutional-management.controller.js';

const router = express.Router();

// ========== REGIME IVA - CRUD ==========

/**
 * @swagger
 * /api/institutional-management/regimes-iva:
 *   post:
 *     summary: Criar novo regime de IVA
 *     description: Cria um novo regime de IVA no sistema
 *     tags: [Gestão Institucional - Regimes IVA]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegimeIvaCreate'
 *     responses:
 *       201:
 *         description: Regime de IVA criado com sucesso
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
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Regime já existe
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/regimes-iva', InstitutionalManagementController.createRegimeIva);

/**
 * @swagger
 * /api/institutional-management/regimes-iva/{id}:
 *   put:
 *     summary: Atualizar regime de IVA
 *     description: Atualiza um regime de IVA existente
 *     tags: [Gestão Institucional - Regimes IVA]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do regime de IVA
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegimeIvaUpdate'
 *     responses:
 *       200:
 *         description: Regime de IVA atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Regime não encontrado
 *       409:
 *         description: Designação já existe
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/regimes-iva/:id', InstitutionalManagementController.updateRegimeIva);

/**
 * @swagger
 * /api/institutional-management/regimes-iva/{id}:
 *   delete:
 *     summary: Excluir regime de IVA
 *     description: Exclui um regime de IVA (apenas se não estiver em uso)
 *     tags: [Gestão Institucional - Regimes IVA]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do regime de IVA
 *     responses:
 *       200:
 *         description: Regime de IVA excluído com sucesso
 *       400:
 *         description: Regime em uso, não pode ser excluído
 *       404:
 *         description: Regime não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/regimes-iva/:id', InstitutionalManagementController.deleteRegimeIva);

// ========== DADOS INSTITUIÇÃO - CRUD ==========

/**
 * @swagger
 * /api/institutional-management/dados-instituicao:
 *   post:
 *     summary: Criar dados da instituição
 *     description: Cria novos dados da instituição
 *     tags: [Gestão Institucional - Dados Instituição]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DadosInstituicaoCreate'
 *     responses:
 *       201:
 *         description: Dados da instituição criados com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Regime de IVA não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/dados-instituicao', InstitutionalManagementController.createDadosInstituicao);

/**
 * @swagger
 * /api/institutional-management/dados-instituicao/{id}:
 *   put:
 *     summary: Atualizar dados da instituição
 *     description: Atualiza dados existentes da instituição
 *     tags: [Gestão Institucional - Dados Instituição]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID dos dados da instituição
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DadosInstituicaoCreate'
 *     responses:
 *       200:
 *         description: Dados da instituição atualizados com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Dados não encontrados
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/dados-instituicao/:id', InstitutionalManagementController.updateDadosInstituicao);

/**
 * @swagger
 * /api/institutional-management/dados-instituicao/{id}:
 *   delete:
 *     summary: Excluir dados da instituição
 *     description: Exclui dados da instituição
 *     tags: [Gestão Institucional - Dados Instituição]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID dos dados da instituição
 *     responses:
 *       200:
 *         description: Dados da instituição excluídos com sucesso
 *       404:
 *         description: Dados não encontrados
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/dados-instituicao/:id', InstitutionalManagementController.deleteDadosInstituicao);

// ========== PARÂMETROS - CRUD ==========

/**
 * @swagger
 * /api/institutional-management/parametros:
 *   post:
 *     summary: Criar novo parâmetro
 *     description: Cria um novo parâmetro do sistema
 *     tags: [Gestão Institucional - Parâmetros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ParametroCreate'
 *     responses:
 *       201:
 *         description: Parâmetro criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Parâmetro já existe
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/parametros', InstitutionalManagementController.createParametro);

/**
 * @swagger
 * /api/institutional-management/parametros/{id}:
 *   put:
 *     summary: Atualizar parâmetro
 *     description: Atualiza um parâmetro existente
 *     tags: [Gestão Institucional - Parâmetros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do parâmetro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ParametroCreate'
 *     responses:
 *       200:
 *         description: Parâmetro atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Parâmetro não encontrado
 *       409:
 *         description: Descrição já existe
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/parametros/:id', InstitutionalManagementController.updateParametro);

/**
 * @swagger
 * /api/institutional-management/parametros/{id}:
 *   delete:
 *     summary: Excluir parâmetro
 *     description: Exclui um parâmetro do sistema
 *     tags: [Gestão Institucional - Parâmetros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do parâmetro
 *     responses:
 *       200:
 *         description: Parâmetro excluído com sucesso
 *       404:
 *         description: Parâmetro não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/parametros/:id', InstitutionalManagementController.deleteParametro);

// ========== STATUS ESCOLA - CRUD ==========

/**
 * @swagger
 * /api/institutional-management/status-escola:
 *   post:
 *     summary: Criar novo status da escola
 *     description: Cria um novo status da escola
 *     tags: [Gestão Institucional - Status Escola]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StatusEscolaCreate'
 *     responses:
 *       201:
 *         description: Status da escola criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Status já existe
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/status-escola', InstitutionalManagementController.createStatusEscola);

/**
 * @swagger
 * /api/institutional-management/status-escola/{id}:
 *   put:
 *     summary: Atualizar status da escola
 *     description: Atualiza um status existente da escola
 *     tags: [Gestão Institucional - Status Escola]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do status
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StatusEscolaCreate'
 *     responses:
 *       200:
 *         description: Status da escola atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Status não encontrado
 *       409:
 *         description: Designação já existe
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/status-escola/:id', InstitutionalManagementController.updateStatusEscola);

/**
 * @swagger
 * /api/institutional-management/status-escola/{id}:
 *   delete:
 *     summary: Excluir status da escola
 *     description: Exclui um status da escola
 *     tags: [Gestão Institucional - Status Escola]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do status
 *     responses:
 *       200:
 *         description: Status da escola excluído com sucesso
 *       404:
 *         description: Status não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/status-escola/:id', InstitutionalManagementController.deleteStatusEscola);

// ========== NUMERAÇÃO DOCUMENTOS - CRUD ==========

/**
 * @swagger
 * /api/institutional-management/numeracao-documentos:
 *   post:
 *     summary: Criar nova numeração de documento
 *     description: Cria uma nova numeração de documento
 *     tags: [Gestão Institucional - Numeração Documentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NumeracaoDocumentoCreate'
 *     responses:
 *       201:
 *         description: Numeração de documento criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Numeração já existe
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/numeracao-documentos', InstitutionalManagementController.createNumeracaoDocumento);

/**
 * @swagger
 * /api/institutional-management/numeracao-documentos/{id}:
 *   put:
 *     summary: Atualizar numeração de documento
 *     description: Atualiza uma numeração existente de documento
 *     tags: [Gestão Institucional - Numeração Documentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da numeração
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NumeracaoDocumentoCreate'
 *     responses:
 *       200:
 *         description: Numeração de documento atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Numeração não encontrada
 *       409:
 *         description: Designação já existe
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/numeracao-documentos/:id', InstitutionalManagementController.updateNumeracaoDocumento);

/**
 * @swagger
 * /api/institutional-management/numeracao-documentos/{id}:
 *   delete:
 *     summary: Excluir numeração de documento
 *     description: Exclui uma numeração de documento
 *     tags: [Gestão Institucional - Numeração Documentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da numeração
 *     responses:
 *       200:
 *         description: Numeração de documento excluída com sucesso
 *       404:
 *         description: Numeração não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/numeracao-documentos/:id', InstitutionalManagementController.deleteNumeracaoDocumento);

// ========== ITENS GUIA - CRUD ==========

/**
 * @swagger
 * /api/institutional-management/itens-guia:
 *   post:
 *     summary: Criar novo item da guia
 *     description: Cria um novo item da guia
 *     tags: [Gestão Institucional - Itens Guia]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ItemGuiaCreate'
 *     responses:
 *       201:
 *         description: Item da guia criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Item já existe
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/itens-guia', InstitutionalManagementController.createItemGuia);

/**
 * @swagger
 * /api/institutional-management/itens-guia/{id}:
 *   put:
 *     summary: Atualizar item da guia
 *     description: Atualiza um item existente da guia
 *     tags: [Gestão Institucional - Itens Guia]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ItemGuiaCreate'
 *     responses:
 *       200:
 *         description: Item da guia atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Item não encontrado
 *       409:
 *         description: Designação já existe
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/itens-guia/:id', InstitutionalManagementController.updateItemGuia);

/**
 * @swagger
 * /api/institutional-management/itens-guia/{id}:
 *   delete:
 *     summary: Excluir item da guia
 *     description: Exclui um item da guia
 *     tags: [Gestão Institucional - Itens Guia]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do item
 *     responses:
 *       200:
 *         description: Item da guia excluído com sucesso
 *       404:
 *         description: Item não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/itens-guia/:id', InstitutionalManagementController.deleteItemGuia);

// ========== OPERAÇÕES ESPECIAIS ==========

/**
 * @swagger
 * /api/institutional-management/next-number/{designacao}:
 *   get:
 *     summary: Obter próximo número de documento
 *     description: Obtém e incrementa o próximo número para um tipo de documento
 *     tags: [Gestão Institucional - Operações Especiais]
 *     parameters:
 *       - in: path
 *         name: designacao
 *         required: true
 *         schema:
 *           type: string
 *         description: Designação do tipo de documento
 *     responses:
 *       200:
 *         description: Próximo número obtido com sucesso
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
 *                     designacao:
 *                       type: string
 *                     numeroAtual:
 *                       type: integer
 *                     proximoNumero:
 *                       type: integer
 *       404:
 *         description: Numeração não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/next-number/:designacao', InstitutionalManagementController.getNextDocumentNumber);

/**
 * @swagger
 * /api/institutional-management/next-number:
 *   get:
 *     summary: Obter próximo número por query
 *     description: Obtém próximo número usando query parameter
 *     tags: [Gestão Institucional - Operações Especiais]
 *     parameters:
 *       - in: query
 *         name: designacao
 *         required: true
 *         schema:
 *           type: string
 *         description: Designação do tipo de documento
 *     responses:
 *       200:
 *         description: Próximo número obtido com sucesso
 *       400:
 *         description: Parâmetro designacao obrigatório
 *       404:
 *         description: Numeração não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/next-number', InstitutionalManagementController.getNextDocumentNumberByQuery);

// ========== OPERAÇÕES EM LOTE ==========

/**
 * @swagger
 * /api/institutional-management/parametros/batch:
 *   post:
 *     summary: Criar múltiplos parâmetros
 *     description: Cria múltiplos parâmetros em uma única operação
 *     tags: [Gestão Institucional - Operações em Lote]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BatchParametroCreate'
 *     responses:
 *       201:
 *         description: Processamento concluído
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
 *                     created:
 *                       type: array
 *                       items:
 *                         type: object
 *                     errors:
 *                       type: array
 *                       items:
 *                         type: object
 *                     summary:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         success:
 *                           type: integer
 *                         failed:
 *                           type: integer
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/parametros/batch', InstitutionalManagementController.createMultipleParametros);

/**
 * @swagger
 * /api/institutional-management/itens-guia/batch:
 *   post:
 *     summary: Criar múltiplos itens da guia
 *     description: Cria múltiplos itens da guia em uma única operação
 *     tags: [Gestão Institucional - Operações em Lote]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BatchItemGuiaCreate'
 *     responses:
 *       201:
 *         description: Processamento concluído
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/itens-guia/batch', InstitutionalManagementController.createMultipleItensGuia);

export default router;
