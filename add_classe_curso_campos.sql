-- Adicionar campos Codigo_Classe e Codigo_Curso à tabela tb_tipo_servicos
ALTER TABLE tb_tipo_servicos 
ADD COLUMN Codigo_Classe INT NULL AFTER codigo_multa,
ADD COLUMN Codigo_Curso INT NULL AFTER Codigo_Classe;

-- Adicionar chaves estrangeiras
ALTER TABLE tb_tipo_servicos 
ADD CONSTRAINT FK_tb_tipo_servicos_tb_classes 
FOREIGN KEY (Codigo_Classe) REFERENCES tb_classes(Codigo) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE tb_tipo_servicos 
ADD CONSTRAINT FK_tb_tipo_servicos_tb_cursos 
FOREIGN KEY (Codigo_Curso) REFERENCES tb_cursos(Codigo) ON DELETE SET NULL ON UPDATE CASCADE;

-- Adicionar índices para performance
CREATE INDEX FK_tb_tipo_servicos_tb_classes ON tb_tipo_servicos(Codigo_Classe);
CREATE INDEX FK_tb_tipo_servicos_tb_cursos ON tb_tipo_servicos(Codigo_Curso);
