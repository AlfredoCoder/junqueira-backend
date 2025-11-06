import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ler o arquivo schema.prisma
const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schemaContent = fs.readFileSync(schemaPath, 'utf8');

console.log('🔧 Removendo atributos @db.UnsignedInt duplicados...');

// Remover duplicatas de @db.UnsignedInt
schemaContent = schemaContent.replace(/@db\.UnsignedInt\s+@map\("Codigo"\)\s+@db\.UnsignedInt/g, '@map("Codigo") @db.UnsignedInt');

// Remover outras duplicatas possíveis
schemaContent = schemaContent.replace(/@db\.UnsignedInt\s+@db\.UnsignedInt/g, '@db.UnsignedInt');

// Padrões específicos encontrados no erro
schemaContent = schemaContent.replace(/@id\s+@default\(autoincrement\(\)\)\s+@db\.UnsignedInt\s+@map\("Codigo"\)\s+@db\.UnsignedInt/g, '@id @default(autoincrement()) @map("Codigo") @db.UnsignedInt');

// Salvar o arquivo corrigido
fs.writeFileSync(schemaPath, schemaContent);

console.log('✅ Atributos duplicados removidos com sucesso!');

// Verificar se ainda há duplicatas
const duplicateCheck = schemaContent.match(/@db\.UnsignedInt.*@db\.UnsignedInt/g);
if (duplicateCheck) {
  console.log('⚠️  Ainda há duplicatas encontradas:', duplicateCheck.length);
  duplicateCheck.forEach((dup, index) => {
    console.log(`${index + 1}. ${dup}`);
  });
} else {
  console.log('✅ Nenhuma duplicata encontrada!');
}
