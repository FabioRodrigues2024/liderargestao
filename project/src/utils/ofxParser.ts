import { ImportTransaction } from '../types';

export interface OfxBankInfo {
  bankId: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
}

export function parseOfxContent(content: string): { transactions: ImportTransaction[], bankInfo: OfxBankInfo | null } {
  const transactions: ImportTransaction[] = [];
  let bankInfo: OfxBankInfo | null = null;
  
  try {
    // Extract bank information
    const bankIdMatch = content.match(/<BANKID>(\d+)<\/BANKID>/);
    const bankNameMatch = content.match(/<ORG>(.+?)<\/ORG>/);
    const accountNumberMatch = content.match(/<ACCTID>(.+?)<\/ACCTID>/);
    const accountTypeMatch = content.match(/<ACCTTYPE>(.+?)<\/ACCTTYPE>/);

    if (bankIdMatch && bankNameMatch) {
      bankInfo = {
        bankId: bankIdMatch[1],
        bankName: bankNameMatch[1],
        accountNumber: accountNumberMatch ? accountNumberMatch[1] : '',
        accountType: accountTypeMatch ? accountTypeMatch[1] : ''
      };
    }

    // Extract transactions
    const transactionMatches = content.match(/<STMTTRN>[\s\S]*?<\/STMTTRN>/g) || [];

    transactions.push(...transactionMatches.map(transactionStr => {
      const dateMatch = transactionStr.match(/<DTPOSTED>(\d{8})<\/DTPOSTED>/);
      const amountMatch = transactionStr.match(/<TRNAMT>(-?\d+\.\d+)<\/TRNAMT>/);
      const descMatch = transactionStr.match(/<MEMO>(.+?)<\/MEMO>/) || transactionStr.match(/<NAME>(.+?)<\/NAME>/);
      const typeMatch = transactionStr.match(/<TRNTYPE>(.+?)<\/TRNTYPE>/);

      if (!dateMatch || !amountMatch) {
        throw new Error('Transação inválida: data ou valor ausente');
      }

      const date = parseOfxDate(dateMatch[1]);
      const amount = Math.abs(parseFloat(amountMatch[1]));
      const description = descMatch ? descMatch[1] : 'Sem descrição';
      const type = parseFloat(amountMatch[1]) > 0 ? 'INCOME' : 'EXPENSE';

      return {
        date: date.toISOString(),
        amount,
        description,
        type,
        paymentMethod: 'TRANSFER',
        bankId: bankInfo?.bankId || '',
        category: '',
        originalDescription: description
      };
    }));

  } catch (error) {
    console.error('Erro ao processar arquivo OFX:', error);
    throw new Error('Formato de arquivo OFX inválido');
  }

  return { transactions, bankInfo };
}

function parseOfxDate(dateStr: string): Date {
  const year = parseInt(dateStr.substring(0, 4), 10);
  const month = parseInt(dateStr.substring(4, 6), 10) - 1;
  const day = parseInt(dateStr.substring(6, 8), 10);
  return new Date(Date.UTC(year, month, day));
}