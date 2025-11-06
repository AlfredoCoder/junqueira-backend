import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ler o arquivo schema.prisma
const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schemaContent = fs.readFileSync(schemaPath, 'utf8');

console.log('🔧 Corrigindo tipos de ID no schema.prisma...');

// Lista de modelos que precisam de correção (excluindo users que usa BigInt)
const modelsToFix = [
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
  'tb_classes',
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
  'tb_notas_alunos',
  'tb_professor_turma',
  'tb_categoria_servicos',
  'tb_tipo_servicos',
  'tb_pagamentos',
  'tb_moedas',
  'tb_anos_letivos',
  'tb_trimestres',
  'tb_periodos_lancamento',
  'tb_efeitos_declaracao'
];

// Corrigir IDs principais
modelsToFix.forEach(modelName => {
  // Padrão para ID sem @db.UnsignedInt
  const idPattern = new RegExp(
    `(model ${modelName} {[\\s\\S]*?codigo\\s+Int\\s+@id\\s+@default\\(autoincrement\\(\\)\\)\\s+@map\\("Codigo"\\))(?!\\s+@db\\.UnsignedInt)`,
    'g'
  );
  
  schemaContent = schemaContent.replace(idPattern, '$1 @db.UnsignedInt');
  
  // Padrão alternativo para alguns modelos
  const idPattern2 = new RegExp(
    `(model ${modelName} {[\\s\\S]*?codigo\\s+Int\\s+@id\\s+@default\\(autoincrement\\(\\)\\))(?!\\s+@db\\.UnsignedInt)`,
    'g'
  );
  
  schemaContent = schemaContent.replace(idPattern2, '$1 @db.UnsignedInt');
});

// Corrigir foreign keys específicas
const foreignKeyFixes = [
  // tb_municipios
  { pattern: /codigo_Provincia Int\s+@map\("Codigo_Provincia"\)(?!\s+@db\.UnsignedInt)/g, replacement: 'codigo_Provincia Int    @map("Codigo_Provincia") @db.UnsignedInt' },
  
  // tb_comunas  
  { pattern: /codigo_Municipio Int\s+@map\("Codigo_Municipio"\)(?!\s+@db\.UnsignedInt)/g, replacement: 'codigo_Municipio Int    @map("Codigo_Municipio") @db.UnsignedInt' },
  
  // tb_grade_curricular
  { pattern: /codigo_disciplina Int\s+@map\("Codigo_disciplina"\)(?!\s+@db\.UnsignedInt)/g, replacement: 'codigo_disciplina Int  @map("Codigo_disciplina") @db.UnsignedInt' },
  { pattern: /codigo_Classe\s+Int\s+@map\("Codigo_Classe"\)(?!\s+@db\.UnsignedInt)/g, replacement: 'codigo_Classe     Int  @map("Codigo_Classe") @db.UnsignedInt' },
  { pattern: /codigo_Curso\s+Int\s+@map\("Codigo_Curso"\)(?!\s+@db\.UnsignedInt)/g, replacement: 'codigo_Curso      Int  @map("Codigo_Curso") @db.UnsignedInt' },
  
  // tb_turmas
  { pattern: /codigo_Classe\s+Int\s+@map\("Codigo_Classe"\)(?!\s+@db\.UnsignedInt)/g, replacement: 'codigo_Classe     Int    @map("Codigo_Classe") @db.UnsignedInt' },
  { pattern: /codigo_Sala\s+Int\s+@map\("Codigo_Sala"\)(?!\s+@db\.UnsignedInt)/g, replacement: 'codigo_Sala       Int    @map("Codigo_Sala") @db.UnsignedInt' },
  { pattern: /codigo_Periodo\s+Int\s+@map\("Codigo_Periodo"\)(?!\s+@db\.UnsignedInt)/g, replacement: 'codigo_Periodo    Int    @map("Codigo_Periodo") @db.UnsignedInt' },
  
  // tb_professor_turma
  { pattern: /codigo_Turma\s+Int\s+@map\("Codigo_Turma"\)(?!\s+@db\.UnsignedInt)/g, replacement: 'codigo_Turma      Int      @map("Codigo_Turma") @db.UnsignedInt' },
];

foreignKeyFixes.forEach(fix => {
  schemaContent = schemaContent.replace(fix.pattern, fix.replacement);
});

// Salvar o arquivo corrigido
fs.writeFileSync(schemaPath, schemaContent);

console.log('✅ Schema corrigido com sucesso!');
console.log('📋 Modelos corrigidos:', modelsToFix.length);
console.log('🔑 Foreign keys corrigidas:', foreignKeyFixes.length);
