# 📍 AI Location Agent — AI 위치 기반 자동 일정 관리 시스템

> 위치가 바뀌면 AI가 맥락을 파악하고, 자동으로 모드를 전환합니다.

![Java](https://img.shields.io/badge/Java_21-ED8B00?style=flat-square&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot_3-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-010101?style=flat-square&logo=socketdotio&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI_API-412991?style=flat-square&logo=openai&logoColor=white)

---

## 📌 프로젝트 소개

GPS 위치 변화를 감지하여 AI가 현재 맥락을 파악하고, 자동으로 생활 모드를 전환하는 스마트 에이전트 시스템입니다.

### 시나리오 예시

- 🏢 **회사 근처 도착** → "출근 모드" 전환, 오늘 일정 요약 알림
- ☕ **카페 진입** → "집중 모드" 추천, 방해금지 자동 설정
- 📍 **약속 장소 접근** → 상대방에게 "곧 도착합니다" 자동 알림
- 🏠 **귀가 감지** → "휴식 모드", 내일 일정 프리뷰
- 🏋️ **헬스장 도착** → "운동 모드", 오늘의 루틴 추천

### 핵심 기능

- **위치 기반 자동 모드 전환**: 등록된 장소 반경 진입 시 AI가 맥락 판단
- **AI 행동 추천**: 위치 + 시간 + 일정 데이터를 종합하여 다음 행동 제안
- **WebSocket 실시간 동기화**: 모드 전환 & 알림을 실시간 푸시
- **패턴 학습**: 반복 행동을 학습하여 자동 루틴 생성
- **약속 자동 알림**: 약속 장소 접근 시 상대방에게 자동 메시지

---

## 🏗 아키텍처

```
[모바일 앱 (Flutter)] ── 위치 데이터 전송 (60초 간격)
         ↓
[Spring Boot 서버]
    ├── 위치 분석 (Haversine 거리 계산)
    ├── 장소 매칭 (등록된 장소 반경 체크)
    ├── AI 맥락 분석 (OpenAI API)
    │     └── 위치 + 시간 + 일정 → 모드 & 행동 추천
    ├── Redis (현재 상태, 패턴 캐싱)
    └── WebSocket (실시간 모드 전환 알림)
         ↓
[클라이언트] ← 모드 전환 + 행동 추천 실시간 수신
```

---

## 🛠 기술 스택

| 분류 | 기술 |
|------|------|
| Backend | Java 21, Spring Boot 3, Spring WebSocket, STOMP |
| AI | OpenAI GPT API (맥락 분석 + 행동 추천) |
| Realtime | WebSocket + STOMP Protocol |
| Cache | Redis (상태 관리, 패턴 학습 데이터) |
| DB | MySQL 8.0 |
| Geo | Haversine Formula (거리 계산) |
| Auth | JWT + Spring Security |

---

## 📁 프로젝트 구조

```
src/main/java/com/bomin/locationagent/
├── config/          # WebSocket, Redis, OpenAI, Security 설정
├── controller/      # REST API + WebSocket 핸들러
├── dto/             # Request/Response DTO
├── model/           # Entity (User, Place, Schedule, LocationLog)
├── service/         # 위치 분석, AI 추천, 패턴 학습
├── websocket/       # STOMP 메시지 핸들러
└── LocationAgentApplication.java
```

---

## 🚀 실행 방법

```bash
# 1. 환경변수 설정
export OPENAI_API_KEY=your_openai_api_key

# 2. Docker (Redis + MySQL)
docker-compose up -d

# 3. 애플리케이션 실행
./gradlew bootRun
```

---

## 📡 API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/location/update` | 위치 업데이트 (모바일 → 서버) |
| GET | `/api/location/current-mode` | 현재 모드 조회 |
| POST | `/api/places` | 장소 등록 (회사, 집, 카페 등) |
| GET | `/api/places` | 등록 장소 목록 |
| GET | `/api/recommendations` | AI 행동 추천 조회 |
| GET | `/api/patterns` | 학습된 패턴 조회 |
| WS | `/ws/mode` | 실시간 모드 전환 구독 |

---

## 📄 라이선스

MIT License

---

## 👨‍💻 만든 사람

**김보민** — [@utmmyppol-glitch](https://github.com/utmmyppol-glitch)
