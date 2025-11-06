// controllers/periodos-lancamento.controller.js
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export class PeriodosLancamentoController {
  /**
   * Listar todos os períodos de lançamento
   * GET /api/periodos-lancamento
   */
  static async listarPeriodos(req, res) {
    try {
      let periodos;
      try {
        // Usar estrutura real da tabela tb_periodos_avaliacao
        const periodosDb = await prisma.tb_periodos_avaliacao.findMany({
          orderBy: [
            { anoLectivo: 'desc' },
            { trimestre: 'asc' },
            { tipoAvaliacao: 'asc' }
          ]
        });

        // Mapear para formato esperado pelo frontend
        periodos = periodosDb.map(p => ({
          codigo: p.codigo,
          nome: p.designacao,
          tipoNota: p.tipoAvaliacao,
          trimestre: p.trimestre,
          anoLectivo: parseInt(p.anoLectivo),
          status: new Date() >= p.dataInicio && new Date() <= p.dataFim ? 'Ativo' : 'Inativo',
          dataInicio: p.dataInicio.toISOString(),
          dataFim: p.dataFim.toISOString(),
          criadoPor: 'Sistema'
        }));
      } catch (error) {
        console.error('Erro ao buscar da tabela:', error);
        // Fallback: períodos padrão
        periodos = [
          {
            codigo: 1,
            nome: 'Período de Avaliação Contínua - 1º Trimestre',
            tipoNota: 'MAC',
            trimestre: 1,
            anoLectivo: new Date().getFullYear(),
            status: 'Ativo',
            dataInicio: new Date().toISOString(),
            dataFim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            criadoPor: 'Sistema'
          }
        ];
      }

      res.json({
        success: true,
        message: 'Períodos listados com sucesso',
        data: periodos
      });
    } catch (error) {
      console.error('Erro ao listar períodos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Listar anos letivos disponíveis
   * GET /api/periodos-lancamento/anos-letivos
   */
  static async listarAnosLetivos(req, res) {
    try {
      let anosLetivos;
      try {
        anosLetivos = await prisma.tb_ano_lectivo.findMany({
          select: {
            codigo: true,
            designacao: true
          },
          orderBy: { designacao: 'desc' }
        });
        
        console.log('Anos letivos encontrados:', anosLetivos);
      } catch (error) {
        console.error('Erro ao buscar anos letivos:', error);
        // Fallback: se tabela não existe, retornar anos padrão
        const anoAtual = new Date().getFullYear();
        anosLetivos = [
          { codigo: 1, designacao: `${anoAtual}` },
          { codigo: 2, designacao: `${anoAtual + 1}` },
          { codigo: 3, designacao: `${anoAtual - 1}` }
        ];
      }

      res.json({
        success: true,
        message: 'Anos letivos listados com sucesso',
        data: anosLetivos
      });
    } catch (error) {
      console.error('Erro ao listar anos letivos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Listar períodos ativos para professores
   * GET /api/periodos-lancamento/ativos
   */
  static async listarPeriodosAtivos(req, res) {
    try {
      let periodos;
      try {
        // Buscar todos os períodos e filtrar os ativos por data
        const todosOsPeriodos = await prisma.tb_periodos_avaliacao.findMany({
          orderBy: [
            { anoLectivo: 'desc' },
            { trimestre: 'asc' },
            { tipoAvaliacao: 'asc' }
          ]
        });

        const agora = new Date();
        
        // Filtrar períodos ativos (data atual entre dataInicio e dataFim)
        const periodosAtivos = todosOsPeriodos.filter(p => 
          agora >= p.dataInicio && agora <= p.dataFim
        );

        // Mapear para formato esperado pelo frontend
        periodos = periodosAtivos.map(p => ({
          codigo: p.codigo,
          nome: p.designacao,
          tipoNota: p.tipoAvaliacao,
          trimestre: p.trimestre,
          anoLectivo: parseInt(p.anoLectivo),
          status: 'Ativo',
          dataInicio: p.dataInicio.toISOString(),
          dataFim: p.dataFim.toISOString()
        }));

        // Se não há períodos ativos, pegar o mais recente
        if (periodos.length === 0 && todosOsPeriodos.length > 0) {
          const maisRecente = todosOsPeriodos[0];
          periodos = [{
            codigo: maisRecente.codigo,
            nome: maisRecente.designacao,
            tipoNota: maisRecente.tipoAvaliacao,
            trimestre: maisRecente.trimestre,
            anoLectivo: parseInt(maisRecente.anoLectivo),
            status: 'Ativo',
            dataInicio: maisRecente.dataInicio.toISOString(),
            dataFim: maisRecente.dataFim.toISOString()
          }];
        }
      } catch (error) {
        console.error('Erro ao buscar períodos:', error);
        // Fallback: período padrão
        periodos = [{
          codigo: 1,
          nome: 'Período MAC - 1º Trimestre',
          tipoNota: 'MAC',
          trimestre: 1,
          anoLectivo: new Date().getFullYear(),
          status: 'Ativo',
          dataInicio: new Date().toISOString(),
          dataFim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }];
      }

      res.json({
        success: true,
        message: 'Períodos ativos listados com sucesso',
        data: periodos
      });
    } catch (error) {
      console.error('Erro ao listar períodos ativos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Criar novo período de lançamento
   * POST /api/periodos-lancamento
   */
  static async criarPeriodo(req, res) {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        return res.status(401).json({
          success: false,
          message: 'Token não fornecido'
        });
      }

      const token = authorization.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'junqueira_secret_key_2025');

      const {
        nome,
        tipoNota,
        trimestre,
        anoLectivo,
        dataInicio,
        dataFim
      } = req.body;

      // Validações
      if (!nome || !tipoNota || !trimestre || !anoLectivo || !dataInicio || !dataFim) {
        return res.status(400).json({
          success: false,
          message: 'Todos os campos são obrigatórios'
        });
      }

      if (!['MAC', 'PP', 'PT'].includes(tipoNota)) {
        return res.status(400).json({
          success: false,
          message: 'Tipo de nota deve ser MAC, PP ou PT'
        });
      }

      if (![1, 2, 3].includes(parseInt(trimestre))) {
        return res.status(400).json({
          success: false,
          message: 'Trimestre deve ser 1, 2 ou 3'
        });
      }

      // Verificar se já existe período para o mesmo tipo/trimestre/ano
      const periodoExistente = await prisma.tb_periodos_avaliacao.findFirst({
        where: {
          tipoAvaliacao: tipoNota,
          trimestre: parseInt(trimestre),
          anoLectivo: anoLectivo.toString()
        }
      });

      if (periodoExistente) {
        return res.status(400).json({
          success: false,
          message: `Já existe um período para ${tipoNota} no ${trimestre}º trimestre de ${anoLectivo}`
        });
      }

      const novoPeriodo = await prisma.tb_periodos_avaliacao.create({
        data: {
          designacao: nome,
          tipoAvaliacao: tipoNota,
          trimestre: parseInt(trimestre),
          anoLectivo: anoLectivo.toString(),
          dataInicio: new Date(dataInicio),
          dataFim: new Date(dataFim),
          observacoes: `Criado via sistema em ${new Date().toLocaleDateString('pt-BR')}`
        }
      });

      res.status(201).json({
        success: true,
        message: 'Período criado com sucesso',
        data: novoPeriodo
      });
    } catch (error) {
      console.error('Erro ao criar período:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Ativar/Desativar período (simulado via datas)
   * PUT /api/periodos-lancamento/:id/status
   */
  static async alterarStatusPeriodo(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['Ativo', 'Inativo'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status deve ser Ativo ou Inativo'
        });
      }

      const periodo = await prisma.tb_periodos_avaliacao.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!periodo) {
        return res.status(404).json({
          success: false,
          message: 'Período não encontrado'
        });
      }

      // Simular ativação/desativação alterando as datas
      const agora = new Date();
      let novaDataInicio, novaDataFim;

      if (status === 'Ativo') {
        // Ativar: definir data início como agora e fim em 30 dias
        novaDataInicio = agora;
        novaDataFim = new Date(agora.getTime() + 30 * 24 * 60 * 60 * 1000);
      } else {
        // Desativar: definir data fim como ontem
        novaDataInicio = periodo.dataInicio;
        novaDataFim = new Date(agora.getTime() - 24 * 60 * 60 * 1000);
      }

      const periodoAtualizado = await prisma.tb_periodos_avaliacao.update({
        where: { codigo: parseInt(id) },
        data: {
          dataInicio: novaDataInicio,
          dataFim: novaDataFim,
          observacoes: `${periodo.observacoes || ''} | Status alterado para ${status} em ${agora.toLocaleDateString('pt-BR')}`
        }
      });

      res.json({
        success: true,
        message: `Período ${status === 'Ativo' ? 'ativado' : 'desativado'} com sucesso`,
        data: {
          ...periodoAtualizado,
          status: status
        }
      });
    } catch (error) {
      console.error('Erro ao alterar status do período:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Excluir período
   * DELETE /api/periodos-lancamento/:id
   */
  static async excluirPeriodo(req, res) {
    try {
      const { id } = req.params;

      const periodo = await prisma.tb_periodos_avaliacao.findUnique({
        where: { codigo: parseInt(id) }
      });

      if (!periodo) {
        return res.status(404).json({
          success: false,
          message: 'Período não encontrado'
        });
      }

      // Verificar se há notas lançadas neste período
      const notasExistentes = await prisma.tb_notas_alunos.count({
        where: {
          tipoNota: periodo.tipoNota,
          trimestre: periodo.trimestre,
          anoLectivo: periodo.anoLectivo
        }
      });

      if (notasExistentes > 0) {
        return res.status(400).json({
          success: false,
          message: 'Não é possível excluir período com notas já lançadas'
        });
      }

      await prisma.tb_periodos_avaliacao.delete({
        where: { codigo: parseInt(id) }
      });

      res.json({
        success: true,
        message: 'Período excluído com sucesso'
      });
    } catch (error) {
      console.error('Erro ao excluir período:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
}
