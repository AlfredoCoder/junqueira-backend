// controller/student-management.controller.js
import { StudentManagementService } from "../services/student-management.services.js";
import { handleControllerError } from "../utils/validation.utils.js";
import { convertBigIntToString } from "../utils/bigint.utils.js";
import {
  encarregadoCreateSchema,
  encarregadoUpdateSchema,
  encarregadoFlexibleCreateSchema,
  provenienciaCreateSchema,
  provenienciaUpdateSchema,
  alunoCreateSchema,
  alunoUpdateSchema,
  alunoFlexibleCreateSchema,
  alunoComEncarregadoCreateSchema,
  alunoComEncarregadoUpdateSchema,
  matriculaCreateSchema,
  matriculaUpdateSchema,
  matriculaFlexibleCreateSchema,
  confirmacaoCreateSchema,
  confirmacaoUpdateSchema,
  confirmacaoFlexibleCreateSchema,
  transferenciaCreateSchema,
  transferenciaUpdateSchema,
  idParamSchema,
  alunosByTurmaSchema,
  matriculasByAnoLectivoSchema,
  confirmacoesByTurmaAnoSchema,
  batchEncarregadoCreateSchema,
  batchAlunoCreateSchema,
  batchMatriculaCreateSchema,
  batchConfirmacaoCreateSchema
} from "../validations/student-management.validations.js";

export class StudentManagementController {
  // ===============================
  // ENCARREGADOS - CRUD COMPLETO
  // ===============================

