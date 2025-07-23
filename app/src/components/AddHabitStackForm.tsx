import { useState, useRef } from 'react';

interface AddHabitStackFormProps {
  onAddStack: (stackName: string) => void;
}

const AddHabitStackForm = ({ onAddStack }: AddHabitStackFormProps) => {
  const [newStackName, setNewStackName] = useState('');
  const isSubmittingRef = useRef(false); // 제출 중인지 추적하는 ref

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStackName.trim() && !isSubmittingRef.current) {
      isSubmittingRef.current = true; // 제출 시작 플래그 설정
      onAddStack(newStackName);
      setNewStackName('');
      isSubmittingRef.current = false; // 즉시 플래그 재설정
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="새 습관 스택 이름..."
          value={newStackName}
          onChange={(e) => setNewStackName(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={isSubmittingRef.current}>
          🚀 새 스택 추가
        </button>
      </div>
    </form>
  );
};

export default AddHabitStackForm;
