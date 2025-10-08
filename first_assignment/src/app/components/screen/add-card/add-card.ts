import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardService } from './card.service';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.css']
})
export class AddCardComponent implements OnInit {
  cardForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private cardService: CardService
  ) {
    this.cardForm = this.fb.group({
      card_number: ['', [
        Validators.required,
        Validators.pattern(/^\d+$/),
        Validators.minLength(7),
        Validators.maxLength(16)
      ]],
      cardholder_name: ['', Validators.required],
      csc_code: ['', [
        Validators.required,
        Validators.pattern(/^\d{3}$/)
      ]],
      expiration_date_month: ['', [
        Validators.required,
        Validators.min(1),
        Validators.max(12)
      ]],
      expiration_date_year: ['', Validators.required],
      issuer: ['']
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.cardForm.valid) {
      this.isSubmitting = true;
      this.submitSuccess = false;
      this.submitError = false;
      this.errorMessage = '';

      this.cardService.addCard(this.cardForm.value).subscribe({
        next: (response) => {
          console.log('Card added successfully:', response);
          this.submitSuccess = true;
          this.isSubmitting = false;
          this.cardForm.reset();

          // Hide success message after 3 seconds
          setTimeout(() => {
            this.submitSuccess = false;
          }, 3000);
        },
        error: (error) => {
          console.error('Error adding card:', error);
          this.submitError = true;
          this.isSubmitting = false;
          this.errorMessage = error.error?.message || 'Failed to add card. Please try again.';

          // Hide error message after 5 seconds
          setTimeout(() => {
            this.submitError = false;
          }, 5000);
        }
      });
    } else {
      console.log('Form is invalid');
      this.markFormGroupTouched(this.cardForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get card_number() {
    return this.cardForm.get('card_number');
  }

  get cardholder_name() {
    return this.cardForm.get('cardholder_name');
  }

  get csc_code() {
    return this.cardForm.get('csc_code');
  }

  get expiration_date_month() {
    return this.cardForm.get('expiration_date_month');
  }

  get expiration_date_year() {
    return this.cardForm.get('expiration_date_year');
  }

  get issuer() {
    return this.cardForm.get('issuer');
  }
}
