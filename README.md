# 먹튜브 - 인플루언서들의 찐맛집 지도

인플루언서들이 추천하는 맛집 정보를 한눈에 볼 수 있는 지도 서비스입니다.
관련 영상 URL과 지도앱에서 보기 URL을 지원합니다.

## 기술 스택

- **Frontend**:

  - 코어 : React + TypeScript
  - 번들러 : Vite
  - 스타일링 : TailwindCSS
  - 컴포넌트 라이브러리 : shadcn/ui
  - 데이터 관리 : Tanstack Query
  - 지도 : React Naver Maps + Naver Maps API

- **Backend**:
  - DB : Google Sheets
  - API : Google App Scripts

## 주요 기능

- **지도 기반 맛집 탐색**: 구글 시트이용하여 쉽게 맛집 정보 관리
- **클러스터링**: 줌 레벨에 따라 마커를 그룹화
- **검색/필터 기능**: 키워드와 카테고리로 검색/필터 기능 지원
- **현재 위치**: 내 위치 기반 주변 맛집 탐색 기능 및 거리순 정렬 기능
- **반응형 디자인**: 모바일/데스크톱 환경 모두 지원. 테스크탑에서는 사이드바 레이아웃, 모바일에서는 스냅퍼블 드로워 레이아웃
- **Windowing을 통한 DOM요소 최적화** Tanstack Virtual을 통해 화면에 보이는 리스트와 마커만 렌더링

## 시작하기

1. 저장소 클론

```bash
git clone https://github.com/yourusername/matzip.git
cd matzip
```

2. 환경 변수 설정

```bash
cp .env.example .env
```

`.env` 파일에 네이버 클라이언트 ID 설정:

```
VITE_NAVER_CLIENT_ID=your_client_id
```

3. 의존성 설치

```bash
npm install
```

4. 개발 서버 실행

```bash
npm run dev
```

## 프로젝트 구조

```
src/
├── components/     # 리액트 컴포넌트
├── hooks/         # 커스텀 훅
├── lib/           # 유틸리티 함수 및 상수
├── types/         # 타입 정의
└── assets/        # 이미지 등 정적 파일
```

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 라이선스

MIT License
