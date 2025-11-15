import HeaderTabs from "./HeaderTabs";
import PaymentItem from "./PaymentItem";
import "../css/CoinChargeHistory.css";

// ********************************************
// TODO: 백엔드 구현 시, 이 데이터를 API 호출 결과로 대체해야 합니다.
// ********************************************
const dummyPaymentHistory = [
  {
    id: 1,
    paymentDate: "2025-09-27",
    paymentMethod: "카드 결제",
    chargeAmount: "₩ 4,680",
    coinCount: 500,
  },
  {
    id: 2,
    paymentDate: "2025-08-15",
    paymentMethod: "네이버 페이",
    chargeAmount: "₩ 9,900",
    coinCount: 1000,
  },
  {
    id: 3,
    paymentDate: "2025-07-01",
    paymentMethod: "휴대폰 결제",
    chargeAmount: "₩ 2,200",
    coinCount: 200,
  },
];

const CoinChargeHistory = () => {
  return (
    <div>
      <HeaderTabs />
      <div className="payment-list-wrapper">
        {dummyPaymentHistory.map((item) => (
          <PaymentItem key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
};

export default CoinChargeHistory;
