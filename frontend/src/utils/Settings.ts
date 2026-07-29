import { reactive } from 'vue';

interface Lesson {
  id: number;
  title: string;
  description: string;
  estimatedMinutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
}

interface Course {
  title: string;
  description: string;
  lessons: Lesson[];
}

interface UserData {
  // SETTINGS
  name: string;
  gender: 'male' | 'female' | '';
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | '';

  // GOALS AND COURSE
  goal:
    | 'Learn traditional rhythms'
    | 'Learn about the history and culture'
    | 'Understand how the darbuka works'
    | 'Just explore and have fun'
    | '';
  timeLimit: '10-15 minutes' | '20-30 minutes' | '30-60 minutes' | '60 minutes +' | '';
  course: Course | null;
  currentLessonId: number | null;
}

interface State extends UserData {
  areSettingsLoaded: boolean;
  isCourseLoaded: boolean;
}

export class Settings {
  private state = reactive<State>({
    // SETTINGS
    name: '',
    gender: '',
    skillLevel: '',

    // GOALS AND COURSE
    goal: '',
    timeLimit: '',
    course: null,
    currentLessonId: null,

    areSettingsLoaded: false,
    isCourseLoaded: false,
  });

  constructor() {
    this.load();
  }

  private load() {
    const userData = localStorage.getItem('userData');
    if (!userData) return;

    const data: UserData = JSON.parse(userData);

    // SETTINGS
    this.state.name = data.name;
    this.state.gender = data.gender;
    this.state.skillLevel = data.skillLevel;

    if (data.name && data.gender && data.skillLevel) {
      this.state.areSettingsLoaded = true;
    }

    // GOALS AND COURSE
    this.state.goal = data.goal;
    this.state.timeLimit = data.timeLimit;
    this.state.course = data.course;
    this.state.currentLessonId = data.currentLessonId;

    if (data.goal && data.timeLimit && data.course && data.currentLessonId) {
      this.state.isCourseLoaded = true;
    }
  }

  save() {
    const dto = {
      name: this.state.name,
      gender: this.state.gender,
      skillLevel: this.state.skillLevel,

      // GOALS AND COURSE
      goal: this.state.goal,
      timeLimit: this.state.timeLimit,
      course: this.state.course,
      currentLessonId: this.state.currentLessonId,
    };

    localStorage.setItem('userData', JSON.stringify(dto));
  }

  getDetails() {
    return this.state as State;
  }

  updateDetails(options: {
    name?: UserData['name'];
    gender?: UserData['gender'];
    skillLevel?: UserData['skillLevel'];
    goal?: UserData['goal'];
    timeLimit?: UserData['timeLimit'];
    currentLessonId?: UserData['currentLessonId'];
  }) {
    if (options.name) {
      this.state.name = options.name;
    }
    if (options.gender) {
      this.state.gender = options.gender;
    }
    if (options.skillLevel) {
      this.state.skillLevel = options.skillLevel;
    }
    if (options.goal) {
      this.state.goal = options.goal;
    }
    if (options.timeLimit) {
      this.state.timeLimit = options.timeLimit;
    }
    if (options.currentLessonId) {
      this.state.currentLessonId = options.currentLessonId;
    }

    this.save();

    if (this.state.name && this.state.gender && this.state.skillLevel) {
      this.state.areSettingsLoaded = true;
    }

    if (this.state.goal && this.state.timeLimit && this.state.currentLessonId) {
      this.state.isCourseLoaded = true;
    }
  }

  async generateCourse() {
    if (!this.state.goal || !this.state.timeLimit || !this.state.skillLevel) {
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/chatbot/generateCourse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          goal: this.state.goal,
          skillLevel: this.state.skillLevel,
          timeLimit: this.state.timeLimit,
        }),
      });

      const course = await res.json();

      this.state.course = course as Course;
      this.state.currentLessonId = this.state.course.lessons[0]?.id || null;

      this.save();

      if (this.state.goal && this.state.timeLimit && this.state.currentLessonId) {
        this.state.isCourseLoaded = true;
      }
    } catch (e) {
      console.log(e);
      return;
    }
  }
}
