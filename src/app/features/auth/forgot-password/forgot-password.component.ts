import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router ,RouterLink} from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  @Output() backToLoginEvent = new EventEmitter<void>();

  resetForm: FormGroup;
  selectedMethod: 'email' | 'phone' = 'email';
  isLoading: boolean = false;

  currentStep: 'reset' | 'verify' = 'reset';
codeDigits = ['', '', '', '', '', ''];
countdown = 60;
canResend = false;
isVerifying = false;
isResending = false;
verificationError = '';

codeSent = false; // Pour contrôler l'affichage des étapes
maskedContact = ''; // Pour afficher l'email/téléphone masqué
verificationForm!: FormGroup; // Nouveau FormGroup pour la vérification
resendCountdown = 0; // Compteur pour le renvoi de code
  fb: any;
  codeVerified = false; // Pour contrôler l'affichage de l'étape 3
newPasswordForm!: FormGroup; // FormGroup pour le nouveau mot de passe
showNewPassword = false; // Visibilité du nouveau mot de passe
showConfirmPassword = false; // Visibilité de la confirmation
isResetting = false; // État de chargement pour la réinitialisation

// Variables pour les critères de validation du mot de passe
hasMinLength = false;
hasUppercase = false;


  constructor(
    private formBuilder: FormBuilder ,
    private router: Router
    ) {
   
    
    this.resetForm = this.createResetForm();
  
  }

  ngOnInit(): void {
    // Initialize with email method selected
    this.selectMethod('email');
    this.verificationForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Creates the reactive form for password reset
   */
  private createResetForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^(\+33|0)[1-9](\d{8})$/)]]
    });
  }

  /**
   * Selects the reset method (email or phone)
   */
  selectMethod(method: 'email' | 'phone'): void {
    this.selectedMethod = method;
    
    // Clear previous validations
    this.resetForm.get('email')?.clearValidators();
    this.resetForm.get('phone')?.clearValidators();
    
    // Set validators based on selected method
    if (method === 'email') {
      this.resetForm.get('email')?.setValidators([Validators.required, Validators.email]);
      this.resetForm.get('phone')?.clearValidators();
    } else {
      this.resetForm.get('phone')?.setValidators([
        Validators.required, 
        Validators.pattern(/^(\+33|0)[1-9](\d{8})$/)
      ]);
      this.resetForm.get('email')?.clearValidators();
    }
    
    // Update form validation
    this.resetForm.get('email')?.updateValueAndValidity();
    this.resetForm.get('phone')?.updateValueAndValidity();
  }

  /**
   * Handles form submission
   */

  // Méthode appelée après l'envoi du code
onSubmit() {
  if (this.resetForm.valid) {
    this.isLoading = true;
    
    // Simuler l'envoi du code
    setTimeout(() => {
      this.isLoading = false;
      this.codeSent = true;
      
      // Masquer l'email/téléphone
      const contact = this.selectedMethod === 'email' 
        ? this.resetForm.get('email')?.value 
        : this.resetForm.get('phone')?.value;
      
      this.maskedContact = this.maskContact(contact);
      this.startResendCountdown();
    }, 1500);
  }
}

// Masquer partiellement l'email ou téléphone
maskContact(contact: string): string {
  if (this.selectedMethod === 'email') {
    const [name, domain] = contact.split('@');
    return `${name.charAt(0)}***@${domain}`;
  } else {
    return contact.replace(/\d(?=\d{4})/g, '*');
  }
}

