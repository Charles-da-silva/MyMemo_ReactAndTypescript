
import '../../styles/AppLoader.css'; // Importe os estilos aqui
import loaderVideo from '../../assets/intro.mp4'; // Importe do vídeo do loader

const AppLoader = () => {
  return (
    <div className="loader-container">
      <video autoPlay loop muted playsInline className="loader-video">
        <source src={loaderVideo} type="video/mp4" />
        Seu navegador não suporta vídeos.
      </video>
    </div>
  );
};

export default AppLoader;