import { useState, useRef } from 'react';
import type { HabitStackData, Habit } from './types';
import HabitStack from './components/HabitStack';
import AddHabitStackForm from './components/AddHabitStackForm';

// 초기 데이터
const initialStacks: HabitStackData[] = [
  {
    id: 1,
    name: '아침 루틴',
    repetitionType: 'daily',
    habits: [
      { id: 1, name: '물 한 컵 마시기', isSpecial: false },
      { id: 2, name: '스트레칭', isSpecial: false },
      { id: 3, name: '오늘 할 일 계획하기', isSpecial: false },
      { id: 4, name: '하루 시작하기', isSpecial: true }, 
    ],
  },
  {
    id: 2,
    name: '주간 집안일',
    repetitionType: 'weekly',
    habits: [
      { id: 4, name: '화장실 청소', isSpecial: false },
      { id: 5, name: '분리수거', isSpecial: false },
      { id: 6, name: '식물 물 주기', isSpecial: false },
      { id: 7, name: '새로운 주 시작하기', isSpecial: true },
    ],
  },
];


// App 컴포넌트
function App() {
  const [stacks, setStacks] = useState<HabitStackData[]>(initialStacks);
  // nextIdRef를 사용하여 고유 ID를 생성합니다.
  // 초기 ID는 initialStacks의 최대 ID보다 크게 설정합니다.
  const nextIdRef = useRef(
    Math.max(
      ...initialStacks.flatMap(stack => [
        stack.id,
        ...stack.habits.map(habit => habit.id),
      ]),
    ) + 1
  );

  // 가장 아래 할 일 완료 처리
  const handleComplete = (stackId: number) => {
    setStacks(prevStacks =>
      prevStacks.map(stack => {
        if (stack.id === stackId) {
          if (stack.habits.length === 0) return stack; // 습관이 없으면 변경 없음

          const completedHabit = stack.habits[stack.habits.length - 1];
          // 새로운 habits 배열 생성: 마지막 습관을 맨 앞으로 이동
          const updatedHabits = [
            completedHabit,
            ...stack.habits.slice(0, stack.habits.length - 1),
          ];
          return { ...stack, habits: updatedHabits };
        }
        return stack;
      })
    );
  };

  // 새 스택 추가 처리
  const handleAddStack = (stackName: string) => {
    const newStack: HabitStackData = {
      id: nextIdRef.current++, // 고유 ID 생성 및 증가
      name: stackName,
      habits: [], // 초기엔 비어있는 습관 목록
    };
    setStacks(prevStacks => [...prevStacks, newStack]);
  };

  // 습관 추가 처리
  const handleAddHabit = (stackId: number, habitName: string) => {
    setStacks(prevStacks =>
      prevStacks.map(stack => {
        if (stack.id === stackId) {
          const newHabit: Habit = {
            id: nextIdRef.current++, // 고유 ID 생성 및 증가
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