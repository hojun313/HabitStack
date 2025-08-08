import { useState, useRef } from 'react';
import type { HabitStackData } from '../types';
import HabitBlock from './HabitBlock';
import { canCompleteSpecialHabit, getNextAvailableTime } from '../utils/timeUtils';

interface HabitStackProps {
  stack: HabitStackData;
  onComplete: (stackId: number) => void;
  onAddHabit: (stackId: number, habitName: string) => void;
}

// HabitStack 컴포넌트
const HabitStack = ({ stack, onComplete, onAddHabit }: HabitStackProps) => {
  const [newHabitName, setNewHabitName] = useState('');
  const [completingHabitId, setCompletingHabitId] = useState<number | null>(null);
  const [newlyAddedHabitId, setNewlyAddedHabitId] = useState<number | null>(null);
  const [droppingBlocks, setDroppingBlocks] = useState<Set<number>>(new Set());
  const [reappearingHabitId, setReappearingHabitId] = useState<number | null>(null);
  // flex-direction: column-reverse 때문에 첫 번째 요소가 시각적으로 아래에 위치
  const bottomHabit = stack.habits[0];
  const isAddingRef = useRef(false); // 추가 중인지 추적하는 ref
  const isCompletingRef = useRef(false); // 완료 처리 중인지 추적하는 ref

  const handleAddHabit = () => {
    if (newHabitName.trim() && !isAddingRef.current) {
      isAddingRef.current = true;
      
      // 새로운 습관이 추가될 때의 ID를 예측 (임시)
      const newHabitId = Date.now();
      setNewlyAddedHabitId(newHabitId);
      
      onAddHabit(stack.id, newHabitName);
      setNewHabitName('');
      
      // 애니메이션 완료 후 상태 초기화
      setTimeout(() => {
        setNewlyAddedHabitId(null);
        isAddingRef.current = false;
      }, 1000);
    }
  };

  const handleCompleteClick = () => {
    if (!bottomHabit || isCompletingRef.current) return;
    
    // 특별 블록 시간 제한 검증
    if (!canCompleteSpecialHabit(bottomHabit, stack.repetitionType)) {
      const nextTime = getNextAvailableTime(bottomHabit, stack.repetitionType);
      alert(`이 습관은 ${nextTime}에 다시 완료할 수 있습니다.`);
      return;
    }
    
    isCompletingRef.current = true;
    const completingId = bottomHabit.id;
    setCompletingHabitId(completingId);
    
    // 완료 애니메이션 완료 후 실제 상태 변경
    setTimeout(() => {
      // 완료 애니메이션 정리
      setCompletingHabitId(null);
      
      // 남은 블록들을 떨어뜨리기 위해 ID 수집
      const remainingBlocks = stack.habits.slice(1).map(h => h.id);
      setDroppingBlocks(new Set(remainingBlocks));
      
      // 실제 상태 변경 - 첫 번째 블록을 맨 뒤로 이동 (완료 시간 기록 포함)
      onComplete(stack.id);
      
      // 상태 변경 후 약간의 지연을 두고 재등장 애니메이션 시작
      setTimeout(() => {
        setReappearingHabitId(completingId);
        setDroppingBlocks(new Set()); // 드롭 애니메이션 정리
        
        // 재등장 애니메이션 완료 후 상태 초기화
        setTimeout(() => {
          setReappearingHabitId(null);
          isCompletingRef.current = false;
        }, 800);
      }, 400); // 상태 변경과 드롭 애니메이션 후 지연
    }, 1200); // 완료 애니메이션 시간
  };

  // 스택 반복 주기 텍스트 생성
  const stackRepetitionText = stack.repetitionType === 'custom' && stack.customDays
    ? `${stack.customDays}일마다 반복`
    : stack.repetitionType === 'daily'
      ? '매일 반복'
      : '매주 반복';

  // 완료 버튼 비활성화 상태 확인
  const isCompleteButtonDisabled = !bottomHabit || 
    isCompletingRef.current || 
    (bottomHabit && !canCompleteSpecialHabit(bottomHabit, stack.repetitionType));

  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">{stack.name}</h5>
          <small className="text-muted">{stackRepetitionText}</small> {/* 스택 반복 주기 표시 */}
        </div>
        <div className="card-body">
          <div className="habit-stack-visual mb-3">
            {stack.habits.length === 0 ? (
              <div className="empty-stack">
                <div className="empty-stack-message">
                  🪵 블록을 추가해서 스택을 쌓아보세요!
                </div>
              </div>
            ) : (
              stack.habits.map((habit, index) => (
                <HabitBlock
                  key={habit.id}
                  habit={habit}
                  stack={stack}
                  isBottom={index === 0}
                  isCompleting={completingHabitId === habit.id}
                  isNew={newlyAddedHabitId === habit.id}
                  isReappearing={reappearingHabitId === habit.id && index === stack.habits.length - 1}
                  isDropping={droppingBlocks.has(habit.id)}
                />
              ))
            )}
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
            disabled={isCompleteButtonDisabled}
          >
            {bottomHabit ? `✨ "${bottomHabit.name}" 완료하기` : '📚 스택이 비었습니다'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HabitStack;
