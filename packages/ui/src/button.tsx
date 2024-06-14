import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode,
  className: string,
  onClickHandler: () => void,
  disabled?: boolean
}

export const Button = ({ children, className,  onClickHandler, disabled }: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      className={className}
      onClick={onClickHandler}
    >
      {children}
    </button>
  );
};
