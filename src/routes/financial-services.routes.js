/**
 * @swagger
 * tags:
 *   - name: Gestão Financeira - Serviços e Produtos
 *     description: Sistema completo de gestão financeira para serviços educacionais
 *   - name: Moedas
 *     description: Gestão de moedas do sistema
 *   - name: Categorias de Serviços
 *     description: Categorização de tipos de serviços
 *   - name: Tipos de Serviços
 *     description: Gestão de serviços e produtos financeiros
 *   - name: Motivos IVA
 *     description: Gestão de motivos de aplicação de IVA
 *   - name: Taxas IVA
 *     description: Gestão de taxas de IVA do sistema
 *   - name: Tipos de Multa
 *     description: Gestão de tipos de multa aplicáveis
 *   - name: Motivos de Isenção
 *     description: Gestão de motivos de isenção fiscal
 *   - name: Tipos de Taxa IVA
 *     description: Gestão de tipos de taxa IVA com isenções
 *   - name: Consultas Especiais
 *     description: Operações especiais e relatórios
 *   - name: Relatórios Financeiros
 *     description: Relatórios e estatísticas do sistema financeiro
 *
 * components:
 *   schemas:
 *     # ===============================
 *     # SCHEMAS PRINCIPAIS
 *     # ===============================
 *     Moeda:
 *       type: object
 *       required:
 *         - designacao
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único da moeda
 *           example: 1
 *         designacao:
 *           type: string
 *           maxLength: 45
 *           description: Designação da moeda
 *           example: "Kwanza Angolano"
 *       example:
 *         designacao: "Kwanza Angolano"
 *
 *     MoedaResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/Moeda'
 *         - type: object
 *           properties:
 *             _count:
 *               type: object
 *               properties:
 *                 tb_tipo_servicos:
 *                   type: integer
 *                   description: Quantidade de serviços usando esta moeda
 *
 *     CategoriaServico:
 *       type: object
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único da categoria
 *           example: 1
 *         designacao:
 *           type: string
 *           maxLength: 50
 *           description: Designação da categoria
 *           example: "Propinas e Mensalidades"
 *       example:
 *         designacao: "Propinas e Mensalidades"
 *
 *     CategoriaServicoResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/CategoriaServico'
 *         - type: object
 *           properties:
 *             _count:
 *               type: object
 *               properties:
 *                 tb_tipo_servicos:
 *                   type: integer
 *                   description: Quantidade de serviços nesta categoria
 *
 *     TipoServico:
 *       type: object
 *       required:
 *         - designacao
 *         - preco
 *         - descricao
 *         - codigo_Utilizador
 *         - codigo_Moeda
 *         - tipoServico
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único do tipo de serviço
 *           example: 1
 *         designacao:
 *           type: string
 *           maxLength: 45
 *           description: Designação do serviço
 *           example: "Propina Mensal - 10ª Classe"
 *         preco:
 *           type: number
 *           format: float
 *           minimum: 0
 *           description: Preço do serviço
 *           example: 15000.00
 *         descricao:
 *           type: string
 *           maxLength: 45
 *           description: Descrição detalhada do serviço
 *           example: "Propina mensal para alunos da 10ª classe"
 *         codigo_Utilizador:
 *           type: integer
 *           description: Código do utilizador que criou o serviço
 *           example: 1
 *         codigo_Moeda:
 *           type: integer
 *           description: Código da moeda utilizada
 *           example: 1
 *         tipoServico:
 *           type: string
 *           maxLength: 15
 *           description: Tipo/categoria do serviço
 *           example: "Propina"
 *           enum: ["Propina", "Taxa", "Multa", "Certificado", "Outro"]
 *         status:
 *           type: string
 *           maxLength: 45
 *           description: Status do serviço
 *           example: "Activo"
 *           enum: ["Activo", "Inactivo"]
 *           default: "Activo"
 *         aplicarMulta:
 *           type: boolean
 *           description: Indica se aplica multa por atraso
 *           example: true
 *           default: false
 *         aplicarDesconto:
 *           type: boolean
 *           description: Indica se permite aplicar desconto
 *           example: false
 *           default: false
 *         codigo_Ano:
 *           type: integer
 *           description: Código do ano de referência
 *           example: 1
 *           default: 1
 *         codigoAnoLectivo:
 *           type: integer
 *           nullable: true
 *           description: Código do ano letivo específico
 *           example: 1
 *         valorMulta:
 *           type: number
 *           format: float
 *           minimum: 0
 *           description: Valor da multa aplicada
 *           example: 2000.00
 *           default: 0
 *         iva:
 *           type: integer
 *           nullable: true
 *           description: Código da taxa de IVA aplicável
 *           example: 1
 *         codigoRasao:
 *           type: integer
 *           nullable: true
 *           description: Código do motivo de IVA
 *           example: 1
 *         categoria:
 *           type: integer
 *           nullable: true
 *           description: Código da categoria do serviço
 *           example: 1
 *         codigo_multa:
 *           type: integer
 *           nullable: true
 *           description: Código do tipo de multa
 *           example: 1
 *       example:
 *         designacao: "Propina Mensal - 10ª Classe"
 *         preco: 15000.00
 *         descricao: "Propina mensal para alunos da 10ª classe"
 *         codigo_Utilizador: 1
 *         codigo_Moeda: 1
 *         tipoServico: "Propina"
 *         status: "Activo"
 *         aplicarMulta: true
 *         aplicarDesconto: false
 *         valorMulta: 2000.00
 *         categoria: 1
 *
 *     TipoServicoResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/TipoServico'
 *         - type: object
 *           properties:
 *             tb_moedas:
 *               type: object
 *               properties:
 *                 codigo:
 *                   type: integer
 *                 designacao:
 *                   type: string
 *             tb_categoria_servicos:
 *               type: object
 *               nullable: true
 *               properties:
 *                 codigo:
 *                   type: integer
 *                 designacao:
 *                   type: string
 *             _count:
 *               type: object
 *               properties:
 *                 tb_servicos_turma:
 *                   type: integer
 *                 tb_servico_aluno:
 *                   type: integer
 *                 tb_propina_classe:
 *                   type: integer
 *
 *     # ===============================
 *     # SCHEMAS DE RESPOSTA
 *     # ===============================
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Operação realizada com sucesso"
 *         data:
 *           type: object
 *
 *     PaginatedResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Dados encontrados"
 *         data:
 *           type: array
 *           items:
 *             type: object
 *         pagination:
 *           type: object
 *           properties:
 *             currentPage:
 *               type: integer
 *               example: 1
 *             totalPages:
 *               type: integer
 *               example: 5
 *             totalItems:
 *               type: integer
 *               example: 50
 *             itemsPerPage:
 *               type: integer
 *               example: 10
 *             hasNextPage:
 *               type: boolean
 *               example: true
 *             hasPreviousPage:
 *               type: boolean
 *               example: false
 *
 *     RelatorioFinanceiro:
 *       type: object
 *       properties:
 *         resumo:
 *           type: object
 *           properties:
 *             totalMoedas:
 *               type: integer
 *               description: Total de moedas cadastradas
 *               example: 3
 *             totalCategorias:
 *               type: integer
 *               description: Total de categorias de serviços
 *               example: 5
 *             totalTiposServicos:
 *               type: integer
 *               description: Total de tipos de serviços
 *               example: 25
 *             servicosAtivos:
 *               type: integer
 *               description: Serviços com status ativo
 *               example: 20
 *             servicosComMulta:
 *               type: integer
 *               description: Serviços que aplicam multa
 *               example: 15
 *             servicosComDesconto:
 *               type: integer
 *               description: Serviços que permitem desconto
 *               example: 8
 *
 *     # ===============================
 *     # SCHEMAS DE ERRO
 *     # ===============================
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Erro na operação"
 *         error:
 *           type: string
 *           example: "Detalhes do erro"
 */

