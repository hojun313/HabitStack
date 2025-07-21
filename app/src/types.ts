// 데이터 타입 정의
export interface Habit {
  id: number;
  name: string;
  isSpecial: boolean; // 'A' 블록 여부
}

export interface HabitStackData {
  id: number;
  name: string;
  habits: Habit[];
}


