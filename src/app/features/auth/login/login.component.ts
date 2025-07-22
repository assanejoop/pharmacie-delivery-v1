import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showPassword: boolean = false;
  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.createLoginForm();
  }

  ngOnInit(): void {
    // Initialization logic can be added here
  }

  /**
   * Creates the reactive form for login
   */
  private createLoginForm(): FormGroup {
    return this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  /**
   * Toggles password visibility
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Handles form submission
   */
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      const formData = {
        username: this.loginForm.get('username')?.value,
        password: this.loginForm.get('password')?.value,
        rememberMe: this.loginForm.get('rememberMe')?.value
      };

      console.log('Login attempt:', formData);

      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        
        // Here you would typically call your authentication service
        this.authenticateUser(formData);
      }, 2000);
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.loginForm);
    }
  }

  /**
   * Simulates user authentication
   */
  private authenticateUser(credentials: any): void {
    // This is where you would integrate with your authentication service
    // For demo purposes, we'll just simulate a successful login
    
    if (credentials.username && credentials.password) {
      // Store authentication data if remember me is checked
      if (credentials.rememberMe) {
        // Note: In a real app, use secure storage methods
        console.log('Remember me option selected');
      }
      
      // Redirect to dashboard or home page
      console.log('Authentication successful, redirecting...');
      // this.router.navigate(['/dashboard']);
      
      // Show success message (you can implement a toast service)
      this.showSuccessMessage('Connexion réussie !');
    } else {
      this.showErrorMessage('Identifiants invalides');
    }
  }

  /**
   * Handles Google OAuth login
   */
  loginWithGoogle(): void {
    this.isLoading = true;
    console.log('Google login initiated');
    
    // Here you would integrate with Google OAuth
    // For demo purposes, we'll simulate the process
    setTimeout(() => {
      this.isLoading = false;
      console.log('Google authentication completed');
      this.showSuccessMessage('Connexion avec Google réussie !');
    }, 1500);
  }

  /**
   * Handles Apple ID login
   */
  loginWithApple(): void {
    this.isLoading = true;
    console.log('Apple login initiated');
    
    // Here you would integrate with Apple Sign-In
    // For demo purposes, we'll simulate the process
    setTimeout(() => {
      this.isLoading = false;
      console.log('Apple authentication completed');
      this.showSuccessMessage('Connexion avec Apple réussie !');
    }, 1500);
  }

  /**
   * Marks all form controls as touched to trigger validation display
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  /**
   * Shows success message (implement with your preferred toast/notification service)
   */
  private showSuccessMessage(message: string): void {
    // Implement your success notification logic here
    console.log('SUCCESS:', message);
    // Example: this.notificationService.showSuccess(message);
  }

  /**
   * Shows error message (implement with your preferred toast/notification service)
   */
  private showErrorMessage(message: string): void {
    // Implement your error notification logic here
    console.log('ERROR:', message);
    // Example: this.notificationService.showError(message);
  }

  /**
   * Handles forgot password functionality
   */
  onForgotPassword(): void {
    console.log('Forgot password clicked');
    // Navigate to forgot password page or show modal
    // this.router.navigate(['/forgot-password']);
  }

  /**
   * Handles sign up navigation
   */
  onSignUp(): void {
    console.log('Sign up clicked');
    // Navigate to registration page
    // this.router.navigate(['/register']);
  }

  /**
   * Getter for easy access to form controls in template
   */
  get f() {
    return this.loginForm.controls;
  }

  /**
   * Check if form field has error
   */
  hasError(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  /**
   * Get error message for a specific field
   */
  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    
    if (field?.hasError('required')) {
      return 'Ce champ est requis';
    }
    
    if (field?.hasError('email')) {
      return 'Veuillez saisir un email valide';
    }
    
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength']?.requiredLength;
      return `Minimum ${minLength} caractères requis`;
    }
    
    return '';
  }
}