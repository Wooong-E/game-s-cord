## 2. Use Case Analysis

본 장에서는 시스템이 제공하는 주요 기능들을 사용자 관점에서 정의한 Use Case Diagram과 개별 Use Case Description을 제시한다.

Use Case Diagram은 시스템 내 주요 행위자(Actor)와 Use Case 간의 관계를 개략적으로 나타내는 개요도이며, 상세한 기능 흐름과 조건은 본문에 이어지는 Use Case Description을 통해 설명한다.

### Diagram 관련 고려 사항

- Use Case Diagram은 전체 구조를 파악하기 위한 보조 자료이며, 실제 기능 이해를 위해서는 **Use Case Description**을 참고해야 한다.
- Diagram에 포함된 Use Case는 모두 **User-level Use Case**이다.
- **회원(User)** 은 회원가입 및 로그인이 완료된 사용자이며,  
  **비회원(Guest)** 은 로그인하지 않은 사용자이다.

### 본 시스템에서 정의하는 주요 Use Case

아래 기능들은 본 시스템의 핵심 사용자 경험 흐름을 구성한다:

1) 로그인  
2) 로그아웃  
3) 회원가입  
4) 매칭수락  
5) 매칭거절  
6) 게임 메이트 검색  
7) 프로필 관리  
8) 게임 메이트 등록  
9) 알림 시스템  
10) 즐겨찾기  
11) 코인 충전  
12) 코인 환불  
13) 코인 지급  
14) 게임 메이트 상세정보 확인  
15) 리뷰 작성  

### Use Case Diagram

<div align="center">
<img src="./usecasediagram.png" width="600"/>
</div>

<p align="center">그림 2-1. Use Case Diagram</p>

---

### ※ 다음 섹션부터는 각 Use Case별 상세 동작을 서술한다.


<h2>2.2 Use case description</h2>

<h3>Use Case #1 : 회원가입</h3>

<table border="1" width="100%" cellspacing="0" cellpadding="6">

<!-- GENERAL -->
<tr><th colspan="2">GENERAL CHARACTERISTICS</th></tr>
<tr><td width="30%">Summary</td><td>사용자가 회원가입을 한다.</td></tr>
<tr><td>Scope</td><td>game-s-cord</td></tr>
<tr><td>Level</td><td>User Level</td></tr>
<tr><td>Author</td><td>백유진</td></tr>
<tr><td>Last Update</td><td>2025. 11. 03</td></tr>
<tr><td>Status</td><td>Analysis</td></tr>
<tr><td>Primary Actor</td><td>User</td></tr>
<tr><td>Preconditions</td><td>사용자는 아직 계정이 없으며, 시스템에 가입하기 위한 정보를 준비해야 한다.</td></tr>
<tr><td>Trigger</td><td>사용자가 회원가입 버튼을 클릭한다.</td></tr>
<tr><td>Success Post Condition</td><td>사용자가 정상적으로 시스템에 가입되어, 새로운 계정이 생성된다.</td></tr>
<tr><td>Failed Post Condition</td><td>가입 정보가 불완전하거나 중복되면 오류 메시지가 표시된다.</td></tr>

<!-- MAIN -->
<tr><th colspan="2">MAIN SUCCESS SCENARIO</th></tr>
<tr><td width="30%">Step</td><td>Action</td></tr>
<tr><td>1</td><td>사용자가 웹 헤더에서 회원가입 버튼을 클릭하여 회원가입 페이지에 진입한다.</td></tr>
<tr><td>2</td><td>사용자가 아이디, 비밀번호, 닉네임, 생년월일 등 필수 가입 정보를 입력하여 회원가입을 시도한다.</td></tr>
<tr><td>3</td><td>시스템은 입력된 정보를 검증한다.</td></tr>
<tr><td>4</td><td>정보가 유효하면 계정이 생성되어 회원가입이 완료된다.</td></tr>
<tr><td>5</td><td>자동으로 로그인 상태가 되며, 메인 페이지로 리다이렉트된다.</td></tr>

<!-- EXTENSION -->
<tr><th colspan="2">EXTENSION SCENARIOS</th></tr>
<tr><td>Step</td><td>Branching Action</td></tr>

<!-- Step 2 -->
<tr>
  <td rowspan="2" align="center">2</td>
  <td><b>2a</b> 사용자가 회원가입 중 취소 버튼 클릭 시</td>
</tr>
<tr>
  <td>2a.1 입력한 정보는 저장되지 않고 이전 페이지로 돌아간다.</td>
</tr>

<!-- Step 3 -->
<tr>
  <td rowspan="12" align="center">3</td>
  <td><b>3a</b> 필수 항목 미입력 시</td>
</tr>
<tr><td>3a.1 “필수 항목을 모두 입력해주세요” 메시지를 표시한다.</td></tr>
<tr><td>3a.2 사용자의 입력을 다시 요청한다.</td></tr>

<tr><td><b>3b</b> 이미 존재하는 아이디 입력 시</td></tr>
<tr><td>3b.1 “이미 사용 중인 아이디입니다” 메시지를 표시한다.</td></tr>
<tr><td>3b.2 사용자의 입력을 다시 요청한다.</td></tr>

<tr><td><b>3c</b> 비밀번호 규정(8~16자, 숫자/영문/특수문자 포함) 미준수 시</td></tr>
<tr><td>3c.1 “비밀번호 규정을 확인해주세요” 메시지를 표시한다.</td></tr>
<tr><td>3c.2 사용자의 입력을 다시 요청한다.</td></tr>

<tr><td><b>3d</b> 생년월일 입력 오류 시</td></tr>
<tr><td>3d.1 “유효한 생년월일을 입력해주세요” 메시지를 표시한다.</td></tr>
<tr><td>3d.2 사용자의 입력을 다시 요청한다.</td></tr>

