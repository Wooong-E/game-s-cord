import React from "react";
import "../css/CoinChargeHistory.css";

//결제 이력을 나타내기 위한 컴포넌트
const PaymentItem = ({ data, onRefund }) => {
  const handleRefundClick = () => {
    // 환불 확인 메시지
    if (window.confirm("정말로 이 충전 내역을 환불하시겠습니까?")) {
      // 부모 컴포넌트의 환불 함수를 호출하면서 해당 항목의 ID를 전달합니다.
      onRefund(data.id);
    }
  };
  return (
    <div className="charge-item-wrapper">
      <div className="charge-item">
        <h1 className="item-title">결제 일시</h1>
        <p className="item-value">{data.paymentDate}</p>
      </div>
      <div className="charge-item">
        <h1 className="item-title">충전 금액</h1>
        <p className="item-value">{data.chargeAmount}</p>
      </div>
      <div className="charge-item">
        <h1 className="item-title">결제 수단</h1>
        <p className="item-value">{data.paymentMethod}</p>
      </div>
      <div className="charge-item">
        <h1 className="item-title">코인 수</h1>
        <p className="item-value">{data.coinCount}</p>
      </div>
      <button className="refund-button" onClick={handleRefundClick}>
        환불하기
      </button>
    </div>
  );
};

export default PaymentItem;
