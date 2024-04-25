import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode,
  className: string,
  onClickHandler: () => void
}

export const Button = ({ children, className,  onClickHandler }: ButtonProps) => {
  return (
    <button
      className={className}
      onClick={onClickHandler}
    >
      {children}
    </button>
  );
};
