import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';

interface PersonalInfo {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
}

interface Document {
  id: string;
  name: string;
  lastUpdate: string;
  status: 'verified' | 'pending' | 'missing';
}

export interface PharmacyInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  openingHours: string;
  availability: string;
  logo?: string;
}
interface Facture {
  id: string;
  reference: string;
  echeance: string;
  montant: string;
  statut: 'en_attente' | 'payee';
}

@Component({
  selector: 'app-comptes',
  imports: [CommonModule, FormsModule],
  templateUrl: './comptes.component.html',
  styleUrl: './comptes.component.css'
})
export class ComptesComponent {


getStatusColor(arg0: string) {
throw new Error('Method not implemented.');
}
  activeSection: string = 'personal';
  
  personalInfo: PersonalInfo = {
    prenom: 'Cheikh',
    nom: 'Gueye',
    email: 'cheikh.gueye@example.com',
    telephone: '+221 77 123 45 67',
    adresse: '123 Rue Point, Dakar'
  };

  documents: Document[] = [
    {
      id: '1',
      name: "Pièce d'identité",
      lastUpdate: '12/05/2025',
      status: 'verified'
    },
    {
      id: '2',
      name: "Autorisation d'exercer",
      lastUpdate: '12/05/2025',
      status: 'verified'
    },
    {
      id: '3',
      name: 'Registre de commerce',
      lastUpdate: '15/05/2025',
      status: 'pending'
    },
    {
      id: '4',
      name: 'Attestation fiscale',
      lastUpdate: '15/05/2025',
      status: 'missing'
    }
  ];

  getStatusClass(status: string): string {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'missing':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusIconClass(status: string): string {
    switch (status) {
      case 'verified':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'missing':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'verified':
        return 'Vérifié';
      case 'pending':
        return 'En attente';
      case 'missing':
        return 'Manquant';
      default:
        return 'Inconnu';
    }
  }

  downloadDocument(documentId: string): void {
    // Logique pour télécharger le document
    console.log(`Téléchargement du document: ${documentId}`);
    // Ici vous pouvez implémenter la logique réelle de téléchargement
  }

  addDocument(): void {
    // Logique pour ajouter un nouveau document
    console.log('Ajouter un nouveau document');
    // Ici vous pouvez ouvrir une modale ou naviguer vers une page d'ajout
  }

 

  disponibiliteOptions = [
    'Ouvert 7j/7',
    'Fermé le dimanche',
    'Fermé le samedi et dimanche',
    'Horaires réduits weekend'
  ];

  menuItems = [
    {
      id: 'personal',
      label: 'Informations personnelles',
      icon: 'user'
    },
    {
      id: 'documents',
      label: 'Documents justificatifs',
      icon: 'document'
    },
    {
      id: 'pharmacy',
      label: 'Informations de la pharmacie',
      icon: 'pharmacy'
    },
    {
      id: 'invoices',
      label: 'Mes factures',
      icon: 'invoice'
    }
  ];

  setActiveSection(sectionId: string): void {
    this.activeSection = sectionId;
  }

  onSaveChanges(): void {
    console.log('Modifications sauvegardées:', this.personalInfo);
    // Ici vous pouvez implémenter la logique de sauvegarde
  }

  

  onAddDocument(): void {
    console.log('Ajouter un document');
    // Ici vous pouvez implémenter la logique d'ajout de document
  }

  onDownloadDocument(documentId: number): void {
    console.log('Télécharger le document:', documentId);
    // Ici vous pouvez implémenter la logique de téléchargement
  }

  factures: Facture[] = [
    {
      id: '1',
      reference: 'FAC-2025-07',
      echeance: '05/07/2025',
      montant: '250 000 F cfa',
      statut: 'en_attente'
    },
    {
      id: '2',
      reference: 'FAC-2025-06',
      echeance: '05/06/2025',
      montant: '250 000 F cfa',
      statut: 'payee'
    },
    {
      id: '3',
      reference: 'FAC-2025-05',
      echeance: '05/05/2025',
      montant: '250 000 F cfa',
      statut: 'payee'
    },
    {
      id: '4',
      reference: 'FAC-2025-04',
      echeance: '05/04/2025',
      montant: '250 000 F cfa',
      statut: 'payee'
    }
  ];


  pharmacyInfo: PharmacyInfo = {
    name: 'Pharmacie Centrale',
    email: 'contact@pharmacie-centrale.ma',
    phone: '+221 77 123 45 67',
    address: '123 Rue Point, Dakar',
    openingHours: '8h00 - 20h00',
    availability: 'Ouvert 7j/7'
  };

  availabilityOptions = [
    { value: 'Ouvert 7j/7', label: 'Ouvert 7j/7' },
    { value: 'Fermé le dimanche', label: 'Fermé le dimanche' },
    { value: 'Fermé le weekend', label: 'Fermé le weekend' },
    { value: 'Horaires variables', label: 'Horaires variables' }
  ];

  isDropdownOpen = false;

  onLogoChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.pharmacyInfo.logo = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onLogoUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => this.onLogoChange(event);
    input.click();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectAvailability(option: any) {
    this.pharmacyInfo.availability = option.value;
    this.isDropdownOpen = false;
  }

  onSave() {
    console.log('Informations sauvegardées:', this.pharmacyInfo);
    // Ici vous pouvez ajouter la logique pour sauvegarder les données
    alert('Modifications enregistrées avec succès!');
  }
  // Pagination
  itemsPerPage: number = 10;
  currentPage: number = 1;
  totalPages: number = 4;

  getStatusClassFact(statut: string): string {
    switch (statut) {
      case 'en_attente':
        return 'bg-orange-100 text-orange-800';
      case 'payee':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusTextFact(statut: string): string {
    switch (statut) {
      case 'en_attente':
        return 'En attente';
      case 'payee':
        return 'Payée';
      default:
        return 'Inconnu';
    }
  }

  payerFacture(factureId: string): void {
    // Logique pour payer la facture
    console.log(`Payer la facture: ${factureId}`);
    
    // Mettre à jour le statut de la facture
    const facture = this.factures.find(f => f.id === factureId);
    if (facture) {
      facture.statut = 'payee';
    }
  }

  telechargerFacture(factureId: string): void {
    // Logique pour télécharger la facture
    console.log(`Télécharger la facture: ${factureId}`);
    // Ici vous pouvez implémenter la logique de téléchargement
  }

  onItemsPerPageChange(): void {
    // Logique pour changer le nombre d'éléments par page
    console.log(`Items per page changed to: ${this.itemsPerPage}`);
    // Recalculer la pagination
    this.currentPage = 1;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      console.log(`Page précédente: ${this.currentPage}`);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      console.log(`Page suivante: ${this.currentPage}`);
    }
  }

  }