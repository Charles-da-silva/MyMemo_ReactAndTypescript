
interface HomeCardProps {
  setMode: (mode: "home" | "deckOptions" | "createDeck") => void;
}

export default function HowCreateCard({ setMode }: HomeCardProps) {
return (    
<>          
<div className="howCreateCard">

    <p className="personText largeText" style={{width: '80vw'}}>De que forma deseja criar o Deck?</p>
    <br /><br />
    
    <p className="personText mediumText">Importe arquivos de texto em PDF ou Word e 
    deixe a IA criar todas as perguntas e respostas para você!
    </p>
    <br />
    
    <button className="btn btn-blue">Criar com IA</button>
    <br /><br />

    <p className="personText mediumText">Crie manualmente todas as perguntas e alternativas.</p>
    <br />

    <button className="btn btn-gray">Manualmente</button>
    <br />
      
    <img src="src\assets\home2.png" 
        alt="Voltar a home" height={30} onClick={() => setMode("home")} 
        style={{cursor: 'pointer', paddingTop: 15}}/>
</div>
</>
);
}   