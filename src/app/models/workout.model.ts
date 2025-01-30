export interface Workout {
  id: number;
  userName: string;
  workouts: {
    type: string;
    minutes: number;
  }[];
  date: Date;
}
