import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// ===============================================================
// CONTROLADOR DE NOTAS
// ===============================================================

/**
 * Calcular média do trimestre
 * Só calcula se todas as 3 notas (MAC, PP, PT) estiverem preenchidas
 */
const calcularMediaTrimestre = (notaMAC, notaPP, notaPT) => {
  // Verificar se todas as 3 notas estão preenchidas
  if (notaMAC === null || notaMAC === undefined || isNaN(notaMAC) ||
      notaPP === null || notaPP === undefined || isNaN(notaPP) ||
      notaPT === null || notaPT === undefined || isNaN(notaPT)) {
    return null; // Não calcula se alguma nota estiver faltando
  }
  
  // Fórmula: MT = (MAC + PP + PT) / 3
  const media = (parseFloat(notaMAC) + parseFloat(notaPP) + parseFloat(notaPT)) / 3;
  return Math.round(media * 100) / 100; // Arredondar para 2 casas decimais
};

/**
 * Determinar classificação baseada na média
 */
const determinarClassificacao = (media) => {
  if (media === null || media === undefined) return null;
  if (media >= 17) return 'Excelente';
  if (media >= 14) return 'Muito Bom';
  if (media >= 12) return 'Bom';
  if (media >= 10) return 'Suficiente';
  return 'Insuficiente';
};

/**
 * Determinar aprovação baseada na média final da disciplina
 */
const determinarAprovacao = (mediaFinal) => {
  if (mediaFinal === null || mediaFinal === undefined) return null;
  return mediaFinal >= 10 ? 'Aprovado' : 'Reprovado';
};

/**
 * Recalcular médias de todas as notas existentes
 */
