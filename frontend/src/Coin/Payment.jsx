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
  const packageId = paymentData?.id || "Null";

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
    setIsPopupOpen(true);
  };

  // 팝업 닫기 핸들러 (취소 버튼 클릭 또는 배경 클릭 시)
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  // 최종 결제 승인 핸들러 (API 호출)
  const handlePaymentConfirm = async () => {
    setIsProcessing(true);

    // 인증 토큰 가져오기
    const token = localStorage.getItem("accessToken");

    console.log(token);
    if (!token) {
      alert("로그인 정보(인증 토큰)가 없습니다. 다시 로그인해 주세요.");
      setIsProcessing(false);
      navigate("/login"); // 로그인 페이지로 이동
      return;
    }

    // 쉼표 제거
    const stringWithoutComma = price.replace(/,/g, "");
    // 정수로 변환
    const numericPrice = parseInt(stringWithoutComma, 10);

    // 쉼표 제거
    const WithoutComma = points.replace(/,/g, "");
    // 정수로 변환
    const numericPoints = parseInt(WithoutComma, 10);

    console.log(numericPoints, numericPrice, packageId);
    // 백엔드 요청 페이로드 구성
    const payload = {
      paymentAmount: numericPrice,
      coinAmount: numericPoints,
      packageId: packageId,
    };

    // Axios 요청 Configuration (헤더에 토큰 포함)
    // Bearer Scheme을 사용하여 토큰을 포함합니다.
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.post(`${BASE_URL}/charge`, payload, config);

      // 성공 처리
      const successMessage =
        response.data?.message ||
        `${numericPoints} 코인 충전이 성공적으로 완료되었습니다.`;
      alert(successMessage);
      handleClosePopup();

      setTimeout(() => {
        navigate("/coinHistory");
      }, 2000);
    } catch (error) {
      console.error("Coin Charge Error:", error.response || error);

      // 403 에러 발생 시 인증 관련 메시지를 표시할 수 있습니다.
      let errorText =
        "결제 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
      if (error.response?.status === 403) {
        errorText =
          "권한이 없거나, 인증 정보가 만료되었습니다. 다시 로그인해 주세요.";
      } else if (error.response?.data?.message) {
        errorText = error.response.data.message;
      }

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