// Gérer la saisie des codes
onCodeInput(event: any, index: number) {
  const value = event.target.value;
  if (value && /^\d$/.test(value)) {
    this.codeDigits[index] = value;
    
    // Passer au champ suivant
    if (index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
    
    // Mettre à jour le FormControl
    this.updateCodeFormControl();
  } else {
    event.target.value = '';
    this.codeDigits[index] = '';
  }
}

// Gérer les touches spéciales
onKeyDown(event: any, index: number) {
  if (event.key === 'Backspace' && !event.target.value && index > 0) {
    const prevInput = document.getElementById(`code-${index - 1}`);
    prevInput?.focus();
  }
}

// Gérer le collage
onPaste(event: any) {
  event.preventDefault();
  const pastedData = event.clipboardData.getData('text');
  const cleanData = pastedData.replace(/\D/g, '').slice(0, 6);
  
  for (let i = 0; i < cleanData.length; i++) {
    this.codeDigits[i] = cleanData[i];
    const input = document.getElementById(`code-${i}`);
    if (input) (input as HTMLInputElement).value = cleanData[i];
  }
  
  this.updateCodeFormControl();
}

// Mettre à jour le FormControl du code
updateCodeFormControl() {
  const fullCode = this.codeDigits.join('');
  this.verificationForm.get('code')?.setValue(fullCode);
}

// Démarrer le compte à rebours pour renvoyer le code
startResendCountdown() {
  this.resendCountdown = 120; // 2 minutes
  const interval = setInterval(() => {
    this.resendCountdown--;
    if (this.resendCountdown <= 0) {
      clearInterval(interval);
    }
  }, 1000);
}

// Renvoyer le code
resendCode() {
  // Logique pour renvoyer le code
  this.startResendCountdown();
}


 
  /**
   * Checks if the current form is valid based on selected method
   */
  private isFormValid(): boolean {
    if (this.selectedMethod === 'email') {
      const emailControl = this.resetForm.get('email');
      return emailControl?.valid || false;
    } else {
      const phoneControl = this.resetForm.get('phone');
      return phoneControl?.valid || false;
    }
  }

  /**
   * Simulates sending verification code
   */
  private sendVerificationCode(data: any): void {
    // Here you would integrate with your backend API
    const method = data.method === 'email' ? 'email' : 'SMS';
    const destination = data.value;
    
    console.log(`Verification code sent via ${method} to ${destination}`);
    
    // Show success message
    this.showSuccessMessage(
      `Code de vérification envoyé ${data.method === 'email' ? 'par email' : 'par SMS'} !`
    );
    
    // In a real app, you might navigate to a verification code input page
    // or show a modal for code verification
  }

  /**
   * Navigates back to login
   */
  backToLogin(): void {
    this.backToLoginEvent.emit();
  }

  /**
   * Marks all relevant form controls as touched
   */
  private markFormGroupTouched(): void {
    if (this.selectedMethod === 'email') {
      this.resetForm.get('email')?.markAsTouched();
    } else {
      this.resetForm.get('phone')?.markAsTouched();
    }
  }

  /**
   * Shows success message
   */
  private showSuccessMessage(message: string): void {
    console.log('SUCCESS:', message);
    // Implement your notification service here
    // Example: this.notificationService.showSuccess(message);
  }

  /**
   * Shows error message
   */
  private showErrorMessage(message: string): void {
    console.log('ERROR:', message);
    // Implement your notification service here
    // Example: this.notificationService.showError(message);
  }

  /**
   * Custom email validator
   */
  private emailValidator(control: any) {
    const email = control.value;
    if (!email) return null;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? null : { invalidEmail: true };
  }

  /**
   * Custom phone validator for French numbers
   */
  private phoneValidator(control: any) {
    const phone = control.value;
    if (!phone) return null;
    
    // French phone number pattern
    const phoneRegex = /^(?:(?:\+33|0)[1-9])(?:[0-9]{8})$/;
    return phoneRegex.test(phone.replace(/\s+/g, '')) ? null : { invalidPhone: true };
  }

  /**
   * Getter for easy access to form controls
   */
  get f() {
    return this.resetForm.controls;
  }

  /**
   * Check if specific field has error
   */
  hasError(fieldName: string): boolean {
    const field = this.resetForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  /**
   * Get error message for a specific field
   */
  getErrorMessage(fieldName: string): string {
    const field = this.resetForm.get(fieldName);
    
    if (field?.hasError('required')) {
      return 'Ce champ est requis';
    }
    
    if (field?.hasError('email')) {
      return 'Veuillez saisir une adresse email valide';
    }
    
    if (field?.hasError('pattern') && fieldName === 'phone') {
      return 'Veuillez saisir un numéro de téléphone français valide';
    }
    
    return '';
  }
  // Validation personnalisée pour la confirmation du mot de passe
passwordMatchValidator(formGroup: AbstractControl): ValidationErrors | null {
  const password = formGroup.get('newPassword')?.value;
  const confirmPassword = formGroup.get('confirmPassword')?.value;
  
  if (password !== confirmPassword) {
    formGroup.get('confirmPassword')?.setErrors({ mismatch: true });
    return { mismatch: true };
  } else {
    formGroup.get('confirmPassword')?.setErrors(null);
    return null;
  }
}

// Méthode modifiée pour vérifier le code
onVerifyCode() {
  if (this.verificationForm.valid) {
    this.isVerifying = false;
    
    // Simuler la vérification
    setTimeout(() => {
      this.isVerifying = false;
      this.codeVerified = true; // Passer à l'étape 3
    }, 1500);
  }
}

// Basculer la visibilité du nouveau mot de passe
toggleNewPasswordVisibility() {
  this.showNewPassword = !this.showNewPassword;
}

// Basculer la visibilité de la confirmation
toggleConfirmPasswordVisibility() {
  this.showConfirmPassword = !this.showConfirmPassword;
}

// Vérifier les critères du mot de passe en temps réel
checkPasswordCriteria(password: string) {
  this.hasMinLength = password.length >= 8;
  this.hasUppercase = /[A-Z]/.test(password);
}

// Réinitialiser le mot de passe
onResetPassword() {
  if (this.newPasswordForm.valid) {
    this.isResetting = true;
    
    // Simuler la réinitialisation
    setTimeout(() => {
      this.isResetting = false;
      // Rediriger vers la page de connexion avec un message de succès
      // this.router.navigate(['/login']);
    }, 2000);
  }
}

  /**
   * Format phone number input
   */
  formatPhoneNumber(event: any): void {
    let value = event.target.value.replace(/\s+/g, '');
    
    // Auto-format French phone numbers
    if (value.startsWith('0') || value.startsWith('+33')) {
      // Add spaces for readability
      if (value.length > 2) {
        value = value.substring(0, 2) + ' ' + value.substring(2);
      }
      if (value.length > 5) {
        value = value.substring(0, 5) + ' ' + value.substring(5);
      }
      if (value.length > 8) {
        value = value.substring(0, 8) + ' ' + value.substring(8);
      }
      if (value.length > 11) {
        value = value.substring(0, 11) + ' ' + value.substring(11);
      }
      if (value.length > 14) {
        value = value.substring(0, 14) + ' ' + value.substring(14);
      }
    }
    
    this.resetForm.patchValue({ phone: value });
  }
  
}