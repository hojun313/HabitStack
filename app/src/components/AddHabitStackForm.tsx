import { useState, useRef } from 'react';

interface AddHabitStackFormProps {
  onAddStack: (stackName: string, repetitionType: 'daily' | 'weekly') => void;
}

const AddHabitStackForm = ({ onAddStack }: AddHabitStackFormProps) => {
  const [newStackName, setNewStackName] = useState('');
  const [repetitionType, setRepetitionType] = useState<'daily' | 'weekly'>('weekly');
  const isSubmittingRef = useRef(false); // 제출 중인지 추적하는 ref

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStackName.trim() && !isSubmittingRef.current) {
      isSubmittingRef.current = true; // 제출 시작 플래그 설정
      onAddStack(newStackName, repetitionType);
      setNewStackName('');
      setRepetitionType('weekly'); // 기본값으로 리셋
      isSubmittingRef.current = false; // 즉시 플래그 재설정
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="row g-2">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="새 습관 스택 이름..."
            value={newStackName}
            onChange={(e) => setNewStackName(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={repetitionType}
            onChange={(e) => setRepetitionType(e.target.value as 'daily' | 'weekly')}
          >
            <option value="daily">📅 매일</option>
            <option value="weekly">🗓️ 매주</option>
          </select>
        </div>
        <div className="col-md-3">
          <button type="submit" className="btn btn-primary w-100" disabled={isSubmittingRef.current}>
            🚀 새 스택 추가
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddHabitStackForm;
