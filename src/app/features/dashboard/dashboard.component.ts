import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [ CommonModule],
  standalone: true
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('pieChart', { static: false }) pieChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineChart', { static: false }) lineChart!: ElementRef<HTMLCanvasElement>;

  isBrowser: boolean = false;
  isOpen = false;
  selectedRegion = '';
  cards = [
    {
      title: 'Commandes en attente',
      value: '0',
      icon: 'package',
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
      linkText: 'Voir toutes les commandes',
      linkColor: 'text-teal-600'
    },
    {
      title: 'Temps moyen de préparation',
      value: '35min',
      icon: 'clock',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      linkText: 'Voir toutes les commandes',
      linkColor: 'text-blue-600'
    },
    {
      title: 'Commandes en préparations',
      value: '12',
      icon: 'clock',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      linkText: 'Voir toutes les commandes',
      linkColor: 'text-yellow-600'
    }
  ];


  revenus = {
    total: 4750000,
    aujourdhui: 250000,
    septJours: 1200000,
    moisPrecedent: 3500000
  };


  onCardClick(cardTitle: string) {
    console.log('Clicked on:', cardTitle);
    // Ajoutez ici votre logique de navigation
  }
  pieChartData = {
    labels: ['En attente', 'Préparation', 'Prêtes', 'Livrées', 'Refusées'],
    datasets: [{
      data: [25, 30, 15, 25, 5],
      backgroundColor: [
        '#FDE047', // Jaune
        '#60A5FA', // Bleu clair
        '#2563EB', // Bleu
        '#14B8A6', // Teal
        '#F87171'  // Rouge
      ],
      borderWidth: 0
    }]
  };

  lineChartData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [{
      label: 'Commandes livrées',
      data: [6, 8, 12, 9, 10, 6, 2],
      borderColor: '#14B8A6',
      backgroundColor: 'transparent',
      borderWidth: 2,
      pointBackgroundColor: '#14B8A6',
      pointBorderColor: '#14B8A6',
      pointRadius: 4,
      tension: 0.4
    }]
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Vérifie si on est dans le navigateur
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Chargement des données si besoin
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      setTimeout(() => {
        this.createPieChart();
        this.createLineChart();
      }, 100);
    }
  }


  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  exportToPDF() {
    console.log('Export en PDF...');
    // Ajoutez ici votre logique d'export PDF
    this.closeDropdown();
  }

  exportToExcel() {
    console.log('Export en Excel...');
    // Ajoutez ici votre logique d'export Excel
    this.closeDropdown();
  }
  createPieChart(): void {
    const ctx = this.pieChart?.nativeElement?.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'pie',
        data: this.pieChartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    }
  }

  createLineChart(): void {
    const ctx = this.lineChart?.nativeElement?.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'line',
        data: this.lineChartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: { display: false },
              border: { display: false }
            },
            y: {
              beginAtZero: true,
              max: 14,
              grid: { color: '#F3F4F6' },
              border: { display: false },
              ticks: { stepSize: 2 }
            }
          },
          plugins: {
            legend: { display: false }
          },
          elements: {
            point: { hoverRadius: 6 }
          }
        }
      });
    }
  }
}
