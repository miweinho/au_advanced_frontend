import { Component, computed, effect, inject, Pipe, signal } from '@angular/core';
import { Transaction, TransactionService } from '../../transaction/transaction-service';
import { combineLatest, debounceTime, distinctUntilChanged, map, Observable, shareReplay, Subject, switchMap, startWith } from 'rxjs';
import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { TransactionForm } from "../../transaction/transaction-form/transaction-form";


@Component({
  selector: 'app-transacation-list',
  imports: [AsyncPipe, DatePipe, DecimalPipe, FormsModule, TransactionForm],
  templateUrl: './transacation-list.html',
  styleUrl: './transacation-list.css',
})
export class TransacationList {
  transactionService = inject(TransactionService);
  private reloadTrigger$ = new Subject<void>();

  showAddForm = signal<boolean>(false);

  //Filter State Signals
  cardNumber = signal<string>('');
  amountMin = signal<number | null>(null);
  amountMax = signal<number | null>(null);
  currency = signal<Currency | null>(null);
  dateFrom = signal<string>('');
  dateTo = signal<string>('');
  comment = signal<string>('');

  sortKey = signal<SortKey>('date');
  sortDir = signal<SortDir>('desc');

  // zusammengefasste Filter als Observable (mit debounce)
  filtersSig = computed(() => ({
    cardNumber: this.cardNumber().trim(),
    amountMin: this.amountMin(),
    amountMax: this.amountMax(),
    currency: this.currency(),
    dateFrom: this.dateFrom(),
    dateTo: this.dateTo(),
    q: this.comment().trim().toLowerCase(),
    sortKey: this.sortKey(),
    sortDir: this.sortDir(),
  }));

  private transactions$: Observable<Transaction[]> = this.reloadTrigger$.pipe(
    startWith(null),
    switchMap(() => this.transactionService.returnAllTransactions()),
    shareReplay(1)
  );

  // Gefilterte und sortierte Transaktionen
  filteredTransactions$ = combineLatest([
    this.transactions$,
    toObservable(this.filtersSig).pipe(
      debounceTime(300),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
    ),
  ]).pipe(
    map(([transactions, filters]) => {
      let filtered = transactions;

      // Kartennummer Filter
      if (filters.cardNumber) {
        filtered = filtered.filter((t) =>
          t.cardNumber.toString().includes(filters.cardNumber.toLowerCase())
        );
      }

      // Betrag Min Filter
      if (filters.amountMin !== null) {
        filtered = filtered.filter((t) => t.amount >= filters.amountMin!);
      }

      // Betrag Max Filter
      if (filters.amountMax !== null) {
        filtered = filtered.filter((t) => t.amount <= filters.amountMax!);
      }

      // Währung Filter
      if (filters.currency) {
        filtered = filtered.filter((t) => t.currencyCode === filters.currency);
      }

      // Datum Von Filter
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        filtered = filtered.filter((t) => new Date(t.transactionDate) >= fromDate);
      }

      // Datum Bis Filter
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        filtered = filtered.filter((t) => new Date(t.transactionDate) <= toDate);
      }

      // Kommentar Filter (Volltext-Suche)
      if (filters.q) {
        filtered = filtered.filter(
          (t) =>
            t.comment?.toLowerCase().includes(filters.q) ||
            t.comment?.toLowerCase().includes(filters.q)
        );
      }

      // Sortierung
      return filtered.sort((a, b) => {
        let comparison = 0;

        switch (filters.sortKey) {
          case 'date':
            comparison =
              new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime();
            break;
          case 'amount':
            comparison = a.amount - b.amount;
            break;
          case 'cardNumber':
            comparison = a.cardNumber.toString().localeCompare(b.cardNumber.toString());
            break;
        }

        return filters.sortDir === 'asc' ? comparison : -comparison;
      });
    }),
    shareReplay(1)
  );

  clearFilters() {
    this.cardNumber.set('');
    this.amountMin.set(null);
    this.amountMax.set(null);
    this.currency.set(null);
    this.dateFrom.set('');
    this.dateTo.set('');
    this.comment.set('');
  }

  deleteTransaction(id: string) {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.transactionService.deleteTransaction(id).subscribe({
        next: () => {
          console.log('Transaction deleted successfully');
          this.reloadTrigger$.next();
        },
        error: (error) => {
          console.error('Error deleting transaction:', error);
        },
      });
    }
  }

  toggleAddForm() {
    this.showAddForm.update(show => !show);
  }

  onAddCancelled() {
    this.showAddForm.set(false);
  }
  onTransactionAdded() {
    this.showAddForm.set(false);
    this.reloadTrigger$.next();
  }

  toggleManualReload() {
    this.reloadTrigger$.next();

  }
}

export enum Currency {
  MWK = "MWK",
  EUR = "EUR",
  CAD = "CAD",
  USD = "USD",
  KYD = "KYD",
  NAD = "NAD",
}

type SortKey = 'date' | 'amount' | 'cardNumber';
type SortDir = 'asc' | 'desc';