<!-- RELATED -->
<tr><th colspan="2">RELATED INFORMATION</th></tr>
<tr><td>Performance</td><td>입력 데이터 검증 및 계정 생성 ≤ 1 second<br>DB 중복 검증 ≤ 300 milliseconds</td></tr>
<tr><td>Frequency</td><td>일반 사용자 기준 초기 1회</td></tr>
<tr><td>Concurrency</td><td>중복 ID 입력 시 UNIQUE KEY 기반 DB 트랜잭션 처리<br>동일 시점 요청 시 DB 락을 통해 데이터 정합성 보장</td></tr>
<tr><td>Due Date</td><td>2025. 11. 24</td></tr>

</table>


<br>
<h3>Use Case #2 : 로그인</h3>

<table border="1" width="100%" cellspacing="0" cellpadding="6">

<!-- GENERAL -->
<tr><th colspan="2">GENERAL CHARACTERISTICS</th></tr>
<tr><td width="30%">Summary</td><td>사용자가 시스템에 로그인한다.</td></tr>
<tr><td>Scope</td><td>GameMatch</td></tr>
<tr><td>Level</td><td>game-s-cord</td></tr>
<tr><td>Author</td><td>백유진</td></tr>
<tr><td>Last Update</td><td>2025. 11. 03</td></tr>
<tr><td>Status</td><td>Analysis</td></tr>
<tr><td>Primary Actor</td><td>User</td></tr>
<tr><td>Preconditions</td><td>사용자는 등록된 계정이 있어야 하고 로그인 정보를 보유해야 한다.</td></tr>
<tr><td>Trigger</td><td>사용자가 헤더의 로그인 버튼을 클릭한다.</td></tr>
<tr><td>Success Post Condition</td><td>사용자가 시스템에 로그인되고, 시스템의 기능을 이용할 수 있다.</td></tr>
<tr><td>Failed Post Condition</td><td>로그인 정보가 올바르지 않으면 오류 메시지가 표시된다.</td></tr>

<!-- MAIN -->
<tr><th colspan="2">MAIN SUCCESS SCENARIO</th></tr>
<tr><td width="30%">Step</td><td>Action</td></tr>
<tr><td>1</td><td>사용자가 웹 헤더에서 로그인 버튼을 클릭하여 로그인 페이지에 진입한다.</td></tr>
<tr><td>2</td><td>사용자가 아이디와 비밀번호를 입력하여 로그인 시도를 한다.</td></tr>
<tr><td>3</td><td>시스템은 입력된 정보를 검증하고 DB에서 사용자 정보를 조회한다.</td></tr>
<tr><td>4</td><td>사용자 정보가 인증되면 로그인에 성공하여 메인 페이지로 리다이렉트된다.</td></tr>

<!-- EXTENSION -->
<tr><th colspan="2">EXTENSION SCENARIOS</th></tr>
<tr><td>Step</td><td>Branching Action</td></tr>

<!-- Step 3 -->
<tr>
  <td rowspan="11" align="center">3</td>
  <td><b>3a</b> 입력된 아이디가 존재하지 않는 경우</td>
</tr>
<tr><td>3a.1 “존재하지 않는 아이디입니다.”라는 경고 메시지가 표시된다.</td></tr>
<tr><td>3a.2 사용자의 입력을 다시 요청한다.</td></tr>

<tr><td><b>3b</b> 입력된 비밀번호가 올바르지 않은 경우</td></tr>
<tr><td>3b.1 “비밀번호가 일치하지 않습니다.”라는 경고 메시지가 표시된다.</td></tr>
<tr><td>3b.2 사용자의 입력을 다시 요청한다.</td></tr>

<tr><td><b>3c</b> 아이디나 비밀번호가 입력되지 않은 경우</td></tr>
<tr><td>3c.1 “모든 필드를 입력해주세요”라는 경고 메시지가 표시된다.</td></tr>
<tr><td>3c.2 사용자의 입력을 다시 요청한다.</td></tr>

<tr><td><b>3d</b> 비밀번호 3회 시도 오류가 발생한 경우</td></tr>
<tr><td><span>3d.1</span> 5분 동안 로그인 시도가 제한된다.</td></tr>

<!-- RELATED -->
<tr><th colspan="2">RELATED INFORMATION</th></tr>
<tr><td>Performance</td><td>인증 처리 및 세션 생성 시간 ≤ 500 milliseconds<br>서버 응답 시간 ≤ 1 second</td></tr>
<tr><td>Frequency</td><td>하루 평균 3~10회</td></tr>
<tr><td>Concurrency</td><td>동시 로그인 시 세션 충돌 방지 및 시도 제한 적용</td></tr>
<tr><td>Due Date</td><td>2025. 11. 24</td></tr>

</table>

<br>
<h3>Use Case #3 : 로그아웃</h3>

<table border="1" width="100%" cellspacing="0" cellpadding="6">

<!-- GENERAL -->
<tr><th colspan="2">GENERAL CHARACTERISTICS</th></tr>
<tr><td width="30%">Summary</td><td>사용자가 시스템에서 로그아웃한다.</td></tr>
<tr><td>Scope</td><td>GameMatch</td></tr>
<tr><td>Level</td><td>game-s-cord</td></tr>
<tr><td>Author</td><td>백유진</td></tr>
<tr><td>Last Update</td><td>2025. 11. 03</td></tr>
<tr><td>Status</td><td>Analysis</td></tr>
<tr><td>Primary Actor</td><td>User</td></tr>
<tr><td>Preconditions</td><td>사용자가 로그인 상태여야 한다.</td></tr>
<tr><td>Trigger</td><td>사용자가 헤더의 로그아웃 버튼을 클릭한다.</td></tr>
<tr><td>Success Post Condition</td><td>사용자의 로그인 세션이 만료되고, 더 이상 웹 서비스를 이용할 수 없다.</td></tr>
<tr><td>Failed Post Condition</td><td>로그아웃이 실패하면 현재 세션이 유지된다.</td></tr>

