-- Adicionar campo codigo_Turma à tabela tb_grade_curricular
ALTER TABLE tb_grade_curricular 
ADD COLUMN codigo_Turma INT NULL AFTER codigo_Curso;

-- Adicionar índice para o novo campo
ALTER TABLE tb_grade_curricular 
ADD INDEX FK_tb_grade_curricular_turma (codigo_Turma);

-- Adicionar foreign key constraint (opcional, mas recomendado)
ALTER TABLE tb_grade_curricular 
ADD CONSTRAINT FK_tb_grade_curricular_turma 
FOREIGN KEY (codigo_Turma) REFERENCES tb_turmas(Codigo);
