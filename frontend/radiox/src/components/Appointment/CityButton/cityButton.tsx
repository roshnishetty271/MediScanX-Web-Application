import "./cityButton.css"

interface CityButtonProps {
    city: string;
    onClick: (city: string) => void;
    isSelected: boolean;
}
  
const CityButton: React.FC<CityButtonProps> = ({ city, onClick, isSelected }) => {
    const cityBtnClass = isSelected ? 'city-btn city-btn-active' : 'city-btn city-btn-inactive';

    return (
        <button
        onClick={() => onClick(city)}
        className={cityBtnClass}
        >
        {city}
        </button>
    );
};

export default CityButton;