import { Router } from 'express';
import { FinancialServicesController } from '../controller/financial-services.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// Aplicar middleware de autenticação a todas as rotas
// router.use(authenticateToken);

// ===============================
// ROTAS MOEDAS
// ===============================

/**
 * @swagger
 * /api/financial-services/moedas:
 *   post:
 *     summary: Criar nova moeda
 *     description: Cria uma nova moeda no sistema financeiro
 *     tags: [Moedas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Moeda'
 *           example:
 *             designacao: "Kwanza Angolano"
 *     responses:
 *       201:
 *         description: Moeda criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/MoedaResponse'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Moeda já existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/moedas', FinancialServicesController.createMoeda);

/**
 * @swagger
 * /api/financial-services/moedas:
 *   get:
 *     summary: Listar moedas
 *     tags: [Moedas]
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
 *     responses:
 *       200:
 *         description: Lista de moedas
 */
router.get('/moedas', FinancialServicesController.getMoedas);

/**
 * @swagger
 * /api/financial-services/moedas/{id}:
 *   get:
 *     summary: Buscar moeda por ID
 *     tags: [Moedas]
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
 *         description: Moeda encontrada
 *       404:
 *         description: Moeda não encontrada
 */
router.get('/moedas/:id', FinancialServicesController.getMoedaById);

