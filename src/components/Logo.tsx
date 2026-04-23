import "../styles/index.css";
import imgLogo from "../assets/img_logo_black.png";

export default function Logo() {
  return (
    <div >
      <img 
      className="logo" 
      src={imgLogo} 
      alt="MyMemo Logo"
    />
    </div>
  );
}