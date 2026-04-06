import "@fontsource/adlam-display/400.css";

interface TextBigProps {
    text: string;
    fontSize?: string;
}

export default function TextBig({ text, fontSize }: TextBigProps) {
    return (
        <div
        style={{textAlign: "center", 
        justifyContent: "center", 
        display: "flex", 
        flexDirection: "column", 
        color: "white", 
        fontSize: fontSize || "24px", 
        fontFamily: "ADLaM Display", 
        fontWeight: 400, 
        letterSpacing: "0.24px", 
        wordWrap: "break-word",}}>
            <p>{text}</p>
        </div>
    );
}   