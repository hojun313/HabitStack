import { useState, useRef } from 'react';
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
  const isCompletingRef = useRef(false); // 완료 처리 중인지 추적하는 ref

  const handleAddHabit = () => {
    if (newHabitName.trim() && !isAddingRef.current) {
      isAddingRef.current = true;
      onAddHabit(stack.id, newHabitName);
      setNewHabitName('');
      isAddingRef.current = false; // 즉시 플래그 재설정
    }
  };

  const handleCompleteClick = () => {
    if (!isCompletingRef.current) {
      isCompletingRef.current = true;
      onComplete(stack.id);
      isCompletingRef.current = false; // 즉시 플래그 재설정
    }
  };

  // 스택 반복 주기 텍스트 생성
  const stackRepetitionText = stack.repetitionType === 'custom' && stack.customDays
    ? `${stack.customDays}일마다 반복`
    : stack.repetitionType === 'daily'
      ? '매일 반복'
      : '매주 반복';

  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">{stack.name}</h5>
          <small className="text-muted">{stackRepetitionText}</small> {/* 스택 반복 주기 표시 */}
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
                  e.preventDefault();
                  handleAddHabit();
                }
              }}
            />
            <button
              className="btn btn-outline-primary"
              type="button"
              onClick={handleAddHabit}
              disabled={isAddingRef.current}
            >
              추가
            </button>
          </div>
          <button
            className="complete-btn"
            onClick={handleCompleteClick}
            disabled={!bottomHabit || isCompletingRef.current}
          >
            {bottomHabit ? `✨ "${bottomHabit.name}" 완료하기` : '📚 스택이 비었습니다'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HabitStack;
