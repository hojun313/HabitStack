import { useEffect, useState } from 'react';
import type { Habit } from '../types';

interface HabitBlockProps {
  habit: Habit;
  isBottom: boolean;
  isCompleting?: boolean;
  isNew?: boolean;
  isReappearing?: boolean;
  isDropping?: boolean;
}

// HabitBlock 컴포넌트
const HabitBlock = ({ 
  habit, 
  isBottom, 
  isCompleting = false, 
  isNew = false,
  isReappearing = false,
  isDropping = false
}: HabitBlockProps) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    // 애니메이션 우선순위: completing > dropping > reappearing > new
    if (isCompleting) {
      setAnimationClass('completing');
    } else if (isDropping) {
      setAnimationClass('dropping');
      // 드롭 애니메이션 완료 후 클래스 제거
      const timer = setTimeout(() => {
        setAnimationClass('');
      }, 800);
      return () => clearTimeout(timer);
    } else if (isReappearing) {
      setAnimationClass('reappearing');
      // 재등장 애니메이션 완료 후 클래스 제거
      const timer = setTimeout(() => {
        setAnimationClass('');
      }, 800);
      return () => clearTimeout(timer);
    } else if (isNew) {
      setAnimationClass('new-block');
      // 새 블록 애니메이션 완료 후 클래스 제거
      const timer = setTimeout(() => {
        setAnimationClass('');
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // 모든 애니메이션이 false일 때만 클래스 제거
      setAnimationClass('');
    }
  }, [isCompleting, isDropping, isReappearing, isNew]);

  // ID를 기반으로 색상 클래스 생성 (ID 1부터 빨간색 시작)
  const getColorClass = (id: number) => {
    if (id === 0) return 'color-0'; // 특별 블록용 (사실상 사용되지 않음)
    const colorIndex = (id - 1) % 7; // ID 1부터 빨간색(index 0) 시작
    return `color-${colorIndex}`;
  };

  const blockClasses = [
    'habit-block',
    habit.isSpecial ? 'special-block' : '',
    isBottom ? 'bottom-block' : '',
    !habit.isSpecial ? getColorClass(habit.id) : '', // 특별 블록이 아닐 때만 색상 적용
    animationClass
  ].filter(Boolean).join(' ');

  return (
    <div className={blockClasses}>
      {habit.name}
    </div>
  );
};

export default HabitBlock;
