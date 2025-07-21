import { useState } from 'react';
import type { HabitStackData, Habit } from './types';
import HabitStack from './components/HabitStack';
import AddHabitStackForm from './components/AddHabitStackForm';

// 초기 데이터
const initialStacks: HabitStackData[] = [
  {
    id: 1,
    name: '아침 루틴',
    habits: [
      { id: 1, name: '물 한 컵 마시기', isSpecial: false },
      { id: 2, name: '스트레칭', isSpecial: false },
      { id: 3, name: '오늘 할 일 계획하기', isSpecial: true }, // 'A' 블록
    ],
  },
  {
    id: 2,
    name: '주간 집안일',
    habits: [
      { id: 4, name: '화장실 청소', isSpecial: false },
      { id: 5, name: '분리수거', isSpecial: false },
      { id: 6, name: '식물 물 주기', isSpecial: false },
    ],
  },
];


// App 컴포넌트
function App() {
  const [stacks, setStacks] = useState<HabitStackData[]>(initialStacks);

  // 가장 아래 할 일 완료 처리
  const handleComplete = (stackId: number) => {
    setStacks(prevStacks => {
      const newStacks = [...prevStacks];
      const stackIndex = newStacks.findIndex(s => s.id === stackId);
      if (stackIndex === -1) return prevStacks;

      const stackToUpdate = { ...newStacks[stackIndex] };
      if (stackToUpdate.habits.length === 0) return prevStacks;

      // 가장 아래의 할 일을 꺼내서 맨 위로 올림
      const completedHabit = stackToUpdate.habits.pop()!;
      stackToUpdate.habits.unshift(completedHabit);

      newStacks[stackIndex] = stackToUpdate;
      return newStacks;
    });
  };

  // 새 스택 추가 처리
  const handleAddStack = (stackName: string) => {
    const newStack: HabitStackData = {
      id: Date.now() + Math.random(), // 고유 ID 생성
      name: stackName,
      habits: [], // 초기엔 비어있는 습관 목록
    };
    setStacks(prevStacks => [...prevStacks, newStack]);
  };

  // 습관 추가 처리
  const handleAddHabit = (stackId: number, habitName: string) => {
    setStacks(prevStacks => {
      const newStacks = [...prevStacks];
      const stackIndex = newStacks.findIndex(s => s.id === stackId);
      if (stackIndex === -1) return prevStacks;

      const stackToUpdate = { ...newStacks[stackIndex] };
      const newHabit: Habit = {
        id: Date.now() + Math.random(), // 고유 ID 생성
        name: habitName,
        isSpecial: false, // 기본값은 false
      };
      stackToUpdate.habits.push(newHabit);

      newStacks[stackIndex] = stackToUpdate;
      return newStacks;
    });
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