/**
 * @swagger
 * /api/financial-services/moedas/{id}:
 *   put:
 *     summary: Atualizar moeda
 *     tags: [Moedas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Moeda'
 *     responses:
 *       200:
 *         description: Moeda atualizada com sucesso
 *       404:
 *         description: Moeda não encontrada
 */
router.put('/moedas/:id', FinancialServicesController.updateMoeda);

/**
 * @swagger
 * /api/financial-services/moedas/{id}:
 *   delete:
 *     summary: Excluir moeda
 *     tags: [Moedas]
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
 *         description: Moeda excluída com sucesso
 *       400:
 *         description: Moeda possui dependências
 *       404:
 *         description: Moeda não encontrada
 */
router.delete('/moedas/:id', FinancialServicesController.deleteMoeda);

// ===============================
// ROTAS CATEGORIAS DE SERVIÇOS
// ===============================

/**
 * @swagger
 * /api/financial-services/categorias:
 *   post:
 *     summary: Criar nova categoria de serviço
 *     tags: [Categorias de Serviços]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoriaServico'
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 */
router.post('/categorias', FinancialServicesController.createCategoriaServico);

/**
 * @swagger
 * /api/financial-services/categorias:
 *   get:
 *     summary: Listar categorias de serviços
 *     tags: [Categorias de Serviços]
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
 *     responses:
 *       200:
 *         description: Lista de categorias
 */
router.get('/categorias', FinancialServicesController.getCategoriasServicos);

/**
 * @swagger
 * /api/financial-services/categorias/{id}:
 *   get:
 *     summary: Buscar categoria por ID
 *     tags: [Categorias de Serviços]
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
 *         description: Categoria encontrada
 *       404:
 *         description: Categoria não encontrada
 */
router.get('/categorias/:id', FinancialServicesController.getCategoriaServicoById);

/**
 * @swagger
 * /api/financial-services/categorias/{id}:
 *   put:
 *     summary: Atualizar categoria
 *     tags: [Categorias de Serviços]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoriaServico'
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso
 */
router.put('/categorias/:id', FinancialServicesController.updateCategoriaServico);

/**
 * @swagger
 * /api/financial-services/categorias/{id}:
 *   delete:
 *     summary: Excluir categoria
 *     tags: [Categorias de Serviços]
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
 *         description: Categoria excluída com sucesso
 *       400:
 *         description: Categoria possui dependências
 */
router.delete('/categorias/:id', FinancialServicesController.deleteCategoriaServico);

// ===============================
// ROTAS TIPOS DE SERVIÇOS
// ===============================

/**
 * @swagger
 * /api/financial-services/tipos-servicos:
 *   post:
 *     summary: Criar novo tipo de serviço
 *     tags: [Tipos de Serviços]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TipoServico'
 *     responses:
 *       201:
 *         description: Tipo de serviço criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/TipoServicoResponse'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Moeda não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Tipo de serviço já existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/tipos-servicos', FinancialServicesController.createTipoServico);

/**
 * @swagger
 * /api/financial-services/tipos-servicos:
 *   get:
 *     summary: Listar tipos de serviços
 *     description: Lista todos os tipos de serviços com paginação e busca
 *     tags: [Tipos de Serviços]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Número da página
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         description: Itens por página
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: search
 *         description: Termo de busca (designação ou descrição)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de tipos de serviços
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/TipoServicoResponse'
 */
router.get('/tipos-servicos', FinancialServicesController.getTiposServicos);

