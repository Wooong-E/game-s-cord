import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import CardPayment from "../assets/CardPayment.png";
import AccountTransfer from "../assets/accountTransfer.png";
import EasyPayment from "../assets/Easypayment.png";

import PaymentConfirmPopup from "./PaymentConfirmPopup";

import "../css/Payment.css";

const Payment = () => {
  const location = useLocation();
  const paymentData = location.state;
  const points = paymentData?.points || "Null";
  const price = paymentData?.price || "Null";

  // 팝업창 상태 관리
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    console.log(`${method} 선택됨`);
  };

  // 팝업 열기 핸들러 (결제하기 버튼 클릭 시)
  const handlePayClick = () => {
    // 실제 구현 시, 결제 수단 선택 여부 검증 로직이 추가되어야 합니다.
    setIsPopupOpen(true);
  };

  // 팝업 닫기 핸들러 (취소 버튼 클릭 또는 배경 클릭 시)
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  // 최종 결제 승인 핸들러
  const handlePaymentConfirm = () => {
    // TODO: 여기에 실제 결제 API 호출 및 후처리(페이지 이동 등) 로직을 구현하세요.
    console.log("최종 결제 승인됨:", points, price);
    alert(`[${points} 코인, ₩${price}] 결제가 시작됩니다.`);
    handleClosePopup();
  };

  // TODO: 결제 수단 선택 상태 관리 로직도 추가되어야 합니다.

  return (
    <div className="payment-container">
      <div className="payment-info-area">
        <h2>game-s-cord</h2>
        <p className="coin-info">{points} 코인</p>
        <p className="price-info">₩ {price}</p>
      </div>
      <div className="payment-method-area">
        <p className="method-title">방법 선택</p>
        <div
          className={`method-item ${
            selectedMethod === "카드 결제" ? "selected" : ""
          }`}
          onClick={() => handleMethodSelect("카드 결제")}
        >
          <img src={CardPayment} alt="카드 결제" />
          <span>카드 결제</span>
        </div>
        <div
          className={`method-item ${
            selectedMethod === "계좌 이체" ? "selected" : ""
          }`}
          onClick={() => handleMethodSelect("계좌 이체")}
        >
          <img src={AccountTransfer} alt="계좌 이체" />
          <span>계좌 이체</span>
        </div>
        <div
          className={`method-item ${
            selectedMethod === "간편 결제" ? "selected" : ""
          }`}
          onClick={() => handleMethodSelect("간편 결제")}
        >
          <img src={EasyPayment} alt="간편 결제" />
          <span>간편 결제</span>
        </div>
        <button className="pay-button" onClick={handlePayClick}>
          결제하기
        </button>
      </div>
      {/* ... (isPopupOpen 조건부 렌더링) ... */}
      {isPopupOpen && (
        <PaymentConfirmPopup
          points={points}
          price={price}
          selectedMethod={selectedMethod} // 팝업으로 선택된 수단 전달
          onClose={handleClosePopup}
          onConfirm={handlePaymentConfirm}
        />
      )}
    </div>
  );
};

export default Payment;
