import XToClose from '@components/XToClose/XToClose';

const XToCloseTopLeft = ({
  onClick,
  className,
}: {
  onClick: () => void;
  className: string;
}) => (
  <XToClose
    onClick={onClick}
    className={`absolute top-2 left-2 ${className}`}
  />
);

export default XToCloseTopLeft;