// ROTAS ESPECIAIS DEVEM VIR ANTES DAS ROTAS COM PARÂMETROS
/**
 * @swagger
 * /api/financial-services/tipos-servicos/ativos:
 *   get:
 *     summary: Buscar tipos de serviços ativos
 *     description: Lista todos os tipos de serviços com status "Activo"
 *     tags: [Consultas Especiais]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tipos de serviços ativos encontrados
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/TipoServicoResponse'
 */
router.get('/tipos-servicos/ativos', FinancialServicesController.getTiposServicosAtivos);

/**
 * @swagger
 * /api/financial-services/tipos-servicos/com-multa:
 *   get:
 *     summary: Buscar tipos de serviços com multa
 *     description: Lista todos os tipos de serviços que aplicam multa por atraso
 *     tags: [Consultas Especiais]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tipos de serviços com multa encontrados
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/TipoServicoResponse'
 */
router.get('/tipos-servicos/com-multa', FinancialServicesController.getTiposServicosComMulta);

/**
 * @swagger
 * /api/financial-services/tipos-servicos/{id}:
 *   get:
 *     summary: Buscar tipo de serviço por ID
 *     description: Busca um tipo de serviço específico pelo seu código
 *     tags: [Tipos de Serviços]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Código do tipo de serviço
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Tipo de serviço encontrado
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/TipoServicoResponse'
 *       404:
 *         description: Tipo de serviço não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/tipos-servicos/:id', FinancialServicesController.getTipoServicoById);

/**
 * @swagger
 * /api/financial-services/tipos-servicos/{id}:
 *   put:
 *     summary: Atualizar tipo de serviço
 *     description: Atualiza os dados de um tipo de serviço existente
 *     tags: [Tipos de Serviços]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Código do tipo de serviço
 *         schema:
 *           type: integer
 *           minimum: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TipoServico'
 *     responses:
 *       200:
 *         description: Tipo de serviço atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/TipoServicoResponse'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Tipo de serviço não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Designação já existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/tipos-servicos/:id', FinancialServicesController.updateTipoServico);

/**
 * @swagger
 * /api/financial-services/tipos-servicos/{id}:
 *   delete:
 *     summary: Excluir tipo de serviço
 *     description: Remove um tipo de serviço do sistema (apenas se não houver dependências)
 *     tags: [Tipos de Serviços]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Código do tipo de serviço
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Tipo de serviço excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Tipo de serviço possui dependências
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Tipo de serviço não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/tipos-servicos/:id', FinancialServicesController.deleteTipoServico);

// ===============================
// ROTAS CONSULTAS ESPECIAIS
// ===============================

/**
 * @swagger
 * /api/financial-services/categorias/{id}/tipos-servicos:
 *   get:
 *     summary: Buscar tipos de serviços por categoria
 *     description: Lista todos os tipos de serviços de uma categoria específica
 *     tags: [Consultas Especiais]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Código da categoria
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Tipos de serviços encontrados por categoria
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/TipoServicoResponse'
 *       404:
 *         description: Categoria não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/categorias/:id/tipos-servicos', FinancialServicesController.getTiposServicosPorCategoria);

/**
 * @swagger
 * /api/financial-services/moedas/{id}/tipos-servicos:
 *   get:
 *     summary: Buscar tipos de serviços por moeda
 *     description: Lista todos os tipos de serviços que utilizam uma moeda específica
 *     tags: [Consultas Especiais]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Código da moeda
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Tipos de serviços encontrados por moeda
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/TipoServicoResponse'
 *       404:
 *         description: Moeda não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/moedas/:id/tipos-servicos', FinancialServicesController.getTiposServicosPorMoeda);

// ===============================
// ROTAS RELATÓRIOS FINANCEIROS
// ===============================

/**
 * @swagger
 * /api/financial-services/relatorio:
 *   get:
 *     summary: Gerar relatório financeiro completo
 *     description: Gera um relatório com estatísticas gerais do sistema financeiro
 *     tags: [Relatórios Financeiros]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Relatório financeiro gerado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/RelatorioFinanceiro'
 */
router.get('/relatorio', FinancialServicesController.getRelatorioFinanceiro);
router.get('/relatorio-vendas', FinancialServicesController.getRelatorioVendas);
router.get('/relatorio-vendas-funcionarios', FinancialServicesController.getRelatorioVendasFuncionarios);

