/**
 * @swagger
 * components:
 *   schemas:
 *     Nacionalidade:
 *       type: object
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único da nacionalidade
 *         designacao:
 *           type: string
 *           description: Nome da nacionalidade
 *     
 *     EstadoCivil:
 *       type: object
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único do estado civil
 *         designacao:
 *           type: string
 *           description: Nome do estado civil
 *     
 *     Provincia:
 *       type: object
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único da província
 *         designacao:
 *           type: string
 *           description: Nome da província
 *         tb_municipios:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Municipio'
 *     
 *     Municipio:
 *       type: object
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único do município
 *         codigo_Provincia:
 *           type: integer
 *           description: Código da província
 *         designacao:
 *           type: string
 *           description: Nome do município
 *         tb_provincias:
 *           $ref: '#/components/schemas/Provincia'
 *         tb_comunas:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comuna'
 *     
 *     Comuna:
 *       type: object
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único da comuna
 *         codigo_Municipio:
 *           type: integer
 *           description: Código do município
 *         designacao:
 *           type: string
 *           description: Nome da comuna
 *         tb_municipios:
 *           $ref: '#/components/schemas/Municipio'
 */

import express from 'express';
import { GeographicController } from '../controllers/geographic.controller.js';

const router = express.Router();

// ========== NACIONALIDADES ==========