<!-- MAIN -->
<tr><th colspan="2">MAIN SUCCESS SCENARIO</th></tr>
<tr><td width="30%">Step</td><td>Action</td></tr>
<tr><td>1</td><td>사용자가 헤더의 로그아웃 버튼을 클릭한다.</td></tr>
<tr><td>2</td><td>시스템은 현재 세션을 종료한다.</td></tr>
<tr><td>3</td><td>시스템은 로그아웃 완료 후 메인 페이지로 리다이렉트한다.</td></tr>

<!-- EXTENSION -->
<tr><th colspan="2">EXTENSION SCENARIOS</th></tr>
<tr><td>Step</td><td>Branching Action</td></tr>

<tr>
  <td rowspan="3" align="center">2</td>
  <td><b>2a</b> 세션 종료 실패 시</td>
</tr>
<tr><td>2a.1 오류 메시지를 표시한다.</td></tr>
<tr><td>2a.2 사용자가 다시 로그아웃 시도를 할 수 있다.</td></tr>

<!-- RELATED -->
<tr><th colspan="2">RELATED INFORMATION</th></tr>
<tr><td>Performance</td><td>세션 종료 처리 및 리다이렉트 ≤ 1 second</td></tr>
<tr><td>Frequency</td><td>하루 평균 1~3회</td></tr>
<tr><td>Concurrency</td><td>동시 로그아웃 요청 시 최신 요청을 기준으로 세션을 안전하게 만료 처리</td></tr>
<tr><td>Due Date</td><td>2025. 11. 24</td></tr>

</table>

<br>
<h3>Use Case #4 : 프로필 관리(Mypage)</h3>

<table border="1" width="100%" cellspacing="0" cellpadding="6">

<!-- GENERAL -->
<tr><th colspan="2">GENERAL CHARACTERISTICS</th></tr>
<tr><td width="30%">Summary</td><td>사용자가 자신의 기본 정보를 확인 및 수정한다.</td></tr>
<tr><td>Scope</td><td>game-s-cord</td></tr>
<tr><td>Level</td><td>User Level</td></tr>
<tr><td>Author</td><td>백유진</td></tr>
<tr><td>Last Update</td><td>2025. 11. 03</td></tr>
<tr><td>Status</td><td>Analysis</td></tr>
<tr><td>Primary Actor</td><td>User</td></tr>
<tr><td>Preconditions</td><td>사용자가 로그인 상태여야 한다.</td></tr>
<tr><td>Trigger</td><td>사용자가 헤더를 통해 마이페이지(MyPage)에 진입한다.</td></tr>
<tr><td>Success Post Condition</td><td>사용자가 프로필을 확인하거나 수정 완료한다.</td></tr>
<tr><td>Failed Post Condition</td><td>입력 정보가 잘못되면 수정이 적용되지 않는다.</td></tr>

<!-- MAIN -->
<tr><th colspan="2">MAIN SUCCESS SCENARIO</th></tr>
<tr><td width="30%">Step</td><td>Action</td></tr>
<tr><td>1</td><td>사용자가 마이페이지 메뉴를 클릭한다.</td></tr>
<tr><td>2</td><td>시스템은 사용자 정보(닉네임, 프로필 사진, 자기소개, 성별 등)를 표시한다.</td></tr>
<tr><td>3</td><td>사용자가 수정 버튼을 클릭한다.</td></tr>
<tr><td>4</td><td>사용자가 원하는 항목(닉네임, 프로필 사진, 자기소개)을 수정한다.</td></tr>
<tr><td>5</td><td>사용자가 확인 버튼을 클릭하면 시스템은 정보를 업데이트한다.</td></tr>
<tr><td>6</td><td>시스템은 변경된 정보를 저장하고, 화면에 반영한다.</td></tr>

<!-- EXTENSION -->
<tr><th colspan="2">EXTENSION SCENARIOS</th></tr>
<tr><td>Step</td><td>Branching Action</td></tr>

<tr>
  <td rowspan="3" align="center">4</td>
  <td><b>4a</b> 자기소개 글자 수 제한 초과 시</td>
</tr>
<tr><td>4a.1 글자 수 제한 메시지를 표시한다.</td></tr>
<tr><td>4a.2 사용자는 허용된 글자 수 내에서 재입력할 수 있다.</td></tr>

<tr>
  <td rowspan="2" align="center">5</td>
  <td><b>5a</b> 수정 취소 혹은 확인 버튼을 누르지 않고 페이지를 벗어날 경우</td>
</tr>
<tr><td>5a.1 시스템은 기존 정보를 유지하고 마이페이지로 돌아간다.</td></tr>

<!-- RELATED -->
<tr><th colspan="2">RELATED INFORMATION</th></tr>
<tr><td>Performance</td><td><= 1 second</td></tr>
<tr><td>Frequency</td><td>회원당 평균 하루 1회 내외</td></tr>
<tr><td>Concurrency</td><td>동시 수정 요청 시 마지막 저장된 정보가 우선 적용되도록 처리</td></tr>
<tr><td>Due Date</td><td>2025. 11. 24</td></tr>

</table>

<br>
<h3>Use Case #5 : 게임 메이트 등록</h3>

<table border="1" width="100%" cellspacing="0" cellpadding="6">

