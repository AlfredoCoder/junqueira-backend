// Correção do método getAlunos - remover includes problemáticos
const fs = require('fs');
const content = fs.readFileSync('src/services/student-management.services.js', 'utf8');

// Substituir o método getAlunos problemático por uma versão simplificada
const newContent = content.replace(
  /static async getAlunos\([\s\S]*?catch \(error\) \{[\s\S]*?}\s*}/,
  `static async getAlunos(page = 1, limit = 10, search = '', statusFilter = null, cursoFilter = null) {
    try {
      const { skip, take } = getPagination(page, limit);
      const where = {};
      
      if (search) {
        where.OR = [
          { nome: { contains: search } },
          { email: { contains: search } },
          { telefone: { contains: search } }
        ];
      }
      
      if (statusFilter !== null && statusFilter !== 'all') {
        where.codigo_Status = parseInt(statusFilter);
      }
      
      const [alunos, total] = await Promise.all([
        prisma.tb_alunos.findMany({
          where,
          skip,
          take,
          include: {
            tb_encarregados: {
              select: {
                codigo: true,
                nome: true,
                telefone: true
              }
            }
          },
          orderBy: { nome: 'asc' }
        }),
        prisma.tb_alunos.count({ where })
      ]);
      
      return {
        alunos,
        total,
        totalPages: Math.ceil(total / take),
        currentPage: page
      };
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      throw new AppError('Erro ao buscar alunos', 500);
    }
  }`
);

fs.writeFileSync('src/services/student-management.services.js', newContent);
console.log('✅ Service corrigido!');
