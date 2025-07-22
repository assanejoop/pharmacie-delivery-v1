import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';


export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  reference: string;
  patient: string;
  date: string;
  status: 'En attente' | 'Validée';
  items: OrderItem[];
}
 
export interface Medicament {
  nom: string;
  posologie: string;
  quantite: number;
  prixUnitaire: number;
}

export interface Patient {
  nom: string;
}

export interface Medecin {
  nom: string;
  telephone: string;
}

export interface Ordonnance {
  imageUrl: string;
}

export interface Commande {
  numero: string;
  patient: Patient;
  medecin: Medecin;
  date: string;
  ordonnance: Ordonnance;
  medicaments: Medicament[];
}

@Component({
  selector: 'app-commandes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commandes.component.html',
  styleUrls: ['./commandes.component.css']
})
export class CommandesComponent implements OnInit {
  // Data properties
  orders: Order[] = [
    {
      reference: 'CMD-4532',
      patient: 'Babacar Diop',
      date: '23/04/2025',
      status: 'En attente',
      items: [
        { name: 'Médicament A', quantity: 2, price: 25.50 },
        { name: 'Médicament B', quantity: 1, price: 45.00 },
        { name: 'Bandage', quantity: 3, price: 12.00 }
      ]
    },
    {
      reference: 'CMD-4531',
      patient: 'Maimouna Tall',
      date: '23/04/2025',
      status: 'En attente',
      items: [
        { name: 'Antibiotique C', quantity: 1, price: 32.00 },
        { name: 'Vitamine D', quantity: 2, price: 18.50 }
      ]
    },
    {
      reference: 'CMD-4530',
      patient: 'Lamine Gueye',
      date: '23/04/2025',
      status: 'Validée',
      items: [
        { name: 'Paracétamol', quantity: 1, price: 8.50 },
        { name: 'Sirop', quantity: 2, price: 15.00 },
        { name: 'Compresses', quantity: 5, price: 6.00 }
      ]
    },
    {
      reference: 'CMD-4529',
      patient: 'Maimouna Tall',
      date: '22/04/2025',
      status: 'Validée',
      items: [
        { name: 'Antalgique', quantity: 1, price: 22.00 },
        { name: 'Gel anti-inflammatoire', quantity: 1, price: 28.00 }
      ]
    }
  ];


  saisieMode: 'medicament' | 'total' = 'medicament';
  montantTotal: number = 0;
  
  commande: Commande = {
    numero: 'CMD-4531',
    patient: {
      nom: 'Babacar Diop'
    },
    medecin: {
      nom: 'Dr. Diop',
      telephone: '77 123 45 67'
    },
    date: 'Babacar Diop', // Il semble y avoir une erreur dans l'image, normalement ce devrait être une date
    ordonnance: {
      imageUrl: 'assets/images/img-ordinance.png' 
    },
    medicaments: [
      {
        nom: 'Doliprane 1000mg',
        posologie: '1 comprimé 3 fois par jour',
        quantite: 2,
        prixUnitaire: 1325
      }
    ]
  };

  constructor() { }

  ngOnInit(): void {
    // Initialisation du composant
    this.loadCommande();
    this.initializeData();
  }
  

  /**
   * Charger les données de la commande
   */
  loadCommande(): void {
    // Ici vous pouvez charger les données depuis un service
    // this.commandeService.getCommande(this.commandeId).subscribe(...)
  }

  /**
   * Définir le mode de saisie
   */
  setSaisieMode(mode: 'medicament' | 'total'): void {
    this.saisieMode = mode;
  }

  /**
   * Mettre à jour un médicament
   */
  updateMedicament(index: number, field: keyof Medicament, event: any): void {
    const value = event.target.value;
    const medicament = this.commande.medicaments[index];
    
    switch (field) {
      case 'nom':
        medicament.nom = value;
        break;
      case 'posologie':
        medicament.posologie = value;
        break;
      case 'quantite':
        medicament.quantite = parseInt(value) || 0;
        break;
      case 'prixUnitaire':
        medicament.prixUnitaire = parseFloat(value) || 0;
        break;
    }
  }

  /**
   * Ajouter un nouveau médicament
   */
  ajouterMedicament(): void {
    const nouveauMedicament: Medicament = {
      nom: '',
      posologie: '',
      quantite: 0,
      prixUnitaire: 0
    };
    
    this.commande.medicaments.push(nouveauMedicament);
  }

  /**
   * Supprimer un médicament
   */
  supprimerMedicament(index: number): void {
    if (this.commande.medicaments.length > 1) {
      this.commande.medicaments.splice(index, 1);
    }
  }

  /**
   * Obtenir le total selon le mode de saisie
   */
  getTotal(): number {
    if (this.saisieMode === 'total') {
      return this.montantTotal;
    }
    return this.calculerTotal();
  }

  /**
   * Calculer le total de la commande
   */
  calculerTotal(): number {
    return this.commande.medicaments.reduce((total, medicament) => {
      return total + (medicament.quantite * medicament.prixUnitaire);
    }, 0);
  }

