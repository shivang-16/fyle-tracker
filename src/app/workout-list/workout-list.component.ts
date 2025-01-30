import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Workout } from '../models/workout.model';
import { WorkoutService } from '../services/workout.service';
Chart.register(...registerables);

@Component({
  selector: 'app-workout-list',
  templateUrl: './workout-list.component.html',
  styleUrls: ['./workout-list.component.css']
})
export class WorkoutListComponent implements OnInit {
  @ViewChild('workoutChart') workoutChart!: ElementRef;
  selectedWorkout: Workout | null = null;
  chart: Chart | null = null;

  workouts: Workout[] = [];
  filteredWorkouts: Workout[] = [];
  searchTerm = '';
  selectedType = '';
  currentPage = 1;
  itemsPerPage = 5;
  workoutTypes: string[] = ['Running', 'Walking', 'Cycling', 'Swimming', 'Strength']; // Add this line

  constructor(private workoutService: WorkoutService) {}

  firstWorkout: Workout | null = null;

  ngOnInit() {
    this.workoutService.getWorkouts().subscribe(workouts => {
      this.workouts = workouts;
      if (workouts.length > 0) {
        this.firstWorkout = workouts[0];
        this.showWorkoutGraph(this.firstWorkout);
      }
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredWorkouts = this.workouts.filter(workout => {
      const matchesSearch = workout.userName.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesType = this.selectedType
        ? workout.workouts.some(w => w.type === this.selectedType)
        : true;
      return matchesSearch && matchesType;
    });
    this.currentPage = 1;
  }

  get paginatedWorkouts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredWorkouts.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredWorkouts.length / this.itemsPerPage);
  }

  // Add this method to get color based on workout type
  getWorkoutTypeColor(type: string): string {
    const colors: { [key: string]: string } = {
      'Running': 'bg-blue-100 text-blue-800',
      'Walking': 'bg-green-100 text-green-800',
      'Cycling': 'bg-purple-100 text-purple-800',
      'Swimming': 'bg-yellow-100 text-yellow-800',
      'Strength': 'bg-red-100 text-red-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  }

  showWorkoutGraph(workout: Workout) {
    this.selectedWorkout = workout;
    setTimeout(() => {
      this.createChart();
    });
  }

  createChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    if (!this.selectedWorkout || !this.workoutChart) {
      return;
    }

    const ctx = this.workoutChart.nativeElement.getContext('2d');

    // Prepare data for the chart
    const labels = this.selectedWorkout.workouts.map(w => w.type);
    const data = this.selectedWorkout.workouts.map(w => w.minutes);

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Minutes',
          data: data,
          backgroundColor: 'rgba(59, 130, 246, 0.5)', // blue-500 with opacity
          borderColor: 'rgb(59, 130, 246)', // blue-500
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Minutes'
            }
          }
        },
        plugins: {
          title: {
            display: false
          }
        }
      }
    });
  }
}
