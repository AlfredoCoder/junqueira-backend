/**
 * @swagger
 * components:
 *   schemas:
 *     Profissao:
 *       type: object
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único da profissão
 *         designacao:
 *           type: string
 *           description: Nome da profissão
 *     
 *     TipoDocumento:
 *       type: object
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único do tipo de documento
 *         designacao:
 *           type: string
 *           description: Nome do tipo de documento
 *     
 *     RegimeIva:
 *       type: object
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único do regime de IVA
 *         designacao:
 *           type: string
 *           description: Nome do regime de IVA
 *     
 *     DadosInstituicao:
 *       type: object
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único dos dados da instituição
 *         n_Escola:
 *           type: string
 *           description: Número da escola
 *         nome:
 *           type: string
 *           description: Nome da instituição
 *         director:
 *           type: string
 *           description: Nome do diretor
 *         subDirector:
 *           type: string
 *           description: Nome do subdiretor
 *         telefone_Fixo:
 *           type: string
 *           description: Telefone fixo
 *         telefone_Movel:
 *           type: string
 *           description: Telefone móvel
 *         email:
 *           type: string
 *           description: Email da instituição
 *         site:
 *           type: string
 *           description: Site da instituição
 *         localidade:
 *           type: string
 *           description: Localidade da instituição
 *         contribuinte:
 *           type: string
 *           description: Número de contribuinte
 *         nif:
 *           type: string
 *           description: NIF da instituição
 *         logotipo:
 *           type: string
 *           description: Caminho do logotipo
 *         provincia:
 *           type: string
 *           description: Província da instituição
 *         municipio:
 *           type: string
 *           description: Município da instituição
 *         tb_regime_iva:
 *           $ref: '#/components/schemas/RegimeIva'
 *     
 *     Parametro:
 *       type: object
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único do parâmetro
 *         designacao:
 *           type: string
 *           description: Designação do parâmetro
 *         valor:
 *           type: number
 *           description: Valor do parâmetro
 *         descricao:
 *           type: string
 *           description: Descrição do parâmetro
 *     
 *     StatusEscola:
 *       type: object
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único do status
 *         designacao:
 *           type: string
 *           description: Nome do status da escola
 *     
 *     NumeracaoDocumento:
 *       type: object
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único da numeração
 *         designacao:
 *           type: string
 *           description: Designação do documento
 *         next:
 *           type: integer
 *           description: Próximo número da sequência
 *     
 *     ItemGuia:
 *       type: object
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único do item
 *         designacao:
 *           type: string
 *           description: Nome do item da guia
 */

import express from 'express';
import { InstitutionalController } from '../controller/institutional.controller.js';

const router = express.Router();

// ========== PROFISSÕES ==========

