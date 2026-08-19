import { writeFile } from 'node:fs/promises';
import { storageGetSignedUrl } from '../server/storage.ts';

const key = 'imports/0/1786991670476-Dados de Colaboradores_a91090f3.xlsx';
const destination = '/home/ubuntu/Downloads/Dados_de_Colaboradores_teste_autoria.xlsx';
const response = await fetch(await storageGetSignedUrl(key));

if (!response.ok) throw new Error(`Download da planilha falhou: ${response.status}`);

await writeFile(destination, Buffer.from(await response.arrayBuffer()));
console.log(destination);
