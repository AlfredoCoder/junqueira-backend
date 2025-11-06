/**
 * @swagger
 * components:
 *   schemas:
 *     Encarregado:
 *       type: object
 *       required:
 *         - nome
 *         - telefone
 *         - codigo_Profissao
 *         - local_Trabalho
 *         - codigo_Utilizador
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único do encarregado
 *         nome:
 *           type: string
 *           maxLength: 250
 *           description: Nome completo do encarregado
 *         telefone:
 *           type: string
 *           maxLength: 45
 *           description: Número de telefone
 *         email:
 *           type: string
 *           maxLength: 45
 *           description: Endereço de email
 *         codigo_Profissao:
 *           type: integer
 *           description: Código da profissão
 *         local_Trabalho:
 *           type: string
 *           maxLength: 45
 *           description: Local de trabalho
 *         codigo_Utilizador:
 *           type: integer
 *           description: Código do utilizador associado
 *         dataCadastro:
 *           type: string
 *           format: date
 *           description: Data de cadastro
 *         status:
 *           type: integer
 *           enum: [0, 1]
 *           description: Status (0=Inativo, 1=Ativo)
 *       example:
 *         nome: "João Silva"
 *         telefone: "923456789"
 *         email: "joao@email.com"
 *         codigo_Profissao: 1
 *         local_Trabalho: "Hospital Central"
 *         codigo_Utilizador: 1
 *         status: 1
 *
 *     Proveniencia:
 *       type: object
 *       required:
 *         - designacao
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único da proveniência
 *         designacao:
 *           type: string
 *           maxLength: 100
 *           description: Nome da escola de proveniência
 *         codigoStatus:
 *           type: integer
 *           enum: [0, 1]
 *           description: Status (0=Inativo, 1=Ativo)
 *         localizacao:
 *           type: string
 *           maxLength: 45
 *           description: Localização da escola
 *         contacto:
 *           type: string
 *           maxLength: 45
 *           description: Contacto da escola
 *         codigoUtilizador:
 *           type: integer
 *           description: Código do utilizador
 *         dataCadastro:
 *           type: string
 *           format: date
 *           description: Data de cadastro
 *       example:
 *         designacao: "Escola Primária da Maianga"
 *         codigoStatus: 1
 *         localizacao: "Maianga"
 *         contacto: "923456789"
 *
 *     Aluno:
 *       type: object
 *       required:
 *         - nome
 *         - codigo_Nacionalidade
 *         - codigo_Comuna
 *         - codigo_Encarregado
 *         - codigo_Utilizador
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único do aluno
 *         nome:
 *           type: string
 *           maxLength: 200
 *           description: Nome completo do aluno
 *         pai:
 *           type: string
 *           maxLength: 200
 *           description: Nome do pai
 *         mae:
 *           type: string
 *           maxLength: 200
 *           description: Nome da mãe
 *         codigo_Nacionalidade:
 *           type: integer
 *           description: Código da nacionalidade
 *         codigo_Estado_Civil:
 *           type: integer
 *           description: Código do estado civil
 *         dataNascimento:
 *           type: string
 *           format: date
 *           description: Data de nascimento
 *         email:
 *           type: string
 *           maxLength: 45
 *           description: Email do aluno
 *         telefone:
 *           type: string
 *           maxLength: 45
 *           description: Telefone do aluno
 *         codigo_Status:
 *           type: integer
 *           enum: [0, 1]
 *           description: Status (0=Inativo, 1=Ativo)
 *         codigo_Comuna:
 *           type: integer
 *           description: Código da comuna
 *         codigo_Encarregado:
 *           type: integer
 *           description: Código do encarregado
 *         codigo_Utilizador:
 *           type: integer
 *           description: Código do utilizador
 *         sexo:
 *           type: string
 *           enum: [M, F, Masculino, Feminino]
 *           description: Sexo do aluno
 *         n_documento_identificacao:
 *           type: string
 *           maxLength: 45
 *           description: Número do documento de identificação
 *         dataCadastro:
 *           type: string
 *           format: date
 *           description: Data de cadastro
 *         saldo:
 *           type: number
 *           description: Saldo do aluno
 *         desconto:
 *           type: number
 *           description: Percentual de desconto
 *         url_Foto:
 *           type: string
 *           maxLength: 345
 *           description: URL da foto do aluno
 *         tipo_desconto:
 *           type: string
 *           maxLength: 45
 *           description: Tipo de desconto
 *         escolaProveniencia:
 *           type: integer
 *           description: Código da escola de proveniência
 *         saldo_Anterior:
 *           type: number
 *           description: Saldo anterior
 *         codigoTipoDocumento:
 *           type: integer
 *           description: Código do tipo de documento
 *         morada:
 *           type: string
 *           maxLength: 60
 *           description: Morada do aluno
 *         dataEmissao:
 *           type: string
 *           format: date
 *           description: Data de emissão do documento
 *         motivo_Desconto:
 *           type: string
 *           maxLength: 455
 *           description: Motivo do desconto
 *         provinciaEmissao:
 *           type: string
 *           maxLength: 45
 *           description: Província de emissão do documento
 *       example:
 *         nome: "Maria Santos"
 *         pai: "João Santos"
 *         mae: "Ana Santos"
 *         codigo_Nacionalidade: 1
 *         dataNascimento: "2010-05-15"
 *         email: "maria@email.com"
 *         telefone: "923456789"
 *         codigo_Comuna: 1
 *         codigo_Encarregado: 1
 *         codigo_Utilizador: 1
 *         sexo: "F"
 *         n_documento_identificacao: "123456789LA"
 *         saldo: 0
 *         morada: "Rua da Paz, 123"
 *
 *     AlunoComEncarregado:
 *       type: object
 *       required:
 *         - nome
 *         - codigo_Nacionalidade
 *         - codigo_Comuna
 *         - encarregado
 *       properties:
 *         nome:
 *           type: string
 *           maxLength: 200
 *           description: Nome completo do aluno
 *         pai:
 *           type: string
 *           maxLength: 200
 *           description: Nome do pai
 *         mae:
 *           type: string
 *           maxLength: 200
 *           description: Nome da mãe
 *         codigo_Nacionalidade:
 *           type: integer
 *           description: Código da nacionalidade
 *         codigo_Estado_Civil:
 *           type: integer
 *           description: Código do estado civil
 *         dataNascimento:
 *           type: string
 *           format: date
 *           description: Data de nascimento
 *         email:
 *           type: string
 *           maxLength: 45
 *           description: Email do aluno
 *         telefone:
 *           type: string
 *           maxLength: 45
 *           description: Telefone do aluno
 *         codigo_Status:
 *           type: integer
 *           enum: [0, 1]
 *           description: Status (0=Inativo, 1=Ativo)
 *           default: 1
 *         codigo_Comuna:
 *           type: integer
 *           description: Código da comuna
 *         sexo:
 *           type: string
 *           enum: [M, F, Masculino, Feminino]
 *           description: Sexo do aluno
 *         n_documento_identificacao:
 *           type: string
 *           maxLength: 45
 *           description: Número do documento de identificação
 *         saldo:
 *           type: number
 *           description: Saldo do aluno
 *           default: 0
 *         desconto:
 *           type: number
 *           description: Percentual de desconto
 *         url_Foto:
 *           type: string
 *           maxLength: 345
 *           description: URL da foto do aluno
 *           default: "fotoDefault.png"
 *         tipo_desconto:
 *           type: string
 *           maxLength: 45
 *           description: Tipo de desconto
 *         escolaProveniencia:
 *           type: integer
 *           description: Código da escola de proveniência
 *         saldo_Anterior:
 *           type: number
 *           description: Saldo anterior
 *         codigoTipoDocumento:
 *           type: integer
 *           description: Código do tipo de documento
 *           default: 1
 *         morada:
 *           type: string
 *           maxLength: 60
 *           description: Morada do aluno
 *           default: "..."
 *         dataEmissao:
 *           type: string
 *           format: date
 *           description: Data de emissão do documento
 *         motivo_Desconto:
 *           type: string
 *           maxLength: 455
 *           description: Motivo do desconto
 *         provinciaEmissao:
 *           type: string
 *           maxLength: 45
 *           description: Província de emissão do documento
 *           default: "LUANDA"
 *         encarregado:
 *           type: object
 *           required:
 *             - nome
 *             - telefone
 *             - codigo_Profissao
 *             - local_Trabalho
 *           properties:
 *             nome:
 *               type: string
 *               maxLength: 250
 *               description: Nome completo do encarregado
 *             telefone:
 *               type: string
 *               maxLength: 45
 *               description: Número de telefone do encarregado
 *             email:
 *               type: string
 *               maxLength: 45
 *               description: Email do encarregado
 *             codigo_Profissao:
 *               type: integer
 *               description: Código da profissão do encarregado
 *             local_Trabalho:
 *               type: string
 *               maxLength: 45
 *               description: Local de trabalho do encarregado
 *             status:
 *               type: integer
 *               enum: [0, 1]
 *               description: Status do encarregado (0=Inativo, 1=Ativo)
 *               default: 1
 *       example:
 *         nome: "Maria Santos"
 *         pai: "João Santos"
 *         mae: "Ana Santos"
 *         codigo_Nacionalidade: 1
 *         dataNascimento: "2010-05-15T00:00:00.000Z"
 *         email: "maria.santos@email.com"
 *         telefone: "923456789"
 *         codigo_Comuna: 1
 *         sexo: "F"
 *         n_documento_identificacao: "123456789LA"
 *         saldo: 0
 *         morada: "Rua da Paz, 123"
 *         codigoTipoDocumento: 1
 *         encarregado:
 *           nome: "João Santos (Pai)"
 *           telefone: "923456780"
 *           email: "joao.santos@email.com"
 *           codigo_Profissao: 1
 *           local_Trabalho: "Hospital Central de Luanda"
 *           status: 1
 *
 *     Matricula:
 *       type: object
 *       required:
 *         - codigo_Aluno
 *         - data_Matricula
 *         - codigo_Curso
 *         - codigo_Utilizador
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único da matrícula
 *         codigo_Aluno:
 *           type: integer
 *           description: Código do aluno
 *         data_Matricula:
 *           type: string
 *           format: date
 *           description: Data da matrícula
 *         codigo_Curso:
 *           type: integer
 *           description: Código do curso
 *         codigo_Utilizador:
 *           type: integer
 *           description: Código do utilizador que registrou
 *         codigoStatus:
 *           type: integer
 *           enum: [0, 1]
 *           description: Status (0=Inativo, 1=Ativo)
 *       example:
 *         codigo_Aluno: 1
 *         data_Matricula: "2024-01-15"
 *         codigo_Curso: 1
 *         codigo_Utilizador: 1
 *         codigoStatus: 1
 *
 *     Confirmacao:
 *       type: object
 *       required:
 *         - codigo_Matricula
 *         - data_Confirmacao
 *         - codigo_Turma
 *         - codigo_Ano_lectivo
 *         - codigo_Utilizador
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único da confirmação
 *         codigo_Matricula:
 *           type: integer
 *           description: Código da matrícula
 *         data_Confirmacao:
 *           type: string
 *           format: date
 *           description: Data da confirmação
 *         codigo_Turma:
 *           type: integer
 *           description: Código da turma
 *         codigo_Ano_lectivo:
 *           type: integer
 *           description: Código do ano letivo
 *         codigo_Utilizador:
 *           type: integer
 *           description: Código do utilizador que confirmou
 *         mes_Comecar:
 *           type: string
 *           format: date
 *           description: Mês para começar as aulas
 *         codigo_Status:
 *           type: integer
 *           enum: [0, 1]
 *           description: Status (0=Inativo, 1=Ativo)
 *         classificacao:
 *           type: string
 *           maxLength: 45
 *           description: Classificação do aluno
 *       example:
 *         codigo_Matricula: 1
 *         data_Confirmacao: "2024-01-20"
 *         codigo_Turma: 1
 *         codigo_Ano_lectivo: 1
 *         codigo_Utilizador: 1
 *         classificacao: "Aprovado"
 *
 *     Transferencia:
 *       type: object
 *       required:
 *         - codigoAluno
 *       properties:
 *         codigo:
 *           type: integer
 *           description: Código único da transferência
 *         codigoAluno:
 *           type: integer
 *           description: Código do aluno
 *         codigoEscola:
 *           type: integer
 *           description: Código da escola de destino
 *         codigoUtilizador:
 *           type: integer
 *           description: Código do utilizador
 *         dataTransferencia:
 *           type: string
 *           format: date
 *           description: Data da transferência
 *         codigoMotivo:
 *           type: integer
 *           description: Código do motivo da transferência
 *         obs:
 *           type: string
 *           maxLength: 150
 *           description: Observações
 *         dataActualizacao:
 *           type: string
 *           format: date
 *           description: Data de atualização
 *       example:
 *         codigoAluno: 1
 *         codigoEscola: 2
 *         dataTransferencia: "2024-06-15"
 *         codigoMotivo: 1
 *         obs: "Transferência por mudança de residência"
 *
 *   responses:
 *     UnauthorizedError:
 *       description: Token de acesso requerido ou inválido
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: "Token de acesso requerido"
 *     
 *     ValidationError:
 *       description: Erro de validação nos dados enviados
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: "Erro de validação"
 *               errors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     field:
 *                       type: string
 *                     message:
 *                       type: string
 *     
 *     NotFoundError:
 *       description: Recurso não encontrado
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: "Recurso não encontrado"
 */

