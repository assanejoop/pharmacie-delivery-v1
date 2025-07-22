import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Medication {
  id: number;
  name: string;
  dosage: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: number;
  reference: string;
  patient: string;
  doctor: string;
  date: Date;
  phone: string;
  status: 'Livrée' | 'En préparation' | 'Prête à livrer';
  medications: Medication[];
  total: number;
}

@Component({
  selector: 'app-livraison',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './livraison.component.html',
  styleUrls: ['./livraison.component.css']
})
export class LivraisonComponent implements OnInit {
  
  // Data properties
  orders: Order[] = [
    {
      id: 1,
      reference: 'CMD-4532',
      patient: 'Babacar Diop',
      doctor: 'Dr. Diop',
      date: new Date('2025-04-23'),
      phone: '77 123 45 67',
      status: 'Livrée',
      medications: [
        { id: 1, name: 'Doliprane 1000mg', dosage: '1 comprimé 3x/j', quantity: 2, unitPrice: 1325 },
        { id: 2, name: 'Amoxicilline 500mg', dosage: '1 gélule m/s', quantity: 2, unitPrice: 750 }
      ],
      total: 2075
    },
    {
      id: 2,
      reference: 'CMD-4531',
      patient: 'Maimouna Tall',
      doctor: 'Dr. Tall',
      date: new Date('2025-04-23'),
      phone: '77 987 65 43',
      status: 'En préparation',
      medications: [
        { id: 3, name: 'Efferalgan 500mg', dosage: '1 comprimé 2x/j', quantity: 1, unitPrice: 1200 },
        { id: 4, name: 'Smecta', dosage: '1 sachet 3x/j', quantity: 3, unitPrice: 800 }
      ],
      total: 3600
    },
    {
      id: 3,
      reference: 'CMD-4530',
      patient: 'Lamine Gueye',
      doctor: 'Dr. Gueye',
      date: new Date('2025-04-23'),
      phone: '77 456 78 90',
      status: 'Prête à livrer',
      medications: [
        { id: 5, name: 'Advil 200mg', dosage: '1 comprimé 2x/j', quantity: 1, unitPrice: 1500 },
        { id: 6, name: 'Vitamine C', dosage: '1 comprimé/j', quantity: 1, unitPrice: 900 }
      ],
      total: 2400
    },
    {
      id: 4,
      reference: 'CMD-4529',
      patient: 'Maimouna Tall',
      doctor: 'Dr. Diallo',
      date: new Date('2025-04-22'),
      phone: '77 987 65 43',
      status: 'Livrée',
      medications: [
        { id: 7, name: 'Imodium', dosage: '1 gélule si besoin', quantity: 1, unitPrice: 1800 }
      ],
      total: 1800
    }
  ];

  paginatedOrders: Order[] = [];
  selectedOrder: Order | null = null;
  
  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  startIndex: number = 0;
  endIndex: number = 0;

  constructor() {}

  ngOnInit(): void {
    this.updatePagination();
    // Auto-select first order for demonstration
    if (this.orders.length > 0) {
      this.selectedOrder = this.orders[0];
    }
  }

  // Pagination methods
  updatePagination(): void {
    this.totalItems = this.orders.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    
    this.startIndex = (this.currentPage - 1) * this.itemsPerPage + 1;
    this.endIndex = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    
    const startIdx = (this.currentPage - 1) * this.itemsPerPage;
    const endIdx = startIdx + this.itemsPerPage;
    
    this.paginatedOrders = this.orders.slice(startIdx, endIdx);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.updatePagination();
  }

  // Order selection
  selectOrder(order: Order): void {
    this.selectedOrder = order;
  }

  // Order management methods
  markAsReadyForDelivery(): void {
    if (this.selectedOrder && this.selectedOrder.status === 'En préparation') {
      this.selectedOrder.status = 'Prête à livrer';
      
      // Update the order in the main array
      const orderIndex = this.orders.findIndex(o => o.id === this.selectedOrder!.id);
      if (orderIndex !== -1) {
        this.orders[orderIndex] = { ...this.selectedOrder };
      }
      
      console.log('Commande marquée comme prête pour livraison:', this.selectedOrder.reference);
    }
  }

  printOrder(): void {
    if (this.selectedOrder) {
      console.log('Impression de la commande:', this.selectedOrder.reference);
      // Logique d'impression
      window.print();
    }
  }

  // Utility methods
  trackByOrderId(index: number, order: Order): number {
    return order.id;
  }

  getStatusColorClass(status: string): string {
    switch (status) {
      case 'Livrée':
        return 'bg-green-100 text-green-800';
      case 'En préparation':
        return 'bg-blue-100 text-blue-800';
      case 'Prête à livrer':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Calculate total for medications
  calculateTotal(medications: Medication[]): number {
    return medications.reduce((total, med) => total + (med.quantity * med.unitPrice), 0);
  }

  // Format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  }
}