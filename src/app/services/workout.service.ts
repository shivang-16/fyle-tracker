import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Workout } from '../models/workout.model';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private readonly STORAGE_KEY = 'workoutApp';
  private workouts: Workout[] = [];
  private workoutsSubject = new BehaviorSubject<Workout[]>([]);

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    const storedData = localStorage.getItem(this.STORAGE_KEY);
    if (storedData) {
      this.workouts = JSON.parse(storedData);
    } else {
      this.workouts = this.seedDefaultData();
      this.saveToLocalStorage();
    }
    this.workoutsSubject.next([...this.workouts]);
  }

  private seedDefaultData(): Workout[] {
    return [
      {
        id: 1,
        userName: 'John Doe',
        workouts: [
          { type: 'Running', minutes: 30 },
          { type: 'Cycling', minutes: 45 }
        ],
        date: new Date()
      },
      {
        id: 2,
        userName: 'Jane Smith',
        workouts: [
          { type: 'Swimming', minutes: 60 },
          { type: 'Running', minutes: 20 }
        ],
        date: new Date()
      },
      {
        id: 3,
        userName: 'Mike Johnson',
        workouts: [
          { type: 'Yoga', minutes: 50 },
          { type: 'Cycling', minutes: 40 }
        ],
        date: new Date()
      }
    ];
  }

  private saveToLocalStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.workouts));
  }

  addWorkout(userName: string, workout: { type: string; minutes: number }) {
    const existingUser = this.workouts.find(u => u.userName === userName);

    if (existingUser) {
      existingUser.workouts.push(workout);
    } else {
      this.workouts.push({
        id: Date.now(),
        userName,
        workouts: [workout],
        date: new Date()
      });
    }

    this.saveToLocalStorage();
    this.workoutsSubject.next([...this.workouts]);
  }

  getWorkouts(): Observable<Workout[]> {
    return this.workoutsSubject.asObservable();
  }
}
