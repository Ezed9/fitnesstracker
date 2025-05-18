# FitTrack - Fitness Tracking Application

A comprehensive fitness tracking application built with Next.js, Tailwind CSS, and Supabase.

## Features

- 🏋️‍♂️ Workout Tracking
  - Log exercises, sets, and reps
  - Track workout history
  - Monitor progress over time

- 🍎 Macro Tracking
  - Log meals and track calories
  - Monitor protein, carbs, and fat intake
  - Daily nutrition summaries

- ⚖️ Weight Tracking
  - Log daily weight
  - View weight trends
  - Track progress towards goals

- 📊 Analytics
  - Visualize workout progress
  - Track nutrition trends
  - Monitor weight changes

## Tech Stack

- **Frontend:**
  - Next.js 14
  - React 18
  - Tailwind CSS
  - TypeScript
  - Chart.js for analytics

- **Backend:**
  - Supabase (PostgreSQL)
  - Row Level Security (RLS)
  - Real-time subscriptions

- **Authentication:**
  - Supabase Auth
  - Email/Password authentication
  - Protected routes

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/fittrack.git
   cd fittrack
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_project_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses the following database tables:

- `workouts`: Store workout sessions
- `exercises`: Track exercises within workouts
- `exercise_sets`: Record sets for each exercise
- `meals`: Log meal information and macros
- `weight_entries`: Track weight measurements

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
