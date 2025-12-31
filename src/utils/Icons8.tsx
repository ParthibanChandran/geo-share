
import React from "react";

export interface IconProps {
  src: string;
  alt?: string;
  size?: number;
  onClick?: () => void;
  className?: string;
  newTab?: boolean;
}

const Icon: React.FC<IconProps> = ({
  src,
  alt = "icon",
  size = 30,
  onClick,
  className = "",
}) => {
  const handleClick = () => {
    if (!onClick) return;
    onClick();
  };

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={className}
      onClick={handleClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    />
  );
};

export default Icon;
