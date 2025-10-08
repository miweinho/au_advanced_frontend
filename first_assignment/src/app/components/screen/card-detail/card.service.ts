import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Service for handling credit card and transaction API requests.
 */
@Injectable({
  providedIn: 'root'
})
export class CardService {
  private http = inject(HttpClient);
  private readonly API_URL = 'https://assignment1.swafe.dk/api/CreditCard';

  /**
   * Returns HTTP headers with authorization token.
   * @returns {object} HTTP options with Authorization header
   */
  private getAuthHeaders() {
    const token = localStorage.getItem('app_token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  /**
   * Fetches all credit cards.
   * @returns {Observable<any[]>} Observable with list of cards
   */
  getCards(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}`, this.getAuthHeaders());
  }

  /**
   * Fetches all transactions for a specific card.
   * @param {string} cardNumber - Card number to filter transactions
   * @returns {Observable<any[]>} Observable with list of transactions
   */
  getCardTransactions(cardNumber: string): Observable<any[]> {
    return this.http
      .get<any[]>(`https://assignment1.swafe.dk/api/Transaction`, this.getAuthHeaders())
      .pipe(
        map(transactions =>
          transactions.filter(t => t.cardNumber === Number(cardNumber))
        )
      );
  }

  /**
   * Removes a card by its card number.
   * @param {string} cardNumber - Card number to remove
   * @returns {Observable<void>} Observable for the delete operation
   */
  removeCard(cardNumber: string): Observable<void> {
    const url = `${this.API_URL}/cardnumber?cardnumber=${cardNumber}`;
    return this.http.delete<void>(url, this.getAuthHeaders());
  }
}