<!-- GENERAL -->
<tr><th colspan="2">GENERAL CHARACTERISTICS</th></tr>
<tr><td width="30%">Summary</td><td>사용자가 게임 메이트로 등록하여 유료 게임 서비스를 제공한다.</td></tr>
<tr><td>Scope</td><td>game-s-cord</td></tr>
<tr><td>Level</td><td>User Level</td></tr>
<tr><td>Author</td><td>백유진</td></tr>
<tr><td>Last Update</td><td>2025. 11. 03</td></tr>
<tr><td>Status</td><td>Analysis</td></tr>
<tr><td>Primary Actor</td><td>User</td></tr>
<tr><td>Preconditions</td><td>사용자가 로그인 상태여야 한다.</td></tr>
<tr><td>Trigger</td><td>사용자가 마이페이지에서 메이트 등록 버튼을 클릭한다.</td></tr>
<tr><td>Success Post Condition</td><td>게임 메이트 등록이 완료되고 서비스 제공 가능 상태가 된다.</td></tr>
<tr><td>Failed Post Condition</td><td>입력 정보가 유효하지 않으면 등록이 제한된다.</td></tr>

<!-- MAIN -->
<tr><th colspan="2">MAIN SUCCESS SCENARIO</th></tr>
<tr><td width="30%">Step</td><td>Action</td></tr>
<tr><td>1</td><td>사용자가 메이트 등록 버튼을 클릭한다.</td></tr>
<tr><td>2</td><td>사용자가 메이트 지원서를 작성한다.</td></tr>
<tr><td>3</td><td>사용자가 게임 실력, 요금, 이용 가능 시간대, 선호 게임, 성별 등을 설정한다.</td></tr>
<tr><td>4</td><td>사용자가 확인 버튼을 클릭하면 시스템은 정보를 저장하고 등록을 완료한다.</td></tr>

<!-- EXTENSION -->
<tr><th colspan="2">EXTENSION SCENARIOS</th></tr>
<tr><td>Step</td><td>Branching Action</td></tr>

<tr>
  <td rowspan="6" align="center">3</td>
  <td><b>3a</b> 티어 스크린샷 미첨부 시</td>
</tr>
<tr><td>3a.1 등록을 제한하고 첨부 안내 메시지를 표시한다.</td></tr>

<tr><td><b>3b</b> 요금이 최소/최대 범위를 벗어난 경우</td></tr>
<tr><td>3b.1 등록을 제한하고 요금 범위 안내 메시지를 표시한다.</td></tr>

<tr><td><b>3c</b> 등록을 위한 요구 사항을 모두 입력하지 않은 경우</td></tr>
<tr><td>3c.1 모든 필드를 입력하라는 안내 메시지를 출력한다.</td></tr>

<tr>
  <td rowspan="2" align="center">4</td>
  <td><b>4a</b> 등록 중 취소하거나 확인 버튼을 누르지 않고 페이지를 벗어날 경우</td>
</tr>
<tr><td>4a.1 입력 정보는 저장되지 않고 마이페이지로 돌아간다.</td></tr>

<!-- RELATED -->
<tr><th colspan="2">RELATED INFORMATION</th></tr>
<tr><td>Performance</td><td><= 1 second</td></tr>
<tr><td>Frequency</td><td>사용자당 가끔 수행되며, 평균 월 1회 내외 발생</td></tr>
<tr><td>Concurrency</td><td>동시에 등록 요청이 발생할 경우, 가장 최근 저장 요청 기준으로 프로필 상태를 갱신</td></tr>
<tr><td>Due Date</td><td>2025. 11. 24</td></tr>

</table>

<br>
<h3>Use Case #6 : 게임 메이트 검색</h3>

<table border="1" width="100%" cellspacing="0" cellpadding="6">

<!-- GENERAL -->
<tr><th colspan="2">GENERAL CHARACTERISTICS</th></tr>
<tr><td width="30%">Summary</td><td>사용자가 필터링을 통해 원하는 게임 메이트를 검색한다.</td></tr>
<tr><td>Scope</td><td>game-s-cord</td></tr>
<tr><td>Level</td><td>User Level</td></tr>
<tr><td>Author</td><td>백유진</td></tr>
<tr><td>Last Update</td><td>2025. 11. 03</td></tr>
<tr><td>Status</td><td>Analysis</td></tr>
<tr><td>Primary Actor</td><td>User</td></tr>
<tr><td>Preconditions</td><td>사용자가 로그인 상태여야 한다.</td></tr>
<tr><td>Trigger</td><td>사용자가 헤더에서 게임 메이트 검색을 시도한다.</td></tr>
<tr><td>Success Post Condition</td><td>조건에 맞는 게임 메이트 목록을 확인한다.</td></tr>
<tr><td>Failed Post Condition</td><td>검색 조건에 맞는 게임 메이트가 없으면 안내 메시지를 표시한다.</td></tr>

<!-- MAIN -->
<tr><th colspan="2">MAIN SUCCESS SCENARIO</th></tr>
<tr><td width="30%">Step</td><td>Action</td></tr>
<tr><td>1</td><td>사용자가 게임 종류를 검색한다.</td></tr>
<tr><td>2</td><td>시스템은 해당 게임에 등록된 게임 메이트 목록을 표시한다.</td></tr>
<tr><td>3</td><td>사용자가 티어/랭크, 정렬순순, 성별 등으로 필터링할 수 있다.</td></tr>
<tr><td>4</td><td>시스템은 필터링 조건에 맞는 게임 메이트 목록을 갱신하여 표시한다.</td></tr>

<!-- EXTENSION -->
<tr><th colspan="2">EXTENSION SCENARIOS</th></tr>
<tr><td>Step</td><td>Branching Action</td></tr>

<tr>
  <td rowspan="4" align="center">4</td>
  <td><b>4a</b> 조건에 맞는 게임 메이트가 없는 경우</td>
