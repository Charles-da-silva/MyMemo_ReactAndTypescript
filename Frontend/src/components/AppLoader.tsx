import imgLogo from '../assets/img_logo_black.png';
import '../styles/AppLoader.css'; // Importe os estilos aqui

const AppLoader = () => {
  return (
    <>
      <div className='mainPage'>
        <div className="splash-container">
          <div className="card-rotation">
            <div><img className="logo" src={imgLogo} alt="Logo" /></div>
          </div>
        </div>
        <br /><br />
        <div className="text">Carregando...</div>
      </div>
    </>
  );
};

export default AppLoader;