// controllers/professor.controller.js
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export class ProfessorController {
  /**
   * Obter dados do perfil do professor logado
   * GET /api/professor/perfil
   */
  static async obterPerfil(req, res) {
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

      // Buscar dados do usuário e professor
      const usuario = await prisma.tb_utilizadores.findUnique({
        where: { codigo: decoded.codigo },
        include: {
          tb_tipos_utilizador: true,
          professor: {
            include: {
              tb_professor_disciplina: {
                include: {
                  tb_disciplinas: true
                }
              },
              tb_professor_turma: {
                include: {
                  tb_turmas: {
                    include: {
                      tb_classes: true,
                      tb_cursos: true
                    }
                  },
                  tb_disciplinas: true
                }
              }
            }
          }
        }
      });

      if (!usuario || !usuario.professor) {
        return res.status(404).json({
          success: false,
          message: 'Professor não encontrado'
        });
      }

      // Organizar dados das turmas e disciplinas
      const turmas = usuario.professor.tb_professor_turma.map(pt => ({
        codigo: pt.tb_turmas.codigo,
        nome: pt.tb_turmas.designacao,
        classe: pt.tb_turmas.tb_classes.designacao,
        curso: pt.tb_turmas.tb_cursos.designacao,
        disciplina: {
          codigo: pt.tb_disciplinas.codigo,
          nome: pt.tb_disciplinas.designacao
        }
      }));

      // Organizar disciplinas únicas
      const disciplinas = [...new Map(
        usuario.professor.tb_professor_disciplina.map(pd => [
          pd.tb_disciplinas.codigo,
          {
            codigo: pd.tb_disciplinas.codigo,
            nome: pd.tb_disciplinas.designacao
          }
        ])
      ).values()];

      const perfil = {
        usuario: {
          codigo: usuario.codigo,
          nome: usuario.nome,
          username: usuario.user,
          tipo: usuario.tb_tipos_utilizador.designacao
        },
        professor: {
          codigo: usuario.professor.codigo,
          nome: usuario.professor.nome,
          formacao: usuario.professor.formacao,
          nivelAcademico: usuario.professor.nivelAcademico,
          especialidade: usuario.professor.especialidade,
          numeroFuncionario: usuario.professor.numeroFuncionario,
          dataAdmissao: usuario.professor.dataAdmissao,
          status: usuario.professor.status
        },
        turmas,
        disciplinas
      };

      res.json({
        success: true,
        message: 'Perfil obtido com sucesso',
        data: perfil
      });
    } catch (error) {
      console.error('Erro ao obter perfil do professor:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Obter turmas do professor logado
   * GET /api/professor/turmas
   */
  static async obterTurmas(req, res) {
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

      // Buscar professor pelo usuário
      const usuario = await prisma.tb_utilizadores.findUnique({
        where: { codigo: decoded.codigo },
        include: {
          professor: true
        }
      });

      if (!usuario || !usuario.professor) {
        return res.status(404).json({
          success: false,
          message: 'Professor não encontrado'
        });
      }

      // Buscar turmas do professor
      const turmas = await prisma.tb_professor_turma.findMany({
        where: {
          codigo_Professor: usuario.professor.codigo
        },
        include: {
          tb_turmas: {
            include: {
              tb_classes: true,
              tb_cursos: true
            }
          },
          tb_disciplinas: true
        },
        orderBy: [
          { tb_turmas: { designacao: 'asc' } }
        ]
      });

      const turmasFormatadas = turmas.map(t => ({
        codigo: t.tb_turmas.codigo,
        nome: t.tb_turmas.designacao,
        classe: t.tb_turmas.tb_classes.designacao,
        curso: t.tb_turmas.tb_cursos.designacao,
        disciplina: {
          codigo: t.tb_disciplinas.codigo,
          nome: t.tb_disciplinas.designacao
        }
      }));

      res.json({
        success: true,
        message: 'Turmas obtidas com sucesso',
        data: turmasFormatadas
      });
    } catch (error) {
      console.error('Erro ao obter turmas do professor:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Obter alunos de uma turma específica
   * GET /api/professor/turmas/:turmaId/alunos
   */
  static async obterAlunosTurma(req, res) {
    try {
      const { authorization } = req.headers;
      const { id: turmaId } = req.params;

      console.log(`🔍 [DEBUG] Parâmetros recebidos:`, req.params);
      console.log(`🔍 [DEBUG] turmaId extraído:`, turmaId);

      if (!authorization) {
        return res.status(401).json({
          success: false,
          message: 'Token não fornecido'
        });
      }

      if (!turmaId) {
        return res.status(400).json({
          success: false,
          message: 'ID da turma não fornecido'
        });
      }

      const token = authorization.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'junqueira_secret_key_2025');

      // Verificar se o professor tem acesso a esta turma
      const usuario = await prisma.tb_utilizadores.findUnique({
        where: { codigo: decoded.codigo },
        include: { professor: true }
      });

      if (!usuario || !usuario.professor) {
        return res.status(404).json({
          success: false,
          message: 'Professor não encontrado'
        });
      }

      console.log(`🔍 [DEBUG] Professor: ${usuario.professor.codigo}, Turma: ${turmaId}, Parsed: ${parseInt(turmaId)}`);

      const professorTurma = await prisma.tb_professor_turma.findFirst({
        where: {
          codigo_Professor: usuario.professor.codigo,
          codigo_Turma: parseInt(turmaId)
        }
      });

      console.log(`🔍 [DEBUG] Professor-Turma encontrado:`, professorTurma);

      if (!professorTurma) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado a esta turma'
        });
      }

      // Buscar alunos confirmados na turma específica do professor
      const confirmacoes = await prisma.tb_confirmacoes.findMany({
        where: {
          codigo_Turma: parseInt(turmaId)
        },
        include: {
          tb_matriculas: {
            include: {
              tb_alunos: {
                include: {
                  tb_notas_alunos: {
                    where: {
                      codigo_Turma: parseInt(turmaId)
                      // Remover filtro por disciplina para mostrar todas as notas do aluno na turma
                    },
                    orderBy: {
                      trimestre: 'asc'
                    }
                  }
                }
              }
            }
          }
        }
      });

      console.log(`🔍 [DEBUG] Confirmações encontradas:`, confirmacoes.length);

      const alunosFormatados = confirmacoes
        .filter(c => c.tb_matriculas && c.tb_matriculas.tb_alunos) // Filtrar apenas registros válidos
        .map(c => {
          const aluno = c.tb_matriculas.tb_alunos;
          const notas = aluno.tb_notas_alunos || [];
          
          // Organizar notas por trimestre e calcular médias
          const notasPorTrimestre = {
            1: notas.find(n => n.trimestre === 1) || null,
            2: notas.find(n => n.trimestre === 2) || null,
            3: notas.find(n => n.trimestre === 3) || null
          };

          // Calcular média para cada trimestre se não estiver calculada
          Object.keys(notasPorTrimestre).forEach(trimestre => {
            const nota = notasPorTrimestre[trimestre];
            if (nota && nota.mediaTrimestre === null && nota.notaMAC !== null && nota.notaPP !== null && nota.notaPT !== null) {
              nota.mediaTrimestre = Math.round(((nota.notaMAC + nota.notaPP + nota.notaPT) / 3) * 100) / 100;
            }
          });

          return {
            codigo: aluno.codigo,
            nome: aluno.nome,
            n_documento_identificacao: aluno.n_documento_identificacao,
            email: aluno.email,
            telefone: aluno.telefone,
            dataNascimento: aluno.dataNascimento,
            sexo: aluno.sexo,
            notas: notasPorTrimestre,
            notasRaw: notas, // Para debug
            codigoConfirmacao: c.codigo,
            codigoMatricula: c.codigo_Matricula,
            disciplina: professorTurma.codigo_Disciplina
          };
        })
        .sort((a, b) => a.nome.localeCompare(b.nome));

      console.log(`🔍 [DEBUG] Alunos formatados:`, alunosFormatados.length);

      // Evitar cache para garantir que as notas atualizadas sejam sempre retornadas
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'ETag': false // Desabilitar ETag
      });

      res.json({
        success: true,
        message: 'Alunos obtidos com sucesso',
        data: alunosFormatados,
        timestamp: Date.now() // Timestamp único para quebrar cache
      });
    } catch (error) {
      console.error('Erro ao obter alunos da turma:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Obter alunos de uma turma (versão de teste sem autenticação)
   * GET /api/professor/test/turmas/:id/alunos
   */
  static async obterAlunosTurmaTest(req, res) {
    try {
      const { id: turmaId } = req.params;

      // Buscar alunos confirmados na turma
      const confirmacoes = await prisma.tb_confirmacoes.findMany({
        where: {
          codigo_Turma: parseInt(turmaId)
        },
        include: {
          tb_matriculas: {
            include: {
              tb_alunos: true
            }
          }
        }
      });

      const alunosFormatados = confirmacoes.map(c => ({
        codigo: c.tb_matriculas.tb_alunos.codigo,
        nome: c.tb_matriculas.tb_alunos.nome,
        numeroProcesso: c.tb_matriculas.tb_alunos.numeroProcesso || `ALU${c.tb_matriculas.tb_alunos.codigo}`,
        email: c.tb_matriculas.tb_alunos.email,
        telefone: c.tb_matriculas.tb_alunos.telefone,
        dataNascimento: c.tb_matriculas.tb_alunos.dataNascimento,
        genero: c.tb_matriculas.tb_alunos.genero,
        status: c.tb_matriculas.tb_alunos.codigo_Status || 1,
        codigoConfirmacao: c.codigo,
        codigoMatricula: c.codigo_Matricula
      })).sort((a, b) => a.nome.localeCompare(b.nome));

      res.json({
        success: true,
        message: `${alunosFormatados.length} alunos encontrados na turma`,
        data: alunosFormatados
      });
    } catch (error) {
      console.error('Erro ao obter alunos da turma (teste):', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Lançar notas para uma turma
   * POST /api/professor/lancar-notas
   */
  static async lancarNotas(req, res) {
    try {
      const { authorization } = req.headers;
      const { 
        turmaId, 
        disciplinaId, 
        tipoNota, 
        trimestre, 
        anoLectivo, 
        notas 
      } = req.body;

      if (!authorization) {
        return res.status(401).json({
          success: false,
          message: 'Token não fornecido'
        });
      }

      const token = authorization.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'junqueira_secret_key_2025');

      // Verificar se existe período ativo para este tipo de nota
      const periodoAtivo = await prisma.tb_periodos_avaliacao.findFirst({
        where: {
          tipoAvaliacao: tipoNota,
          trimestre: parseInt(trimestre),
          anoLectivo: anoLectivo.toString(),
          dataInicio: { lte: new Date() },
          dataFim: { gte: new Date() }
        }
      });

      if (!periodoAtivo) {
        return res.status(400).json({
          success: false,
          message: `Não há período ativo para lançamento de ${tipoNota} no ${trimestre}º trimestre`
        });
      }

      // Verificar acesso do professor à turma e disciplina
      const usuario = await prisma.tb_utilizadores.findUnique({
        where: { codigo: decoded.codigo },
        include: { professor: true }
      });

      if (!usuario || !usuario.professor) {
        return res.status(404).json({
          success: false,
          message: 'Professor não encontrado'
        });
      }

      const professorTurma = await prisma.tb_professor_turma.findFirst({
        where: {
          codigo_Professor: usuario.professor.codigo,
          codigo_Turma: parseInt(turmaId),
          codigo_Disciplina: parseInt(disciplinaId)
        }
      });

      if (!professorTurma) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado a esta turma/disciplina'
        });
      }

      // Lançar as notas
      const notasLancadas = [];
      
      for (const nota of notas) {
        // Verificar se já existe nota para este aluno/disciplina/trimestre/ano
        const notaExistente = await prisma.tb_notas_alunos.findFirst({
          where: {
            codigo_Aluno: parseInt(nota.alunoId),
            codigo_Disciplina: parseInt(disciplinaId),
            codigo_Turma: parseInt(turmaId),
            trimestre: parseInt(trimestre),
            anoLectivo: anoLectivo.toString()
          }
        });

        // Determinar qual campo de nota usar baseado no tipo
        const campoNota = tipoNota === 'MAC' ? 'notaMAC' : 
                         tipoNota === 'PP' ? 'notaPP' : 
                         tipoNota === 'PT' ? 'notaPT' : null;

        if (!campoNota) {
          continue; // Pular se tipo de nota inválido
        }

        if (notaExistente) {
          // Atualizar nota existente
          const dadosAtualizacao = {
            [campoNota]: parseFloat(nota.valor),
            dataLancamento: new Date(),
            lancadoPor: decoded.codigo
          };

          const notaAtualizada = await prisma.tb_notas_alunos.update({
            where: { codigo: notaExistente.codigo },
            data: dadosAtualizacao
          });
          notasLancadas.push(notaAtualizada);
        } else {
          // Criar nova nota
          const dadosCriacao = {
            codigo_Aluno: parseInt(nota.alunoId),
            codigo_Professor: usuario.professor.codigo,
            codigo_Disciplina: parseInt(disciplinaId),
            codigo_Turma: parseInt(turmaId),
            trimestre: parseInt(trimestre),
            anoLectivo: anoLectivo.toString(),
            [campoNota]: parseFloat(nota.valor),
            dataLancamento: new Date(),
            lancadoPor: decoded.codigo,
            codigo_Periodo: periodoAtivo.codigo
          };

          const novaNota = await prisma.tb_notas_alunos.create({
            data: dadosCriacao
          });
          notasLancadas.push(novaNota);
        }
      }

      res.json({
        success: true,
        message: `${notasLancadas.length} notas lançadas com sucesso`,
        data: notasLancadas
      });
    } catch (error) {
      console.error('Erro ao lançar notas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Alterar senha do professor
   * PUT /api/professor/alterar-senha
   */
  static async alterarSenha(req, res) {
    try {
      const { authorization } = req.headers;
      const { senhaAtual, novaSenha } = req.body;

      if (!authorization) {
        return res.status(401).json({
          success: false,
          message: 'Token não fornecido'
        });
      }

      if (!senhaAtual || !novaSenha) {
        return res.status(400).json({
          success: false,
          message: 'Senha atual e nova senha são obrigatórias'
        });
      }

      if (novaSenha.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Nova senha deve ter pelo menos 6 caracteres'
        });
      }

      const token = authorization.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'junqueira_secret_key_2025');

      const usuario = await prisma.tb_utilizadores.findUnique({
        where: { codigo: decoded.codigo }
      });

      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      // Verificar senha atual
      const senhaValida = await bcrypt.compare(senhaAtual, usuario.password);
      if (!senhaValida) {
        return res.status(400).json({
          success: false,
          message: 'Senha atual incorreta'
        });
      }

      // Hash da nova senha
      const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

      await prisma.tb_utilizadores.update({
        where: { codigo: decoded.codigo },
        data: { password: novaSenhaHash }
      });

      res.json({
        success: true,
        message: 'Senha alterada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
}
