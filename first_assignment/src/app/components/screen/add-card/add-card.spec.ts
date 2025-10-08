import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AddCardComponent } from './add-card.component';
import { CardService } from './card.service';

describe('AddCardComponent', () => {
  let component: AddCardComponent;
  let fixture: ComponentFixture<AddCardComponent>;
  let httpMock: HttpTestingController;
  let cardService: CardService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCardComponent ],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [ CardService ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddCardComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    cardService = TestBed.inject(CardService);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize the form with empty values', () => {
      expect(component.cardForm.get('card_number')?.value).toBe('');
      expect(component.cardForm.get('cardholder_name')?.value).toBe('');
      expect(component.cardForm.get('csc_code')?.value).toBe('');
      expect(component.cardForm.get('expiration_date_month')?.value).toBe('');
      expect(component.cardForm.get('expiration_date_year')?.value).toBe('');
      expect(component.cardForm.get('issuer')?.value).toBe('');
    });

    it('should have invalid form when empty', () => {
      expect(component.cardForm.valid).toBeFalsy();
    });
  });

  describe('F4.1 - Card Number Field', () => {
    it('F4.1.3 - should be required', () => {
      const cardNumber = component.cardForm.get('card_number');
      expect(cardNumber?.hasError('required')).toBeTruthy();
    });

    it('F4.1.1 - should only accept numbers', () => {
      const cardNumber = component.cardForm.get('card_number');
      cardNumber?.setValue('12345abc');
      expect(cardNumber?.hasError('pattern')).toBeTruthy();

      cardNumber?.setValue('1234567');
      expect(cardNumber?.hasError('pattern')).toBeFalsy();
    });

    it('F4.1.2 - should enforce minimum length of 7 digits', () => {
      const cardNumber = component.cardForm.get('card_number');
      cardNumber?.setValue('123456');
      expect(cardNumber?.hasError('minlength')).toBeTruthy();

      cardNumber?.setValue('1234567');
      expect(cardNumber?.hasError('minlength')).toBeFalsy();
    });

    it('F4.1.2 - should enforce maximum length of 16 digits', () => {
      const cardNumber = component.cardForm.get('card_number');
      cardNumber?.setValue('12345678901234567');
      expect(cardNumber?.hasError('maxlength')).toBeTruthy();

      cardNumber?.setValue('1234567890123456');
      expect(cardNumber?.hasError('maxlength')).toBeFalsy();
    });

    it('should accept valid card number', () => {
      const cardNumber = component.cardForm.get('card_number');
      cardNumber?.setValue('1234567890123456');
      expect(cardNumber?.valid).toBeTruthy();
    });
  });

  describe('F4.2 - CSC Code Field', () => {
    it('F4.2.4 - should be required', () => {
      const cscCode = component.cardForm.get('csc_code');
      expect(cscCode?.hasError('required')).toBeTruthy();
    });

    it('F4.2.1 - should only accept numbers', () => {
      const cscCode = component.cardForm.get('csc_code');
      cscCode?.setValue('12a');
      expect(cscCode?.hasError('pattern')).toBeTruthy();
    });

    it('F4.2.2 - should enforce exactly 3 digits', () => {
      const cscCode = component.cardForm.get('csc_code');

      cscCode?.setValue('12');
      expect(cscCode?.hasError('pattern')).toBeTruthy();

      cscCode?.setValue('1234');
      expect(cscCode?.hasError('pattern')).toBeTruthy();

      cscCode?.setValue('123');
      expect(cscCode?.valid).toBeTruthy();
    });
  });

  describe('F4.3 - Cardholder Name Field', () => {
    it('F4.3.1 - should be required', () => {
      const cardholderName = component.cardForm.get('cardholder_name');
      expect(cardholderName?.hasError('required')).toBeTruthy();
    });

    it('should accept valid cardholder name', () => {
      const cardholderName = component.cardForm.get('cardholder_name');
      cardholderName?.setValue('John Doe');
      expect(cardholderName?.valid).toBeTruthy();
    });
  });

  describe('F4.4 - Expiration Month Field', () => {
    it('F4.4.2 - should be required', () => {
      const expirationMonth = component.cardForm.get('expiration_date_month');
      expect(expirationMonth?.hasError('required')).toBeTruthy();
    });

    it('F4.4.1 - should enforce range 1-12', () => {
      const expirationMonth = component.cardForm.get('expiration_date_month');

      expirationMonth?.setValue(0);
      expect(expirationMonth?.hasError('min')).toBeTruthy();

      expirationMonth?.setValue(13);
      expect(expirationMonth?.hasError('max')).toBeTruthy();

      expirationMonth?.setValue(1);
      expect(expirationMonth?.valid).toBeTruthy();

      expirationMonth?.setValue(12);
      expect(expirationMonth?.valid).toBeTruthy();
    });
  });

  describe('F4.5 - Expiration Year Field', () => {
    it('F4.5.1 - should be required', () => {
      const expirationYear = component.cardForm.get('expiration_date_year');
      expect(expirationYear?.hasError('required')).toBeTruthy();
    });

    it('should accept valid year', () => {
      const expirationYear = component.cardForm.get('expiration_date_year');
      expirationYear?.setValue(2025);
      expect(expirationYear?.valid).toBeTruthy();
    });
  });

  describe('Issuer Field', () => {
    it('should be optional', () => {
      const issuer = component.cardForm.get('issuer');
      expect(issuer?.hasError('required')).toBeFalsy();
    });
  });

  describe('Form Submission', () => {
    it('should not submit invalid form', () => {
      spyOn(console, 'log');
      component.onSubmit();
      expect(console.log).toHaveBeenCalledWith('Form is invalid');
    });

    it('should submit valid form and call API', () => {
      const mockCard = {
        card_number: '1234567890123456',
        cardholder_name: 'John Doe',
        csc_code: '123',
        expiration_date_month: 12,
        expiration_date_year: 2025,
        issuer: 'Visa'
      };

      component.cardForm.setValue(mockCard);
      component.onSubmit();

      const req = httpMock.expectOne('https://assignment1.swafe.dk/api/CreditCard');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCard);

      req.flush({ id: 1, ...mockCard });

      expect(component.submitSuccess).toBeTruthy();
      expect(component.isSubmitting).toBeFalsy();
    });

    it('should handle API error', () => {
      const mockCard = {
        card_number: '1234567890123456',
        cardholder_name: 'John Doe',
        csc_code: '123',
        expiration_date_month: 12,
        expiration_date_year: 2025,
        issuer: 'Visa'
      };

      component.cardForm.setValue(mockCard);
      component.onSubmit();

      const req = httpMock.expectOne('https://assignment1.swafe.dk/api/CreditCard');
      req.flush({ message: 'Server error' }, { status: 500, statusText: 'Server Error' });

      expect(component.submitError).toBeTruthy();
      expect(component.isSubmitting).toBeFalsy();
      expect(component.errorMessage).toBeTruthy();
    });

    it('should mark all fields as touched when submitting invalid form', () => {
      component.onSubmit();
      expect(component.cardForm.get('card_number')?.touched).toBeTruthy();
      expect(component.cardForm.get('cardholder_name')?.touched).toBeTruthy();
      expect(component.cardForm.get('csc_code')?.touched).toBeTruthy();
    });
  });

  describe('Form Integration', () => {
    it('should be valid with all required fields filled correctly', () => {
      component.cardForm.setValue({
        card_number: '1234567890123456',
        cardholder_name: 'John Doe',
        csc_code: '123',
        expiration_date_month: 6,
        expiration_date_year: 2026,
        issuer: ''
      });

      expect(component.cardForm.valid).toBeTruthy();
    });
  });
});