// ===============================
// ROTAS MOTIVOS IVA
// ===============================

/**
 * @swagger
 * /api/financial-services/motivos-iva:
 *   post:
 *     summary: Criar novo motivo IVA
 *     description: Cria um novo motivo de IVA no sistema
 *     tags: [Motivos IVA]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigomotivo
 *             properties:
 *               codigomotivo:
 *                 type: string
 *                 maxLength: 45
 *                 description: Código do motivo IVA
 *                 example: "M01"
 *               designacao:
 *                 type: string
 *                 maxLength: 45
 *                 description: Designação do motivo
 *                 example: "Isento de IVA"
 *     responses:
 *       201:
 *         description: Motivo IVA criado com sucesso
 *       409:
 *         description: Código já existe
 */
router.post('/motivos-iva', FinancialServicesController.createMotivoIva);

/**
 * @swagger
 * /api/financial-services/motivos-iva:
 *   get:
 *     summary: Listar motivos IVA
 *     description: Lista todos os motivos de IVA com paginação
 *     tags: [Motivos IVA]
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
 *     responses:
 *       200:
 *         description: Lista de motivos IVA
 */
router.get('/motivos-iva', FinancialServicesController.getMotivosIva);

/**
 * @swagger
 * /api/financial-services/motivos-iva/{id}:
 *   get:
 *     summary: Buscar motivo IVA por ID
 *     tags: [Motivos IVA]
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
 *         description: Motivo IVA encontrado
 *       404:
 *         description: Motivo IVA não encontrado
 */
router.get('/motivos-iva/:id', FinancialServicesController.getMotivoIvaById);

/**
 * @swagger
 * /api/financial-services/motivos-iva/{id}:
 *   put:
 *     summary: Atualizar motivo IVA
 *     tags: [Motivos IVA]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigomotivo:
 *                 type: string
 *                 maxLength: 45
 *               designacao:
 *                 type: string
 *                 maxLength: 45
 *     responses:
 *       200:
 *         description: Motivo IVA atualizado com sucesso
 */
router.put('/motivos-iva/:id', FinancialServicesController.updateMotivoIva);

/**
 * @swagger
 * /api/financial-services/motivos-iva/{id}:
 *   delete:
 *     summary: Excluir motivo IVA
 *     tags: [Motivos IVA]
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
 *         description: Motivo IVA excluído com sucesso
 *       400:
 *         description: Motivo possui dependências
 */
router.delete('/motivos-iva/:id', FinancialServicesController.deleteMotivoIva);

// ===============================
// ROTAS TAXAS IVA
// ===============================

/**
 * @swagger
 * /api/financial-services/taxas-iva:
 *   post:
 *     summary: Criar nova taxa IVA
 *     description: Cria uma nova taxa de IVA no sistema
 *     tags: [Taxas IVA]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - taxa
 *               - designcao
 *             properties:
 *               taxa:
 *                 type: number
 *                 minimum: 0
 *                 description: Percentual da taxa IVA
 *                 example: 14.0
 *               designcao:
 *                 type: string
 *                 maxLength: 45
 *                 description: Designação da taxa
 *                 example: "IVA Normal"
 *     responses:
 *       201:
 *         description: Taxa IVA criada com sucesso
 */
router.post('/taxas-iva', FinancialServicesController.createTaxaIva);

/**
 * @swagger
 * /api/financial-services/taxas-iva:
 *   get:
 *     summary: Listar taxas IVA
 *     tags: [Taxas IVA]
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
 *     responses:
 *       200:
 *         description: Lista de taxas IVA
 */
router.get('/taxas-iva', FinancialServicesController.getTaxasIva);

/**
 * @swagger
 * /api/financial-services/taxas-iva/{id}:
 *   get:
 *     summary: Buscar taxa IVA por ID
 *     tags: [Taxas IVA]
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
 *         description: Taxa IVA encontrada
 */
router.get('/taxas-iva/:id', FinancialServicesController.getTaxaIvaById);

/**
 * @swagger
 * /api/financial-services/taxas-iva/{id}:
 *   put:
 *     summary: Atualizar taxa IVA
 *     tags: [Taxas IVA]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taxa:
 *                 type: number
 *                 minimum: 0
 *               designcao:
 *                 type: string
 *                 maxLength: 45
 *     responses:
 *       200:
 *         description: Taxa IVA atualizada com sucesso
 */
