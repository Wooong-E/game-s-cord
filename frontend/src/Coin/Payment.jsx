import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CardPayment from "../assets/CardPayment.png";
import AccountTransfer from "../assets/accountTransfer.png";
import EasyPayment from "../assets/Easypayment.png";

import PaymentConfirmPopup from "./PaymentConfirmPopup";
import axios from "axios";

import "../css/Payment.css";

// API 호출 기본 URL 및 엔드포인트
const BASE_URL = "http://localhost:8080/api/coins";

const Payment = () => {
  const location = useLocation();
  const paymentData = location.state;
  const points = paymentData?.points || "Null";
  const price = paymentData?.price || "Null";
  const packageId = paymentData?.packageId || "Null";

  // 팝업창 상태 관리
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

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

  // 최종 결제 승인 핸들러 (API 호출)
  const handlePaymentConfirm = async () => {
    setIsProcessing(true);

    const numericPoints = parseInt(points);
    const numericPrice = parseInt(price);

    // 2. 백엔드 요청 페이로드 구성
    const payload = {
      paymentAmount: numericPrice,
      coinAmount: numericPoints,
      packageId: packageId,
    };

    try {
      // 3. API 호출
      const response = await axios.post(`${BASE_URL}/charge`, payload);

      // 4. 성공 처리
      // response.data.message 또는 기본 성공 메시지 사용
      const successMessage =
        response.data?.message ||
        `${numericPoints} 코인 충전이 성공적으로 완료되었습니다.`;
      alert(successMessage);
      handleClosePopup();

      // 5. 페이지 이동 (예: 코인 내역 페이지 또는 메인)
      setTimeout(() => {
        navigate("/coinHistory");
        navigate("/");
      }, 2000);
    } catch (error) {
      // 4. 에러 처리
      console.error("Coin Charge Error:", error.response || error);
      const errorText =
        error.response?.data?.message ||
        "결제 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
      alert(errorText);
      handleClosePopup();
    } finally {
      setIsProcessing(false);
    }
  };

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
