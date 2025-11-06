import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ler o arquivo schema.prisma
const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schemaContent = fs.readFileSync(schemaPath, 'utf8');

console.log('🔧 Adaptando schema para banco existente...');

// Remover @db.UnsignedInt de todos os IDs para compatibilidade com banco existente
// Manter apenas nos relacionamentos novos se necessário

// Lista de modelos que devem manter Int simples (sem @db.UnsignedInt)
const modelsToRevert = [
  'tb_tipos_utilizador',
  'tb_utilizadores', 
  'tb_permissao',
  'tb_item_permissao_utilizador',
  'tb_permissao_turma_utilizador',
  'tb_nacionalidades',
  'tb_estado_civil',
  'tb_provincias',
  'tb_municipios',
  'tb_comunas',
  'tb_profissao',
  'tb_tipo_documento',
  'tb_regime_iva',
  'tb_dados_instituicao',
  'tb_parametros',
  'statusescola',
  'tb_numeracao_documentos',
  'tb_itens_guia',
  'tb_ano_lectivo',
  'tb_cursos',
  'tb_classes',
  'tb_disciplinas',
  'tb_grade_curricular',
  'tb_salas',
  'tb_periodos',
  'tb_turmas',
  'tb_especialidade',
  'tb_docente',
  'tb_disciplinas_docente',
  'tb_directores_turmas',
  'tb_tipo_avaliacao',
  'tb_tipo_nota',
  'tb_tipo_nota_valor',
  'tb_encarregados',
  'tb_matriculas',
  'tb_confirmacoes',
  'tb_proveniencias',
  'tb_alunos',
  'tb_professores',
  'tb_professor_disciplina',
  'tb_professor_turma',
  'tb_notas_alunos',
  'tb_categoria_servicos',
  'tb_tipo_servicos',
  'tb_pagamentos',
  'tb_moedas',
  'tb_anos_letivos',
  'tb_trimestres',
  'tb_periodos_lancamento',
  'tb_efeitos_declaracao'
];

// Remover @db.UnsignedInt de IDs principais
modelsToRevert.forEach(modelName => {
  // Padrão para remover @db.UnsignedInt de IDs
  const idPattern = new RegExp(
    `(model ${modelName} {[\\s\\S]*?codigo\\s+Int\\s+@id\\s+@default\\(autoincrement\\(\\)\\)\\s+@map\\("Codigo"\\))\\s+@db\\.UnsignedInt`,
    'g'
  );
  
  schemaContent = schemaContent.replace(idPattern, '$1');
});

// Remover @db.UnsignedInt de foreign keys também
const foreignKeyPatterns = [
  /@map\("Codigo_[^"]+"\)\s+@db\.UnsignedInt/g,
  /@map\("codigo_[^"]+"\)\s+@db\.UnsignedInt/g,
  /@map\("[^"]*Codigo[^"]*"\)\s+@db\.UnsignedInt/g
];

foreignKeyPatterns.forEach(pattern => {
  schemaContent = schemaContent.replace(pattern, (match) => {
    return match.replace(' @db.UnsignedInt', '');
  });
});

// Salvar o arquivo corrigido
fs.writeFileSync(schemaPath, schemaContent);

console.log('✅ Schema adaptado para banco existente!');
console.log('📋 Removido @db.UnsignedInt para compatibilidade');
console.log('🔧 Mantida funcionalidade completa do sistema');
