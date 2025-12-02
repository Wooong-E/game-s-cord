import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./page/MyPage/Sidebar";
import "./requestdetail.css";

const dummySent = [
  { id: 1, nickname: "USER1", status: "accepted" }, // 수락됨
  { id: 2, nickname: "USER2", status: "pending" }, // 응답없음
  { id: 3, nickname: "USER3", status: "rejected" }, // 거절됨
];

const dummyReceived = [
  { id: 1, nickname: "USER1", status: "waiting" },
  { id: 2, nickname: "USER2", status: "waiting" },
  { id: 3, nickname: "USER3", status: "waiting" },
];

export default function RequestHistoryPage() {
  const [activeTab, setActiveTab] = useState("sent"); // sent = 매칭요청, received = 매칭수락
  const [sentList] = useState(dummySent);
  const [receivedList, setReceivedList] = useState(dummyReceived);

  const handleDecision = (id, decision) => {
    setReceivedList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: decision } : item
      )
    );
  };

  return (
    <div className="page">
      <div className="request-layout">
        <Sidebar />

        <section className="request-content">
          <Link to="/requestdetail" className="request-title">
            신청내역
          </Link>
          <Link to="/requestReceived" className="request-title">
            받은내역
          </Link>

          <div className="request-tabs">
            <button
              className={
                "request-tab" +
                (activeTab === "sent" ? " request-tab--active" : "")
              }
              onClick={() => setActiveTab("sent")}
            >
              매칭요청
            </button>
            <button
              className={
                "request-tab" +
                (activeTab === "received" ? " request-tab--active" : "")
              }
              onClick={() => setActiveTab("received")}
            >
              매칭수락
            </button>
          </div>

          {activeTab === "sent" && (
            <>
              <div className="status-legend">
                <span>
                  <span className="status-dot status-dot--accepted" /> 수락됨
                </span>
                <span>
                  <span className="status-dot status-dot--rejected" /> 거절됨
                </span>
                <span>
                  <span className="status-dot status-dot--pending" /> 응답없음
                </span>
              </div>

              <ul className="request-list">
                {sentList.map((item) => (
                  <li key={item.id} className="request-row">
                    <div className="request-row-left">
                      <span className="request-row-title">
                        {item.nickname} 님과의 매칭
                      </span>
                    </div>

                    <div className="request-row-right">
                      <span className="request-row-status-label">
                        현재상태 :
                      </span>
                      <span
                        className={
                          "status-dot " +
                          (item.status === "accepted"
                            ? "status-dot--accepted"
                            : item.status === "rejected"
                            ? "status-dot--rejected"
                            : "status-dot--pending")
                        }
                      />
                      <button className="info-button" disabled>
                        상대 정보 확인하기
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          {activeTab === "received" && (
            <ul className="request-list">
              {receivedList.map((item) => (
                <li key={item.id} className="request-row">
                  <div className="request-row-left">
                    <span className="request-row-title">
                      {item.nickname} 님의 매칭요청
                    </span>
                  </div>

                  <div className="request-row-right">
                    <button
                      className={
                        "pill-button pill-button--accept" +
                        (item.status === "accepted"
                          ? " pill-button--filled"
                          : "")
                      }
                      onClick={() => handleDecision(item.id, "accepted")}
                    >
                      수락
                    </button>
                    <button
                      className={
                        "pill-button pill-button--reject" +
                        (item.status === "rejected"
                          ? " pill-button--filled"
                          : "")
                      }
                      onClick={() => handleDecision(item.id, "rejected")}
                    >
                      거절
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
