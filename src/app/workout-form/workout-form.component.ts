import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { WorkoutService } from '../services/workout.service';

@Component({
  selector: 'app-workout-form',
  templateUrl: './workout-form.component.html',
  styleUrls: ['./workout-form.component.css']
})
export class WorkoutFormComponent {
  workoutForm = this.fb.group({
    userName: ['', Validators.required],
    type: ['', Validators.required],
    minutes: [null, [Validators.required, Validators.min(1)]]
  });

  workoutTypes = ['Running', 'Cycling', 'Swimming', 'Weight Training', 'Yoga'];

  constructor(
    private fb: FormBuilder,
    private workoutService: WorkoutService
  ) {}

  onSubmit() {
    if (this.workoutForm.valid) {
      const formValues = this.workoutForm.value;
      const userName = formValues.userName ?? '';
      const type = formValues.type ?? '';
      const minutes = formValues.minutes ?? 0;

      if (userName && type) {
        this.workoutService.addWorkout(userName, { type, minutes });
        this.workoutForm.reset();
      }
    }
  }
}
