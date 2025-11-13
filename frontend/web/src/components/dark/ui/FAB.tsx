import { Plus } from 'lucide-react';

interface FABProps {
  onClick: () => void;
}

export function FAB({ onClick }: FABProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-28 right-8 w-14 h-14 bg-gradient-to-br from-[#4F46E5] to-[#06B6D4] pixel-corners flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-lg z-30"
      style={{ boxShadow: '0 10px 25px rgba(79, 70, 229, 0.3)' }}
    >
      <Plus className="w-8 h-8 text-white" strokeWidth={3} />
    </button>
  );
}
