-- ===============================================================
-- MIGRAÇÃO: SISTEMA DE USUÁRIOS INTEGRADO
-- Descrição: Implementa relacionamento 1:1 entre usuários, professores e alunos
-- Data: 2025-11-03
-- ===============================================================

-- 1. Adicionar colunas para relacionamento 1:1 na tb_utilizadores
ALTER TABLE tb_utilizadores 
ADD COLUMN Codigo_Professor INT UNSIGNED NULL UNIQUE COMMENT 'FK para tb_professores',
ADD COLUMN Codigo_Aluno INT UNSIGNED NULL UNIQUE COMMENT 'FK para tb_alunos';

-- 2. Modificar colunas existentes para suportar o novo sistema
ALTER TABLE tb_utilizadores 
MODIFY COLUMN Nome VARCHAR(200) NOT NULL COMMENT 'Nome completo do usuário',
MODIFY COLUMN User VARCHAR(45) NOT NULL UNIQUE COMMENT 'Username único',
MODIFY COLUMN Passe VARCHAR(255) NOT NULL COMMENT 'Hash da senha',
MODIFY COLUMN EstadoActual VARCHAR(10) DEFAULT 'Activo' COMMENT 'Estado do usuário';

-- 3. Adicionar índices para performance
CREATE INDEX idx_tb_utilizadores_professor ON tb_utilizadores(Codigo_Professor);
CREATE INDEX idx_tb_utilizadores_aluno ON tb_utilizadores(Codigo_Aluno);
CREATE INDEX idx_tb_utilizadores_tipo ON tb_utilizadores(Codigo_Tipo_Utilizador);
CREATE INDEX idx_tb_utilizadores_estado ON tb_utilizadores(EstadoActual);

-- 4. Remover coluna antiga de relacionamento em tb_professores (se existir)
-- ALTER TABLE tb_professores DROP COLUMN IF EXISTS Codigo_Utilizador;

-- 5. Remover coluna antiga de relacionamento em tb_alunos (se existir)  
-- ALTER TABLE tb_alunos DROP COLUMN IF EXISTS Codigo_Utilizador;

-- 6. Inserir tipos de usuário padrão se não existirem
INSERT IGNORE INTO tb_tipos_utilizador (Designacao) VALUES 
('Administrador'),
('Professor'), 
('Aluno'),
('Operador'),
('Secretaria'),
('Diretor');

-- 7. Adicionar constraints de chave estrangeira
ALTER TABLE tb_utilizadores
ADD CONSTRAINT fk_utilizadores_professor 
    FOREIGN KEY (Codigo_Professor) REFERENCES tb_professores(Codigo) 
    ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT fk_utilizadores_aluno 
    FOREIGN KEY (Codigo_Aluno) REFERENCES tb_alunos(Codigo) 
    ON DELETE SET NULL ON UPDATE CASCADE;

-- 8. Comentários nas tabelas
ALTER TABLE tb_utilizadores COMMENT = 'Tabela unificada de usuários do sistema - professores, alunos e administradores';
ALTER TABLE tb_professores COMMENT = 'Dados específicos dos professores';
ALTER TABLE tb_alunos COMMENT = 'Dados específicos dos alunos';

-- ===============================================================
-- VERIFICAÇÕES DE INTEGRIDADE
-- ===============================================================

-- Verificar se as constraints foram criadas
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'tb_utilizadores'
AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Verificar tipos de usuário
SELECT * FROM tb_tipos_utilizador ORDER BY codigo;

-- ===============================================================
-- DADOS DE EXEMPLO (OPCIONAL)
-- ===============================================================

-- Criar usuário administrador padrão se não existir
INSERT IGNORE INTO tb_utilizadores (
    Nome, 
    User, 
    Passe, 
    Codigo_Tipo_Utilizador, 
    EstadoActual, 
    DataCadastro, 
    LoginStatus
) VALUES (
    'Administrador do Sistema',
    'admin',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- senha: password
    (SELECT codigo FROM tb_tipos_utilizador WHERE Designacao = 'Administrador' LIMIT 1),
    'Activo',
    CURDATE(),
    'OFF'
);

-- ===============================================================
-- COMENTÁRIOS FINAIS
-- ===============================================================

/*
SISTEMA IMPLEMENTADO:

1. RELACIONAMENTO 1:1:
   - tb_utilizadores.Codigo_Professor → tb_professores.Codigo
   - tb_utilizadores.Codigo_Aluno → tb_alunos.Codigo
   - Relacionamentos opcionais (NULL permitido)

2. TIPOS DE USUÁRIO:
   - Administrador: Acesso total ao sistema
   - Professor: Acesso às funcionalidades de ensino
   - Aluno: Acesso às funcionalidades de estudante
   - Outros: Operadores, Secretaria, etc.

3. GERAÇÃO AUTOMÁTICA:
   - Username gerado automaticamente do nome
   - Senha padrão: 123456 (deve ser alterada no primeiro login)
   - Relacionamento criado automaticamente ao cadastrar professor/aluno

4. AUTENTICAÇÃO:
   - Login único para todos os tipos de usuário
   - JWT para sessões
   - Verificação de tipo de usuário para permissões
   - Dados específicos carregados baseado no tipo

5. SEGURANÇA:
   - Senhas com hash bcrypt
   - Usernames únicos
   - Constraints de integridade
   - Índices para performance
*/