const recalcularMediasExistentes = async (req, res) => {
  try {
    console.log('🔄 Iniciando recálculo de médias...');
    
    // Buscar todas as notas que têm as 3 notas preenchidas mas média nula
    const notasParaRecalcular = await prisma.tb_notas_alunos.findMany({
      where: {
        notaMAC: { not: null },
        notaPP: { not: null },
        notaPT: { not: null },
        OR: [
          { mediaTrimestre: null },
          { classificacao: null }
        ]
      }
    });

    console.log(`📊 Encontradas ${notasParaRecalcular.length} notas para recalcular`);

    let recalculadas = 0;
    
    for (const nota of notasParaRecalcular) {
      const mediaTrimestre = calcularMediaTrimestre(nota.notaMAC, nota.notaPP, nota.notaPT);
      const classificacao = determinarClassificacao(mediaTrimestre);
      
      if (mediaTrimestre !== null) {
        await prisma.tb_notas_alunos.update({
          where: { codigo: nota.codigo },
          data: {
            mediaTrimestre,
            classificacao
          }
        });
        recalculadas++;
        console.log(`✅ Recalculada nota ${nota.codigo}: MAC=${nota.notaMAC}, PP=${nota.notaPP}, PT=${nota.notaPT} → Média=${mediaTrimestre}, Class=${classificacao}`);
      }
    }

    res.json({
      success: true,
      message: `${recalculadas} médias recalculadas com sucesso`,
      data: {
        totalEncontradas: notasParaRecalcular.length,
        recalculadas
      }
    });

  } catch (error) {
    console.error('Erro ao recalcular médias:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

/**
 * Listar períodos de avaliação
 */
const listarPeriodos = async (req, res) => {
  try {
    const { anoLectivo, trimestre, tipoAvaliacao } = req.query;

    const where = {
      status: 'Activo',
      ...(anoLectivo && { anoLectivo }),
      ...(trimestre && { trimestre: parseInt(trimestre) }),
      ...(tipoAvaliacao && { tipoAvaliacao })
    };

    const periodos = await prisma.tb_periodos_avaliacao.findMany({
      where,
      orderBy: [
        { anoLectivo: 'desc' },
        { trimestre: 'asc' },
        { tipoAvaliacao: 'asc' }
      ]
    });

    res.json({
      success: true,
      data: periodos
    });
  } catch (error) {
    console.error('Erro ao listar períodos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

/**
 * Criar período de avaliação
 */
const criarPeriodo = async (req, res) => {
  try {
    const {
      designacao,
      tipoAvaliacao,
      trimestre,
      dataInicio,
      dataFim,
      anoLectivo,
      observacoes
    } = req.body;

    // Validações
    if (!designacao || !tipoAvaliacao || !trimestre || !dataInicio || !dataFim || !anoLectivo) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos obrigatórios devem ser preenchidos'
      });
    }

    // Verificar se já existe período para o mesmo tipo/trimestre/ano
    const periodoExiste = await prisma.tb_periodos_avaliacao.findFirst({
      where: {
        tipoAvaliacao,
        trimestre: parseInt(trimestre),
        anoLectivo,
        status: 'Activo'
      }
    });

    if (periodoExiste) {
      return res.status(400).json({
        success: false,
        message: 'Já existe um período ativo para este tipo de avaliação no trimestre e ano letivo especificados'
      });
    }

    const periodo = await prisma.tb_periodos_avaliacao.create({
      data: {
        designacao,
        tipoAvaliacao,
        trimestre: parseInt(trimestre),
        dataInicio: new Date(dataInicio),
        dataFim: new Date(dataFim),
        anoLectivo,
        observacoes
      }
    });

    res.status(201).json({
      success: true,
      message: 'Período de avaliação criado com sucesso',
      data: periodo
    });
  } catch (error) {
    console.error('Erro ao criar período:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

/**
 * Buscar alunos de uma turma para lançamento de notas
 */
const buscarAlunosTurma = async (req, res) => {
  try {
    const { turmaId } = req.params;
    const { anoLectivo } = req.query;

    // Buscar alunos confirmados na turma
    const confirmacoes = await prisma.tb_confirmacoes.findMany({
      where: {
        codigo_Turma: parseInt(turmaId),
        codigo_Status: 1, // Ativo
        ...(anoLectivo && { codigo_Ano_lectivo: parseInt(anoLectivo) })
      },
      include: {
        tb_matriculas: {
          include: {
            tb_alunos: {
              select: {
                codigo: true,
                nome: true,
                email: true,
                telefone: true,
                url_Foto: true
              }
            }
          }
        }
      },
      orderBy: {
        tb_matriculas: {
          tb_alunos: {
            nome: 'asc'
          }
        }
      }
    });

    const alunos = confirmacoes.map(confirmacao => ({
      codigo: confirmacao.tb_matriculas.tb_alunos.codigo,
      nome: confirmacao.tb_matriculas.tb_alunos.nome,
      email: confirmacao.tb_matriculas.tb_alunos.email,
      telefone: confirmacao.tb_matriculas.tb_alunos.telefone,
      url_Foto: confirmacao.tb_matriculas.tb_alunos.url_Foto,
      codigoConfirmacao: confirmacao.codigo
    }));

    res.json({
      success: true,
      data: alunos
    });
  } catch (error) {
    console.error('Erro ao buscar alunos da turma:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

/**
 * Buscar notas de uma turma/disciplina/trimestre
 */
const buscarNotasTurma = async (req, res) => {
  try {
    const { turmaId, disciplinaId, trimestre } = req.params;
    const { anoLectivo } = req.query;

    const notas = await prisma.tb_notas_alunos.findMany({
      where: {
        codigo_Turma: parseInt(turmaId),
        codigo_Disciplina: parseInt(disciplinaId),
        trimestre: parseInt(trimestre),
        anoLectivo,
        status: 'Activo'
      },
      include: {
        tb_alunos: {
          select: {
            codigo: true,
            nome: true,
            url_Foto: true
          }
        },
        tb_professores: {
          select: {
            codigo: true,
            nome: true
          }
        },
        tb_periodos_avaliacao: true
      },
      orderBy: {
        tb_alunos: {
          nome: 'asc'
        }
      }
    });

    res.json({
      success: true,
      data: notas
    });
  } catch (error) {
    console.error('Erro ao buscar notas da turma:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

/**
 * Lançar/atualizar nota de um aluno
 */
const lancarNota = async (req, res) => {
  try {
    const {
      codigo_Aluno,
      codigo_Professor,
      codigo_Disciplina,
      codigo_Turma,
      codigo_Periodo,
      trimestre,
      anoLectivo,
      notaMAC,
      notaPP,
      notaPT,
      observacoes
    } = req.body;

    const lancadoPor = req.user?.codigo || 1; // ID do usuário logado

    // Validações
    if (!codigo_Aluno || !codigo_Professor || !codigo_Disciplina || !codigo_Turma || !trimestre || !anoLectivo) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios não preenchidos'
      });
    }

    // Verificar se já existe nota para este aluno/disciplina/turma/trimestre
    const notaExistente = await prisma.tb_notas_alunos.findFirst({
      where: {
        codigo_Aluno: parseInt(codigo_Aluno),
        codigo_Disciplina: parseInt(codigo_Disciplina),
        codigo_Turma: parseInt(codigo_Turma),
        trimestre: parseInt(trimestre),
        anoLectivo
      }
    });

    // Calcular média do trimestre
    const mediaTrimestre = calcularMediaTrimestre(notaMAC, notaPP, notaPT);
    const classificacao = determinarClassificacao(mediaTrimestre);

    let nota;

    if (notaExistente) {
      // Criar histórico da alteração se houver mudanças significativas
      const alteracoes = [];
      
      if (notaMAC !== null && notaMAC !== notaExistente.notaMAC) {
        alteracoes.push({
          codigo_Nota: notaExistente.codigo,
          campoAlterado: 'notaMAC',
          valorAnterior: notaExistente.notaMAC,
          valorNovo: notaMAC,
          alteradoPor: lancadoPor
        });
      }
      
      if (notaPP !== null && notaPP !== notaExistente.notaPP) {
        alteracoes.push({
          codigo_Nota: notaExistente.codigo,
          campoAlterado: 'notaPP',
          valorAnterior: notaExistente.notaPP,
          valorNovo: notaPP,
          alteradoPor: lancadoPor
        });
      }
      
      if (notaPT !== null && notaPT !== notaExistente.notaPT) {
        alteracoes.push({
          codigo_Nota: notaExistente.codigo,
          campoAlterado: 'notaPT',
          valorAnterior: notaExistente.notaPT,
          valorNovo: notaPT,
          alteradoPor: lancadoPor
        });
      }

      // Atualizar nota existente
      nota = await prisma.tb_notas_alunos.update({
        where: { codigo: notaExistente.codigo },
        data: {
          ...(notaMAC !== null && { notaMAC: parseFloat(notaMAC) }),
          ...(notaPP !== null && { notaPP: parseFloat(notaPP) }),
          ...(notaPT !== null && { notaPT: parseFloat(notaPT) }),
          mediaTrimestre,
          classificacao,
          observacoes,
          lancadoPor
        },
        include: {
          tb_alunos: {
            select: { nome: true }
          }
        }
      });

      // Criar registros de histórico
      if (alteracoes.length > 0) {
        await prisma.tb_historico_notas.createMany({
          data: alteracoes
        });
      }

    } else {
      // Criar nova nota
      nota = await prisma.tb_notas_alunos.create({
        data: {
          codigo_Aluno: parseInt(codigo_Aluno),
          codigo_Professor: parseInt(codigo_Professor),
          codigo_Disciplina: parseInt(codigo_Disciplina),
          codigo_Turma: parseInt(codigo_Turma),
          codigo_Periodo: parseInt(codigo_Periodo),
          trimestre: parseInt(trimestre),
          anoLectivo,
          ...(notaMAC !== null && { notaMAC: parseFloat(notaMAC) }),
          ...(notaPP !== null && { notaPP: parseFloat(notaPP) }),
          ...(notaPT !== null && { notaPT: parseFloat(notaPT) }),
          mediaTrimestre,
          classificacao,
          observacoes,
          lancadoPor
        },
        include: {
          tb_alunos: {
            select: { nome: true }
          }
        }
      });
    }

    res.json({
      success: true,
      message: `Nota ${notaExistente ? 'atualizada' : 'lançada'} com sucesso`,
      data: nota
    });
  } catch (error) {
    console.error('Erro ao lançar nota:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

/**
 * Lançar notas em lote para uma turma
 */
const lancarNotasLote = async (req, res) => {
  try {
    const {
      codigo_Professor,
      codigo_Disciplina,
      codigo_Turma,
      codigo_Periodo,
      trimestre,
      anoLectivo,
      notas // Array de objetos com { codigo_Aluno, notaMAC?, notaPP?, notaPT?, observacoes? }
    } = req.body;

    const lancadoPor = req.user?.codigo || 1;

    // Validações
    if (!codigo_Professor || !codigo_Disciplina || !codigo_Turma || !trimestre || !anoLectivo || !Array.isArray(notas)) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos para lançamento em lote'
      });
    }

    const resultados = [];
    const erros = [];

    // Processar cada nota
    for (const notaData of notas) {
      try {
        const { codigo_Aluno, notaMAC, notaPP, notaPT, observacoes } = notaData;

        // Verificar se já existe nota
        const notaExistente = await prisma.tb_notas_alunos.findFirst({
          where: {
            codigo_Aluno: parseInt(codigo_Aluno),
            codigo_Disciplina: parseInt(codigo_Disciplina),
            codigo_Turma: parseInt(codigo_Turma),
            trimestre: parseInt(trimestre),
            anoLectivo
          }
        });

        const mediaTrimestre = calcularMediaTrimestre(notaMAC, notaPP, notaPT);
        const classificacao = determinarClassificacao(mediaTrimestre);

        let nota;

        if (notaExistente) {
          nota = await prisma.tb_notas_alunos.update({
            where: { codigo: notaExistente.codigo },
            data: {
              ...(notaMAC !== null && notaMAC !== undefined && { notaMAC: parseFloat(notaMAC) }),
              ...(notaPP !== null && notaPP !== undefined && { notaPP: parseFloat(notaPP) }),
              ...(notaPT !== null && notaPT !== undefined && { notaPT: parseFloat(notaPT) }),
              mediaTrimestre,
              classificacao,
              observacoes,
              lancadoPor
            }
          });
        } else {
          nota = await prisma.tb_notas_alunos.create({
            data: {
              codigo_Aluno: parseInt(codigo_Aluno),
              codigo_Professor: parseInt(codigo_Professor),
              codigo_Disciplina: parseInt(codigo_Disciplina),
              codigo_Turma: parseInt(codigo_Turma),
              codigo_Periodo: parseInt(codigo_Periodo),
              trimestre: parseInt(trimestre),
              anoLectivo,
              ...(notaMAC !== null && notaMAC !== undefined && { notaMAC: parseFloat(notaMAC) }),
              ...(notaPP !== null && notaPP !== undefined && { notaPP: parseFloat(notaPP) }),
              ...(notaPT !== null && notaPT !== undefined && { notaPT: parseFloat(notaPT) }),
              mediaTrimestre,
              classificacao,
              observacoes,
              lancadoPor
            }
          });
        }

        resultados.push({
          codigo_Aluno: parseInt(codigo_Aluno),
          sucesso: true,
          nota
        });

      } catch (error) {
        erros.push({
          codigo_Aluno: notaData.codigo_Aluno,
          erro: error.message
        });
      }
    }

    res.json({
      success: true,
      message: `${resultados.length} notas processadas com sucesso`,
      data: {
        sucessos: resultados.length,
        erros: erros.length,
        resultados,
        erros
      }
    });
  } catch (error) {
    console.error('Erro ao lançar notas em lote:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

/**
 * Buscar histórico de alterações de uma nota
 */
const buscarHistoricoNota = async (req, res) => {
  try {
    const { notaId } = req.params;

    const historico = await prisma.tb_historico_notas.findMany({
      where: {
        codigo_Nota: parseInt(notaId)
      },
      include: {
        tb_utilizadores: {
          select: { nome: true }
        }
      },
      orderBy: {
        dataAlteracao: 'desc'
      }
    });

    res.json({
      success: true,
      data: historico
    });
  } catch (error) {
    console.error('Erro ao buscar histórico da nota:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

/**
 * Relatório de notas por turma
 */
const relatorioNotasTurma = async (req, res) => {
  try {
    const { turmaId, disciplinaId, trimestre } = req.params;
    const { anoLectivo } = req.query;

    // Para o schema simplificado, vamos criar dados fictícios
    const turma = {
      codigo: parseInt(turmaId),
      designacao: `Turma ${turmaId}`,
      tb_classes: { designacao: "7ª Classe" },
      tb_cursos: { designacao: "I Ciclo do Ensino Secundário" }
    };

    const disciplina = {
      codigo: parseInt(disciplinaId),
      designacao: disciplinaId === 1 ? "Matemática" : disciplinaId === 2 ? "Português" : "Física"
    };

    // Buscar notas
    const notas = await prisma.tb_notas_alunos.findMany({
      where: {
        codigo_Turma: parseInt(turmaId),
        codigo_Disciplina: parseInt(disciplinaId),
        trimestre: parseInt(trimestre),
        anoLectivo,
        status: 'Activo'
      },
      include: {
        tb_professores: {
          select: {
            nome: true
          }
        }
      },
      orderBy: {
        tb_alunos: {
          nome: 'asc'
        }
      }
    });

    // Estatísticas
    const totalAlunos = notas.length;
    const aprovados = notas.filter(nota => nota.classificacao === 'Aprovado').length;
    const reprovados = notas.filter(nota => nota.classificacao === 'Reprovado').length;
    const pendentes = notas.filter(nota => nota.classificacao === 'Pendente').length;

    const medias = notas.filter(nota => nota.mediaTrimestre !== null).map(nota => nota.mediaTrimestre);
    const mediaGeral = medias.length > 0 ? medias.reduce((sum, media) => sum + media, 0) / medias.length : 0;

    res.json({
      success: true,
      data: {
        turma,
        disciplina,
        trimestre: parseInt(trimestre),
        anoLectivo,
        notas,
        estatisticas: {
          totalAlunos,
          aprovados,
          reprovados,
          pendentes,
          mediaGeral: parseFloat(mediaGeral.toFixed(2)),
          percentualAprovacao: totalAlunos > 0 ? parseFloat(((aprovados / totalAlunos) * 100).toFixed(2)) : 0
        }
      }
    });
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

/**
 * Buscar todas as notas de uma turma (todas disciplinas/trimestres)
 */
const buscarTodasNotasTurma = async (req, res) => {
  try {
    const { turmaId } = req.params;
    const { anoLectivo } = req.query;

    const notas = await prisma.tb_notas_alunos.findMany({
      where: {
        codigo_Turma: parseInt(turmaId),
        ...(anoLectivo && { anoLectivo }),
        status: 'Activo'
      },
      orderBy: [{ codigo_Aluno: 'asc' }, { codigo_Disciplina: 'asc' }, { trimestre: 'asc' }]
    });

    // Mapear dados fictícios
    const alunosNomes = { 1: 'Pedro Paulo', 2: 'Maria Silva', 21: 'Alfredo Leonildo' };
    const disciplinasNomes = { 1: 'Matemática', 2: 'Português', 3: 'Física' };

    // Organizar por aluno
    const alunosComNotas = {};
    notas.forEach(nota => {
      const alunoId = nota.codigo_Aluno;
      if (!alunosComNotas[alunoId]) {
        alunosComNotas[alunoId] = {
          codigo: alunoId,
          nome: alunosNomes[alunoId] || `Aluno ${alunoId}`,
          disciplinas: {}
        };
      }
      
      const disciplinaId = nota.codigo_Disciplina;
      if (!alunosComNotas[alunoId].disciplinas[disciplinaId]) {
        alunosComNotas[alunoId].disciplinas[disciplinaId] = {
          codigo: disciplinaId,
          nome: disciplinasNomes[disciplinaId] || `Disciplina ${disciplinaId}`,
          trimestres: {}
        };
      }
      
      alunosComNotas[alunoId].disciplinas[disciplinaId].trimestres[nota.trimestre] = {
        trimestre: nota.trimestre,
        notaMAC: nota.notaMAC,
        notaPP: nota.notaPP,
        notaPT: nota.notaPT,
        mediaTrimestre: nota.mediaTrimestre,
        classificacao: nota.classificacao
      };
    });

    const alunosArray = Object.values(alunosComNotas).map(aluno => ({
      ...aluno,
      disciplinas: Object.values(aluno.disciplinas).map(disciplina => ({
        ...disciplina,
        trimestres: Object.values(disciplina.trimestres)
      }))
    }));

    res.json({
      success: true,
      data: {
        turma: { codigo: parseInt(turmaId), designacao: `Turma ${turmaId}` },
        alunos: alunosArray,
        estatisticas: { totalAlunos: alunosArray.length, totalNotas: notas.length }
      }
    });

  } catch (error) {
    console.error('Erro ao buscar notas da turma:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
};

export default {
  listarPeriodos,
  criarPeriodo,
  buscarAlunosTurma,
  buscarNotasTurma,
  lancarNota,
  lancarNotasLote,
  buscarHistoricoNota,
  relatorioNotasTurma,
  recalcularMediasExistentes,
  buscarTodasNotasTurma
};
