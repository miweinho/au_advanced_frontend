import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpService } from '../../http/http.service';


@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./add-card.component.css']
})
export class AddCardComponent {
  cardForm: FormGroup;
  successMessage = '';
  errorMessage = '';
  httpService = inject(HttpService);


  constructor(private fb: FormBuilder) {
    this.cardForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      cardHolder: ['', Validators.required],
      expiryMonth: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
      expiryYear: ['', [Validators.required, Validators.min(new Date().getFullYear())]],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
      issuer: ['', [Validators.required, Validators.maxLength(10)]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.cardForm.invalid) {
      this.errorMessage = 'Please fill all fields correctly.';
      this.successMessage = '';
      return;
    }

    const payload = {
      cardNumber: this.cardForm.value.cardNumber,
      cscCode: this.cardForm.value.cvv,
      cardHolderName: this.cardForm.value.cardHolder,
      expirationMonth: this.cardForm.value.expiryMonth,
      expirationYear: this.cardForm.value.expiryYear,
      issuer: this.cardForm.value.issuer
    }
    const jsonPayload = await JSON.stringify(payload);

    this.httpService.post('CreditCard',jsonPayload).subscribe({
      next: () => {
        this.successMessage = 'Card added successfully!';
        this.errorMessage = '';
        this.cardForm.reset();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to add card. Please try again.';
        this.successMessage = '';
      },
    });
  }
}

