import type { Habit } from '../types';

// HabitBlock 컴포넌트
const HabitBlock = ({ habit, isBottom }: { habit: Habit; isBottom: boolean; }) => {
  const blockClasses = [
    'habit-block',
    habit.isSpecial ? 'special-block' : '',
    isBottom ? 'bottom-block' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={blockClasses}>
      {habit.name}
    </div>
  );
};

export default HabitBlock;