import { Router } from 'express';
import { StudentManagementController } from '../controller/student-management.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// Aplicar middleware de autenticação para todas as rotas
	// router.use(authenticateToken);

// Rota de teste para verificar dados
router.get('/test-data', async (req, res) => {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const matriculas = await prisma.tb_matriculas.count();
    const alunos = await prisma.tb_alunos.count();
    const confirmacoes = await prisma.tb_confirmacoes.count();
    
    // Buscar algumas matrículas de exemplo
    const exemploMatriculas = await prisma.tb_matriculas.findMany({
      take: 3,
      include: {
        tb_alunos: {
          select: {
            codigo: true,
            nome: true
          }
        },
        tb_cursos: {
          select: {
            codigo: true,
            designacao: true
          }
        }
      }
    });
    
    res.json({
      success: true,
      data: {
        matriculas,
        alunos,
        confirmacoes,
        matriculasAtivas: await prisma.tb_matriculas.count({
          where: {
            codigoStatus: 1
          }
        }),
        matriculasSemConfirmacao: await prisma.tb_matriculas.count({
          where: {
            codigoStatus: 1,
            tb_confirmacoes: {
              none: {}
            }
          }
        }),
        exemploMatriculas
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Rota simples para buscar alunos matriculados
router.get('/alunos-matriculados', async (req, res) => {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    console.log('Buscando alunos matriculados...');
    
    const matriculas = await prisma.tb_matriculas.findMany({
      where: {
        codigoStatus: 1
      },
      include: {
        tb_alunos: true,
        tb_cursos: true
      },
      orderBy: {
        data_Matricula: 'desc'
      }
    });
    
    console.log(`Encontradas ${matriculas.length} matrículas`);
    
    res.json({
      success: true,
      message: `${matriculas.length} matrículas encontradas`,
      data: matriculas
    });
  } catch (error) {
    console.error('Erro ao buscar alunos matriculados:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ===============================
// ROTAS PARA ENCARREGADOS
// ===============================

/**
 * @swagger
 * /api/student-management/encarregados:
 *   post:
 *     summary: Criar novo encarregado
 *     tags: [Gestão de Estudantes - Encarregados]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Encarregado'
 *     responses:
 *       201:
 *         description: Encarregado criado com sucesso
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
 *                   example: "Encarregado criado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Encarregado'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/encarregados', StudentManagementController.createEncarregado);

/**
 * @swagger
 * /api/student-management/encarregados:
 *   get:
 *     summary: Listar encarregados com paginação e pesquisa
 *     tags: [Gestão de Estudantes - Encarregados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Itens por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Termo de pesquisa (nome, telefone, email, local de trabalho)
 *     responses:
 *       200:
 *         description: Lista de encarregados
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
 *                   example: "Encarregados encontrados"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Encarregado'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *                     itemsPerPage:
 *                       type: integer
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/encarregados', StudentManagementController.getEncarregados);

/**
 * @swagger
 * /api/student-management/encarregados/{id}:
 *   get:
 *     summary: Buscar encarregado por ID
 *     tags: [Gestão de Estudantes - Encarregados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do encarregado
 *     responses:
 *       200:
 *         description: Encarregado encontrado
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
 *                   example: "Encarregado encontrado"
 *                 data:
 *                   $ref: '#/components/schemas/Encarregado'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/encarregados/:id', StudentManagementController.getEncarregadoById);

/**
 * @swagger
 * /api/student-management/encarregados/{id}:
 *   put:
 *     summary: Atualizar encarregado
 *     tags: [Gestão de Estudantes - Encarregados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do encarregado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Encarregado'
 *     responses:
 *       200:
 *         description: Encarregado atualizado com sucesso
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
 *                   example: "Encarregado atualizado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Encarregado'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.put('/encarregados/:id', StudentManagementController.updateEncarregado);

/**
 * @swagger
 * /api/student-management/encarregados/{id}:
 *   delete:
 *     summary: Excluir encarregado
 *     tags: [Gestão de Estudantes - Encarregados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do encarregado
 *     responses:
 *       200:
 *         description: Encarregado excluído com sucesso
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
 *                   example: "Encarregado excluído com sucesso"
 *       400:
 *         description: Não é possível excluir encarregado com alunos associados
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.delete('/encarregados/:id', StudentManagementController.deleteEncarregado);

/**
 * @swagger
 * /api/student-management/encarregados/batch:
 *   post:
 *     summary: Criar múltiplos encarregados
 *     tags: [Gestão de Estudantes - Encarregados]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               encarregados:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Encarregado'
 *     responses:
 *       201:
 *         description: Processamento de encarregados concluído
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
 *                   example: "Processamento concluído. 5 encarregados criados, 0 erros"
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
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/encarregados/batch', StudentManagementController.createMultipleEncarregados);

// ===============================
// ROTAS PARA PROVENIÊNCIAS
// ===============================

/**
 * @swagger
 * /api/student-management/proveniencias:
 *   post:
 *     summary: Criar nova proveniência
 *     tags: [Gestão de Estudantes - Proveniências]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Proveniencia'
 *     responses:
 *       201:
 *         description: Proveniência criada com sucesso
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/proveniencias', StudentManagementController.createProveniencia);

/**
 * @swagger
 * /api/student-management/proveniencias:
 *   get:
 *     summary: Listar proveniências com paginação e pesquisa
 *     tags: [Gestão de Estudantes - Proveniências]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Itens por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Termo de pesquisa (designação, localização, contacto)
 *     responses:
 *       200:
 *         description: Lista de proveniências
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/proveniencias', StudentManagementController.getProveniencias);

/**
 * @swagger
 * /api/student-management/proveniencias/{id}:
 *   get:
 *     summary: Buscar proveniência por ID
 *     tags: [Gestão de Estudantes - Proveniências]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da proveniência
 *     responses:
 *       200:
 *         description: Proveniência encontrada
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/proveniencias/:id', StudentManagementController.getProvenienciaById);

/**
 * @swagger
 * /api/student-management/proveniencias/{id}:
 *   put:
 *     summary: Atualizar proveniência
 *     tags: [Gestão de Estudantes - Proveniências]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da proveniência
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Proveniencia'
 *     responses:
 *       200:
 *         description: Proveniência atualizada com sucesso
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.put('/proveniencias/:id', StudentManagementController.updateProveniencia);

/**
 * @swagger
 * /api/student-management/proveniencias/{id}:
 *   delete:
 *     summary: Excluir proveniência
 *     tags: [Gestão de Estudantes - Proveniências]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da proveniência
 *     responses:
 *       200:
 *         description: Proveniência excluída com sucesso
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.delete('/proveniencias/:id', StudentManagementController.deleteProveniencia);

// ===============================
// ROTAS PARA ALUNOS
// ===============================

/**
 * @swagger
 * /api/student-management/alunos:
 *   post:
 *     summary: Criar novo aluno (com ou sem encarregado)
 *     description: |
 *       Este endpoint permite criar um aluno de duas formas:
 *       
 *       **1. Com Encarregado Automático (NOVO):**
 *       - Envie os dados do aluno com um objeto `encarregado` incluído
 *       - O sistema criará automaticamente o encarregado
 *       - O `codigo_Utilizador` será obtido do usuário logado
 *       - Não é necessário enviar `codigo_Encarregado` nem `codigo_Utilizador`
 *       
 *       **2. Sem Encarregado (Fluxo Original):**
 *       - Envie os dados do aluno sem o objeto `encarregado`
 *       - Você precisa fornecer `codigo_Encarregado` e `codigo_Utilizador`
 *       - O encarregado deve existir previamente
 *     tags: [Gestão de Estudantes - Alunos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/AlunoComEncarregado'
 *               - $ref: '#/components/schemas/Aluno'
 *           examples:
 *             comEncarregado:
 *               summary: Criar aluno com encarregado (novo)
 *               description: Cria o aluno e o encarregado automaticamente. O codigo_Utilizador é obtido do usuário logado.
 *               value:
 *                 nome: "Maria Santos"
 *                 pai: "João Santos"
 *                 mae: "Ana Santos"
 *                 codigo_Nacionalidade: 1
 *                 dataNascimento: "2010-05-15T00:00:00.000Z"
 *                 email: "maria.santos@email.com"
 *                 telefone: "923456789"
 *                 codigo_Comuna: 1
 *                 sexo: "F"
 *                 n_documento_identificacao: "123456789LA"
 *                 saldo: 0
 *                 morada: "Rua da Paz, 123"
 *                 codigoTipoDocumento: 1
 *                 encarregado:
 *                   nome: "João Santos (Pai)"
 *                   telefone: "923456780"
 *                   email: "joao.santos@email.com"
 *                   codigo_Profissao: 1
 *                   local_Trabalho: "Hospital Central de Luanda"
 *                   status: 1
 *             semEncarregado:
 *               summary: Criar aluno sem encarregado (fluxo original)
 *               description: Cria apenas o aluno. O encarregado deve existir previamente.
 *               value:
 *                 nome: "Pedro Silva"
 *                 pai: "Carlos Silva"
 *                 mae: "Teresa Silva"
 *                 codigo_Nacionalidade: 1
 *                 dataNascimento: "2011-08-20T00:00:00.000Z"
 *                 email: "pedro.silva@email.com"
 *                 telefone: "923456790"
 *                 codigo_Comuna: 1
 *                 codigo_Encarregado: 5
 *                 codigo_Utilizador: 1
 *                 sexo: "M"
 *                 n_documento_identificacao: "987654321LA"
 *                 saldo: 0
 *                 morada: "Rua da Esperança, 456"
 *     responses:
 *       201:
 *         description: Aluno criado com sucesso (com ou sem encarregado)
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
 *                   example: "Aluno e encarregado criados com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     codigo:
 *                       type: integer
 *                     nome:
 *                       type: string
 *                     codigo_Encarregado:
 *                       type: integer
 *                     codigo_Utilizador:
 *                       type: integer
 *                     tb_encarregados:
 *                       type: object
 *                       description: Dados completos do encarregado (quando criado automaticamente)
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Recurso não encontrado (profissão, nacionalidade, tipo de documento, etc.)
 *       409:
 *         description: Conflito - Aluno com documento de identificação já existe
 */
router.post('/alunos', StudentManagementController.createAluno);

/**
 * @swagger
 * /api/student-management/alunos:
 *   get:
 *     summary: Listar alunos com paginação e pesquisa
 *     tags: [Gestão de Estudantes - Alunos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Itens por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Termo de pesquisa (nome, pai, mãe, email, telefone, documento)
 *     responses:
 *       200:
 *         description: Lista de alunos
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/alunos', StudentManagementController.getAlunos);

/**
 * @swagger
 * /api/student-management/alunos/{id}:
 *   get:
 *     summary: Buscar aluno por ID
 *     tags: [Gestão de Estudantes - Alunos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do aluno
 *     responses:
 *       200:
 *         description: Aluno encontrado
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/alunos/:id', StudentManagementController.getAlunoById);

/**
 * @swagger
 * /api/student-management/alunos/{id}:
 *   put:
 *     summary: Atualizar aluno
 *     tags: [Gestão de Estudantes - Alunos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do aluno
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Aluno'
 *     responses:
 *       200:
 *         description: Aluno atualizado com sucesso
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.put('/alunos/:id', StudentManagementController.updateAluno);

/**
 * @swagger
 * /api/student-management/alunos/{id}:
 *   delete:
 *     summary: Excluir aluno
 *     tags: [Gestão de Estudantes - Alunos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do aluno
 *     responses:
 *       200:
 *         description: Aluno excluído com sucesso
 *       400:
 *         description: Não é possível excluir aluno com matrículas ou pagamentos associados
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.delete('/alunos/:id', StudentManagementController.deleteAluno);

/**
 * @swagger
 * /api/student-management/alunos/batch:
 *   post:
 *     summary: Criar múltiplos alunos
 *     tags: [Gestão de Estudantes - Alunos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               alunos:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Aluno'
 *     responses:
 *       201:
 *         description: Processamento de alunos concluído
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/alunos/batch', StudentManagementController.createMultipleAlunos);

/**
 * @swagger
 * /api/student-management/alunos/sem-matricula:
 *   get:
 *     summary: Listar alunos sem matrícula
 *     tags: [Gestão de Estudantes - Alunos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de alunos sem matrícula
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/alunos/sem-matricula', StudentManagementController.getAlunosWithoutMatricula);

/**
 * @swagger
 * /api/student-management/alunos/turma/{codigo_Turma}:
 *   get:
 *     summary: Buscar alunos por turma
 *     tags: [Gestão de Estudantes - Alunos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: codigo_Turma
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código da turma
 *     responses:
 *       200:
 *         description: Alunos da turma encontrados
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/alunos/turma/:codigo_Turma', StudentManagementController.getAlunosByTurma);

// ===============================
// ROTAS PARA MATRÍCULAS
// ===============================

/**
 * @swagger
 * /api/student-management/matriculas:
 *   post:
 *     summary: Criar nova matrícula
 *     tags: [Gestão de Estudantes - Matrículas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Matricula'
 *     responses:
 *       201:
 *         description: Matrícula criada com sucesso
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/matriculas', StudentManagementController.createMatricula);

/**
 * @swagger
 * /api/student-management/matriculas:
 *   get:
 *     summary: Listar matrículas com paginação e pesquisa
 *     tags: [Gestão de Estudantes - Matrículas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Itens por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Termo de pesquisa (nome do aluno, curso)
 *     responses:
 *       200:
 *         description: Lista de matrículas
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/matriculas', StudentManagementController.getMatriculas);

/**
 * @swagger
 * /api/student-management/matriculas/{id}:
 *   get:
 *     summary: Buscar matrícula por ID
 *     tags: [Gestão de Estudantes - Matrículas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da matrícula
 *     responses:
 *       200:
 *         description: Matrícula encontrada
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/matriculas/:id', StudentManagementController.getMatriculaById);

/**
 * @swagger
 * /api/student-management/matriculas/{id}:
 *   put:
 *     summary: Atualizar matrícula
 *     tags: [Gestão de Estudantes - Matrículas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da matrícula
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Matricula'
 *     responses:
 *       200:
 *         description: Matrícula atualizada com sucesso
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.put('/matriculas/:id', StudentManagementController.updateMatricula);

/**
 * @swagger
 * /api/student-management/matriculas/{id}:
 *   delete:
 *     summary: Excluir matrícula
 *     tags: [Gestão de Estudantes - Matrículas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da matrícula
 *     responses:
 *       200:
 *         description: Matrícula excluída com sucesso
 *       400:
 *         description: Não é possível excluir matrícula com confirmações associadas
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.delete('/matriculas/:id', StudentManagementController.deleteMatricula);

/**
 * @swagger
 * /api/student-management/matriculas/batch:
 *   post:
 *     summary: Criar múltiplas matrículas
 *     tags: [Gestão de Estudantes - Matrículas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               matriculas:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Matricula'
 *     responses:
 *       201:
 *         description: Processamento de matrículas concluído
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/matriculas/batch', StudentManagementController.createMultipleMatriculas);

/**
 * @swagger
 * /api/student-management/matriculas/sem-confirmacao:
 *   get:
 *     summary: Listar todas as matrículas ativas (para confirmações)
 *     description: |
 *       Retorna todas as matrículas ativas com informações dos alunos, cursos 
 *       e confirmações existentes. Usado para permitir criar confirmações 
 *       para qualquer matrícula, independente de já ter confirmações anteriores.
 *     tags: [Gestão de Estudantes - Matrículas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de matrículas ativas
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
 *                   example: "Matrículas obtidas com sucesso"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       codigo:
 *                         type: integer
 *                       data_Matricula:
 *                         type: string
 *                         format: date
 *                       tb_alunos:
 *                         type: object
 *                         properties:
 *                           codigo:
 *                             type: integer
 *                           nome:
 *                             type: string
 *                           email:
 *                             type: string
 *                           telefone:
 *                             type: string
 *                       tb_cursos:
 *                         type: object
 *                         properties:
 *                           codigo:
 *                             type: integer
 *                           designacao:
 *                             type: string
 *                       tb_confirmacoes:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             codigo:
 *                               type: integer
 *                             codigo_Ano_lectivo:
 *                               type: integer
 *                             data_Confirmacao:
 *                               type: string
 *                               format: date
 *                             classificacao:
 *                               type: string
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/matriculas/sem-confirmacao', StudentManagementController.getMatriculasWithoutConfirmacao);

/**
 * @swagger
 * /api/student-management/matriculas/ano-lectivo/{codigo_AnoLectivo}:
 *   get:
 *     summary: Buscar matrículas por ano letivo
 *     tags: [Gestão de Estudantes - Matrículas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: codigo_AnoLectivo
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código do ano letivo
 *     responses:
 *       200:
 *         description: Matrículas do ano letivo encontradas
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/matriculas/ano-lectivo/:codigo_AnoLectivo', StudentManagementController.getMatriculasByAnoLectivo);

// ===============================
// ROTAS PARA CONFIRMAÇÕES
// ===============================

/**
 * @swagger
 * /api/student-management/confirmacoes:
 *   post:
 *     summary: Criar nova confirmação
 *     tags: [Gestão de Estudantes - Confirmações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Confirmacao'
 *     responses:
 *       201:
 *         description: Confirmação criada com sucesso
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/confirmacoes', StudentManagementController.createConfirmacao);

/**
 * @swagger
 * /api/student-management/confirmacoes:
 *   get:
 *     summary: Listar confirmações com paginação e pesquisa
 *     tags: [Gestão de Estudantes - Confirmações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Itens por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Termo de pesquisa (nome do aluno, turma, classificação)
 *     responses:
 *       200:
 *         description: Lista de confirmações
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/confirmacoes', StudentManagementController.getConfirmacoes);

// Rota alternativa em inglês para compatibilidade com frontend
router.get('/confirmations', StudentManagementController.getConfirmacoes);

/**
 * @swagger
 * /api/student-management/confirmacoes/{id}:
 *   get:
 *     summary: Buscar confirmação por ID
 *     tags: [Gestão de Estudantes - Confirmações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da confirmação
 *     responses:
 *       200:
 *         description: Confirmação encontrada
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/confirmacoes/:id', StudentManagementController.getConfirmacaoById);

/**
 * @swagger
 * /api/student-management/confirmacoes/{id}:
 *   put:
 *     summary: Atualizar confirmação
 *     tags: [Gestão de Estudantes - Confirmações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da confirmação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Confirmacao'
 *     responses:
 *       200:
 *         description: Confirmação atualizada com sucesso
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.put('/confirmacoes/:id', StudentManagementController.updateConfirmacao);

/**
 * @swagger
 * /api/student-management/confirmacoes/{id}:
 *   delete:
 *     summary: Excluir confirmação
 *     tags: [Gestão de Estudantes - Confirmações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da confirmação
 *     responses:
 *       200:
 *         description: Confirmação excluída com sucesso
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.delete('/confirmacoes/:id', StudentManagementController.deleteConfirmacao);

/**
 * @swagger
 * /api/student-management/confirmacoes/batch:
 *   post:
 *     summary: Criar múltiplas confirmações
 *     tags: [Gestão de Estudantes - Confirmações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               confirmacoes:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Confirmacao'
 *     responses:
 *       201:
 *         description: Processamento de confirmações concluído
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/confirmacoes/batch', StudentManagementController.createMultipleConfirmacoes);

/**
 * @swagger
 * /api/student-management/confirmacoes/turma/{codigo_Turma}/ano/{codigo_AnoLectivo}:
 *   get:
 *     summary: Buscar confirmações por turma e ano letivo
 *     tags: [Gestão de Estudantes - Confirmações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: codigo_Turma
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código da turma
 *       - in: path
 *         name: codigo_AnoLectivo
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código do ano letivo
 *     responses:
 *       200:
 *         description: Confirmações da turma e ano encontradas
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/confirmacoes/turma/:codigo_Turma/ano/:codigo_AnoLectivo', StudentManagementController.getConfirmacoesByTurmaAndAno);

// ===============================
// ROTAS PARA TRANSFERÊNCIAS
// ===============================

/**
 * @swagger
 * /api/student-management/transferencias:
 *   post:
 *     summary: Criar nova transferência
 *     tags: [Gestão de Estudantes - Transferências]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transferencia'
 *     responses:
 *       201:
 *         description: Transferência criada com sucesso
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/transferencias', StudentManagementController.createTransferencia);

/**
 * @swagger
 * /api/student-management/transferencias:
 *   get:
 *     summary: Listar transferências com paginação e pesquisa
 *     tags: [Gestão de Estudantes - Transferências]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Itens por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Termo de pesquisa (nome do aluno, observações)
 *     responses:
 *       200:
 *         description: Lista de transferências
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/transferencias', StudentManagementController.getTransferencias);

/**
 * @swagger
 * /api/student-management/transferencias/{id}:
 *   get:
 *     summary: Buscar transferência por ID
 *     tags: [Gestão de Estudantes - Transferências]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da transferência
 *     responses:
 *       200:
 *         description: Transferência encontrada
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/transferencias/:id', StudentManagementController.getTransferenciaById);

/**
 * @swagger
 * /api/student-management/transferencias/{id}:
 *   put:
 *     summary: Atualizar transferência
 *     tags: [Gestão de Estudantes - Transferências]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da transferência
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transferencia'
 *     responses:
 *       200:
 *         description: Transferência atualizada com sucesso
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.put('/transferencias/:id', StudentManagementController.updateTransferencia);

/**
 * @swagger
 * /api/student-management/transferencias/{id}:
 *   delete:
 *     summary: Excluir transferência
 *     tags: [Gestão de Estudantes - Transferências]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da transferência
 *     responses:
 *       200:
 *         description: Transferência excluída com sucesso
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.delete('/transferencias/:id', StudentManagementController.deleteTransferencia);

// ===============================
// ROTAS PARA ESTATÍSTICAS
// ===============================

/**
 * @swagger
 * /api/student-management/statistics/alunos:
 *   get:
 *     summary: Obter estatísticas dos alunos
 *     description: |
 *       Retorna estatísticas completas dos alunos, incluindo:
 *       - Total de alunos
 *       - Alunos ativos (status = 1)
 *       - Alunos inativos (status != 1)
 *       - Alunos com matrícula
 *       - Alunos sem matrícula
 *       - Distribuição por sexo
 *       - Percentuais calculados
 *       
 *       Suporta filtros opcionais por status e curso.
 *     tags: [Gestão de Estudantes - Estatísticas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, '1', '2', '3']
 *         description: Filtro por status (opcional)
 *         example: '1'
 *       - in: query
 *         name: curso
 *         schema:
 *           type: string
 *         description: Filtro por código do curso (opcional)
 *         example: '5'
 *     responses:
 *       200:
 *         description: Estatísticas obtidas com sucesso
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
 *                   example: "Estatísticas obtidas com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalAlunos:
 *                       type: integer
 *                       description: Número total de alunos
 *                       example: 150
 *                     alunosAtivos:
 *                       type: integer
 *                       description: Número de alunos ativos
 *                       example: 145
 *                     alunosInativos:
 *                       type: integer
 *                       description: Número de alunos inativos
 *                       example: 5
 *                     alunosComMatricula:
 *                       type: integer
 *                       description: Número de alunos com matrícula
 *                       example: 140
 *                     alunosSemMatricula:
 *                       type: integer
 *                       description: Número de alunos sem matrícula
 *                       example: 10
 *                     distribuicaoPorSexo:
 *                       type: object
 *                       properties:
 *                         masculino:
 *                           type: integer
 *                           example: 80
 *                         feminino:
 *                           type: integer
 *                           example: 70
 *                         outro:
 *                           type: integer
 *                           example: 0
 *                     percentuais:
 *                       type: object
 *                       properties:
 *                         ativos:
 *                           type: string
 *                           description: Percentual de alunos ativos
 *                           example: "96.67"
 *                         inativos:
 *                           type: string
 *                           description: Percentual de alunos inativos
 *                           example: "3.33"
 *                         comMatricula:
 *                           type: string
 *                           description: Percentual de alunos com matrícula
 *                           example: "93.33"
 *                         semMatricula:
 *                           type: string
 *                           description: Percentual de alunos sem matrícula
 *                           example: "6.67"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Erro ao gerar estatísticas
 */
router.get('/statistics/alunos', StudentManagementController.getAlunosStatistics);

/**
 * @swagger
 * /api/student-management/statistics/matriculas:
 *   get:
 *     summary: Obter estatísticas das matrículas
 *     description: |
 *       Retorna estatísticas completas das matrículas, incluindo:
 *       - Total de matrículas
 *       - Matrículas ativas (codigoStatus = 1)
 *       - Matrículas inativas (codigoStatus != 1)
 *       - Matrículas com confirmação
 *       - Matrículas sem confirmação
 *       - Distribuição por curso (top 5)
 *       - Percentuais calculados
 *       
 *       Suporta filtros opcionais por status e curso.
 *     tags: [Gestão de Estudantes - Estatísticas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, '1', '0']
 *         description: Filtro por status da matrícula (opcional)
 *         example: '1'
 *       - in: query
 *         name: curso
 *         schema:
 *           type: string
 *         description: Filtro por código do curso (opcional)
 *         example: '5'
 *     responses:
 *       200:
 *         description: Estatísticas obtidas com sucesso
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
 *                   example: "Estatísticas de matrículas obtidas com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       description: Número total de matrículas
 *                       example: 200
 *                     ativas:
 *                       type: integer
 *                       description: Número de matrículas ativas
 *                       example: 195
 *                     inativas:
 *                       type: integer
 *                       description: Número de matrículas inativas
 *                       example: 5
 *                     comConfirmacao:
 *                       type: integer
 *                       description: Número de matrículas com confirmação
 *                       example: 180
 *                     semConfirmacao:
 *                       type: integer
 *                       description: Número de matrículas sem confirmação
 *                       example: 20
 *                     percentualAtivas:
 *                       type: string
 *                       description: Percentual de matrículas ativas
 *                       example: "97.50"
 *                     percentualComConfirmacao:
 *                       type: string
 *                       description: Percentual de matrículas com confirmação
 *                       example: "90.00"
 *                     distribuicaoPorCurso:
 *                       type: array
 *                       description: Top 5 cursos com mais matrículas
 *                       items:
 *                         type: object
 *                         properties:
 *                           curso:
 *                             type: string
 *                             example: "Informática de Gestão"
 *                           total:
 *                             type: integer
 *                             example: 85
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Erro ao gerar estatísticas
 */
router.get('/statistics/matriculas', StudentManagementController.getMatriculasStatistics);

/**
 * @swagger
 * /api/student-management/statistics/confirmacoes:
 *   get:
 *     summary: Obter estatísticas de confirmações
 *     tags: [Estatísticas]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filtrar por status (1 para ativas, outro para inativas)
 *       - in: query
 *         name: anoLectivo
 *         schema:
 *           type: integer
 *         description: Filtrar por código do ano letivo
 *     responses:
 *       200:
 *         description: Estatísticas obtidas com sucesso
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
 *                   example: "Estatísticas de confirmações obtidas com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalConfirmacoes:
 *                       type: integer
 *                       example: 150
 *                     confirmacoesAtivas:
 *                       type: integer
 *                       example: 140
 *                     confirmacoesInativas:
 *                       type: integer
 *                       example: 10
 *                     aprovados:
 *                       type: integer
 *                       example: 120
 *                     reprovados:
 *                       type: integer
 *                       example: 15
 *                     pendentes:
 *                       type: integer
 *                       example: 15
 *                     distribuicaoPorAnoLectivo:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           codigo_Ano_lectivo:
 *                             type: integer
 *                           designacao:
 *                             type: string
 *                           total:
 *                             type: integer
 *                     distribuicaoPorClassificacao:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           classificacao:
 *                             type: string
 *                           total:
 *                             type: integer
 *                     distribuicaoPorTurma:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           codigo_Turma:
 *                             type: integer
 *                           designacao_Turma:
 *                             type: string
 *                           designacao_Classe:
 *                             type: string
 *                           total:
 *                             type: integer
 *                     percentuais:
 *                       type: object
 *                       properties:
 *                         ativas:
 *                           type: string
 *                           example: "93.33"
 *                         inativas:
 *                           type: string
 *                           example: "6.67"
 *                         aprovados:
 *                           type: string
 *                           example: "80.00"
 *                         reprovados:
 *                           type: string
 *                           example: "10.00"
 *                         pendentes:
 *                           type: string
 *                           example: "10.00"
 *       400:
 *         description: Erro ao gerar estatísticas
 */
router.get('/statistics/confirmacoes', StudentManagementController.getConfirmacoesStatistics);

export default router;