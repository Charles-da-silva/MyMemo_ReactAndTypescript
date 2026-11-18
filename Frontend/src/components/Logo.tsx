import "../styles/index.css";
import imgLogo from "../assets/img_logo_black.png";

interface LogoProps {
  isLoading?: boolean;
  size?: number;
}

export default function Logo({
  isLoading = false,
  size,
}: LogoProps) {
  return (
    <div className={isLoading ? "splash-container" : undefined}>
      <div className={isLoading ? "card-rotation" : undefined}>
        <img
          className="logo"
          style={size ? { width: size } : undefined}
          src={imgLogo}
          alt="MyMemo Logo"
        />
      </div>
    </div>
  );
}