  static async createEncarregado(req, res) {
    try {
      // Tentar primeiro o schema flexível, depois o padrão
      let validatedData;
      try {
        validatedData = encarregadoFlexibleCreateSchema.parse(req.body);
      } catch {
        validatedData = encarregadoCreateSchema.parse(req.body);
      }

      const encarregado = await StudentManagementService.createEncarregado(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Encarregado criado com sucesso",
        data: convertBigIntToString(encarregado),
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar encarregado", 400);
    }
  }

  static async updateEncarregado(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = encarregadoUpdateSchema.parse(req.body);

      const encarregado = await StudentManagementService.updateEncarregado(id, validatedData);
      
      res.json({
        success: true,
        message: "Encarregado atualizado com sucesso",
        data: encarregado,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar encarregado", 400);
    }
  }

  static async getEncarregados(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      const result = await StudentManagementService.getEncarregados(page, limit, search);
      
      res.json({
        success: true,
        message: "Encarregados encontrados",
        ...convertBigIntToString(result)
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar encarregados", 400);
    }
  }

  static async getEncarregadoById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const encarregado = await StudentManagementService.getEncarregadoById(id);
      
      res.json({
        success: true,
        message: "Encarregado encontrado",
        data: convertBigIntToString(encarregado),
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar encarregado", 400);
    }
  }

  static async deleteEncarregado(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const result = await StudentManagementService.deleteEncarregado(id);
      
      // Determinar código de status baseado no tipo de exclusão
      const statusCode = result.tipo === 'soft_delete' ? 200 : 200;
      
      res.status(statusCode).json({
        success: true,
        message: result.message,
        tipo: result.tipo,
        ...(result.alunosAssociados && { 
          info: `O encarregado foi desativado porque possui ${result.alunosAssociados} aluno(s) associado(s). Para excluir permanentemente, remova os alunos primeiro.`
        })
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir encarregado", 400);
    }
  }

  // ===============================
  // PROVENIÊNCIAS - CRUD COMPLETO
  // ===============================

  static async createProveniencia(req, res) {
    try {
      const validatedData = provenienciaCreateSchema.parse(req.body);

      const proveniencia = await StudentManagementService.createProveniencia(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Proveniência criada com sucesso",
        data: proveniencia,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar proveniência", 400);
    }
  }

  static async updateProveniencia(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = provenienciaUpdateSchema.parse(req.body);

      const proveniencia = await StudentManagementService.updateProveniencia(id, validatedData);
      
      res.json({
        success: true,
        message: "Proveniência atualizada com sucesso",
        data: proveniencia,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar proveniência", 400);
    }
  }

  static async getProveniencias(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      const result = await StudentManagementService.getProveniencias(page, limit, search);
      
      res.json({
        success: true,
        message: "Proveniências encontradas",
        ...result
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar proveniências", 400);
    }
  }

  static async getProvenienciaById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const proveniencia = await StudentManagementService.getProvenienciaById(id);
      
      res.json({
        success: true,
        message: "Proveniência encontrada",
        data: proveniencia,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar proveniência", 400);
    }
  }

  static async deleteProveniencia(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const result = await StudentManagementService.deleteProveniencia(id);
      
      res.json({
        success: true,
        message: result.message,
        tipo: result.tipo
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir proveniência", 400);
    }
  }

  // ===============================
  // ALUNOS - CRUD COMPLETO
  // ===============================

  static async createAluno(req, res) {
    try {
      console.log('=== CREATE ALUNO DEBUG ===');
      console.log('Request body:', JSON.stringify(req.body, null, 2));
      
      // Verificar se tem dados do encarregado embutidos
      if (req.body.encarregado) {
        console.log('Validando com schema de encarregado embutido...');
        let validatedData;
        try {
          // Validar schema com encarregado embutido
          validatedData = alunoComEncarregadoCreateSchema.parse(req.body);
          console.log('Validação ZOD bem-sucedida!');
        } catch (zodError) {
          console.error('ERRO DE VALIDAÇÃO ZOD:');
          console.error('Mensagem:', zodError.message);
          console.error('Erros detalhados:', JSON.stringify(zodError.errors, null, 2));
          return res.status(400).json({
            success: false,
            message: 'Dados inválidos',
            errors: zodError.errors
          });
        }
        
        // Obter codigo_Utilizador do usuário logado ou usar valor padrão (1 = admin) para desenvolvimento
        const codigo_Utilizador = req.user?.id || 1;

        // Criar aluno com encarregado
        const aluno = await StudentManagementService.createAlunoComEncarregado(
          validatedData, 
          codigo_Utilizador
        );
        
        res.status(201).json({
          success: true,
          message: "Aluno e encarregado criados com sucesso",
          data: convertBigIntToString(aluno),
        });
      } else {
        // Fluxo original - apenas criar aluno
        let validatedData;
        try {
          validatedData = alunoFlexibleCreateSchema.parse(req.body);
        } catch {
          validatedData = alunoCreateSchema.parse(req.body);
        }

        const aluno = await StudentManagementService.createAluno(validatedData);
        
        res.status(201).json({
          success: true,
          message: "Aluno criado com sucesso",
          data: convertBigIntToString(aluno),
        });
      }
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar aluno", 400);
    }
  }

  static async updateAluno(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      
      // Tentar primeiro o schema com encarregado, depois o padrão
      let validatedData;
      let hasEncarregadoData = false;
      
      try {
        validatedData = alunoComEncarregadoUpdateSchema.parse(req.body);
        hasEncarregadoData = !!validatedData.encarregado;
      } catch {
        validatedData = alunoUpdateSchema.parse(req.body);
      }

      const aluno = hasEncarregadoData 
        ? await StudentManagementService.updateAlunoComEncarregado(id, validatedData)
        : await StudentManagementService.updateAluno(id, validatedData);
      
      res.json({
        success: true,
        message: "Aluno atualizado com sucesso",
        data: convertBigIntToString(aluno),
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar aluno", 400);
    }
  }

  static async getAlunos(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';
      const statusFilter = req.query.status || null;
      const cursoFilter = req.query.curso || null;

      const result = await StudentManagementService.getAlunos(page, limit, search, statusFilter, cursoFilter);
      
      // Converter BigInt para string antes de enviar
      const convertedResult = convertBigIntToString(result);
      
      res.json({
        success: true,
        message: "Alunos encontrados",
        ...convertedResult
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar alunos", 400);
    }
  }

  static async getAlunoById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const aluno = await StudentManagementService.getAlunoById(id);
      
      res.json({
        success: true,
        message: "Aluno encontrado",
        data: convertBigIntToString(aluno),
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar aluno", 400);
    }
  }

  static async deleteAluno(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const result = await StudentManagementService.deleteAluno(id);
      
      res.json({
        success: true,
        message: result.message,
        tipo: result.tipo,
        detalhes: result.detalhes,
        info: 'Exclusão em cascata: todas as dependências do aluno foram removidas de forma segura.'
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir aluno", 400);
    }
  }

  // ===============================
  // MATRÍCULAS - CRUD COMPLETO
  // ===============================

  static async createMatricula(req, res) {
    console.log('\n\n=== CONTROLLER CHAMADO - CRIAR MATRÍCULA ===');
    console.log('Método:', req.method);
    console.log('URL:', req.url);
    console.log('Headers:', req.headers);
    
    try {
      console.log('=== CONTROLLER - CRIAR MATRÍCULA ===');
      console.log('Body recebido:', req.body);
      
      // Tentar primeiro o schema flexível, depois o padrão
      let validatedData;
      try {
        validatedData = matriculaFlexibleCreateSchema.parse(req.body);
        console.log('Validado com schema flexível:', validatedData);
      } catch (flexError) {
        console.log('Erro no schema flexível:', flexError.message);
        validatedData = matriculaCreateSchema.parse(req.body);
        console.log('Validado com schema padrão:', validatedData);
      }

      console.log('Chamando service com dados:', validatedData);
      const matricula = await StudentManagementService.createMatricula(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Matrícula criada com sucesso",
        data: matricula,
      });
    } catch (error) {
      console.log('=== ERRO NO CONTROLLER ===');
      console.log('Erro completo:', error);
      console.log('Mensagem:', error.message);
      console.log('Stack:', error.stack);
      console.log('========================');
      handleControllerError(res, error, "Erro ao criar matrícula", 400);
    }
  }

  static async updateMatricula(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = matriculaUpdateSchema.parse(req.body);

      const matricula = await StudentManagementService.updateMatricula(id, validatedData);
      
      res.json({
        success: true,
        message: "Matrícula atualizada com sucesso",
        data: matricula,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar matrícula", 400);
    }
  }

  static async getMatriculas(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';
      const statusFilter = req.query.status || null;
      const cursoFilter = req.query.curso || null;

      const result = await StudentManagementService.getMatriculas(page, limit, search, statusFilter, cursoFilter);
      
      res.json({
        success: true,
        message: "Matrículas encontradas",
        ...convertBigIntToString(result)
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar matrículas", 400);
    }
  }

  static async getMatriculaById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const matricula = await StudentManagementService.getMatriculaById(id);
      
      res.json({
        success: true,
        message: "Matrícula encontrada",
        data: matricula,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar matrícula", 400);
    }
  }

  static async deleteMatricula(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const result = await StudentManagementService.deleteMatricula(id);
      
      res.json({
        success: true,
        message: result.message,
        tipo: result.tipo,
        ...(result.detalhes && { detalhes: result.detalhes }),
        ...(result.tipo === 'cascade_delete' && {
          info: 'Exclusão em cascata: matrícula e confirmações removidas.'
        })
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir matrícula", 400);
    }
  }

  // ===============================
  // CONFIRMAÇÕES - CRUD COMPLETO
  // ===============================

  static async createConfirmacao(req, res) {
    try {
      const validatedData = confirmacaoFlexibleCreateSchema.parse(req.body);
      const confirmacao = await StudentManagementService.createConfirmacao(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Confirmação criada com sucesso",
        data: confirmacao,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar confirmação", 400);
    }
  }

  static async updateConfirmacao(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = confirmacaoUpdateSchema.parse(req.body);

      const confirmacao = await StudentManagementService.updateConfirmacao(id, validatedData);
      
      res.json({
        success: true,
        message: "Confirmação atualizada com sucesso",
        data: confirmacao,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar confirmação", 400);
    }
  }

  static async getConfirmacoes(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';
      const statusFilter = req.query.status || null;
      const anoLectivoFilter = req.query.anoLectivo || null;
      const alunoId = req.query.alunoId ? parseInt(req.query.alunoId) : null;

      const result = await StudentManagementService.getConfirmacoes(page, limit, search, statusFilter, anoLectivoFilter, alunoId);
      
      res.json({
        success: true,
        message: "Confirmações encontradas",
        ...result
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar confirmações", 400);
    }
  }

  static async getConfirmacaoById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const confirmacao = await StudentManagementService.getConfirmacaoById(id);
      
      res.json({
        success: true,
        message: "Confirmação encontrada",
        data: confirmacao,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar confirmação", 400);
    }
  }

  static async deleteConfirmacao(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const result = await StudentManagementService.deleteConfirmacao(id);
      
      res.json({
        success: true,
        message: result.message,
        tipo: result.tipo,
        ...(result.detalhes && { detalhes: result.detalhes }),
        ...(result.info && { info: result.info })
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir confirmação", 400);
    }
  }

  // ===============================
  // TRANSFERÊNCIAS - CRUD COMPLETO
  // ===============================

  static async createTransferencia(req, res) {
    try {
      const validatedData = transferenciaCreateSchema.parse(req.body);

      const transferencia = await StudentManagementService.createTransferencia(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Transferência criada com sucesso",
        data: transferencia,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar transferência", 400);
    }
  }

  static async updateTransferencia(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = transferenciaUpdateSchema.parse(req.body);

      const transferencia = await StudentManagementService.updateTransferencia(id, validatedData);
      
      res.json({
        success: true,
        message: "Transferência atualizada com sucesso",
        data: transferencia,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar transferência", 400);
    }
  }

  static async getTransferencias(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      const result = await StudentManagementService.getTransferencias(page, limit, search);
      
      res.json({
        success: true,
        message: "Transferências encontradas",
        ...result
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar transferências", 400);
    }
  }

  static async getTransferenciaById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const transferencia = await StudentManagementService.getTransferenciaById(id);
      
      res.json({
        success: true,
        message: "Transferência encontrada",
        data: transferencia,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar transferência", 400);
    }
  }

  static async deleteTransferencia(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);

      const result = await StudentManagementService.deleteTransferencia(id);
      
      res.json({
        success: true,
        message: result.message,
        tipo: result.tipo,
        ...(result.detalhes && { detalhes: result.detalhes }),
        ...(result.info && { info: result.info })
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir transferência", 400);
    }
  }

  // ===============================
  // OPERAÇÕES ESPECIAIS
  // ===============================

  static async getAlunosByTurma(req, res) {
    try {
      const { codigo_Turma } = alunosByTurmaSchema.parse(req.params);

      const alunos = await StudentManagementService.getAlunosByTurma(codigo_Turma);
      
      res.json({
        success: true,
        message: "Alunos da turma obtidos com sucesso",
        data: convertBigIntToString(alunos),
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter alunos da turma", 400);
    }
  }

  static async getMatriculasByAnoLectivo(req, res) {
    try {
      const { codigo_AnoLectivo } = matriculasByAnoLectivoSchema.parse(req.params);

      const matriculas = await StudentManagementService.getMatriculasByAnoLectivo(codigo_AnoLectivo);
      
      res.json({
        success: true,
        message: "Matrículas do ano letivo obtidas com sucesso",
        data: convertBigIntToString(matriculas),
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter matrículas do ano letivo", 400);
    }
  }

  static async getConfirmacoesByTurmaAndAno(req, res) {
    try {
      const { codigo_Turma, codigo_AnoLectivo } = confirmacoesByTurmaAnoSchema.parse(req.params);

      const confirmacoes = await StudentManagementService.getConfirmacoesByTurmaAndAno(codigo_Turma, codigo_AnoLectivo);
      
      res.json({
        success: true,
        message: "Confirmações da turma e ano obtidas com sucesso",
        data: confirmacoes,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter confirmações da turma e ano", 400);
    }
  }

  static async getAlunosWithoutMatricula(req, res) {
    try {
      const alunos = await StudentManagementService.getAlunosWithoutMatricula();
      
      res.json({
        success: true,
        message: "Alunos sem matrícula obtidos com sucesso",
        data: convertBigIntToString(alunos),
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter alunos sem matrícula", 400);
    }
  }

  static async getMatriculasWithoutConfirmacao(req, res) {
    try {
      const matriculas = await StudentManagementService.getMatriculasWithoutConfirmacao();
      
      res.json({
        success: true,
        message: "Matrículas obtidas com sucesso",
        data: convertBigIntToString(matriculas),
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter matrículas", 400);
    }
  }

  // ===============================
  // ESTATÍSTICAS
  // ===============================

  static async getMatriculasStatistics(req, res) {
    try {
      const statusFilter = req.query.status || null;
      const cursoFilter = req.query.curso || null;

      const statistics = await StudentManagementService.getMatriculasStatistics(statusFilter, cursoFilter);
      
      res.json({
        success: true,
        message: "Estatísticas de matrículas obtidas com sucesso",
        data: statistics,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter estatísticas de matrículas", 400);
    }
  }

  static async getAlunosStatistics(req, res) {
    try {
      const statusFilter = req.query.status || null;
      const cursoFilter = req.query.curso || null;

      const statistics = await StudentManagementService.getAlunosStatistics(statusFilter, cursoFilter);
      
      res.json({
        success: true,
        message: "Estatísticas obtidas com sucesso",
        data: statistics,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter estatísticas", 400);
    }
  }

  static async getConfirmacoesStatistics(req, res) {
    try {
      const statusFilter = req.query.status || null;
      const anoLectivoFilter = req.query.anoLectivo || null;

      const statistics = await StudentManagementService.getConfirmacoesStatistics(statusFilter, anoLectivoFilter);
      
      res.json({
        success: true,
        message: "Estatísticas de confirmações obtidas com sucesso",
        data: statistics,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter estatísticas de confirmações", 400);
    }
  }

  // ===============================
  // OPERAÇÕES EM LOTE (BATCH)
  // ===============================

  static async createMultipleEncarregados(req, res) {
    try {
      const { encarregados } = batchEncarregadoCreateSchema.parse(req.body);

      const results = [];
      const errors = [];

      for (let i = 0; i < encarregados.length; i++) {
        try {
          let validatedData;
          try {
            validatedData = encarregadoFlexibleCreateSchema.parse(encarregados[i]);
          } catch {
            validatedData = encarregadoCreateSchema.parse(encarregados[i]);
          }

          const encarregado = await StudentManagementService.createEncarregado(validatedData);
          results.push({ index: i, success: true, data: encarregado });
        } catch (error) {
          errors.push({ 
            index: i, 
            success: false, 
            error: error.message,
            data: encarregados[i]
          });
        }
      }
      
      res.status(201).json({
        success: true,
        message: `Processamento concluído. ${results.length} encarregados criados, ${errors.length} erros`,
        data: {
          created: results,
          errors: errors,
          summary: {
            total: encarregados.length,
            success: results.length,
            failed: errors.length
          }
        },
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar múltiplos encarregados", 400);
    }
  }

  static async createMultipleAlunos(req, res) {
    try {
      const { alunos } = batchAlunoCreateSchema.parse(req.body);

      const results = [];
      const errors = [];

      for (let i = 0; i < alunos.length; i++) {
        try {
          let validatedData;
          try {
            validatedData = alunoFlexibleCreateSchema.parse(alunos[i]);
          } catch {
            validatedData = alunoCreateSchema.parse(alunos[i]);
          }

          const aluno = await StudentManagementService.createAluno(validatedData);
          results.push({ index: i, success: true, data: aluno });
        } catch (error) {
          errors.push({ 
            index: i, 
            success: false, 
            error: error.message,
            data: alunos[i]
          });
        }
      }
      
      res.status(201).json({
        success: true,
        message: `Processamento concluído. ${results.length} alunos criados, ${errors.length} erros`,
        data: {
          created: results,
          errors: errors,
          summary: {
            total: alunos.length,
            success: results.length,
            failed: errors.length
          }
        },
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar múltiplos alunos", 400);
    }
  }

  static async createMultipleMatriculas(req, res) {
    try {
      const { matriculas } = batchMatriculaCreateSchema.parse(req.body);

      const results = [];
      const errors = [];

      for (let i = 0; i < matriculas.length; i++) {
        try {
          let validatedData;
          try {
            validatedData = matriculaFlexibleCreateSchema.parse(matriculas[i]);
          } catch {
            validatedData = matriculaCreateSchema.parse(matriculas[i]);
          }

          const matricula = await StudentManagementService.createMatricula(validatedData);
          results.push({ index: i, success: true, data: matricula });
        } catch (error) {
          errors.push({ 
            index: i, 
            success: false, 
            error: error.message,
            data: matriculas[i]
          });
        }
      }
      
      res.status(201).json({
        success: true,
        message: `Processamento concluído. ${results.length} matrículas criadas, ${errors.length} erros`,
        data: {
          created: results,
          errors: errors,
          summary: {
            total: matriculas.length,
            success: results.length,
            failed: errors.length
          }
        },
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar múltiplas matrículas", 400);
    }
  }

  static async createMultipleConfirmacoes(req, res) {
    try {
      const { confirmacoes } = batchConfirmacaoCreateSchema.parse(req.body);

      const results = [];
      const errors = [];

      for (let i = 0; i < confirmacoes.length; i++) {
        try {
          let validatedData;
          try {
            validatedData = confirmacaoFlexibleCreateSchema.parse(confirmacoes[i]);
          } catch {
            validatedData = confirmacaoCreateSchema.parse(confirmacoes[i]);
          }

          const confirmacao = await StudentManagementService.createConfirmacao(validatedData);
          results.push({ index: i, success: true, data: confirmacao });
        } catch (error) {
          errors.push({ 
            index: i, 
            success: false, 
            error: error.message,
            data: confirmacoes[i]
          });
        }
      }
      
      res.status(201).json({
        success: true,
        message: `Processamento concluído. ${results.length} confirmações criadas, ${errors.length} erros`,
        data: {
          created: results,
          errors: errors,
          summary: {
            total: confirmacoes.length,
            success: results.length,
            failed: errors.length
          }
        },
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar múltiplas confirmações", 400);
    }
  }
}