</tr>
<tr><td>4a.1 “조건에 맞는 게임 메이트가 없습니다”라는 메시지를 표시한다.</td></tr>

<tr><td><b>4b</b> 게임 메이트 목록 로드에 실패할 경우</td></tr>
<tr><td>4b.1 오류 메시지를 표시하고 다시 시도하도록 안내한다.</td></tr>

<!-- RELATED -->
<tr><th colspan="2">RELATED INFORMATION</th></tr>
<tr><td>Performance</td><td><= 1 second</td></tr>
<tr><td>Frequency</td><td>자주 사용됨. 평균 하루 3~5회 내외</td></tr>
<tr><td>Concurrency</td><td>다수 사용자가 동시검색 요청 시에도 읽기 기반 처리로 문제없음.</td></tr>
<tr><td>Due Date</td><td>2025. 11. 24</td></tr>

</table>
<h3>Use Case #7 : 게임 메이트 상세 정보 확인</h3>

<table border="1" width="100%" cellspacing="0" cellpadding="6">

<tr><th colspan="2">GENERAL CHARACTERISTICS</th></tr>
<tr><td width="30%">Summary</td><td>사용자가 게임 메이트 상세 정보를 확인한다.</td></tr>
<tr><td>Scope</td><td>game-s-cord</td></tr>
<tr><td>Level</td><td>User Level</td></tr>
<tr><td>Author</td><td>이성진</td></tr>
<tr><td>Last Update</td><td>2025. 10. 27</td></tr>
<tr><td>Status</td><td>Analysis</td></tr>
<tr><td>Primary Actor</td><td>User</td></tr>
<tr><td>Preconditions</td><td>사용자는 로그인 상태여야 한다.</td></tr>
<tr><td>Trigger</td><td>사용자가 게임 메이트 프로필을 클릭한다.</td></tr>
<tr><td>Success Post Condition</td><td>게임 메이트의 정보(프로필, 자기소개, 별점 등)를 확인할 수 있다.</td></tr>
<tr><td>Failed Post Condition</td><td>정보를 불러올 수 없고 이전 화면으로 돌아간다.</td></tr>

<tr><th colspan="2">MAIN SUCCESS SCENARIO</th></tr>
<tr><td>1</td><td>사용자가 게임 메이트 목록에서 특정 메이트를 선택한다.</td></tr>
<tr><td>2</td><td>시스템은 선택된 메이트의 정보를 조회한다.</td></tr>
<tr><td>3</td><td>시스템은 상세 정보 페이지를 사용자에게 표시한다.</td></tr>
<tr><td>4</td><td>사용자는 메이트 정보를 확인한다.</td></tr>
<tr><td>5</td><td>Use case 종료.</td></tr>

<tr><th colspan="2">EXTENSION SCENARIOS</th></tr>
<tr><td>2</td><td><b>2a</b> DB 조회 실패 → “프로필 정보를 찾을 수 없습니다.” 표시 후 목록 화면으로 이동.</td></tr>

<tr><th colspan="2">RELATED INFORMATION</th></tr>
<tr><td>Performance</td><td>≤ 1 second</td></tr>
<tr><td>Frequency</td><td>일 평균 약 5,000회</td></tr>
<tr><td>Concurrency</td><td>최대 200 TPS 처리 가능</td></tr>
<tr><td>Due Date</td><td>2025. 12. 03</td></tr>

</table>
<h3>Use Case #8 : 즐겨찾기</h3>

<table border="1" width="100%" cellspacing="0" cellpadding="6">

<tr><th colspan="2">GENERAL CHARACTERISTICS</th></tr>
<tr><td width="30%">Summary</td><td>사용자는 게임 메이트를 즐겨찾기에 추가하거나 해제할 수 있다.</td></tr>
<tr><td>Scope</td><td>game-s-cord</td></tr>
<tr><td>Level</td><td>User Level</td></tr>
<tr><td>Author</td><td>이성진</td></tr>
<tr><td>Last Update</td><td>2025. 10. 27</td></tr>
<tr><td>Status</td><td>Analysis</td></tr>
<tr><td>Primary Actor</td><td>User</td></tr>
<tr><td>Preconditions</td><td>사용자는 로그인 상태여야 한다.</td></tr>
<tr><td>Trigger</td><td>사용자가 상세 프로필에서 즐겨찾기 버튼을 클릭한다.</td></tr>
<tr><td>Success Post Condition</td><td>즐겨찾기 상태가 업데이트된다.</td></tr>
<tr><td>Failed Post Condition</td><td>상태 변경 실패 메시지를 표시하고 기존 상태 유지.</td></tr>

<tr><th colspan="2">MAIN SUCCESS SCENARIO</th></tr>
<tr><td>1</td><td>사용자가 즐겨찾기 버튼을 클릭한다.</td></tr>
<tr><td>2</td><td>시스템은 즐겨찾기 상태를 DB에서 변경한다.</td></tr>
<tr><td>3</td><td>시스템은 UI 아이콘을 변경하여 반영한다.</td></tr>
<tr><td>4</td><td>사용자는 변경된 상태를 확인한다.</td></tr>
<tr><td>5</td><td>Use case 종료.</td></tr>

<tr><th colspan="2">EXTENSION SCENARIOS</th></tr>
<tr><td>2</td><td><b>2a</b> DB 업데이트 실패 → “즐겨찾기 변경 실패” 메시지 표시.</td></tr>

<tr><th colspan="2">RELATED INFORMATION</th></tr>
<tr><td>Performance</td><td>≤ 500 ms</td></tr>
<tr><td>Frequency</td><td>회원당 하루 평균 5회</td></tr>
<tr><td>Concurrency</td><td>DB Lock 필요</td></tr>
<tr><td>Due Date</td><td>2025. 12. 03</td></tr>

