// 💚 오사카 3박 4일 일정 데이터
// tag: normal(노랑) | food(핑크) | shop(보라) | sight(초록) | theme(인디고)  (워시테이프 색상에 사용)
// ※ theme(indigo) 태그: 사용 활성화됨. 특별 이벤트/체험성 일정에 자유롭게 사용 가능하며,
//   라벨·색상 매핑(app.js)과 CSS(style.css .tag-theme)도 정식 지원 상태로 유지한다.

// ---------------- 준비물 체크리스트: 카테고리 (단일 소스, B1) ----------------
// index.html의 추가폼 select와 app.js의 CHECKLIST_VALID_CATS가 모두 여기서 파생됨.
// 카테고리를 추가/변경/삭제하려면 이 배열만 수정하면 됨(다른 파일은 손댈 필요 없음).
const CHECKLIST_CATEGORIES = ["여권서류", "의류", "전자기기", "세안미용", "기타"];

// ---------------- 공항→시내 교통정보 (단일 소스, B2) ----------------
// index.html의 transitCard 하드코딩 대신 여기서 렌더링 데이터를 관리.
// 왕복 지원을 위해 배열 형태로 구성: [가는편, 오는편]. (구버전 단일 객체 형태도 app.js에서 호환 처리됨)
// 라피트 예약 완료 상태라 옵션(지하철/버스) 나열이 아니라 확정된 예약 정보만 기록.
const TRANSIT_INFO = [
  {
    title: "✈️ 간사이 공항 → 난카이난바 (9/21)",
    methods: [
      {
        icon: "🚆",
        name: "라피트 β56호 (예약완료)",
        steps: [
          "간사이공항역 → 난카이난바역",
          "3호차 23·24번 좌석",
        ],
        durationLabel: "이동시간",
        duration: "10:35 → 11:12",
        fareLabel: "좌석",
        fare: "3호차 23·24번",
        payment: ["예약 완료"],
      },
    ],
    recommend: [
      "출발 시각(10:35) 전 여유 있게 승강장 도착",
    ],
  },
  {
    title: "🏨 난카이난바 → 간사이 공항 (9/24)",
    methods: [
      {
        icon: "🚆",
        name: "라피트 α29호 (예약완료)",
        steps: [
          "난카이난바역 → 간사이공항역",
          "3호차 21·22번 좌석",
        ],
        durationLabel: "이동시간",
        duration: "16:00 → 16:41",
        fareLabel: "좌석",
        fare: "3호차 21·22번",
        payment: ["예약 완료"],
      },
    ],
    recommend: [
      "출발 시각(16:00) 전 여유 있게 승강장 도착",
    ],
  },
];

// ---------------- 지도 좌표 (확정본) ----------------
// mapQuery 텍스트를 키로 사용. 여기 등록된 곳은 기기/캐시와 무관하게 항상 이 좌표를 그대로 써서
// 모든 기기에서 동일하게 보인다 - 공유 시 각자 수동으로 다시 찾을 필요 없음.
// 일정 수정으로 mapQuery 문구 자체가 바뀌면, 그 새 문구는 여기 없으니 앱이 자동으로 다시 지오코딩을 시도한다.
// 다른 여행 데이터에서도 이 구조(GEO_COORDS/GEO_SEARCH_QUERY) 그대로 복사해서 재사용 가능.
// 신규 여행이라 확정 좌표가 아직 없음 — 장소를 추가하면서 하나씩 채워나간다.
const GEO_COORDS = {};

// 위 GEO_COORDS에 없는 곳(대부분 특정 매장·지점) 중, 한국어 mapQuery로는 OSM 검색이 잘 안 되는
// 곳들을 위한 영문/현지어 검색어. 자동 지오코딩 시도할 때 이 문구를 우선 사용한다.
// (그래도 실패하면 지도에서 빼지 않고 "위치 확인 필요" 목록에 남겨 수동 확정을 기다린다)
const GEO_SEARCH_QUERY = {};

