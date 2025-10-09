import { Injectable, inject } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  httpService = inject(HttpService)

  returnAllTransactions(): Observable<Transaction[]> {
    return this.httpService.get('Transaction');
  }

  addTransaction(transaction: TransactionDto): Observable<TransactionDto> {
    return this.httpService.post('Transaction', transaction);
  }

  deleteTransaction(id: string): Observable<string> {
    return this.httpService.delete(`Transaction/uid?uid=${id}`);
  }

}


export interface Transaction {
  uid: string;
  cardNumber: number;
  amount: number;
  currencyCode: string;
  transactionDate: string;
  comment?: string;
}

export interface TransactionDto {
  cardNumber: number;
  amount: number;
  currencyCode: string;
  transactionDate: string;
  comment?: string;
}
