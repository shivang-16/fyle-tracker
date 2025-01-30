import { Component, OnInit } from '@angular/core';
import { WorkoutService } from '../services/workout.service';
import { Workout } from '../models/workout.model';

@Component({
  selector: 'app-workout-list',
  templateUrl: './workout-list.component.html',
  styleUrls: ['./workout-list.component.css']
})
export class WorkoutListComponent implements OnInit {
  workouts: Workout[] = [];
  filteredWorkouts: Workout[] = [];
  searchTerm = '';
  selectedType = '';
  currentPage = 1;
  itemsPerPage = 5;
  workoutTypes: string[] = ['Running', 'Walking', 'Cycling', 'Swimming', 'Strength']; // Add this line

  constructor(private workoutService: WorkoutService) {}

  ngOnInit() {
    this.workoutService.getWorkouts().subscribe(workouts => {
      this.workouts = workouts;
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
}
