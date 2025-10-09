import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpService } from '../../http/http.service';

/**
 * Service for handling credit card and transaction API requests.
 */
@Injectable({
  providedIn: 'root'
})
export class CardService {
  httpService = inject(HttpService);


  /**
   * Fetches all credit cards.
   * @returns {Observable<any[]>} Observable with list of cards
   */
  getCards(): Observable<any[]> {
    return this.httpService.get<any[]>('CreditCard', );
  }

  getCardByNumber(cardNumber: string): Observable<any> {
    return this.httpService.get(`CreditCard/cardnumber?cardnumber=${cardNumber}`);
  }

  /**
   * Fetches all transactions for a specific card.
   * @param {string} cardNumber - Card number to filter transactions
   * @returns {Observable<any[]>} Observable with list of transactions
   */
  getCardTransactions(cardNumber: string): Observable<any[]> {
    return this.httpService
      .get<any[]>('Transaction')
      .pipe(
        map(transactions =>
          transactions.filter(t => {
            return t.cardNumber === Number(cardNumber);
          })
        ),
      );
  }

  /**
   * Removes a card by its card number.
   * @param {string} cardNumber - Card number to remove
   * @returns {Observable<void>} Observable for the delete operation
   */
  removeCard(cardNumber: string): Observable<void> {
    const url = `CreditCard/cardnumber?cardnumber=${cardNumber}`;
    return this.httpService.delete<void>(url);
  }
}

export interface Card {
  card_number: number;
  csc_code: number;
  cardholder_name: string;
  expiration_date_mont: number;
  expiration_date_year: number;
  issuer: string;
}

export interface Transaction {

}