const TRIP = {
  title: "💚 오사카 3박 4일",
  hotel: {
    name: "토요코인 오사카 요도야바시 에키 미나미",
    checkin: "2026-09-21",
    checkout: "2026-09-24"
  },
  // 개인 식별 정보(나의 이름): 하드코딩 대신 데이터 레이어(TRIP 객체)에서 관리(T03).
  // classifyExpense/myShare(app.js)에서 splitWith 판별에 사용.
  meName: "동녘하늘노을",
  // 일차 목록 — index.html의 DAY 탭(#dayTabs)·지도 필터(#mapDayFilter)와 app.js의
  // mapMarkerLayers를 이 배열 기준으로 동적 생성하는 단일 소스(B3). 신규 여행이라 아직
  // 비어 있음 — 일정을 짜면서 { day: 1, date: "..." } 형태로 하나씩 채워나간다.
  days: [
    { day: 1, date: "2026-09-21" }, // 도착 + 난바 & 도톤보리
    { day: 2, date: "2026-09-22" }, // 교토 버스투어
    { day: 3, date: "2026-09-23" }, // 오사카 유니버셜 스튜디오 재팬(USJ)
    { day: 4, date: "2026-09-24" }, // 난바 & 우메다 + 마지막날
  ],
  flights: [
    { type: "outbound", flightNo: "7C1351", from: "PUS", to: "KIX", depTime: "08:05", arrTime: "09:35" },
    { type: "return", flightNo: "7C1354", from: "KIX", to: "PUS", depTime: "19:00", arrTime: "20:35" }
  ]
};

