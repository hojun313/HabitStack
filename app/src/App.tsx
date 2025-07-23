import { useState, useRef, useEffect } from 'react';
import type { HabitStackData, Habit } from './types';
import HabitStack from './components/HabitStack';
import AddHabitStackForm from './components/AddHabitStackForm';

// 초기 데이터 (localStorage가 비어있을 때만 사용)
const defaultStacks: HabitStackData[] = [
  {
    id: 1,
    name: '아침 루틴',
    repetitionType: 'daily',
    habits: [
      { id: 0, name: '하루 시작하기', isSpecial: true },
      { id: 1, name: '물 한 컵 마시기', isSpecial: false },
      { id: 2, name: '스트레칭', isSpecial: false },
      { id: 3, name: '오늘 할 일 계획하기', isSpecial: false },
    ],
  },
  {
    id: 2,
    name: '주간 집안일',
    repetitionType: 'weekly',
    habits: [
      { id: 0, name: '새로운 주 시작하기', isSpecial: true },
      { id: 1, name: '화장실 청소', isSpecial: false },
      { id: 2, name: '분리수거', isSpecial: false },
      { id: 3, name: '식물 물 주기', isSpecial: false },
    ],
  },
];

// localStorage에서 데이터 로드
const loadStacksFromStorage = (): HabitStackData[] => {
  try {
    const stored = localStorage.getItem('habitStacks');
    return stored ? JSON.parse(stored) : defaultStacks;
  } catch (error) {
    console.error('데이터 로드 오류:', error);
    return defaultStacks;
  }
};

// localStorage에 데이터 저장
const saveStacksToStorage = (stacks: HabitStackData[]) => {
  try {
    localStorage.setItem('habitStacks', JSON.stringify(stacks));
  } catch (error) {
    console.error('데이터 저장 오류:', error);
  }
};


// App 컴포넌트
function App() {
  const [stacks, setStacks] = useState<HabitStackData[]>(() => loadStacksFromStorage());
  
  // nextIdRef를 사용하여 스택의 고유 ID를 생성합니다.
  const getNextId = () => {
    const loadedStacks = loadStacksFromStorage();
    return loadedStacks.length > 0 
      ? Math.max(...loadedStacks.map((stack: HabitStackData) => stack.id)) + 1 
      : 1;
  };
  const nextIdRef = useRef<number>(getNextId());

  // 데이터가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    saveStacksToStorage(stacks);
  }, [stacks]);

  // 가장 아래 할 일 완료 처리 (완료된 블록이 맨 위로 이동)
  const handleComplete = (stackId: number) => {
    setStacks(prevStacks =>
      prevStacks.map(stack => {
        if (stack.id === stackId) {
          if (stack.habits.length === 0) return stack; // 습관이 없으면 변경 없음

          // 첫 번째(아래) 블록을 가져와서 맨 뒤(위)로 이동
          const completedHabit = stack.habits[0];
          const updatedHabits = [...stack.habits.slice(1), completedHabit];
          return { ...stack, habits: updatedHabits };
        }
        return stack;
      })
    );
  };

  // 새 스택 추가 처리
  const handleAddStack = (stackName: string, repetitionType: 'daily' | 'weekly') => {
    // 반복 타입에 따른 기본 특별 습관 생성
    const defaultSpecialHabit: Habit = {
      id: 0,
      name: repetitionType === 'daily' ? '하루 시작하기' : '새로운 주 시작하기',
      isSpecial: true
    };

    const newStack: HabitStackData = {
      id: nextIdRef.current++, // 고유 ID 생성 및 증가
      name: stackName,
      habits: [defaultSpecialHabit], // 기본 특별 습관으로 시작
      repetitionType: repetitionType, // 사용자가 선택한 반복 타입 사용
    };
    setStacks(prevStacks => [...prevStacks, newStack]);
  };

  // 습관 추가 처리
  const handleAddHabit = (stackId: number, habitName: string) => {
    setStacks(prevStacks =>
      prevStacks.map(stack => {
        if (stack.id === stackId) {
          // 해당 스택 내에서 가장 큰 ID를 찾아서 +1
          const maxId = stack.habits.length > 0 
            ? Math.max(...stack.habits.map(h => h.id)) 
            : -1;
          
          const newHabit: Habit = {
            id: maxId + 1, // 스택 내에서 고유한 ID
            name: habitName,
            isSpecial: false, // 기본값은 false
          };
          // 새로운 habits 배열 생성: 기존 습관에 새 습관 추가
          return { ...stack, habits: [...stack.habits, newHabit] };
        }
        return stack;
      })
    );
  };


  return (
    <div className="container mt-5">
      <header className="text-center mb-5">
        <h1>HabitStack</h1>
        <p className="lead">습관을 블록처럼 쌓아 관리하세요.</p>
      </header>

      <AddHabitStackForm onAddStack={handleAddStack} />

      <hr className="my-5" />

      <div className="row">
        {stacks.map(stack => (
          <HabitStack
            key={stack.id}
            stack={stack}
            onComplete={handleComplete}
            onAddHabit={handleAddHabit}
          />
        ))}
      </div>
    </div>
  );
}

export default App;