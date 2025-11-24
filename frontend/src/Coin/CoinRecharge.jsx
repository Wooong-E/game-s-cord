import "../css/CoinRecharge.css";
import coinImage from "../assets/coin.jpg";
import HeaderTabs from "../Coin/HeaderTabs";
import { useNavigate } from "react-router-dom";

//코인 가격 배열 points: 코인 갯수 price : 가격, id: 인덱스
const coinProducts = [
  { id: 1, points: "500", price: "4,680" },
  { id: 2, points: "1,000", price: "9,360" },
  { id: 3, points: "2,000", price: "18,720" },
  { id: 4, points: "5,000", price: "45,600" },
  { id: 5, points: "10,000", price: "91,200" },
  { id: 6, points: "30,000", price: "266,400" },
  { id: 7, points: "50,000", price: "444,000" },
  { id: 8, points: "100,000", price: "864,000" },
  { id: 9, points: "300,000", price: "2,592,000" },
  { id: 10, points: "500,000", price: "4,320,000" },
];

//얼마를 충전할지 렌더링되는 코인 충전 목록 함수
const CoinItem = ({ id, points, price }) => {
  const navigate = useNavigate();
  const handleRecharge = () => {
    const message = `${points} 코인을 ₩${price} 에 충전하시겠습니까?`;

    const isConfirmed = window.confirm(message);

    console.log(`선택된 상품: ${points} points, ₩${price}`);

    if (isConfirmed) {
      // 만약 충전 상품 정보를 `/pay` 페이지로 함께 넘기고 싶다면 아래처럼 state를 사용합니다.
      navigate("/pay", {
        state: {
          id: id,
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
          <CoinItem
            key={index}
            id={product.id}
            points={product.points}
            price={product.price}
          />
        ))}
      </div>
    </div>
  );
};

export default CoinRecharge;
