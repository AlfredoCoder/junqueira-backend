import {
  formaPagamentoCreateSchema,
  formaPagamentoUpdateSchema,
  pagamentoiCreateSchema,
  pagamentoiUpdateSchema,
  pagamentoCreateSchema,
  pagamentoUpdateSchema,
  notaCreditoCreateSchema,
  notaCreditoUpdateSchema,
  motivoAnulacaoCreateSchema,
  motivoAnulacaoUpdateSchema,
  idParamSchema,
  paginationSchema,
  pagamentoFilterSchema,
  relatorioFinanceiroSchema
} from "../validations/payment-management.validations.js";

import { PaymentManagementService } from "../services/payment-management.services.js";
import { handleControllerError } from "../utils/validation.utils.js";
import prisma from "../config/database.js";

export class PaymentManagementController {
  // ===============================
  // FORMAS DE PAGAMENTO - CRUD COMPLETO
  // ===============================

  static async createFormaPagamento(req, res) {
    try {
      const validatedData = formaPagamentoCreateSchema.parse(req.body);
      const formaPagamento = await PaymentManagementService.createFormaPagamento(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Forma de pagamento criada com sucesso",
        data: formaPagamento,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar forma de pagamento", 400);
    }
  }

  static async getFormasPagamento(req, res) {
    try {
      const { page, limit } = paginationSchema.parse(req.query);
      const { search } = req.query;

      const result = await PaymentManagementService.getFormasPagamento(page, limit, search);
      
      res.json({
        success: true,
        message: "Formas de pagamento obtidas com sucesso",
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar formas de pagamento", 400);
    }
  }

  static async getFormaPagamentoById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const formaPagamento = await PaymentManagementService.getFormaPagamentoById(id);
      
      res.json({
        success: true,
        message: "Forma de pagamento encontrada",
        data: formaPagamento,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar forma de pagamento", 400);
    }
  }

  static async updateFormaPagamento(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = formaPagamentoUpdateSchema.parse(req.body);

      const formaPagamento = await PaymentManagementService.updateFormaPagamento(id, validatedData);
      
      res.json({
        success: true,
        message: "Forma de pagamento atualizada com sucesso",
        data: formaPagamento,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar forma de pagamento", 400);
    }
  }

  static async deleteFormaPagamento(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const result = await PaymentManagementService.deleteFormaPagamento(id);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir forma de pagamento", 400);
    }
  }

  // ===============================
  // PAGAMENTO PRINCIPAL (tb_pagamentoi) - CRUD COMPLETO
  // ===============================

  static async createPagamentoi(req, res) {
    try {
      const validatedData = pagamentoiCreateSchema.parse(req.body);
      const pagamentoi = await PaymentManagementService.createPagamentoi(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Pagamento principal criado com sucesso",
        data: pagamentoi,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar pagamento principal", 400);
    }
  }

  static async getPagamentois(req, res) {
    try {
      const { page, limit } = paginationSchema.parse(req.query);
      const filters = pagamentoFilterSchema.parse(req.query);

      const result = await PaymentManagementService.getPagamentois(page, limit, filters);
      
      res.json({
        success: true,
        message: "Pagamentos principais obtidos com sucesso",
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar pagamentos principais", 400);
    }
  }

  static async getPagamentoiById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const pagamentoi = await PaymentManagementService.getPagamentoiById(id);
      
      res.json({
        success: true,
        message: "Pagamento principal encontrado",
        data: pagamentoi,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar pagamento principal", 400);
    }
  }

  static async updatePagamentoi(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = pagamentoiUpdateSchema.parse(req.body);

      const pagamentoi = await PaymentManagementService.updatePagamentoi(id, validatedData);
      
      res.json({
        success: true,
        message: "Pagamento principal atualizado com sucesso",
        data: pagamentoi,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar pagamento principal", 400);
    }
  }

  static async deletePagamentoi(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const result = await PaymentManagementService.deletePagamentoi(id);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir pagamento principal", 400);
    }
  }

  // ===============================
  // DETALHES DE PAGAMENTO (tb_pagamentos) - CRUD COMPLETO
  // ===============================

  static async createPagamento(req, res) {
    try {
      const validatedData = pagamentoCreateSchema.parse(req.body);
      const pagamento = await PaymentManagementService.createPagamento(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Detalhe de pagamento criado com sucesso",
        data: pagamento,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar detalhe de pagamento", 400);
    }
  }

  static async getPagamentos(req, res) {
    try {
      const { page, limit } = paginationSchema.parse(req.query);
      const filters = pagamentoFilterSchema.parse(req.query);

      const result = await PaymentManagementService.getPagamentos(page, limit, filters);
      
      res.json({
        success: true,
        message: "Detalhes de pagamento obtidos com sucesso",
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar detalhes de pagamento", 400);
    }
  }

  static async getPagamentoById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const pagamento = await PaymentManagementService.getPagamentoById(id);
      
      res.json({
        success: true,
        message: "Detalhe de pagamento encontrado",
        data: pagamento,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar detalhe de pagamento", 400);
    }
  }

  static async updatePagamento(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = pagamentoUpdateSchema.parse(req.body);

      const pagamento = await PaymentManagementService.updatePagamento(id, validatedData);
      
      res.json({
        success: true,
        message: "Detalhe de pagamento atualizado com sucesso",
        data: pagamento,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar detalhe de pagamento", 400);
    }
  }

  static async deletePagamento(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const result = await PaymentManagementService.deletePagamento(id);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir detalhe de pagamento", 400);
    }
  }

  // ===============================
  // NOTAS DE CRÉDITO - CRUD COMPLETO
  // ===============================

  // Endpoint de teste para debug
  static async testNotaCredito(req, res) {
    try {
      const testData = {
        designacao: "TESTE - Anulação de Fatura",
        fatura: "TEST_001",
        descricao: "Teste de criação de nota de crédito",
        valor: "1000",
        codigo_aluno: 1, // Usar um aluno que sabemos que existe
        documento: "TEST_001",
        next: "NC TEST/001",
        dataOperacao: "2025-10-29"
      };

      console.log('[TEST] Criando nota de crédito de teste:', testData);
      
      const notaCredito = await PaymentManagementService.createNotaCredito(testData);
      
      res.status(201).json({
        success: true,
        message: "Nota de crédito de teste criada com sucesso",
        data: notaCredito,
      });
    } catch (error) {
      console.error('[TEST] Erro no teste:', error);
      res.status(400).json({
        success: false,
        message: error.message || "Erro no teste"
      });
    }
  }

  static async createNotaCredito(req, res) {
    try {
      console.log('[CONTROLLER] ===== INÍCIO CRIAÇÃO NOTA DE CRÉDITO =====');
      console.log('[CONTROLLER] Dados recebidos para nota de crédito:', req.body);
      
      // Teste de validação passo a passo
      console.log('[CONTROLLER] Iniciando validação Zod...');
      const validatedData = notaCreditoCreateSchema.parse(req.body);
      console.log('[CONTROLLER] ✅ Dados validados com sucesso');
      
      console.log('[CONTROLLER] Chamando service para criar nota de crédito...');
      
      const notaCredito = await PaymentManagementService.createNotaCredito(validatedData);
      console.log('[CONTROLLER] ✅ Nota de crédito criada com sucesso');
      
      res.status(201).json({
        success: true,
        message: "Nota de crédito criada com sucesso",
        data: notaCredito,
      });
    } catch (error) {
      console.error('[CONTROLLER] ❌ ERRO DETALHADO:', error);
      console.error('[CONTROLLER] ❌ TIPO DO ERRO:', error.constructor.name);
      console.error('[CONTROLLER] ❌ MENSAGEM:', error.message);
      console.error('[CONTROLLER] ❌ STACK:', error.stack);
      
      if (error.errors) {
        console.error('[CONTROLLER] ❌ DETALHES VALIDAÇÃO ZOD:', error.errors);
      }
      
      if (error.code) {
        console.error('[CONTROLLER] ❌ CÓDIGO PRISMA:', error.code);
      }
      
      console.error('[CONTROLLER] ===== FIM ERRO =====');
      handleControllerError(res, error, "Erro ao criar nota de crédito", 400);
    }
  }

  static async getNotasCredito(req, res) {
    try {
      console.log('[CONTROLLER] Query params recebidos:', req.query);
      
      // Fazer parsing mais flexível dos parâmetros
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      console.log('[CONTROLLER] Parâmetros processados:', { page, limit, search });

      // Teste básico da tabela primeiro
      try {
        const testCount = await prisma.tb_nota_credito.count();
        console.log('[CONTROLLER] Total de registros na tabela tb_nota_credito:', testCount);
      } catch (testError) {
        console.error('[CONTROLLER] Erro ao acessar tabela tb_nota_credito:', testError);
        return res.status(500).json({
          success: false,
          message: "Erro ao acessar tabela de notas de crédito",
          error: testError.message
        });
      }

      const result = await PaymentManagementService.getNotasCredito(page, limit, search);
      
      res.json({
        success: true,
        message: "Notas de crédito obtidas com sucesso",
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error('[CONTROLLER] Erro ao buscar notas de crédito:', error);
      handleControllerError(res, error, "Erro ao buscar notas de crédito", 400);
    }
  }

  static async getNotaCreditoById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const notaCredito = await PaymentManagementService.getNotaCreditoById(id);
      
      res.json({
        success: true,
        message: "Nota de crédito encontrada",
        data: notaCredito,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar nota de crédito", 400);
    }
  }

  static async updateNotaCredito(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = notaCreditoUpdateSchema.parse(req.body);

      const notaCredito = await PaymentManagementService.updateNotaCredito(id, validatedData);
      
      res.json({
        success: true,
        message: "Nota de crédito atualizada com sucesso",
        data: notaCredito,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar nota de crédito", 400);
    }
  }

  static async deleteNotaCredito(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const result = await PaymentManagementService.deleteNotaCredito(id);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir nota de crédito", 400);
    }
  }

  // ===============================
  // MOTIVOS DE ANULAÇÃO - CRUD COMPLETO
  // ===============================

  static async createMotivoAnulacao(req, res) {
    try {
      const validatedData = motivoAnulacaoCreateSchema.parse(req.body);
      const motivoAnulacao = await PaymentManagementService.createMotivoAnulacao(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Motivo de anulação criado com sucesso",
        data: motivoAnulacao,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar motivo de anulação", 400);
    }
  }

  static async getMotivosAnulacao(req, res) {
    try {
      const { page, limit } = paginationSchema.parse(req.query);
      const { search } = req.query;

      const result = await PaymentManagementService.getMotivosAnulacao(page, limit, search);
      
      res.json({
        success: true,
        message: "Motivos de anulação obtidos com sucesso",
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar motivos de anulação", 400);
    }
  }

  static async getMotivoAnulacaoById(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const motivoAnulacao = await PaymentManagementService.getMotivoAnulacaoById(id);
      
      res.json({
        success: true,
        message: "Motivo de anulação encontrado",
        data: motivoAnulacao,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar motivo de anulação", 400);
    }
  }

  static async updateMotivoAnulacao(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData = motivoAnulacaoUpdateSchema.parse(req.body);

      const motivoAnulacao = await PaymentManagementService.updateMotivoAnulacao(id, validatedData);
      
      res.json({
        success: true,
        message: "Motivo de anulação atualizado com sucesso",
        data: motivoAnulacao,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao atualizar motivo de anulação", 400);
    }
  }

  static async deleteMotivoAnulacao(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const result = await PaymentManagementService.deleteMotivoAnulacao(id);
      
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao excluir motivo de anulação", 400);
    }
  }

  // ===============================
  // ALUNOS CONFIRMADOS
  // ===============================

  static async getAlunosConfirmados(req, res) {
    try {
      res.json({
        success: true,
        message: "API funcionando",
        data: [
          {
            codigo: 1,
            nome: "Ana Beatriz Costa",
            n_documento_identificacao: "123456789",
            email: "ana@test.com",
            telefone: "123456789",
            dadosAcademicos: {
              classe: "10ª Classe",
              curso: "Curso Editado",
              turma: "Turma Atualizada",
              codigo_Classe: 1,
              codigo_Curso: 1,
              codigo_Turma: 1
            }
          }
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 1,
          itemsPerPage: 10
        }
      });
    } catch (error) {
      console.error('❌ Controller Error:', error);
      res.status(500).json({
        success: false,
        message: "Erro ao buscar alunos confirmados"
      });
    }
  }

  // ===============================
  // RELATÓRIOS E DASHBOARDS
  // ===============================

  static async getRelatorioFinanceiro(req, res) {
    try {
      const validatedData = relatorioFinanceiroSchema.parse(req.query);
      const relatorio = await PaymentManagementService.getRelatorioFinanceiro(validatedData);
      
      res.json({
        success: true,
        message: "Relatório financeiro gerado com sucesso",
        data: relatorio,
        filtros: validatedData,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao gerar relatório financeiro", 400);
    }
  }

  // ===============================
  // DASHBOARDS E ESTATÍSTICAS
  // ===============================

  static async getDashboardFinanceiro(req, res) {
    try {
      const dashboard = await PaymentManagementService.getDashboardFinanceiro();
      
      res.json({
        success: true,
        message: "Dashboard financeiro obtido com sucesso",
        data: dashboard,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter dashboard financeiro", 400);
    }
  }

  static async getEstatisticasPagamentos(req, res) {
    try {
      const { periodo } = req.query;
      const estatisticas = await PaymentManagementService.getEstatisticasPagamentos(periodo);
      
      res.json({
        success: true,
        message: "Estatísticas de pagamentos obtidas com sucesso",
        data: estatisticas,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter estatísticas de pagamentos", 400);
    }
  }

  // ===============================
  // FUNCIONÁRIOS
  // ===============================

  static async getAllFuncionarios(req, res) {
    try {
      const funcionarios = await PaymentManagementService.getAllFuncionarios();
      
      res.json({
        success: true,
        message: `${funcionarios.length} funcionários encontrados`,
        data: funcionarios,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar funcionários", 400);
    }
  }

  // ===============================
  // NOVA GESTÃO FINANCEIRA
  // ===============================

  static async createPagamento(req, res) {
    try {
      const validatedData = pagamentoCreateSchema.parse(req.body);
      const pagamento = await PaymentManagementService.createPagamento(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Pagamento criado com sucesso",
        data: pagamento,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao criar pagamento", 400);
    }
  }

  static async getAlunosConfirmados(req, res) {
    try {
      const { page = 1, limit = 10, search, turma, curso } = req.query;
      const filters = { search, turma, curso };
      
      const result = await PaymentManagementService.getAlunosConfirmados(
        parseInt(page),
        parseInt(limit),
        filters
      );
      
      res.json({
        success: true,
        message: `${result.data.length} alunos encontrados`,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar alunos confirmados", 400);
    }
  }

  static async getDadosFinanceirosAluno(req, res) {
    try {
      const { id } = req.params;
      const { ano_lectivo } = req.query;
      
      console.log(`🎯 Controller - ID recebido: ${id}, Ano: ${ano_lectivo}`);
      if (!id || isNaN(parseInt(id))) {
        console.log(`❌ ID inválido: ${id}`);
        return res.status(400).json({
          success: false,
          message: "ID do aluno deve ser um número válido",
        });
      }
      
      const dadosFinanceiros = await PaymentManagementService.getDadosFinanceirosAluno(
        parseInt(id), 
        ano_lectivo ? parseInt(ano_lectivo) : null
      );
      
      res.json({
        success: true,
        message: "Dados financeiros obtidos com sucesso",
        data: dadosFinanceiros,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter dados financeiros do aluno", 400);
    }
  }


  static async gerarFaturaPDF(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(parseInt(id))) {
        console.log(`❌ ID inválido: ${id}`);
        return res.status(400).json({
          success: false,
          message: "ID do pagamento deve ser um número válido",
        });
      }

      const pdfBuffer = await PaymentManagementService.gerarFaturaPDF(parseInt(id));
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="fatura_${id}.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      handleControllerError(res, error, "Erro ao gerar fatura PDF", 400);
    }
  }

  // Métodos auxiliares
  static async getTiposServico(req, res) {
    try {
      const tiposServico = await PaymentManagementService.getTiposServico();
      
      res.json({
        success: true,
        message: "Tipos de serviço obtidos com sucesso",
        data: tiposServico,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter tipos de serviço", 400);
    }
  }

  static async getFormasPagamento(req, res) {
    try {
      const formasPagamento = await PaymentManagementService.getFormasPagamento();
      
      res.json({
        success: true,
        message: "Formas de pagamento obtidas com sucesso",
        data: formasPagamento,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter formas de pagamento", 400);
    }
  }

  static async getAlunoCompleto(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const aluno = await PaymentManagementService.getAlunoCompleto(id);
      
      res.json({
        success: true,
        message: "Dados completos do aluno obtidos com sucesso",
        data: aluno,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter dados do aluno", 400);
    }
  }

  static async getTipoServicoTurmaAluno(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const result = await PaymentManagementService.getTipoServicoTurmaAluno(id);
      
      res.json({
        success: true,
        message: "Tipo de serviço da turma obtido com sucesso",
        data: result,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter tipo de serviço da turma", 400);
    }
  }

  static async getMesesPendentesAluno(req, res) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const { codigoAnoLectivo } = req.query;
      const codigoAno = codigoAnoLectivo ? parseInt(codigoAnoLectivo) : null;
      
      const result = await PaymentManagementService.getMesesPendentesAluno(id, codigoAno);
      
      res.json({
        success: true,
        message: "Meses pendentes obtidos com sucesso",
        data: result,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter meses pendentes", 400);
    }
  }

  static async getAnosLectivos(req, res) {
    try {
      const anosLectivos = await PaymentManagementService.getAnosLectivos();
      
      res.json({
        success: true,
        message: "Anos letivos obtidos com sucesso",
        data: anosLectivos,
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao obter anos letivos", 400);
    }
  }

  static async validateBordero(req, res) {
    try {
      const { bordero } = req.body;
      const { excludeId } = req.query;
      
      await PaymentManagementService.validateBordero(bordero, excludeId ? parseInt(excludeId) : null);
      
      res.json({
        success: true,
        message: "Número de borderô válido",
        data: { valid: true },
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao validar borderô", 400);
    }
  }

  // Buscar propina da classe do aluno
  static async getPropinaClasse(req, res) {
    try {
      const { id: alunoId, anoLectivoId } = req.params;
      
      const propinaClasse = await PaymentManagementService.getPropinaClasse(alunoId, anoLectivoId);
      
      if (!propinaClasse) {
        return res.status(404).json({
          success: false,
          message: "Propina da classe não encontrada para este aluno e ano letivo"
        });
      }

      res.json({
        success: true,
        message: "Propina da classe obtida com sucesso",
        data: propinaClasse
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar propina da classe", 500);
    }
  }

  // ===============================
  // RELATÓRIOS DE VENDAS POR FUNCIONÁRIO
  // ===============================

  static async getRelatorioVendasFuncionarios(req, res) {
    try {
      const { periodo, dataInicio, dataFim } = req.query;
      
      const relatorio = await PaymentManagementService.getRelatorioVendasFuncionarios(
        periodo || 'diario',
        dataInicio,
        dataFim
      );
      
      res.json({
        success: true,
        message: "Relatório de vendas por funcionário obtido com sucesso",
        data: relatorio
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao gerar relatório de vendas por funcionário", 500);
    }
  }

  static async getRelatorioVendasDetalhado(req, res) {
    try {
      const { funcionarioId } = req.params;
      const { periodo, dataInicio, dataFim } = req.query;
      
      const relatorio = await PaymentManagementService.getRelatorioVendasDetalhado(
        funcionarioId,
        periodo || 'diario',
        dataInicio,
        dataFim
      );
      
      res.json({
        success: true,
        message: "Relatório detalhado do funcionário obtido com sucesso",
        data: relatorio
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao gerar relatório detalhado do funcionário", 500);
    }
  }

  static async getAllFuncionarios(req, res) {
    try {
      const funcionarios = await PaymentManagementService.getAllFuncionarios();
      
      res.json({
        success: true,
        message: "Funcionários obtidos com sucesso",
        data: funcionarios
      });
    } catch (error) {
      handleControllerError(res, error, "Erro ao buscar funcionários", 500);
    }
  }
}
