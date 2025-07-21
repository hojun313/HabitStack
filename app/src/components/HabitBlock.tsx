import type { Habit } from '../types';

// HabitBlock 컴포넌트
const HabitBlock = ({ habit, isBottom }: { habit: Habit; isBottom: boolean; }) => {
  return (
    <div className={`card p-3 mb-2 ${isBottom ? 'border-primary' : ''}`}>
      {habit.name} {habit.isSpecial && '(A)'}
    </div>
  );
};

export default HabitBlock;