// 일정 아이템 (날짜별 타임라인에 표시될 장소/이벤트). 채워나가면서 추가.
// 필드: id(문자열, 예: "d1-1") / day(숫자, 일차) / time("HH:MM") / tag(상단 enum 참고: normal/food/shop/sight/theme) /
//   title(장소·이벤트명) / desc(한줄 설명, 빈 문자열 가능) / mapQuery(지도 검색어) / remark(비고, 빈 문자열 가능)
// 예: { id: "d1-1", day: 1, time: "09:00", tag: "normal", title: "호텔 체크인", desc: "", mapQuery: "○○호텔", remark: "" }
const ITEMS = [
  { id: "d1-1", day: 1, time: "10:35", tag: "normal", title: "간사이공항 → 난카이난바 (라피트 β56호)", desc: "3호차 23·24번, 10:35→11:12 예약완료", mapQuery: "간사이국제공항역", remark: "" },
  { id: "d1-2", day: 1, time: "11:12", tag: "normal", title: "난카이난바역 → 토요코인 오사카 요도야바시 스테이션 미나미", desc: "짐 맡기기", mapQuery: "토요코인 오사카 요도야바시 스테이션 미나미", remark: "약 11:50 도착 예상" },
  { id: "d1-3", day: 1, time: "12:00", tag: "food", title: "숙소 근처 점심", desc: "식당 미정, 현지에서 즉흥 결정", mapQuery: "요도야바시 맛집", remark: "" },
  { id: "d1-4", day: 1, time: "13:00", tag: "food", title: "요도야바시/기타하마 카페", desc: "", mapQuery: "기타하마 카페", remark: "" },
  { id: "d1-5", day: 1, time: "14:30", tag: "normal", title: "숙소 체크인", desc: "", mapQuery: "토요코인 오사카 요도야바시 스테이션 미나미", remark: "" },
  { id: "d1-6", day: 1, time: "15:00", tag: "normal", title: "숙소에서 휴식", desc: "", mapQuery: "", remark: "" },
  { id: "d1-7", day: 1, time: "15:30", tag: "shop", title: "다이마루 백화점/파르코 쇼핑", desc: "닌텐도샵, GU 등", mapQuery: "다이마루 신사이바시 파르코", remark: "" },
  { id: "d1-8", day: 1, time: "17:00", tag: "normal", title: "신사이바시 → 도톤보리 이동", desc: "지하철", mapQuery: "신사이바시역", remark: "" },
  { id: "d1-9", day: 1, time: "18:00", tag: "food", title: "저녁식사 (도톤보리)", desc: "식당 미정, 현지에서 즉흥 결정", mapQuery: "도톤보리 맛집", remark: "시간 추정치" },
  { id: "d1-10", day: 1, time: "19:30", tag: "sight", title: "도톤보리 구경", desc: "글리코상 등", mapQuery: "도톤보리 글리코상", remark: "시간 추정치" },

  { id: "d2-1", day: 2, time: "07:40", tag: "normal", title: "버스 탑승 (도톤보리 츠루동탄 소에몬초점 앞)", desc: "교토버스투어 집합", mapQuery: "츠루동탄 소에몬초점", remark: "" },
  { id: "d2-2", day: 2, time: "08:00", tag: "normal", title: "버스 출발", desc: "", mapQuery: "", remark: "" },
  { id: "d2-3", day: 2, time: "09:00", tag: "sight", title: "나라 사슴공원 + 동대사", desc: "09:00~10:40", mapQuery: "나라공원", remark: "" },
  { id: "d2-4", day: 2, time: "12:00", tag: "sight", title: "아라시야마", desc: "12:00~14:40", mapQuery: "아라시야마", remark: "" },
  { id: "d2-5", day: 2, time: "15:20", tag: "sight", title: "청수사", desc: "15:20~17:00", mapQuery: "청수사", remark: "" },
  { id: "d2-6", day: 2, time: "18:00", tag: "normal", title: "닛폰바시 하차", desc: "", mapQuery: "닛폰바시역", remark: "" },
  { id: "d2-7", day: 2, time: "18:30", tag: "food", title: "저녁식사 (도톤보리 또는 우메다)", desc: "식당 미정, 현지에서 즉흥 결정", mapQuery: "", remark: "시간 추정치" },
  { id: "d2-8", day: 2, time: "21:00", tag: "normal", title: "숙소 복귀", desc: "", mapQuery: "토요코인 오사카 요도야바시 스테이션 미나미", remark: "예상 시간" },

  { id: "d3-1", day: 3, time: "07:30", tag: "normal", title: "숙소 → USJ 이동", desc: "택시 약 20분 또는 지하철 약 40분", mapQuery: "유니버설 스튜디오 재팬", remark: "08:30 오픈 전 도착 목표, 시간 추정치" },
  { id: "d3-2", day: 3, time: "08:30", tag: "theme", title: "USJ 입장", desc: "익스프레스 패스 사용", mapQuery: "유니버설 스튜디오 재팬", remark: "" },
  { id: "d3-3", day: 3, time: "시간무관", tag: "theme", title: "플라잉 다이너소어", desc: "익스프레스 패스", mapQuery: "", remark: "예약 시간 지정 없음" },
  { id: "d3-4", day: 3, time: "10:00", tag: "theme", title: "미니언 메이헴", desc: "익스프레스 패스, 10:00~10:30", mapQuery: "", remark: "" },
  { id: "d3-5", day: 3, time: "12:20", tag: "theme", title: "슈퍼 마리오 닌텐도 월드", desc: "익스프레스 패스, 12:20~13:20", mapQuery: "", remark: "" },
  { id: "d3-6", day: 3, time: "12:20", tag: "theme", title: "마리오카트: 쿠파의 도전장", desc: "익스프레스 패스, 12:20~12:50", mapQuery: "", remark: "닌텐도월드 내" },
  { id: "d3-7", day: 3, time: "12:50", tag: "theme", title: "동키콩의 크레이지 트램카", desc: "익스프레스 패스, 12:50~13:20", mapQuery: "", remark: "닌텐도월드 내" },
  { id: "d3-8", day: 3, time: "시간무관", tag: "theme", title: "해리포터 포비든 저니", desc: "익스프레스 패스", mapQuery: "", remark: "예약 시간 지정 없음" },
  { id: "d3-9", day: 3, time: "18:00", tag: "theme", title: "할로윈 이벤트", desc: "저녁에 잠깐 관람 예정", mapQuery: "유니버설 스튜디오 재팬", remark: "" },
  { id: "d3-10", day: 3, time: "19:30", tag: "normal", title: "USJ 퇴장", desc: "할로윈 이벤트 관람 후 퇴장", mapQuery: "", remark: "" },
  { id: "d3-11", day: 3, time: "20:00", tag: "food", title: "저녁식사 (우메다)", desc: "식당 미정, 현지에서 즉흥 결정", mapQuery: "우메다 맛집", remark: "시간 추정치" },
  { id: "d3-12", day: 3, time: "21:30", tag: "normal", title: "숙소 복귀", desc: "", mapQuery: "토요코인 오사카 요도야바시 스테이션 미나미", remark: "예상 시간" },

  { id: "d4-1", day: 4, time: "10:00", tag: "normal", title: "숙소 체크아웃", desc: "", mapQuery: "토요코인 오사카 요도야바시 스테이션 미나미", remark: "" },
  { id: "d4-2", day: 4, time: "10:15", tag: "normal", title: "짐 보관 (난카이난바 또는 난바역 코인라커)", desc: "정확한 위치 미정", mapQuery: "난카이난바역 코인라커", remark: "" },
  { id: "d4-3", day: 4, time: "10:30", tag: "sight", title: "오사카성 주변 + 요미우리TV 코난 거리", desc: "", mapQuery: "오사카성", remark: "" },
  { id: "d4-4", day: 4, time: "12:30", tag: "food", title: "점심", desc: "식당 미정, 현지에서 즉흥 결정", mapQuery: "", remark: "시간 추정치" },
  { id: "d4-5", day: 4, time: "13:30", tag: "shop", title: "난바/도톤보리 쇼핑 및 시내 구경", desc: "남은 쇼핑 마무리", mapQuery: "난바", remark: "시간 추정치" },
  { id: "d4-6", day: 4, time: "15:00", tag: "normal", title: "난카이난바 이동 (짐 찾기)", desc: "", mapQuery: "난카이난바역", remark: "16:00 라피트 탑승 전 도착 목표" },
  { id: "d4-7", day: 4, time: "16:00", tag: "normal", title: "난카이난바 → 간사이공항 (라피트 α29호)", desc: "3호차 21·22번, 16:00→16:41 예약완료", mapQuery: "난카이난바역", remark: "" },
];

