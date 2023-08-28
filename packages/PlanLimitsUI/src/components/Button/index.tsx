type Props = {
  text: string;
  active?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const defaultStyles =
  'px-2 py-1 text-sm bg-white text-nui rounded-full shadow-sm border-2 border-nui hover:bg-nui hover:text-white transition-colors duration-150 ease-in-out';
const activeStyles =
  'px-2 py-1 text-sm bg-nui text-white rounded-full shadow-sm border-2 border-nui';

export default function Button({ text, active = false, onClick }: Props) {
  return (
    <button
      className={active ? activeStyles : defaultStyles}
      onClick={onClick}
      type="button"
      style={{ pointerEvents: active ? 'none' : 'all' }}
    >
      {text}
    </button>
  );
}
