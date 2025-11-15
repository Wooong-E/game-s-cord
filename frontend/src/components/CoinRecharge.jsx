import "../css/CoinRecharge.css";
import coinImage from "../assets/coin.jpg";
import HeaderTabs from "./HeaderTabs";
import { useNavigate } from "react-router-dom";

//코인 가격 배열 points: 코인 갯수 price : 가격
const coinProducts = [
  { points: "500", price: "4,680" },
  { points: "1,000", price: "9,360" },
  { points: "2,000", price: "18,720" },
  { points: "5,000", price: "45,600" },
  { points: "10,000", price: "91,200" },
  { points: "30,000", price: "266,400" },
  { points: "50,000", price: "444,000" },
  { points: "100,000", price: "864,000" },
  { points: "300,000", price: "2,592,000" },
  { points: "500,000", price: "4,320,000" },
];

//얼마를 충전할지 렌더링되는 코인 충전 목록 함수
const CoinItem = ({ points, price }) => {
  const navigate = useNavigate();
  const handleRecharge = () => {
    const message = `${points} 코인을 ₩${price} 에 충전하시겠습니까?`;

    const isConfirmed = window.confirm(message);

    console.log(`선택된 상품: ${points} points, ₩${price}`);

    if (isConfirmed) {
      // 만약 충전 상품 정보를 `/pay` 페이지로 함께 넘기고 싶다면 아래처럼 state를 사용합니다.
      navigate("/pay", {
        state: {
          points: points,
          price: price,
        },
      });
    } else {
      console.log("충전이 취소되었습니다.");
    }
  };

  return (
    <button className="coin-item" onClick={handleRecharge}>
      <div className="point-info">
        <img src={coinImage} alt="포인트 코인" className="coin-icon" />
        <p className="points-amount">{points}</p>
      </div>
      <hr />
      <p className="price-amount">￦ {price}</p>
    </button>
  );
};

const CoinRecharge = () => {
  return (
    <div>
      <HeaderTabs />
      <div className="coin-list-container">
        {coinProducts.map((product, index) => (
          <CoinItem key={index} points={product.points} price={product.price} />
        ))}
      </div>
    </div>
  );
};

export default CoinRecharge;
