import { useEffect, useState } from 'react';
import type { Habit } from '../types';

interface HabitBlockProps {
  habit: Habit;
  isBottom: boolean;
  isCompleting?: boolean;
  isNew?: boolean;
  isReappearing?: boolean;
}

// HabitBlock 컴포넌트
const HabitBlock = ({ 
  habit, 
  isBottom, 
  isCompleting = false, 
  isNew = false,
  isReappearing = false 
}: HabitBlockProps) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    // 애니메이션 우선순위: completing > reappearing > new
    if (isCompleting) {
      setAnimationClass('completing');
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
  }, [isCompleting, isReappearing, isNew]);

  const blockClasses = [
    'habit-block',
    habit.isSpecial ? 'special-block' : '',
    isBottom ? 'bottom-block' : '',
    animationClass
  ].filter(Boolean).join(' ');

  return (
    <div className={blockClasses}>
      {habit.name}
    </div>
  );
};

export default HabitBlock;
