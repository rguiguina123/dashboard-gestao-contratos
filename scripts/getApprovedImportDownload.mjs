import { storageGetSignedUrl } from '../server/storage.ts';

const key = 'imports/0/1786991670476-Dados de Colaboradores_a91090f3.xlsx';
const url = await storageGetSignedUrl(key);
console.log(url);
