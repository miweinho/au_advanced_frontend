import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { CardService } from './card.service';

/**
 * Card detail component.
 * Displays details and transactions for a selected card.
 */
@Component({
  selector: 'app-card-detail',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './card-detail.html',
  styleUrl: './card-detail.css',
})
export class CardDetail implements OnInit {
  private cardService = inject(CardService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  /** Selected card data */
  card: any = null;
  /** List of card transactions */
  transactions: any[] = [];
  /** Indicates if data is loading */
  loading = false;
  /** Error message, if any */
  error: string | null = null;

  /**
   * Initializes the component, fetches the card and its transactions.
   */
  ngOnInit(): void {
    const cardNumber = this.route.snapshot.paramMap.get('cardNumber');
    console.log('Route param:', cardNumber);

    if (!cardNumber) {
      this.error = 'No card number provided in the URL.';
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    this.cardService.getCardByNumber(cardNumber).subscribe({
      next: (data) => {
        this.card = data;
        this.cdr.detectChanges();
        console.log(this.card);

        if (!this.card) {
          this.error = 'No credit card found.';
        } else {
          console.log('Selected card:', this.card);

          // Fetch card transactions
          this.cardService.getCardTransactions(cardNumber).subscribe({
            next: (txs) => {
              console.log('Transactions:', txs);
              this.transactions = txs;
              console.log(txs);
              this.cdr.detectChanges();
            },
            error: (err) => console.error('Error loading transactions', err),
          });
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading cards', err);
        this.error = 'Failed to load cards.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  /**
   * Removes the current card after user confirmation.
   * @returns {void}
   */
  removeCard(): void {
    if (!this.card?.cardNumber) return;

    const confirmDelete = confirm('Are you sure you want to remove this card?');
    if (!confirmDelete) return;

    this.cardService.removeCard(this.card.cardNumber).subscribe({
      next: () => {
        alert('Card removed successfully.');

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 300);
      },
      error: (err) => {
        console.error('Error removing card', err);
        alert('Failed to remove card.');
      },
    });
  }
}
