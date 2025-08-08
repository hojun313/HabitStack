import { useEffect, useState } from 'react';
import type { Habit, HabitStackData } from '../types';
import { canCompleteSpecialHabit } from '../utils/timeUtils';

interface HabitBlockProps {
  habit: Habit;
  stack: HabitStackData; // 스택 정보 추가
  isBottom: boolean;
  isCompleting?: boolean;
  isNew?: boolean;
  isReappearing?: boolean;
  isDropping?: boolean;
}

// HabitBlock 컴포넌트
const HabitBlock = ({ 
  habit, 
  stack,
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

  // 동적 색상 계산 - 스택 내 일반 습관 개수에 따라 색상 스펙트럼 분배
  const getDynamicColor = (habit: Habit, stack: HabitStackData) => {
    if (habit.isSpecial) return null; // 특별 블록은 골든색
    
    // 일반 습관들만 필터링하고 정렬
    const normalHabits = stack.habits
      .filter(h => !h.isSpecial)
      .sort((a, b) => a.id - b.id); // ID 순으로 정렬
    
    const totalNormalHabits = normalHabits.length;
    const habitIndex = normalHabits.findIndex(h => h.id === habit.id);
    
    if (totalNormalHabits === 0 || habitIndex === -1) return null;
    
    // HSL을 사용해서 색상환에서 균등하게 분배
    const hue = (360 / totalNormalHabits) * habitIndex;
    const saturation = 35; // 낮은 채도로 파스텔 톤
    const lightness = 85;  // 높은 명도로 밝고 흰색 느낌
    
    return {
      background: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
      border: `hsl(${hue}, ${saturation + 20}%, ${lightness - 25}%)`
    };
  };

  // ID를 기반으로 색상 클래스 생성 (ID 1부터 빨간색 시작) - 백업용
  const getColorClass = (id: number) => {
    if (id === 0) return 'color-0'; // 특별 블록용 (사실상 사용되지 않음)
    const colorIndex = (id - 1) % 7; // ID 1부터 빨간색(index 0) 시작
    return `color-${colorIndex}`;
  };

  // 동적 색상 적용
  const dynamicColor = getDynamicColor(habit, stack);
  
  // 특별 블록 활성화 상태 확인 (하단 블록이면서 특별 블록인 경우만)
  const isDisabled = isBottom && !canCompleteSpecialHabit(habit, stack.repetitionType);

  const blockClasses = [
    'habit-block',
    habit.isSpecial ? 'special-block' : '',
    isBottom ? 'bottom-block' : '',
    isDisabled ? 'disabled-block' : '', // 비활성화 클래스 추가
    // 동적 색상이 없을 때만 기존 색상 클래스 사용
    !habit.isSpecial && !dynamicColor ? getColorClass(habit.id) : '', 
    animationClass
  ].filter(Boolean).join(' ');

  // 동적 스타일 적용
  const blockStyle = dynamicColor ? {
    background: `linear-gradient(135deg, ${dynamicColor.background} 0%, ${dynamicColor.background} 100%)`,
    borderColor: dynamicColor.border
  } : {};

  return (
    <div className={blockClasses} style={blockStyle}>
      {habit.name}
      {isDisabled && <small className="disabled-text">🔒 대기중</small>}
    </div>
  );
};

export default HabitBlock;