  /**
   * Accepter la commande
   */
  accepterCommande(): void {
    Swal.fire({
      title: 'Accepter cette commande ?',
      text: `Commande N° ${this.commande.numero} - Patient: ${this.commande.patient.nom}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#00B894',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, accepter',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        // Logique pour accepter
        console.log('Commande acceptée:', this.commande);
        Swal.fire({
          title: 'Acceptée !',
          text: 'La commande a été acceptée avec succès.',
          icon: 'success',
          confirmButtonColor: '#00B894'
        });
      }
    });
  }
  
  refuserCommande(): void {
    Swal.fire({
      title: 'Refuser cette commande ?',
      text: 'Veuillez fournir une raison (facultatif) :',
      input: 'text',
      inputPlaceholder: 'Raison du refus',
      showCancelButton: true,
      confirmButtonColor: '#FF6B6B',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Refuser',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        const raison = result.value || 'Non précisée';
        console.log('Commande refusée:', this.commande.numero, 'Raison:', raison);
        Swal.fire({
          title: 'Refusée !',
          text: 'La commande a été refusée.',
          icon: 'info',
          confirmButtonColor: '#FF6B6B'
        });
      }
    });
  }
  

  /**
   * Refuser la commande
   */


  /**
   * Sauvegarder les modifications
   */
  sauvegarder(): void {
    // Logique pour sauvegarder les modifications
    console.log('Sauvegarde de la commande:', this.commande);
    
    // Ici vous pouvez appeler un service pour sauvegarder
    // this.commandeService.updateCommande(this.commande).subscribe(...)
  }

  /**
   * Valider les données du formulaire
   */
  validerFormulaire(): boolean {
    // Vérifier que tous les médicaments ont un nom
    const medicamentsValides = this.commande.medicaments.every(med => 
      med.nom.trim() !== '' && med.quantite > 0 && med.prixUnitaire > 0
    );
    
    if (!medicamentsValides) {
      alert('Veuillez remplir tous les champs obligatoires pour chaque médicament.');
      return false;
    }
    
    return true;
  }

  /**
   * Imprimer l'ordonnance
   */
  imprimerOrdonnance(): void {
    window.print();
  }

  // Filter and search properties
  filteredOrders: Order[] = [];
  paginatedOrders: Order[] = [];
  searchTerm: string = '';
  selectedOrder: Order | null = null;
  showFilter: boolean = false;

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  // Math reference for template
  Math = Math;


  private initializeData(): void {
    this.filteredOrders = [...this.orders];
    this.totalItems = this.orders.length;
    this.updatePagination();
  }

  // Search functionality
  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(order =>
        order.reference.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.patient.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.date.includes(this.searchTerm) ||
        order.status.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.totalItems = this.filteredOrders.length;
    this.currentPage = 1;
    this.updatePagination();
  }

  // Filter functionality
  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  // Selection functionality
  selectOrder(order: Order): void {
    this.selectedOrder = order;
  }

  // Pagination functionality
  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.updatePagination();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  private updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedOrders = this.filteredOrders.slice(startIndex, endIndex);
  }

  // Pagination helper methods
  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }

  // Order actions
  validateOrder(order: Order): void {
    const orderIndex = this.orders.findIndex(o => o.reference === order.reference);
    if (orderIndex !== -1) {
      this.orders[orderIndex].status = 'Validée';
      this.selectedOrder = this.orders[orderIndex];
      this.initializeData();
    }
  }

  cancelOrder(order: Order): void {
    const orderIndex = this.orders.findIndex(o => o.reference === order.reference);
    if (orderIndex !== -1) {
      this.orders[orderIndex].status = 'En attente';
      this.selectedOrder = this.orders[orderIndex];
      this.initializeData();
    }
  }

  printOrder(order: Order): void {
    console.log('Impression de la commande:', order.reference);
    // Implement print functionality
  }

  // Status helper methods
  isStatusPending(status: string): boolean {
    return status === 'En attente';
  }

  isStatusValidated(status: string): boolean {
    return status === 'Validée';
  }

  getStatusClass(status: string): string {
    return status === 'En attente' 
      ? 'bg-orange-100 text-orange-800' 
      : 'bg-green-100 text-green-800';
  }

  // Order totals
  getOrderTotal(order: Order): number {
    return order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Additional utility methods
  exportOrders(): void {
    console.log('Exporting orders...');
  }

  refreshData(): void {
    this.initializeData();
  }

  deleteOrder(orderId: string): void {
    this.orders = this.orders.filter(order => order.reference !== orderId);
    if (this.selectedOrder?.reference === orderId) {
      this.selectedOrder = null;
    }
    this.initializeData();
  }

  updateOrderStatus(orderId: string, newStatus: 'En attente' | 'Validée'): void {
    const order = this.orders.find(o => o.reference === orderId);
    if (order) {
      order.status = newStatus;
      this.initializeData();
    }
  }

  // Filter by status
  filterByStatus(status: 'En attente' | 'Validée' | 'all'): void {
    if (status === 'all') {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(order => order.status === status);
    }
    this.totalItems = this.filteredOrders.length;
    this.currentPage = 1;
    this.updatePagination();
  }
}