router.put('/taxas-iva/:id', FinancialServicesController.updateTaxaIva);

/**
 * @swagger
 * /api/financial-services/taxas-iva/{id}:
 *   delete:
 *     summary: Excluir taxa IVA
 *     tags: [Taxas IVA]
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
 *         description: Taxa IVA excluída com sucesso
 */
router.delete('/taxas-iva/:id', FinancialServicesController.deleteTaxaIva);

// ===============================
// ROTAS TIPOS DE MULTA
// ===============================

/**
 * @swagger
 * /api/financial-services/tipos-multa:
 *   post:
 *     summary: Criar novo tipo de multa
 *     description: Cria um novo tipo de multa no sistema
 *     tags: [Tipos de Multa]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descrisao
 *             properties:
 *               descrisao:
 *                 type: string
 *                 maxLength: 45
 *                 description: Descrição do tipo de multa
 *                 example: "Multa por atraso no pagamento"
 *     responses:
 *       201:
 *         description: Tipo de multa criado com sucesso
 */
router.post('/tipos-multa', FinancialServicesController.createTipoMulta);

/**
 * @swagger
 * /api/financial-services/tipos-multa:
 *   get:
 *     summary: Listar tipos de multa
 *     tags: [Tipos de Multa]
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
 *     responses:
 *       200:
 *         description: Lista de tipos de multa
 */
router.get('/tipos-multa', FinancialServicesController.getTiposMulta);

/**
 * @swagger
 * /api/financial-services/tipos-multa/{id}:
 *   get:
 *     summary: Buscar tipo de multa por ID
 *     tags: [Tipos de Multa]
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
 *         description: Tipo de multa encontrado
 */
router.get('/tipos-multa/:id', FinancialServicesController.getTipoMultaById);

/**
 * @swagger
 * /api/financial-services/tipos-multa/{id}:
 *   put:
 *     summary: Atualizar tipo de multa
 *     tags: [Tipos de Multa]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descrisao:
 *                 type: string
 *                 maxLength: 45
 *     responses:
 *       200:
 *         description: Tipo de multa atualizado com sucesso
 */
router.put('/tipos-multa/:id', FinancialServicesController.updateTipoMulta);

/**
 * @swagger
 * /api/financial-services/tipos-multa/{id}:
 *   delete:
 *     summary: Excluir tipo de multa
 *     tags: [Tipos de Multa]
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
 *         description: Tipo de multa excluído com sucesso
 */
router.delete('/tipos-multa/:id', FinancialServicesController.deleteTipoMulta);

// ===============================
// ROTAS MOTIVOS DE ISENÇÃO
// ===============================

/**
 * @swagger
 * /api/financial-services/motivos-isencao:
 *   post:
 *     summary: Criar novo motivo de isenção
 *     description: Cria um novo motivo de isenção no sistema
 *     tags: [Motivos de Isenção]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigo_Isencao
 *               - designacao
 *             properties:
 *               codigo_Isencao:
 *                 type: string
 *                 maxLength: 5
 *                 description: Código da isenção
 *                 example: "M01"
 *               designacao:
 *                 type: string
 *                 maxLength: 300
 *                 description: Designação do motivo
 *                 example: "Isento por lei específica"
 *               status:
 *                 type: string
 *                 maxLength: 30
 *                 description: Status do motivo
 *                 example: "Activo"
 *                 default: "Activo"
 *     responses:
 *       201:
 *         description: Motivo de isenção criado com sucesso
 *       409:
 *         description: Código já existe
 */
router.post('/motivos-isencao', FinancialServicesController.createMotivoIsencao);

/**
 * @swagger
 * /api/financial-services/motivos-isencao:
 *   get:
 *     summary: Listar motivos de isenção
 *     description: Lista todos os motivos de isenção com paginação
 *     tags: [Motivos de Isenção]
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
 *     responses:
 *       200:
 *         description: Lista de motivos de isenção
 */
router.get('/motivos-isencao', FinancialServicesController.getMotivosIsencao);

/**
 * @swagger
 * /api/financial-services/motivos-isencao/{id}:
 *   get:
 *     summary: Buscar motivo de isenção por ID
 *     tags: [Motivos de Isenção]
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
 *         description: Motivo de isenção encontrado
 *       404:
 *         description: Motivo de isenção não encontrado
 */
