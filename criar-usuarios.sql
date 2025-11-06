-- Script SQL para criar usuários de teste
USE gestao_escolar;

-- 1. Inserir tipos de usuário se não existirem
INSERT IGNORE INTO tb_tipos_utilizador (Designacao) VALUES 
('Administrador'),
('Professor'),
('Aluno'),
('Funcionario');

-- 2. Criar usuário Administrador
INSERT IGNORE INTO tb_utilizadores (Nome, User, Passe, Codigo_Tipo_Utilizador, EstadoActual, DataCadastro, LoginStatus)
SELECT 
    'Administrador do Sistema',
    'admin',
    'admin123',
    (SELECT Codigo FROM tb_tipos_utilizador WHERE Designacao = 'Administrador' LIMIT 1),
    'Activo',
    CURDATE(),
    'OFF'
WHERE NOT EXISTS (SELECT 1 FROM tb_utilizadores WHERE User = 'admin');

-- 3. Criar usuário Professor Alberto
INSERT IGNORE INTO tb_utilizadores (Nome, User, Passe, Codigo_Tipo_Utilizador, EstadoActual, DataCadastro, LoginStatus)
SELECT 
    'Alberto Silva Santos',
    'alberto.santos',
    'prof123',
    (SELECT Codigo FROM tb_tipos_utilizador WHERE Designacao = 'Professor' LIMIT 1),
    'Activo',
    CURDATE(),
    'OFF'
WHERE NOT EXISTS (SELECT 1 FROM tb_utilizadores WHERE User = 'alberto.santos');

-- 4. Criar usuário Professor Maria
INSERT IGNORE INTO tb_utilizadores (Nome, User, Passe, Codigo_Tipo_Utilizador, EstadoActual, DataCadastro, LoginStatus)
SELECT 
    'Maria João Fernandes',
    'maria.fernandes',
    'prof123',
    (SELECT Codigo FROM tb_tipos_utilizador WHERE Designacao = 'Professor' LIMIT 1),
    'Activo',
    CURDATE(),
    'OFF'
WHERE NOT EXISTS (SELECT 1 FROM tb_utilizadores WHERE User = 'maria.fernandes');

-- 5. Vincular professores aos usuários (se as tabelas existirem)
UPDATE tb_professores 
SET Codigo_Utilizador = (SELECT Codigo FROM tb_utilizadores WHERE User = 'alberto.santos' LIMIT 1)
WHERE Nome = 'Alberto Silva Santos' AND Codigo_Utilizador IS NULL;

UPDATE tb_professores 
SET Codigo_Utilizador = (SELECT Codigo FROM tb_utilizadores WHERE User = 'maria.fernandes' LIMIT 1)
WHERE Nome = 'Maria João Fernandes' AND Codigo_Utilizador IS NULL;

-- 6. Mostrar os usuários criados
SELECT 
    u.Codigo,
    u.Nome,
    u.User as Usuario,
    u.Passe as Senha,
    t.Designacao as TipoUsuario,
    u.EstadoActual as Status
FROM tb_utilizadores u
JOIN tb_tipos_utilizador t ON u.Codigo_Tipo_Utilizador = t.Codigo
WHERE u.User IN ('admin', 'alberto.santos', 'maria.fernandes')
ORDER BY u.Codigo;
