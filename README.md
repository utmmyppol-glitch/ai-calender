# 📍 AI Location Agent — Full-Stack Dashboard & Mobile App

> 위치가 바뀌면 AI가 맥락을 파악하고, 자동으로 모드를 전환합니다.

---

## 🏗 프로젝트 구조

```
ai-calender/
├── ai-location-agent/     ← Spring Boot 백엔드 (포트 8081)
├── frontend/              ← React 대시보드 (포트 3000)
└── flutter_app/           ← Flutter 모바일 앱 (iOS/Android)
```

---

## 🖥 React 대시보드 실행

### 사전 요구사항
- Node.js 18+
- npm 또는 yarn

### 실행
```bash
cd frontend
npm install
npm run dev
```

→ **http://localhost:3000** 에서 대시보드 접속

### 주요 기능
- **모드 오브** — 현재 모드를 펄스 애니메이션 구체로 실시간 표시
- **AI 인사이트** — GPT-4o 기반 맥락 분석 + 행동 추천
- **Leaflet 지도** — 등록 장소 마커 + 감지 반경 시각화
- **WebSocket 실시간** — STOMP 기반 모드 전환 알림
- **패턴 차트** — Recharts 기반 방문 빈도 / 모드 분포 시각화
- **위치 시뮬레이터** — 테스트용 좌표 전송 (강남역, 서울역 등)
- **다크모드** — 시스템 감지 + 수동 토글

### 기술 스택
| 기술 | 용도 |
|------|------|
| React 18 | UI 프레임워크 |
| Vite 5 | 빌드 도구 |
| Tailwind CSS 3 | 스타일링 |
| Zustand | 전역 상태 관리 |
| Framer Motion | 애니메이션 |
| React-Leaflet | 지도 |
| Recharts | 차트 |
| STOMP.js | WebSocket |
| React Hot Toast | 알림 토스트 |

---

## 📱 Flutter 앱 실행

### 사전 요구사항
- Flutter SDK 3.2+
- Dart 3.2+
- Xcode (iOS) / Android Studio (Android)

### 설정
```bash
cd flutter_app
flutter pub get
```

### Android 설정
`android/app/src/main/AndroidManifest.xml`에 권한 추가:
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
```

### iOS 설정
`ios/Runner/Info.plist`에 추가:
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>위치 기반 자동 모드 전환을 위해 위치 접근이 필요합니다</string>
<key>NSLocationAlwaysUsageDescription</key>
<string>백그라운드에서도 위치를 추적하여 자동 모드 전환을 제공합니다</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>위치 기반 AI 자동화를 위해 항상 위치 접근이 필요합니다</string>
<key>UIBackgroundModes</key>
<array>
  <string>location</string>
</array>
```

### 서버 주소 변경
`lib/services/api_service.dart`에서 백엔드 주소 수정:
```dart
// 에뮬레이터:
static const String baseUrl = 'http://10.0.2.2:8081/api';    // Android
static const String baseUrl = 'http://localhost:8081/api';     // iOS

// 실기기:
static const String baseUrl = 'http://192.168.0.XXX:8081/api'; // 실제 IP
```

### 실행
```bash
flutter run
```

### 주요 기능
- **GPS 실시간 추적** — 60초 간격 백엔드 위치 전송
- **모드 오브** — 펄스 애니메이션 + 그라디언트 구체
- **AI 인사이트** — 위치 변경 시 GPT 기반 행동 추천
- **장소 등록** — 바텀시트 UI + 유형/모드 선택
- **패턴 차트** — fl_chart 바 차트 시각화
- **테스트 전송** — 강남역, 서울역 등 퀵 좌표 전송
- **라이트/다크 테마** — 시스템 자동 감지

---

## ⚙️ 백엔드 실행

```bash
cd ai-location-agent

# 환경변수 설정
export OPENAI_API_KEY=your_key

# Docker (Redis + MySQL)
docker-compose up -d

# 또는 로컬 MySQL/Redis 실행 후:
./gradlew bootRun
```

→ **http://localhost:8081** 에서 API 서버 실행
→ **http://localhost:8081/swagger-ui/index.html** 에서 API 문서

---

## 🔌 API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/location/update` | 위치 업데이트 → AI 모드 분석 |
| GET | `/api/location/current-mode` | 현재 모드 조회 |
| POST | `/api/places` | 장소 등록 |
| GET | `/api/places` | 등록 장소 목록 |
| GET | `/api/patterns` | 학습된 패턴 조회 |
| GET | `/api/health` | 헬스체크 |
| WS | `/ws/mode` | WebSocket 모드 전환 구독 |

---

## 🎨 디자인 시스템

### 컬러 팔레트
| 모드 | 색상 | Hex |
|------|------|-----|
| 🏢 출근 | Amber | `#E8A838` |
| ☕ 집중 | Violet | `#6C63FF` |
| 🏠 휴식 | Emerald | `#43B581` |
| 🏋️ 운동 | Rose | `#FF6B6B` |
| 🚶 이동 | Sky | `#4FC3F7` |
| 🤝 약속 | Orange | `#FF8A65` |
| ✨ 기본 | Slate | `#90A4AE` |

### 폰트
- **Display**: Playfair Display (제목)
- **Body**: DM Sans + Pretendard (본문)
- **Mono**: JetBrains Mono (코드/수치)

---

## 👨‍💻 만든 사람

**김보민** — [@utmmyppol-glitch](https://github.com/utmmyppol-glitch)