router.get('/motivos-isencao/:id', FinancialServicesController.getMotivoIsencaoById);

/**
 * @swagger
 * /api/financial-services/motivos-isencao/{id}:
 *   put:
 *     summary: Atualizar motivo de isenção
 *     tags: [Motivos de Isenção]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo_Isencao:
 *                 type: string
 *                 maxLength: 5
 *               designacao:
 *                 type: string
 *                 maxLength: 300
 *               status:
 *                 type: string
 *                 maxLength: 30
 *     responses:
 *       200:
 *         description: Motivo de isenção atualizado com sucesso
 */
router.put('/motivos-isencao/:id', FinancialServicesController.updateMotivoIsencao);

/**
 * @swagger
 * /api/financial-services/motivos-isencao/{id}:
 *   delete:
 *     summary: Excluir motivo de isenção
 *     tags: [Motivos de Isenção]
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
 *         description: Motivo de isenção excluído com sucesso
 *       400:
 *         description: Motivo possui dependências
 */
router.delete('/motivos-isencao/:id', FinancialServicesController.deleteMotivoIsencao);

// ===============================
// ROTAS TIPOS DE TAXA IVA
// ===============================

/**
 * @swagger
 * /api/financial-services/tipos-taxa-iva:
 *   post:
 *     summary: Criar novo tipo de taxa IVA
 *     description: Cria um novo tipo de taxa IVA no sistema
 *     tags: [Tipos de Taxa IVA]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - taxa
 *             properties:
 *               taxa:
 *                 type: integer
 *                 minimum: 0
 *                 description: Percentual da taxa IVA (inteiro)
 *                 example: 14
 *               designacao:
 *                 type: string
 *                 maxLength: 45
 *                 description: Designação da taxa
 *                 example: "IVA Normal"
 *               codigo_Isencao:
 *                 type: integer
 *                 description: Código do motivo de isenção
 *                 example: 1
 *               status:
 *                 type: string
 *                 maxLength: 45
 *                 description: Status da taxa
 *                 example: "Activo"
 *                 default: "Activo"
 *     responses:
 *       201:
 *         description: Tipo de taxa IVA criado com sucesso
 */
router.post('/tipos-taxa-iva', FinancialServicesController.createTipoTaxaIva);

/**
 * @swagger
 * /api/financial-services/tipos-taxa-iva:
 *   get:
 *     summary: Listar tipos de taxa IVA
 *     tags: [Tipos de Taxa IVA]
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
 *     responses:
 *       200:
 *         description: Lista de tipos de taxa IVA
 */
router.get('/tipos-taxa-iva', FinancialServicesController.getTiposTaxaIva);

/**
 * @swagger
 * /api/financial-services/tipos-taxa-iva/{id}:
 *   get:
 *     summary: Buscar tipo de taxa IVA por ID
 *     tags: [Tipos de Taxa IVA]
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
 *         description: Tipo de taxa IVA encontrado
 */
router.get('/tipos-taxa-iva/:id', FinancialServicesController.getTipoTaxaIvaById);

/**
 * @swagger
 * /api/financial-services/tipos-taxa-iva/{id}:
 *   put:
 *     summary: Atualizar tipo de taxa IVA
 *     tags: [Tipos de Taxa IVA]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taxa:
 *                 type: integer
 *                 minimum: 0
 *               designacao:
 *                 type: string
 *                 maxLength: 45
 *               codigo_Isencao:
 *                 type: integer
 *               status:
 *                 type: string
 *                 maxLength: 45
 *     responses:
 *       200:
 *         description: Tipo de taxa IVA atualizado com sucesso
 */
router.put('/tipos-taxa-iva/:id', FinancialServicesController.updateTipoTaxaIva);

/**
 * @swagger
 * /api/financial-services/tipos-taxa-iva/{id}:
 *   delete:
 *     summary: Excluir tipo de taxa IVA
 *     tags: [Tipos de Taxa IVA]
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
 *         description: Tipo de taxa IVA excluído com sucesso
 */
router.delete('/tipos-taxa-iva/:id', FinancialServicesController.deleteTipoTaxaIva);

export default router;