/**
 * @swagger
 * /api/geographic/nacionalidades:
 *   get:
 *     summary: Obter todas as nacionalidades
 *     description: Retorna lista de todas as nacionalidades cadastradas
 *     tags: [Dados Geográficos - Nacionalidades]
 *     responses:
 *       200:
 *         description: Lista de nacionalidades obtida com sucesso
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
 *                     $ref: '#/components/schemas/Nacionalidade'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/nacionalidades', GeographicController.getAllNacionalidades);

/**
 * @swagger
 * /api/geographic/nacionalidades/{id}:
 *   get:
 *     summary: Obter nacionalidade por ID
 *     description: Retorna uma nacionalidade específica pelo seu código
 *     tags: [Dados Geográficos - Nacionalidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código da nacionalidade
 *     responses:
 *       200:
 *         description: Nacionalidade obtida com sucesso
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
 *                   $ref: '#/components/schemas/Nacionalidade'
 *       404:
 *         description: Nacionalidade não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/nacionalidades/:id', GeographicController.getNacionalidadeById);

// ========== ESTADO CIVIL ==========

/**
 * @swagger
 * /api/geographic/estado-civil:
 *   get:
 *     summary: Obter todos os estados civis
 *     description: Retorna lista de todos os estados civis cadastrados
 *     tags: [Dados Geográficos - Estado Civil]
 *     responses:
 *       200:
 *         description: Lista de estados civis obtida com sucesso
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
 *                     $ref: '#/components/schemas/EstadoCivil'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/estado-civil', GeographicController.getAllEstadoCivil);

/**
 * @swagger
 * /api/geographic/estado-civil/{id}:
 *   get:
 *     summary: Obter estado civil por ID
 *     description: Retorna um estado civil específico pelo seu código
 *     tags: [Dados Geográficos - Estado Civil]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código do estado civil
 *     responses:
 *       200:
 *         description: Estado civil obtido com sucesso
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
 *                   $ref: '#/components/schemas/EstadoCivil'
 *       404:
 *         description: Estado civil não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/estado-civil/:id', GeographicController.getEstadoCivilById);

// ========== PROVÍNCIAS ==========

/**
 * @swagger
 * /api/geographic/provincias:
 *   get:
 *     summary: Obter todas as províncias
 *     description: Retorna lista de todas as províncias com seus municípios e comunas
 *     tags: [Dados Geográficos - Províncias]
 *     responses:
 *       200:
 *         description: Lista de províncias obtida com sucesso
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
 *                     $ref: '#/components/schemas/Provincia'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/provincias', GeographicController.getAllProvincias);

/**
 * @swagger
 * /api/geographic/provincias/{id}:
 *   get:
 *     summary: Obter província por ID
 *     description: Retorna uma província específica com seus municípios e comunas
 *     tags: [Dados Geográficos - Províncias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código da província
 *     responses:
 *       200:
 *         description: Província obtida com sucesso
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
 *                   $ref: '#/components/schemas/Provincia'
 *       404:
 *         description: Província não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/provincias/:id', GeographicController.getProvinciaById);

// ========== MUNICÍPIOS ==========

/**
 * @swagger
 * /api/geographic/municipios:
 *   get:
 *     summary: Obter todos os municípios
 *     description: Retorna lista de todos os municípios com suas províncias e comunas
 *     tags: [Dados Geográficos - Municípios]
 *     responses:
 *       200:
 *         description: Lista de municípios obtida com sucesso
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
 *                     $ref: '#/components/schemas/Municipio'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/municipios', GeographicController.getAllMunicipios);

/**
 * @swagger
 * /api/geographic/municipios/{id}:
 *   get:
 *     summary: Obter município por ID
 *     description: Retorna um município específico com sua província e comunas
 *     tags: [Dados Geográficos - Municípios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código do município
 *     responses:
 *       200:
 *         description: Município obtido com sucesso
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
 *                   $ref: '#/components/schemas/Municipio'
 *       404:
 *         description: Município não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/municipios/:id', GeographicController.getMunicipioById);

/**
 * @swagger
 * /api/geographic/provincias/{provinciaId}/municipios:
 *   get:
 *     summary: Obter municípios por província
 *     description: Retorna todos os municípios de uma província específica
 *     tags: [Dados Geográficos - Municípios]
 *     parameters:
 *       - in: path
 *         name: provinciaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código da província
 *     responses:
 *       200:
 *         description: Municípios da província obtidos com sucesso
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
 *                     $ref: '#/components/schemas/Municipio'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/provincias/:provinciaId/municipios', GeographicController.getMunicipiosByProvincia);

// ========== COMUNAS ==========

/**
 * @swagger
 * /api/geographic/comunas:
 *   get:
 *     summary: Obter todas as comunas
 *     description: Retorna lista de todas as comunas com seus municípios e províncias
 *     tags: [Dados Geográficos - Comunas]
 *     responses:
 *       200:
 *         description: Lista de comunas obtida com sucesso
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
 *                     $ref: '#/components/schemas/Comuna'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/comunas', GeographicController.getAllComunas);

/**
 * @swagger
 * /api/geographic/comunas/{id}:
 *   get:
 *     summary: Obter comuna por ID
 *     description: Retorna uma comuna específica com seu município e província
 *     tags: [Dados Geográficos - Comunas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código da comuna
 *     responses:
 *       200:
 *         description: Comuna obtida com sucesso
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
 *                   $ref: '#/components/schemas/Comuna'
 *       404:
 *         description: Comuna não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/comunas/:id', GeographicController.getComunaById);

/**
 * @swagger
 * /api/geographic/municipios/{municipioId}/comunas:
 *   get:
 *     summary: Obter comunas por município
 *     description: Retorna todas as comunas de um município específico
 *     tags: [Dados Geográficos - Comunas]
 *     parameters:
 *       - in: path
 *         name: municipioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código do município
 *     responses:
 *       200:
 *         description: Comunas do município obtidas com sucesso
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
 *                     $ref: '#/components/schemas/Comuna'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/municipios/:municipioId/comunas', GeographicController.getComunasByMunicipio);

// ========== OPERAÇÕES ESPECIAIS ==========

/**
 * @swagger
 * /api/geographic/hierarchy:
 *   get:
 *     summary: Obter hierarquia geográfica completa
 *     description: Retorna nacionalidades, estados civis e toda a hierarquia geográfica (províncias, municípios, comunas)
 *     tags: [Dados Geográficos - Operações Especiais]
 *     responses:
 *       200:
 *         description: Hierarquia geográfica obtida com sucesso
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
 *                     nacionalidades:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Nacionalidade'
 *                     estadosCivis:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/EstadoCivil'
 *                     provincias:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Provincia'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/hierarchy', GeographicController.getGeographicHierarchy);

/**
 * @swagger
 * /api/geographic/search:
 *   get:
 *     summary: Buscar dados geográficos
 *     description: Realiza busca por nome em províncias, municípios, comunas e nacionalidades
 *     tags: [Dados Geográficos - Operações Especiais]
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
 *                     provincias:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Provincia'
 *                     municipios:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Municipio'
 *                     comunas:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Comuna'
 *                     nacionalidades:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Nacionalidade'
 *       400:
 *         description: Termo de busca inválido
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/search', GeographicController.searchGeographic);

export default router;
