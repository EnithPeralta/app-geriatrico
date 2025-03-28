import { useNavigate } from "react-router-dom";
import '../css/goback.css'
import { FaLongArrowAltLeft} from "react-icons/fa";

export const GoBackComponet = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Retrocede a la página anterior
  };

  return (
    <button onClick={handleGoBack} className="btn-x">
      <FaLongArrowAltLeft />
    </button>
  );
};
