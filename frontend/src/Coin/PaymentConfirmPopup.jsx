import React from "react";

//팝업창 컴포넌트
const PaymentConfirmPopup = ({
  points,
  price,
  selectedMethod,
  onClose,
  onConfirm,
}) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>결제 확인</h2>
        <p>선택하신 코인, 금액 및 결제 수단이 맞는지 확인해 주세요.</p>
        <div className="popup-details">
          <p>
            <strong>코인:</strong> {points} 코인
          </p>
          <p>
            <strong>금액:</strong> ₩ {price}
          </p>
          <p>
            <strong>결제 수단:</strong> {selectedMethod}
          </p>
        </div>

        <div className="popup-actions">
          <button className="cancel-btn" onClick={onClose}>
            취소
          </button>
          <button className="confirm-btn" onClick={onConfirm}>
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmPopup;
