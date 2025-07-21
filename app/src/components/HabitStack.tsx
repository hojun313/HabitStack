import { useState, useRef } from 'react'; // useRef 추가
import type { HabitStackData } from '../types';
import HabitBlock from './HabitBlock';

interface HabitStackProps {
  stack: HabitStackData;
  onComplete: (stackId: number) => void;
  onAddHabit: (stackId: number, habitName: string) => void;
}

// HabitStack 컴포넌트
const HabitStack = ({ stack, onComplete, onAddHabit }: HabitStackProps) => {
  const [newHabitName, setNewHabitName] = useState('');
  const bottomHabit = stack.habits[stack.habits.length - 1];
  const isAddingRef = useRef(false); // 추가 중인지 추적하는 ref

  const handleAddHabit = () => {
    if (newHabitName.trim() && !isAddingRef.current) { // 입력값이 있고, 추가 중이 아닐 때만 실행
      isAddingRef.current = true; // 추가 시작 플래그 설정
      onAddHabit(stack.id, newHabitName);
      setNewHabitName('');
      // 짧은 지연 후 플래그 초기화하여 빠른 연속 클릭 방지
      setTimeout(() => {
        isAddingRef.current = false;
      }, 300); // 300ms 딜레이 (필요에 따라 조정 가능)
    }
  };

  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">{stack.name}</h5>
        </div>
        <div className="card-body">
          <div className="habit-stack-visual mb-3">
            {stack.habits.map((habit, index) => (
              <HabitBlock
                key={habit.id}
                habit={habit}
                isBottom={index === stack.habits.length - 1}
              />
            ))}
          </div>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="새 습관 추가..."
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault(); // 기본 동작 방지
                  handleAddHabit();
                }
              }}
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={handleAddHabit}
              disabled={isAddingRef.current} // 추가 중일 때 버튼 비활성화
            >
              추가
            </button>
          </div>
          <button
            className="btn btn-primary w-100"
            onClick={() => onComplete(stack.id)}
            disabled={!bottomHabit}
          >
            {bottomHabit ? `"${bottomHabit.name}" 완료` : '스택이 비었습니다'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HabitStack;