// 체크리스트 탭 "참고정보" 섹션에 노출되는 항목 (탭하면 고정 카드 팝업이 열림)
const REFERENCE_ITEMS = [
  { id: "ref-japanese-phrases", title: "🗣️ 자주 쓰는 일본어" },
  { id: "ref-shopping-list", title: "🛒 쇼핑리스트" },
  { id: "ref-food-list", title: "🍜 꼭 먹어야 할 음식" },
  { id: "ref-shopping-stores", title: "🛍️ 쇼핑 추천 매장" },
  { id: "ref-airport-station", title: "✈️ 간사이 공항 ↔ 난바역 이동" },
];

// "자주쓰는 일본어" 카드에 노출되는 표현 목록 (category별로 묶어 표시)
// 필드: category(그룹명, 이모지 포함) / ko(한국어) / ja(일본어) / pron(한글 발음)
// 예: { category: "🙋 인사·기본", ko: "감사합니다", ja: "ありがとうございます", pron: "아리가토 고자이마스" }
const JAPANESE_PHRASES = [];

// ---------------- 참고정보: 쇼핑 추천 매장 (표) ----------------
// 필드명은 다른 여행에서도 그대로 재사용 가능하도록 통일함: name/area/hours/recommend/mapQuery
// (image 필드는 2026-07-26 결정으로 제거됨 — 매장 사진은 소싱하지 않는다. changelog 참고)
const SHOPPING_STORES = [];

// ---------------- 참고정보: 쇼핑리스트 / 꼭 먹어야 할 음식 공통 데이터 구조 ----------------
// group: 그룹 제목(이모지 포함) / items: { title, desc(한줄 설명), mapQuery } 배열
// 이 구조는 쇼핑리스트·음식 카드가 공유하며, 다른 여행 데이터로도 그대로 재사용 가능함
const SHOPPING_LIST = [];

