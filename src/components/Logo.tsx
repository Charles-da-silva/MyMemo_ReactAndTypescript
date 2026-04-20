
import imgLogo from "../assets/img_logo_black.png";

export default function Logo() {
  return (
    <div className="logo">
      <img 
      src={imgLogo} 
      alt="MyMemo Logo" 
      style={{ 
        width: '300px', 
        height: 'auto', 
        marginTop: 15,
        paddingTop: 25,
        alignContent: "center",
        alignSelf: "center",
        textAlign: "center"
      }}
    />
    </div>
  );
}