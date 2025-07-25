// register.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router,RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  
  // Étape courante (1: Rôle, 2: Informations, 3: Documents)
  currentStep: number = 1;
  
  // Rôle sélectionné
  selectedRole: string = '';
  
  // Informations utilisateur
  userInfo = {
    username: '',
    phone: '',
    email: ''
  };

  // Documents téléchargés
  documents = {
    identity: null as File | null,
    authorization: null as File | null,
    logo: null as File | null
  };

  // Informations de la pharmacie
  pharmacyInfo = {
    name: '',
    address: ''
  };

  constructor(
    private router: Router
  ) { }

  // Sélectionner un rôle
  selectRole(role: string): void {
    this.selectedRole = role;
  }

  // Passer à l'étape suivante
  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  // Revenir à l'étape précédente
  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // Déclencher l'input file
  triggerFileInput(type: string): void {
    const input = document.querySelector(`input[type="file"]#${type}Input`) as HTMLInputElement;
    if (input) {
      input.click();
    }
  }

  // Gérer la sélection de fichier
  onFileSelected(event: any, type: string): void {
    const file = event.target.files[0];
    if (file) {
      // Vérifier la taille du fichier (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert('Le fichier ne doit pas dépasser 10MB');
        return;
      }

      // Vérifier le type de fichier
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
      if (type === 'logo') {
        const logoTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!logoTypes.includes(file.type)) {
          alert('Le logo doit être au format PNG, JPG ou JPEG');
          return;
        }
      } else {
        if (!allowedTypes.includes(file.type)) {
          alert('Le fichier doit être au format PNG, JPG ou PDF');
          return;
        }
      }

      // Stocker le fichier
      (this.documents as any)[type] = file;
    }
  }

  // Gérer le drag over
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  // Gérer le drop de fichier
  onFileDrop(event: DragEvent, type: string): void {
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Simuler un événement pour réutiliser la logique de validation
      const mockEvent = { target: { files: [file] } };
      this.onFileSelected(mockEvent, type);
    }
  }

  // Vérifier si on peut terminer l'inscription
  canCompleteRegistration(): boolean {
    return (
      this.documents.identity !== null &&
      this.documents.authorization !== null &&
      this.pharmacyInfo.name.trim() !== '' &&
      this.pharmacyInfo.address.trim() !== ''
    );
  }

  // Terminer l'inscription
  completeRegistration(): void {
    if (this.canCompleteRegistration()) {
      // Ici vous pouvez ajouter la logique pour envoyer les données au serveur
      console.log('Données d\'inscription:', {
        role: this.selectedRole,
        userInfo: this.userInfo,
        pharmacyInfo: this.pharmacyInfo,
        documents: this.documents
      });
      
      alert('Inscription terminée avec succès ! Vos documents seront examinés sous 48h.');
      // Rediriger vers la page de connexion ou tableau de bord
    }
  }

  // Vérifier si on peut continuer depuis l'étape 1
  canContinueStep1(): boolean {
    return this.selectedRole !== '';
  }

  // Vérifier si on peut continuer depuis l'étape 2
  canContinueStep2(): boolean {
    return this.userInfo.username.trim() !== '' && this.userInfo.phone.trim() !== '';
  }
}


