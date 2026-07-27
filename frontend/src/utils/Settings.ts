import { reactive } from 'vue';

interface UserData {
  name: string;
  gender: 'male' | 'female' | '';
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | '';
}

interface State extends UserData {
  isLoaded: boolean;
}

export class Settings {
  private state = reactive<State>({
    name: '',
    gender: '',
    skillLevel: '',
    isLoaded: false,
  });

  constructor() {
    this.load();
  }

  private load() {
    const userData = localStorage.getItem('userData');
    if (!userData) return;

    const data: UserData = JSON.parse(userData);

    this.state.name = data.name;
    this.state.gender = data.gender;
    this.state.skillLevel = data.skillLevel;
    this.state.isLoaded = true;
  }

  save() {
    const dto = {
      name: this.state.name,
      gender: this.state.gender,
      skillLevel: this.state.skillLevel,
    };

    localStorage.setItem('userData', JSON.stringify(dto));
  }

  getDetails() {
    return this.state as State;
  }

  updateDetails(options: { name?: string; gender?: 'male' | 'female'; skillLevel?: 'beginner' | 'intermediate' | 'advanced' }) {
    if (options.name) {
      this.state.name = options.name;
    }
    if (options.gender) {
      this.state.gender = options.gender;
    }
    if (options.skillLevel) {
      this.state.skillLevel = options.skillLevel;
    }

    this.save();

    if (this.state.name && this.state.gender && this.state.skillLevel) {
      this.state.isLoaded = true;
    }
  }
}
