import React from "react";
import "../css/CoinChargeHistory.css";

//결제 이력을 나타내기 위한 컴포넌트
const PaymentItem = ({ data }) => {
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
      <button className="refund-button">환불하기</button>
    </div>
  );
};

export default PaymentItem;
