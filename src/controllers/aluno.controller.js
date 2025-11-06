import prisma from '../config/database.js';
import { AppError } from '../utils/validation.utils.js';
import { PaymentManagementService } from '../services/payment-management.services.js';

export class AlunoController {
  static async getPerfil(req, res) {
    try {
      const userId = req.user.codigo;
      
      // Buscar usuário com dados do aluno
      const usuario = await prisma.tb_utilizadores.findUnique({
        where: { codigo: userId },
        include: {
          tb_tipos_utilizador: true,
          aluno: {
            include: {
              tb_matriculas: {
                include: {
                  tb_confirmacoes: {
                    include: {
                      tb_turmas: {
                        include: {
                          tb_classes: true,
                          tb_cursos: true
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (!usuario || !usuario.aluno) {
        throw new AppError('Perfil de aluno não encontrado', 404);
      }

      // Buscar turma através da estrutura: aluno → matriculas → confirmacoes → turma
      if (!usuario.aluno.tb_matriculas || !usuario.aluno.tb_matriculas.tb_confirmacoes || usuario.aluno.tb_matriculas.tb_confirmacoes.length === 0) {
        throw new AppError('Aluno não está matriculado em nenhuma turma', 404);
      }

      // Pegar a primeira confirmação (assumindo que aluno tem uma turma ativa)
      const confirmacao = usuario.aluno.tb_matriculas.tb_confirmacoes[0];
      const turma = confirmacao.tb_turmas;

      // Buscar disciplinas da grade curricular da turma
      const disciplinasGrade = await prisma.tb_grade_curricular.findMany({
        where: {
          codigo_Turma: turma.codigo
        },
        include: {
          tb_disciplinas: true
        }
      });

      const disciplinas = disciplinasGrade.map(grade => grade.tb_disciplinas);

      // Buscar notas do aluno
      const notasAluno = await prisma.tb_notas_alunos.findMany({
        where: {
          codigo_Aluno: usuario.aluno.codigo
        },
        include: {
          tb_disciplinas: true
        }
      });

      // Organizar notas por disciplina e trimestre
      const notasPorDisciplina = {};
      
      disciplinas.forEach(disciplina => {
        notasPorDisciplina[disciplina.codigo] = {
          disciplina: {
            codigo: disciplina.codigo,
            designacao: disciplina.designacao
          },
          trimestre1: { mac: null, pp: null, pt: null, media: null, classificacao: null },
          trimestre2: { mac: null, pp: null, pt: null, media: null, classificacao: null },
          trimestre3: { mac: null, pp: null, pt: null, media: null, classificacao: null },
          mediaFinal: null,
          classificacaoFinal: null
        };
      });

      // Preencher com as notas existentes
      console.log('📝 [PERFIL ALUNO] Processando notas encontradas:', notasAluno.length);
      notasAluno.forEach(nota => {
        const disciplinaCodigo = nota.codigo_Disciplina;
        const trimestre = nota.trimestre;
        
        console.log(`📋 [NOTA] Disciplina ${disciplinaCodigo}, Trimestre ${trimestre}:`, {
          mac: nota.notaMAC,
          pp: nota.notaPP,
          pt: nota.notaPT,
          mediaTrimestre: nota.mediaTrimestre,
          classificacao: nota.classificacao
        });
        
        if (notasPorDisciplina[disciplinaCodigo]) {
          const trimestreKey = `trimestre${trimestre}`;
          
          if (notasPorDisciplina[disciplinaCodigo][trimestreKey]) {
            // Usar os campos corretos da tabela tb_notas_alunos
            const mac = nota.notaMAC;
            const pp = nota.notaPP;
            const pt = nota.notaPT;
            
            // Calcular média do trimestre automaticamente se as notas existirem
            let mediaCalculada = nota.mediaTrimestre;
            if (!mediaCalculada && (mac !== null || pp !== null || pt !== null)) {
              // Fórmula: Média = (MAC + PP + PT) / 3 (apenas para notas não nulas)
              const notasValidas = [mac, pp, pt].filter(n => n !== null && !isNaN(n));
              if (notasValidas.length > 0) {
                mediaCalculada = Math.round((notasValidas.reduce((sum, n) => sum + n, 0) / notasValidas.length) * 100) / 100;
                console.log(`🧮 [CÁLCULO] Média calculada para ${trimestreKey}:`, {
                  notasValidas,
                  mediaCalculada
                });
              }
            }
            
            // Determinar classificação baseada na média
            const classificacaoCalculada = nota.classificacao || (mediaCalculada ? obterClassificacao(mediaCalculada) : null);
            
            notasPorDisciplina[disciplinaCodigo][trimestreKey] = {
              mac: mac,
              pp: pp,
              pt: pt,
              media: mediaCalculada,
              classificacao: classificacaoCalculada
            };
            
            console.log(`✅ [RESULTADO] ${trimestreKey} processado:`, notasPorDisciplina[disciplinaCodigo][trimestreKey]);
          }
        }
      });

      // Calcular média final para cada disciplina (média das médias dos trimestres)
      console.log('📊 [PERFIL ALUNO] Calculando médias finais...');
      Object.keys(notasPorDisciplina).forEach(disciplinaCodigo => {
        const disciplina = notasPorDisciplina[disciplinaCodigo];
        const medias = [
          disciplina.trimestre1.media,
          disciplina.trimestre2.media,
          disciplina.trimestre3.media
        ].filter(media => media !== null && !isNaN(media));
        
        console.log(`📚 [${disciplina.disciplina.designacao}] Médias dos trimestres:`, {
          t1: disciplina.trimestre1.media,
          t2: disciplina.trimestre2.media,
          t3: disciplina.trimestre3.media,
          mediasValidas: medias
        });
        
        if (medias.length > 0) {
          // Calcular média final (média das médias dos trimestres)
          disciplina.mediaFinal = Math.round((medias.reduce((sum, media) => sum + media, 0) / medias.length) * 100) / 100;
          
          // Determinar classificação baseada na média final
          disciplina.classificacaoFinal = obterClassificacao(disciplina.mediaFinal);
          
          // Determinar aprovação/reprovação (>=10 = Aprovado, <10 = Reprovado)
          disciplina.aprovacao = disciplina.mediaFinal >= 10 ? 'Aprovado' : 'Reprovado';
          
          console.log(`✅ [${disciplina.disciplina.designacao}] Média final: ${disciplina.mediaFinal} (${disciplina.classificacaoFinal})`);
        } else {
          disciplina.classificacaoFinal = null;
          disciplina.aprovacao = null;
          console.log(`❌ [${disciplina.disciplina.designacao}] Sem médias válidas para calcular média final`);
        }
      });

      // SOLUÇÃO SIMPLES: Buscar pagamentos diretamente
      console.log('🔍 [PERFIL ALUNO] Buscando pagamentos para aluno:', usuario.aluno.codigo);
      
      let mesesPendentes = [];
      let mesesPagos = [];
      let todosPagamentos = [];
      
      try {
        // Buscar todos os pagamentos do aluno
        todosPagamentos = await prisma.tb_pagamentos.findMany({
          where: { codigo_Aluno: usuario.aluno.codigo },
          orderBy: { data: 'desc' }
        });
        
        console.log('💰 [PERFIL ALUNO] Pagamentos encontrados:', todosPagamentos.length);
        
        // Meses do ano letivo 2025/2026
        const mesesAnoLetivo = [
          'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO', // 2025
          'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO' // 2026
        ];
        
        // Identificar meses pagos (filtrar por ano 2025/2026)
        mesesPagos = todosPagamentos
          .filter(p => p.ano === 2025 || p.ano === 2026)
          .map(p => p.mes)
          .filter(Boolean);
        
        // Identificar meses pendentes
        mesesPendentes = mesesAnoLetivo.filter(mes => !mesesPagos.includes(mes));
        
        console.log('✅ [PERFIL ALUNO] Meses pagos:', mesesPagos);
        console.log('❌ [PERFIL ALUNO] Meses pendentes:', mesesPendentes);
        
      } catch (error) {
        console.error('❌ [PERFIL ALUNO] Erro ao buscar pagamentos:', error);
      }

      // Calcular totais
      const totalPago = todosPagamentos.reduce((sum, p) => sum + (p.preco || p.total || 0), 0);
      const ultimoPagamento = todosPagamentos.length > 0 ? {
        data: todosPagamentos[0].data,
        valor: todosPagamentos[0].preco || todosPagamentos[0].total || 0,
        descricao: todosPagamentos[0].mes || 'Pagamento'
      } : undefined;

      const estadoFinanceiro = {
        saldo: usuario.aluno.saldo || 0,
        totalPago,
        totalDevido: 0,
        ultimoPagamento,
        mesesPendentes,
        mesesPagos,
        dadosAcademicos: null
      };

      // Montar resposta
      const perfilData = {
        usuario: {
          codigo: usuario.codigo,
          nome: usuario.nome,
          user: usuario.user,
          tipo: usuario.tb_tipos_utilizador.designacao
        },
        aluno: {
          codigo: usuario.aluno.codigo,
          nome: usuario.aluno.nome,
          email: usuario.aluno.email,
          telefone: usuario.aluno.telefone,
          dataNascimento: usuario.aluno.dataNascimento,
          sexo: usuario.aluno.sexo,
          saldo: usuario.aluno.saldo
        },
        turma: {
          codigo: turma.codigo,
          designacao: turma.designacao,
          classe: {
            codigo: turma.tb_classes.codigo,
            designacao: turma.tb_classes.designacao
          },
          curso: {
            codigo: turma.tb_cursos.codigo,
            designacao: turma.tb_cursos.designacao
          }
        },
        disciplinas,
        notas: Object.values(notasPorDisciplina),
        estadoFinanceiro
      };

      res.json({
        success: true,
        data: perfilData
      });

    } catch (error) {
      console.error('Erro ao buscar perfil do aluno:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
}

// Função auxiliar para determinar classificação baseada na nota
function obterClassificacao(nota) {
  if (nota === null || nota === undefined) return null;
  if (nota >= 17) return 'Excelente';
  if (nota >= 14) return 'Muito Bom';
  if (nota >= 12) return 'Bom';
  if (nota >= 10) return 'Suficiente';
  return 'Insuficiente';
}