</table>
<h3>Use Case #9 : 매칭 수락</h3>

<table border="1" width="100%" cellspacing="0" cellpadding="6">

<tr><th colspan="2">GENERAL CHARACTERISTICS</th></tr>
<tr><td>Summary</td><td>사용자는 받은 매칭 요청을 수락할 수 있다.</td></tr>
<tr><td>Scope</td><td>game-s-cord</td></tr>
<tr><td>Level</td><td>User Level</td></tr>
<tr><td>Author</td><td>이성진</td></tr>
<tr><td>Last Update</td><td>2025. 11. 04</td></tr>
<tr><td>Status</td><td>Analysis</td></tr>
<tr><td>Primary Actor</td><td>User</td></tr>
<tr><td>Preconditions</td><td>요청 목록 내 유효한 매칭 요청 존재</td></tr>
<tr><td>Trigger</td><td>사용자가 ‘수락’ 버튼을 누른다.</td></tr>
<tr><td>Success Post Condition</td><td>매칭 확정 상태로 업데이트되고 알림 발송.</td></tr>
<tr><td>Failed Post Condition</td><td>상태 변경 실패 메시지 표시.</td></tr>

<tr><th colspan="2">MAIN SUCCESS SCENARIO</th></tr>
<tr><td>1</td><td>사용자가 요청 목록에서 요청을 선택한다.</td></tr>
<tr><td>2</td><td>사용자는 요청 내용을 검토하고 수락 버튼을 누른다.</td></tr>
<tr><td>3</td><td>시스템은 요청 상태를 ‘확정’으로 변경한다.</td></tr>
<tr><td>4</td><td>시스템은 신청자와 사용자 모두에게 알림을 발송한다.</td></tr>
<tr><td>5</td><td>Use case 종료.</td></tr>

<tr><th colspan="2">EXTENSION SCENARIOS</th></tr>
<tr><td>3</td><td><b>3a</b> 동시 수락/거절 충돌 → “이미 처리된 요청입니다.” 메시지 표시.</td></tr>

<tr><th colspan="2">RELATED INFORMATION</th></tr>
<tr><td>Performance</td><td>≤ 1.2 seconds</td></tr>
<tr><td>Frequency</td><td>회원당 하루 평균 2회</td></tr>
<tr><td>Concurrency</td><td>매칭 상태 변경 시 Lock 필요</td></tr>
<tr><td>Due Date</td><td>2025. 12. 03</td></tr>

</table>
<h3>Use Case #10 : 매칭 거절</h3>

<table border="1" width="100%" cellspacing="0" cellpadding="6">

<tr><th colspan="2">GENERAL CHARACTERISTICS</th></tr>
<tr><td width="30%">Summary</td><td>사용자는 받은 매칭 요청을 거절할 수 있다.</td></tr>
<tr><td>Scope</td><td>game-s-cord</td></tr>
<tr><td>Level</td><td>User Level</td></tr>
<tr><td>Author</td><td>이성진</td></tr>
<tr><td>Last Update</td><td>2025. 11. 04</td></tr>
<tr><td>Status</td><td>Analysis</td></tr>
<tr><td>Primary Actor</td><td>User</td></tr>
<tr><td>Preconditions</td><td>요청 목록에 대기 중인 매칭 요청이 존재해야 한다.</td></tr>
<tr><td>Trigger</td><td>사용자가 '거절' 버튼을 누른다.</td></tr>
<tr><td>Success Post Condition</td><td>매칭 요청 상태가 '거절'로 변경되고 신청자에게 알림이 전달된다.</td></tr>
<tr><td>Failed Post Condition</td><td>상태 변경이 실패하고 기존 상태가 유지된다.</td></tr>

<tr><th colspan="2">MAIN SUCCESS SCENARIO</th></tr>
<tr><td>1</td><td>사용자가 요청 목록에서 특정 요청을 선택한다.</td></tr>
<tr><td>2</td><td>사용자는 거절 버튼을 클릭한다.</td></tr>
<tr><td>3</td><td>시스템은 요청 상태를 '거절됨'으로 변경한다.</td></tr>
<tr><td>4</td><td>시스템은 신청자에게 거절 알림을 전송한다.</td></tr>
<tr><td>5</td><td>Use case 종료.</td></tr>

<tr><th colspan="2">EXTENSION SCENARIOS</th></tr>
<tr><td>3</td><td><b>3a</b> DB 업데이트 실패 → “매칭 거절 처리 실패” 메시지 표시.</td></tr>

<tr><th colspan="2">RELATED INFORMATION</th></tr>
<tr><td>Performance</td><td>≤ 500 ms</td></tr>
<tr><td>Frequency</td><td>회원당 하루 평균 3~5회</td></tr>
<tr><td>Concurrency</td><td>DB Lock 필요</td></tr>
<tr><td>Due Date</td><td>2025. 12. 03</td></tr>

</table>
<h3>Use Case #11 : 코인 충전</h3>

<table border="1" width="100%" cellspacing="0" cellpadding="6">

<tr><th colspan="2">GENERAL CHARACTERISTICS</th></tr>
<tr><td width="30%">Summary</td><td>사용자는 유료 기능 사용을 위해 코인을 충전한다.</td></tr>
<tr><td>Scope</td><td>game-s-cord</td></tr>
<tr><td>Level</td><td>User Level</td></tr>
<tr><td>Author</td><td>이성진</td></tr>
<tr><td>Last Update</td><td>2025. 10. 27</td></tr>
<tr><td>Status</td><td>Analysis</td></tr>
<tr><td>Primary Actor</td><td>User</td></tr>
<tr><td>Preconditions</td><td>사용자는 로그인 상태여야 한다.</td></tr>
<tr><td>Trigger</td><td>사용자가 코인 충전 페이지에 진입한다.</td></tr>
<tr><td>Success Post Condition</td><td>코인이 정상적으로 충전되어 계정에 반영된다.</td></tr>
<tr><td>Failed Post Condition</td><td>충전 실패 메시지를 표시하고 기존 잔액 유지.</td></tr>