/**
 * @swagger
 * /api/institutional/profissoes:
 *   get:
 *     summary: Obter todas as profissões
 *     description: Retorna lista de todas as profissões cadastradas
 *     tags: [Dados Institucionais - Profissões]
 *     responses:
 *       200:
 *         description: Lista de profissões obtida com sucesso
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
 *                     $ref: '#/components/schemas/Profissao'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/profissoes', InstitutionalController.getAllProfissoes);

/**
 * @swagger
 * /api/institutional/profissoes/{id}:
 *   get:
 *     summary: Obter profissão por ID
 *     description: Retorna uma profissão específica pelo seu código
 *     tags: [Dados Institucionais - Profissões]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código da profissão
 *     responses:
 *       200:
 *         description: Profissão obtida com sucesso
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
 *                   $ref: '#/components/schemas/Profissao'
 *       404:
 *         description: Profissão não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/profissoes/:id', InstitutionalController.getProfissaoById);

// ========== TIPOS DE DOCUMENTO ==========

/**
 * @swagger
 * /api/institutional/tipos-documento:
 *   get:
 *     summary: Obter todos os tipos de documento
 *     description: Retorna lista de todos os tipos de documento cadastrados
 *     tags: [Dados Institucionais - Tipos de Documento]
 *     responses:
 *       200:
 *         description: Lista de tipos de documento obtida com sucesso
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
 *                     $ref: '#/components/schemas/TipoDocumento'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/tipos-documento', InstitutionalController.getAllTiposDocumento);

/**
 * @swagger
 * /api/institutional/tipos-documento/{id}:
 *   get:
 *     summary: Obter tipo de documento por ID
 *     description: Retorna um tipo de documento específico pelo seu código
 *     tags: [Dados Institucionais - Tipos de Documento]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código do tipo de documento
 *     responses:
 *       200:
 *         description: Tipo de documento obtido com sucesso
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
 *                   $ref: '#/components/schemas/TipoDocumento'
 *       404:
 *         description: Tipo de documento não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/tipos-documento/:id', InstitutionalController.getTipoDocumentoById);

// ========== REGIMES IVA ==========

/**
 * @swagger
 * /api/institutional/regimes-iva:
 *   get:
 *     summary: Obter todos os regimes de IVA
 *     description: Retorna lista de todos os regimes de IVA cadastrados
 *     tags: [Dados Institucionais - Regimes IVA]
 *     responses:
 *       200:
 *         description: Lista de regimes de IVA obtida com sucesso
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
 *                     $ref: '#/components/schemas/RegimeIva'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/regimes-iva', InstitutionalController.getAllRegimesIva);

/**
 * @swagger
 * /api/institutional/regimes-iva/{id}:
 *   get:
 *     summary: Obter regime de IVA por ID
 *     description: Retorna um regime de IVA específico pelo seu código
 *     tags: [Dados Institucionais - Regimes IVA]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código do regime de IVA
 *     responses:
 *       200:
 *         description: Regime de IVA obtido com sucesso
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
 *                   $ref: '#/components/schemas/RegimeIva'
 *       404:
 *         description: Regime de IVA não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/regimes-iva/:id', InstitutionalController.getRegimeIvaById);

// ========== DADOS DA INSTITUIÇÃO ==========

/**
 * @swagger
 * /api/institutional/dados-instituicao:
 *   get:
 *     summary: Obter todos os dados da instituição
 *     description: Retorna lista de todos os dados da instituição cadastrados
 *     tags: [Dados Institucionais - Dados da Instituição]
 *     responses:
 *       200:
 *         description: Lista de dados da instituição obtida com sucesso
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
 *                     $ref: '#/components/schemas/DadosInstituicao'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/dados-instituicao', InstitutionalController.getAllDadosInstituicao);

/**
 * @swagger
 * /api/institutional/dados-instituicao/{id}:
 *   get:
 *     summary: Obter dados da instituição por ID
 *     description: Retorna dados específicos da instituição pelo seu código
 *     tags: [Dados Institucionais - Dados da Instituição]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código dos dados da instituição
 *     responses:
 *       200:
 *         description: Dados da instituição obtidos com sucesso
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
 *                   $ref: '#/components/schemas/DadosInstituicao'
 *       404:
 *         description: Dados da instituição não encontrados
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/dados-instituicao/:id', InstitutionalController.getDadosInstituicaoById);

/**
 * @swagger
 * /api/institutional/dados-instituicao/principal:
 *   get:
 *     summary: Obter dados principais da instituição
 *     description: Retorna os dados principais (primeiro registro) da instituição
 *     tags: [Dados Institucionais - Dados da Instituição]
 *     responses:
 *       200:
 *         description: Dados principais da instituição obtidos com sucesso
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
 *                   $ref: '#/components/schemas/DadosInstituicao'
 *       404:
 *         description: Dados da instituição não configurados
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/dados-instituicao/principal', InstitutionalController.getDadosInstituicaoPrincipal);

// ========== PARÂMETROS ==========

/**
 * @swagger
 * /api/institutional/parametros:
 *   get:
 *     summary: Obter todos os parâmetros
 *     description: Retorna lista de todos os parâmetros do sistema
 *     tags: [Dados Institucionais - Parâmetros]
 *     responses:
 *       200:
 *         description: Lista de parâmetros obtida com sucesso
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
 *                     $ref: '#/components/schemas/Parametro'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/parametros', InstitutionalController.getAllParametros);

/**
 * @swagger
 * /api/institutional/parametros/{id}:
 *   get:
 *     summary: Obter parâmetro por ID
 *     description: Retorna um parâmetro específico pelo seu código
 *     tags: [Dados Institucionais - Parâmetros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código do parâmetro
 *     responses:
 *       200:
 *         description: Parâmetro obtido com sucesso
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
 *                   $ref: '#/components/schemas/Parametro'
 *       404:
 *         description: Parâmetro não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/parametros/:id', InstitutionalController.getParametroById);

/**
 * @swagger
 * /api/institutional/parametros/descricao/{descricao}:
 *   get:
 *     summary: Obter parâmetro por descrição
 *     description: Retorna um parâmetro específico pela sua descrição
 *     tags: [Dados Institucionais - Parâmetros]
 *     parameters:
 *       - in: path
 *         name: descricao
 *         required: true
 *         schema:
 *           type: string
 *         description: Descrição do parâmetro
 *     responses:
 *       200:
 *         description: Parâmetro obtido com sucesso
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
 *                   $ref: '#/components/schemas/Parametro'
 *       404:
 *         description: Parâmetro não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/parametros/descricao/:descricao', InstitutionalController.getParametroByDescricao);

// ========== STATUS ESCOLA ==========

/**
 * @swagger
 * /api/institutional/status-escola:
 *   get:
 *     summary: Obter todos os status da escola
 *     description: Retorna lista de todos os status da escola
 *     tags: [Dados Institucionais - Status Escola]
 *     responses:
 *       200:
 *         description: Lista de status da escola obtida com sucesso
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
 *                     $ref: '#/components/schemas/StatusEscola'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/status-escola', InstitutionalController.getAllStatusEscola);

/**
 * @swagger
 * /api/institutional/status-escola/{id}:
 *   get:
 *     summary: Obter status da escola por ID
 *     description: Retorna um status específico da escola pelo seu código
 *     tags: [Dados Institucionais - Status Escola]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código do status da escola
 *     responses:
 *       200:
 *         description: Status da escola obtido com sucesso
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
 *                   $ref: '#/components/schemas/StatusEscola'
 *       404:
 *         description: Status da escola não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/status-escola/:id', InstitutionalController.getStatusEscolaById);

// ========== NUMERAÇÃO DE DOCUMENTOS ==========

/**
 * @swagger
 * /api/institutional/numeracao-documentos:
 *   get:
 *     summary: Obter todas as numerações de documentos
 *     description: Retorna lista de todas as numerações de documentos
 *     tags: [Dados Institucionais - Numeração Documentos]
 *     responses:
 *       200:
 *         description: Lista de numerações obtida com sucesso
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
 *                     $ref: '#/components/schemas/NumeracaoDocumento'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/numeracao-documentos', InstitutionalController.getAllNumeracaoDocumentos);

/**
 * @swagger
 * /api/institutional/numeracao-documentos/{id}:
 *   get:
 *     summary: Obter numeração de documento por ID
 *     description: Retorna uma numeração específica pelo seu código
 *     tags: [Dados Institucionais - Numeração Documentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código da numeração
 *     responses:
 *       200:
 *         description: Numeração obtida com sucesso
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
 *                   $ref: '#/components/schemas/NumeracaoDocumento'
 *       404:
 *         description: Numeração não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/numeracao-documentos/:id', InstitutionalController.getNumeracaoDocumentoById);

// ========== ITENS GUIA ==========

/**
 * @swagger
 * /api/institutional/itens-guia:
 *   get:
 *     summary: Obter todos os itens da guia
 *     description: Retorna lista de todos os itens da guia
 *     tags: [Dados Institucionais - Itens Guia]
 *     responses:
 *       200:
 *         description: Lista de itens da guia obtida com sucesso
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
 *                     $ref: '#/components/schemas/ItemGuia'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/itens-guia', InstitutionalController.getAllItensGuia);

/**
 * @swagger
 * /api/institutional/itens-guia/{id}:
 *   get:
 *     summary: Obter item da guia por ID
 *     description: Retorna um item específico da guia pelo seu código
 *     tags: [Dados Institucionais - Itens Guia]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código do item da guia
 *     responses:
 *       200:
 *         description: Item da guia obtido com sucesso
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
 *                   $ref: '#/components/schemas/ItemGuia'
 *       404:
 *         description: Item da guia não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/itens-guia/:id', InstitutionalController.getItemGuiaById);

// ========== OPERAÇÕES ESPECIAIS ==========

/**
 * @swagger
 * /api/institutional/all:
 *   get:
 *     summary: Obter todos os dados institucionais
 *     description: Retorna todos os dados institucionais em uma única requisição
 *     tags: [Dados Institucionais - Operações Especiais]
 *     responses:
 *       200:
 *         description: Dados institucionais obtidos com sucesso
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
 *                     profissoes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Profissao'
 *                     tiposDocumento:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/TipoDocumento'
 *                     regimesIva:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/RegimeIva'
 *                     dadosInstituicao:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/DadosInstituicao'
 *                     parametros:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Parametro'
 *                     statusEscola:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/StatusEscola'
 *                     numeracaoDocumentos:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/NumeracaoDocumento'
 *                     itensGuia:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ItemGuia'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/all', InstitutionalController.getInstitutionalData);

/**
 * @swagger
 * /api/institutional/search:
 *   get:
 *     summary: Buscar dados institucionais
 *     description: Realiza busca por nome em profissões, tipos de documento e parâmetros
 *     tags: [Dados Institucionais - Operações Especiais]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 2
 *         description: Termo de busca (mínimo 2 caracteres)
 *     responses:
 *       200:
 *         description: Busca realizada com sucesso
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
 *                     profissoes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Profissao'
 *                     tiposDocumento:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/TipoDocumento'
 *                     parametros:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Parametro'
 *       400:
 *         description: Termo de busca inválido
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/search', InstitutionalController.searchInstitutional);

export default router;
