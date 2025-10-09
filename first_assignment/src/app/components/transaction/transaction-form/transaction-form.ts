import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { TransactionDto, TransactionService } from '../transaction-service';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Currency } from '../../screen/transacation-list/transacation-list';
import { JsonPipe } from '@angular/common';
import { CardService } from '../../screen/card-detail/card.service';
import { catchError, map, Observable, of, switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-transaction-form',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.css',
})
export class TransactionForm {
  transactionService = inject(TransactionService);
  cardService = inject(CardService);


  @Output() transactionAdded = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  transactionForm = new FormGroup({
    cardNumber: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, cardNumberValidator],
      asyncValidators: [cardExistsValidator(this.cardService)]
    }),
    amount: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    currencyCode: new FormControl<Currency>(Currency.EUR, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    transactionDate: new FormControl<string>(
      new Date().toISOString().slice(0,16),
      { nonNullable: true,
      validators: [Validators.required],
    }),
    comment: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  onSubmit() {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }
    const transaction: TransactionDto = this.transactionForm.getRawValue();

    this.transactionService.addTransaction(transaction).subscribe({
      next: (response) => {
        console.log('Transaction added successfully:', response);
        this.transactionForm.reset();
        this.transactionAdded.emit();
      },
      error: (error) => {
        console.error('Error adding transaction:', error);
      },
    });
  }
}

function cardNumberValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if(!value) {
    return null;
  }

  const cardNumberStr = value.toString();
  const isValidLength = cardNumberStr.length ===16;
  const isAllDigits = /^\d{16}$/.test(cardNumberStr);

  if(!isValidLength  || !isAllDigits) {
    return { invalidCardNumber: {message: 'Card number must be excatly 16 digits.' }};
  }

  return null;
}

function cardExistsValidator(cardService: CardService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const value = control.value;

    if (!value || value.toString().length !== 16) {
      return of(null);
    }

    return timer(300).pipe(
      // Debounce to avoid too many API calls
      switchMap(() =>
        cardService.getCardByNumber(value).pipe(
          map(() => null), // Card exists, no error
          catchError((error) => {
            console.log('Card not found:', error);
            return of({ cardNotFound: { message: 'Card number does not exist' } });
          })
        )
      )
    );
  };
}
