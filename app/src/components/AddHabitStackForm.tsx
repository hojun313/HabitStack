import { useState } from 'react';

interface Props {
  onAddStack: (stackName: string) => void;
}

const AddHabitStackForm = ({ onAddStack }: Props) => {
  const [stackName, setStackName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stackName.trim()) return;
    onAddStack(stackName);
    setStackName('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-5">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="새로운 습관 스택 이름..."
          value={stackName}
          onChange={(e) => setStackName(e.target.value)}
        />
        <button type="submit" className="btn btn-success">
          스택 추가
        </button>
      </div>
    </form>
  );
};

export default AddHabitStackForm;