<tr><th colspan="2">MAIN SUCCESS SCENARIO</th></tr>
<tr><td>1</td><td>사용자가 충전할 금액을 선택한다.</td></tr>
<tr><td>2</td><td>사용자는 결제 수단을 선택하고 결제를 진행한다.</td></tr>
<tr><td>3</td><td>시스템은 결제 성공 여부를 확인한다.</td></tr>
<tr><td>4</td><td>결제 성공 시 코인을 계정에 추가하고 내역을 기록한다.</td></tr>
<tr><td>5</td><td>Use case 종료.</td></tr>

<tr><th colspan="2">EXTENSION SCENARIOS</th></tr>
<tr><td>3</td><td><b>3a</b> PG 결제 실패 → “결제 실패” 메시지 표시 후 사용자 재시도 가능.</td></tr>

<tr><th colspan="2">RELATED INFORMATION</th></tr>
<tr><td>Performance</td><td>≤ 500 ms</td></tr>
<tr><td>Frequency</td><td>일 평균 약 1,000회</td></tr>
<tr><td>Concurrency</td><td>잔액 반영 시 트랜잭션 처리 필요</td></tr>
<tr><td>Due Date</td><td>2025. 12. 03</td></tr>

</table>
<h3>Use Case #12 : 코인 지급</h3>

<table border="1" width="100%" cellspacing="0" cellpadding="6">

<tr><th colspan="2">GENERAL CHARACTERISTICS</th></tr>
<tr><td width="30%">Summary</td><td>시스템은 조건 충족 시 자동으로 코인을 지급한다.</td></tr>
<tr><td>Scope</td><td>game-s-cord</td></tr>
<tr><td>Level</td><td>System Level</td></tr>
<tr><td>Author</td><td>이성진</td></tr>
<tr><td>Last Update</td><td>2025. 11. 04</td></tr>
<tr><td>Status</td><td>Analysis</td></tr>
<tr><td>Primary Actor</td><td>System</td></tr>
<tr><td>Preconditions</td><td>사용자가 이벤트 조건을 만족해야 한다.</td></tr>
<tr><td>Trigger</td><td>시스템이 조건 충족 이벤트를 감지한다.</td></tr>
<tr><td>Success Post Condition</td><td>코인이 자동 지급되고 잔액이 업데이트된다.</td></tr>
<tr><td>Failed Post Condition</td><td>지급 실패 메시지를 사용자에게 표시.</td></tr>

<tr><th colspan="2">MAIN SUCCESS SCENARIO</th></tr>
<tr><td>1</td><td>시스템은 사용자 활동을 모니터링한다.</td></tr>
<tr><td>2</td><td>조건 충족 이벤트를 감지한다.</td></tr>
<tr><td>3</td><td>시스템은 지급할 코인 양을 확인한다.</td></tr>
<tr><td>4</td><td>시스템은 코인 트랜잭션을 생성하여 계정에 반영한다.</td></tr>
<tr><td>5</td><td>시스템은 알림을 사용자에게 전송한다.</td></tr>
<tr><td>6</td><td>Use case 종료.</td></tr>

<tr><th colspan="2">EXTENSION SCENARIOS</th></tr>
<tr><td>4</td><td><b>4a</b> DB 트랜잭션 실패 → 롤백 후 재시도 → 실패 시 오류 알림.</td></tr>

<tr><th colspan="2">RELATED INFORMATION</th></tr>
<tr><td>Performance</td><td>≤ 500 ms</td></tr>
<tr><td>Frequency</td><td>이벤트마다 발생</td></tr>
<tr><td>Concurrency</td><td>중복 지급 방지 로직 필요</td></tr>
<tr><td>Due Date</td><td>2025. 12. 03</td></tr>

</table>
<h3>Use Case #13 : 코인 환불</h3>

<table border="1" width="100%" cellspacing="0" cellpadding="6">

<tr><th colspan="2">GENERAL CHARACTERISTICS</th></tr>
<tr><td width="30%">Summary</td><td>사용자는 24시간 내 미사용 코인에 대해 환불 요청을 할 수 있다.</td></tr>
<tr><td>Scope</td><td>game-s-cord</td></tr>
<tr><td>Level</td><td>User Level</td></tr>
<tr><td>Author</td><td>이성진</td></tr>
<tr><td>Last Update</td><td>2025. 11. 04</td></tr>
<tr><td>Status</td><td>Analysis</td></tr>
<tr><td>Primary Actor</td><td>User</td></tr>
<tr><td>Preconditions</td><td>환불 가능한 충전 내역이 존재해야 한다.</td></tr>
<tr><td>Trigger</td><td>사용자가 환불 버튼을 클릭한다.</td></tr>
<tr><td>Success Post Condition</td><td>PG 환불 완료 & 계정 코인 차감 완료.</td></tr>
<tr><td>Failed Post Condition</td><td>환불 실패 메시지 표시 & 기존 잔액 유지.</td></tr>

<tr><th colspan="2">MAIN SUCCESS SCENARIO</th></tr>
<tr><td>1</td><td>사용자가 충전 내역을 조회한다.</td></tr>
<tr><td>2</td><td>사용자는 환불 가능한 내역을 선택한다.</td></tr>
<tr><td>3</td><td>시스템은 환불 가능 여부를 검증한다.</td></tr>
<tr><td>4</td><td>시스템은 PG사에 환불 요청을 보낸다.</td></tr>
<tr><td>5</td><td>환불 완료 시 코인을 차감하고 알림을 전송한다.</td></tr>
<tr><td>6</td><td>Use case 종료.</td></tr>

