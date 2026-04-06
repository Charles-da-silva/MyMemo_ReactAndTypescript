
interface ButtonProps {
        text: string;
        ButtonColor: string;
        width?: number | 126;
        height?: number | 41;
        fontSize?: number | 15;
        onClick?: () => void;
    }

export default function Button({ text, width, height, ButtonColor, onClick }: ButtonProps) {

    return (
        <button className={`btn btn-${ButtonColor}`} onClick={onClick}>
            {text}
        </button>
    );
}