// ---------------- 가계부 (나만 보기 전용, Bella Travel 경유 진입 시에만 노출) ----------------
// 이 배열은 "최초 시드값"일 뿐이다. 앱 안에서 가계부 카드의 "CSV로 업데이트" 버튼으로
// 한 번이라도 업로드하면, 이후로는 IndexedDB에 저장된 내용이 우선 사용되고 이 배열은 무시된다
// (app.js의 loadExpenses/currentExpenses 참고).
// splitWith: 나눠 낼 사람(들). 공동/개인 여부는 splitWith.length로 자동 판단함 (app.js 참고)
//   - splitWith 인원이 2명 이상 → 공동경비 (금액을 인원수로 나눈 값이 내 몫)
//   - splitWith 인원이 1명이고 그게 "나"(TRIP.meName) → 개인경비 (전액 내 몫)
//   - splitWith 인원이 1명인데 내가 아니면 → 내 가계부에서 제외 (타인 단독 경비)
// (T03: 기존 별도 ME_NAME 상수는 TRIP.meName으로 이동)

// 통화 기본값: 대부분의 지출이 KRW라 매 항목마다 currency/krwRate를 반복 입력하지 않도록
// 기본값을 상수화하고 krw(...)로 감싼다. KRW가 아닌 항목만 currency/krwRate를 직접 명시한다.
const DEFAULT_CURRENCY = "KRW";
const DEFAULT_KRW_RATE = 1;
const krw = (e) => ({ currency: DEFAULT_CURRENCY, krwRate: DEFAULT_KRW_RATE, ...e });

// 통화 기호 (단일 소스, B4) — 위 krw 기본값과는 별도 계층.
// 새 통화를 지원해야 하면 이 표에 한 줄만 추가하면 되고(app.js 수정 불필요),
// 등록되지 않은 통화는 app.js formatMoney()가 기호 없이 "금액 통화코드"로 자동 표시한다(예: "100 THB").
const CURRENCY_SYMBOLS = { KRW: "₩", USD: "$", JPY: "¥", EUR: "€", GBP: "£", CNY: "¥" };

// 여행 지출 항목 (가계부 카드 초기값, 앱 내 CSV 업로드 시 IndexedDB 값으로 대체됨 — 위 설명 참고)
// 필드: day(문자열, 예: "여행준비" 또는 숫자 일차) / item(항목명) / category(분류) / amount(숫자, 해당 통화 금액) /
//   currency/krwRate(KRW면 krw({...})로 감싸 생략 가능, 그 외 통화만 직접 명시) / splitWith(나눠 낼 사람 이름 배열)
// 예: krw({ day: "여행준비", item: "항공권", category: "항공", amount: 300000, splitWith: ["나"] })
const EXPENSES = [
  krw({ day: "여행준비", item: "왕복항공료 2인", category: "항공", amount: 657680, splitWith: ["겨울", "동녘하늘노을"] }),
  krw({ day: "여행준비", item: "항공업그레이드 2인", category: "항공", amount: 192000, splitWith: ["겨울"] }),
  { day: "여행준비", item: "토요코인 3박", category: "숙소", amount: 34335, currency: "JPY", krwRate: 9.4616, place: "토요코인 오사카 요도야바시 스테이션 미나미", splitWith: ["겨울", "동녘하늘노을"] },
  krw({ day: "여행준비", item: "유니버셜 익스프레스5 티켓2장", category: "관광", amount: 412800, splitWith: ["겨울", "동녘하늘노을"] }),
  krw({ day: "여행준비", item: "유니버셜입장권2장", category: "관광", amount: 196400, splitWith: ["겨울", "동녘하늘노을"] }),
  krw({ day: "여행준비", item: "나라 교토 버스투어", category: "관광", amount: 68800, splitWith: ["겨울", "동녘하늘노을"] }),
  krw({ day: "여행준비", item: "라피트 왕복2인", category: "교통", amount: 49929, splitWith: ["겨울", "동녘하늘노을"] }),
];

// ---------------- 참고정보: 꼭 먹어야 할 음식 (간식은 구매처별로 분류) ----------------
const FOOD_LIST = [];