<tr><th colspan="2">EXTENSION SCENARIOS</th></tr>
<tr><td>3</td><td><b>3a</b> 사용된 코인 → “환불 불가” 메시지 표시.</td></tr>
<tr><td>4</td><td><b>4a</b> PG 환불 실패 → “환불 처리 실패” 안내.</td></tr>

<tr><th colspan="2">RELATED INFORMATION</th></tr>
<tr><td>Performance</td><td>≤ 1.5 seconds</td></tr>
<tr><td>Frequency</td><td>월 평균 1회</td></tr>
<tr><td>Concurrency</td><td>트랜잭션 록 필수</td></tr>
<tr><td>Due Date</td><td>2025. 12. 03</td></tr>

</table>
<h3>Use Case #14 : 리뷰 작성</h3>

<table border="1" width="100%" cellspacing="0" cellpadding="6">

<tr><th colspan="2">GENERAL CHARACTERISTICS</th></tr>
<tr><td width="30%">Summary</td><td>사용자는 매칭 서비스를 이용한 후 리뷰를 작성할 수 있다.</td></tr>
<tr><td>Scope</td><td>game-s-cord</td></tr>
<tr><td>Level</td><td>User Level</td></tr>
<tr><td>Author</td><td>이성진</td></tr>
<tr><td>Last Update</td><td>2025. 10. 27</td></tr>
<tr><td>Status</td><td>Analysis</td></tr>
<tr><td>Primary Actor</td><td>User</td></tr>
<tr><td>Preconditions</td><td>해당 메이트와의 매칭 이용 기록이 존재해야 한다.</td></tr>
<tr><td>Trigger</td><td>사용자가 리뷰 작성 버튼을 클릭한다.</td></tr>
<tr><td>Success Post Condition</td><td>리뷰가 저장되고 평균 평점이 갱신된다.</td></tr>
<tr><td>Failed Post Condition</td><td>리뷰 저장 실패 메시지 표시.</td></tr>

<tr><th colspan="2">MAIN SUCCESS SCENARIO</th></tr>
<tr><td>1</td><td>사용자가 리뷰 작성 화면을 연다.</td></tr>
<tr><td>2</td><td>사용자는 별점과 리뷰 내용을 입력한다.</td></tr>
<tr><td>3</td><td>사용자가 등록 버튼을 클릭한다.</td></tr>
<tr><td>4</td><td>시스템은 리뷰를 저장하고 평균 별점을 갱신한다.</td></tr>
<tr><td>5</td><td>Use case 종료.</td></tr>

<tr><th colspan="2">EXTENSION SCENARIOS</th></tr>
<tr><td>3</td><td><b>3a</b> 별점 미입력 → “평점은 필수입니다.” 메시지 표시.</td></tr>

<tr><th colspan="2">RELATED INFORMATION</th></tr>
<tr><td>Performance</td><td>≤ 1 second</td></tr>
<tr><td>Frequency</td><td>일 평균 약 500회</td></tr>
<tr><td>Concurrency</td><td>평점 갱신 시 Lock 필요</td></tr>
<tr><td>Due Date</td><td>2025. 12. 03</td></tr>

</table>
<h3>Use Case #15 : 알림 시스템</h3>

<table border="1" width="100%" cellspacing="0" cellpadding="6">

<tr><th colspan="2">GENERAL CHARACTERISTICS</th></tr>
<tr><td width="30%">Summary</td><td>매칭 관련 알림을 사용자에게 제공한다.</td></tr>
<tr><td>Scope</td><td>game-s-cord</td></tr>
<tr><td>Level</td><td>User Level</td></tr>
<tr><td>Author</td><td>이성진</td></tr>
<tr><td>Last Update</td><td>2025. 10. 27</td></tr>
<tr><td>Status</td><td>Analysis</td></tr>
<tr><td>Primary Actor</td><td>User</td></tr>
<tr><td>Preconditions</td><td>사용자는 로그인 상태여야 한다.</td></tr>
<tr><td>Trigger</td><td>매칭 요청/수락/거절 등의 이벤트 발생.</td></tr>
<tr><td>Success Post Condition</td><td>사용자는 관련 알림을 정상적으로 수신한다.</td></tr>
<tr><td>Failed Post Condition</td><td>알림 전달 실패 시 알림 기록만 남는다.</td></tr>

<tr><th colspan="2">MAIN SUCCESS SCENARIO</th></tr>
<tr><td>1</td><td>사용자가 매칭 요청을 수행한다.</td></tr>
<tr><td>2</td><td>시스템은 상대 메이트에게 매칭 요청 알림을 발송한다.</td></tr>
<tr><td>3</td><td>상대 메이트가 요청을 수락 또는 거절한다.</td></tr>
<tr><td>4</td><td>시스템은 결과 알림을 요청자에게 발송한다.</td></tr>
<tr><td>5</td><td>사용자는 알림 목록에서 내용을 확인한다.</td></tr>
<tr><td>6</td><td>Use case 종료.</td></tr>

<tr><th colspan="2">EXTENSION SCENARIOS</th></tr>
<tr><td>2</td><td><b>2a</b> 네트워크 오류 → 알림 내역에 기록만 남기고 사용자 표시 X.</td></tr>

<tr><th colspan="2">RELATED INFORMATION</th></tr>
<tr><td>Performance</td><td>≤ 500 ms</td></tr>
<tr><td>Frequency</td><td>일 최대 약 5,000회</td></tr>
<tr><td>Concurrency</td><td>동시 다중 알림 발송 큐 필요</td></tr>
<tr><td>Due Date</td><td>2025. 12. 03</td></tr>

</table>
