import { writeFile } from 'node:fs/promises';
import * as XLSX from 'xlsx';
import { getCurrentDashboardData } from '../server/dataImports.ts';

const data = await getCurrentDashboardData();
const rows = data.colaboradores.map((collaborator) => ({
  NOME: collaborator.nome,
  CPF: collaborator.cpf,
  POSTO: collaborator.funcao,
  SEC: collaborator.sec,
}));

const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), 'SECs - Colaboradores');
await writeFile(
  '/home/ubuntu/Downloads/Dados_de_Colaboradores_teste_autoria.xlsx',
  XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }),
);
console.log(`Planilha de teste criada com ${rows.length} colaboradores.`);
