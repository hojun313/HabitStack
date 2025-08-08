// 시간 관련 유틸리티 함수들

/**
 * 특별 블록이 클릭 가능한지 확인하는 함수
 */
export const canCompleteSpecialHabit = (
  habit: { isSpecial: boolean; lastCompletedAt?: string },
  repetitionType: 'daily' | 'weekly' | 'custom'
): boolean => {
  // 일반 블록은 항상 클릭 가능
  if (!habit.isSpecial) return true;
  
  // 처음 클릭하는 특별 블록은 클릭 가능
  if (!habit.lastCompletedAt) return true;
  
  const now = new Date();
  const lastCompleted = new Date(habit.lastCompletedAt);
  
  if (repetitionType === 'daily') {
    // 매일 반복: 자정이 지나야 다시 클릭 가능
    return !isSameDay(now, lastCompleted);
  } else if (repetitionType === 'weekly') {
    // 매주 반복: 다음 월요일이 되어야 다시 클릭 가능
    return getNextMonday(lastCompleted) <= now;
  } else if (repetitionType === 'custom') {
    // 커스텀: 일단 매일과 같은 로직 사용 (추후 개선 가능)
    return !isSameDay(now, lastCompleted);
  }
  
  return false;
};

/**
 * 두 날짜가 같은 날인지 확인
 */
const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

/**
 * 주어진 날짜의 다음 월요일을 구하는 함수
 */
const getNextMonday = (date: Date): Date => {
  const nextMonday = new Date(date);
  const dayOfWeek = date.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
  
  // 월요일(1)까지 남은 일수 계산
  const daysUntilNextMonday = dayOfWeek === 1 ? 7 : (8 - dayOfWeek) % 7;
  
  nextMonday.setDate(date.getDate() + daysUntilNextMonday);
  nextMonday.setHours(0, 0, 0, 0); // 자정으로 설정
  
  return nextMonday;
};

/**
 * 다음 활성화 시간을 구하는 함수 (UI 표시용)
 */
export const getNextAvailableTime = (
  habit: { isSpecial: boolean; lastCompletedAt?: string },
  repetitionType: 'daily' | 'weekly' | 'custom'
): string => {
  if (!habit.isSpecial || !habit.lastCompletedAt) return '';
  
  const lastCompleted = new Date(habit.lastCompletedAt);
  
  if (repetitionType === 'daily') {
    const nextDay = new Date(lastCompleted);
    nextDay.setDate(lastCompleted.getDate() + 1);
    nextDay.setHours(0, 0, 0, 0);
    return `${nextDay.getMonth() + 1}/${nextDay.getDate()} 자정 이후`;
  } else if (repetitionType === 'weekly') {
    const nextMonday = getNextMonday(lastCompleted);
    return `${nextMonday.getMonth() + 1}/${nextMonday.getDate()}(월) 이후`;
  } else if (repetitionType === 'custom') {
    const nextDay = new Date(lastCompleted);
    nextDay.setDate(lastCompleted.getDate() + 1);
    nextDay.setHours(0, 0, 0, 0);
    return `${nextDay.getMonth() + 1}/${nextDay.getDate()} 자정 이후`;
  }
  
  return '';
};
