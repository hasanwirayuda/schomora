export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  xp_total: number;
  streak_days: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  author_id: string;
  author: User;
  modules?: Module[];
  created_at: string;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string;
  order: number;
  content_url: string;
  content_type: string;
}

export interface Question {
  id: string;
  topic_tag: string;
  difficulty: number;
  type: string;
  body: string;
  options: string;
  explanation: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  is_correct: boolean;
}

export interface Quiz {
  id: string;
  module_id: string;
  title: string;
  description: string;
  time_limit: number;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  ability_estimate: number;
  started_at: string;
  completed_at: string | null;
  answers?: AttemptAnswer[];
}

export interface AttemptAnswer {
  id: string;
  question_id: string;
  answer: string;
  is_correct: boolean;
  time_spent_ms: number;
  question: Question;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  course: Course;
  enrolled_at: string;
}

export interface ModuleProgress {
  id: string;
  user_id: string;
  module_id: string;
  course_id: string;
  is_completed: boolean;
  completed_at: string | null;
}

export interface CourseProgressSummary {
  course_id: string;
  course_title: string;
  total_modules: number;
  completed_modules: number;
  progress_percent: number;
  is_completed: boolean;
}

export interface SkillMapItem {
  topic_tag: string;
  total_answered: number;
  total_correct: number;
  accuracy_percent: number;
  level: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  user: User;
  course: Course;
  average_score: number;
  issued_at: string;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  name: string;
  xp: number;
}

export interface Badge {
  code: string;
  name: string;
  description: string;
  icon: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_code: string;
  badge: Badge;
  earned_at: string;
}
