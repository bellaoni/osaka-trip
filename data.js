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
          "비행기 하차 → 입국심사 → 수하물 수령 → 세관 순서로 이동",
          "공항 밖으로 나온 뒤 Train / Railway 표지판을 따라 이동",
          "JR이 아닌 <strong>NANKAI / 南海</strong> 표지판을 따라간다 (간사이공항역은 JR·난카이 공용역)",
          "난카이 간사이공항역 개찰구로 이동",
          "전광판에서 <strong>Rapi:t β 56호 / 10:35 / Namba</strong> 확인",
          "승강장에서 <strong>3호차</strong> 위치를 확인하고 대기",
          "열차 도착 후 3호차 탑승 → <strong>23·24번</strong> 좌석으로 이동",
          "난카이 난바역(NK01) 도착 후 하차",
        ],
        durationLabel: "이동시간",
        duration: "10:35 → 11:12",
        fareLabel: "좌석",
        fare: "3호차 23·24번",
      },
    ],
    recommend: [
      "JR과 NANKAI가 함께 있으므로 반드시 <strong>NANKAI</strong>를 찾는다",
      "난바행이라고 아무 열차나 타지 않고 <strong>Rapi:t β 56호</strong>를 확인한다",
      "지정석이므로 <strong>3호차 23·24번</strong> 좌석을 이용한다",
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
          "난바에서 Osaka Metro / JR / Kintetsu가 아닌 <strong>NANKAI / 南海</strong> 표지판을 찾아 이동",
          "난카이 난바역으로 들어가 난카이선 개찰구로 이동",
          "전광판에서 <strong>Rapi:t α 29호 / 16:00 / Kansai Airport</strong> 확인",
          "개찰 후 승강장으로 이동, <strong>3호차</strong> 위치를 확인하고 대기",
          "열차 도착 후 3호차 탑승 → <strong>21·22번</strong> 좌석으로 이동",
          "간사이공항역에서 하차 후 Airport / Terminal 표지판을 따라 이동",
        ],
        durationLabel: "이동시간",
        duration: "16:00 → 16:41",
        fareLabel: "좌석",
        fare: "3호차 21·22번",
      },
    ],
    recommend: [
      "난바에는 여러 철도역이 있으므로 단순히 Namba라고 아무 역으로 가지 말고 <strong>NANKAI / 南海</strong>를 찾는다",
      "Airport Express와 Rapi:t 모두 공항으로 가지만, 예약한 열차명(<strong>Rapi:t α29호</strong>)과 출발시간을 반드시 확인한다",
      "지정석이므로 <strong>3호차 21·22번</strong> 좌석을 이용한다",
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
  { id: "d1-0", day: 1, time: "08:05", tag: "normal", title: "✈️ 김해공항 → 간사이공항 (7C1351)", desc: "08:05 출발 → 09:35 도착", mapQuery: "Gimhae International Airport", remark: "" },
  { id: "d1-1", day: 1, time: "10:35", tag: "normal", title: "간사이공항 → 난카이난바 (라피트 β56호)", desc: "3호차 23·24번, 10:35→11:12 예약완료", mapQuery: "Kansai Airport Station", remark: "" },
  { id: "d1-2", day: 1, time: "11:12", tag: "normal", title: "난카이난바역 → 토요코인 오사카 요도야바시 스테이션 미나미", desc: "짐 맡기기", mapQuery: "Toyoko Inn Osaka Yodoyabashi-eki Minami", remark: "약 11:50 도착 예상" },
  { id: "d1-3", day: 1, time: "12:00", tag: "food", title: "숙소 근처 점심", desc: "식당 미정, 현지에서 즉흥 결정", mapQuery: "Yodoyabashi", remark: "" },
  { id: "d1-4", day: 1, time: "13:00", tag: "food", title: "요도야바시/기타하마 카페", desc: "", mapQuery: "Kitahama", remark: "" },
  { id: "d1-5", day: 1, time: "14:30", tag: "normal", title: "숙소 체크인", desc: "", mapQuery: "Toyoko Inn Osaka Yodoyabashi-eki Minami", remark: "" },
  { id: "d1-6", day: 1, time: "15:00", tag: "normal", title: "숙소에서 휴식", desc: "", mapQuery: "", remark: "" },
  { id: "d1-7", day: 1, time: "15:30", tag: "shop", title: "다이마루 백화점/파르코 쇼핑", desc: "닌텐도샵, GU 등", mapQuery: "Daimaru Shinsaibashi", remark: "" },
  { id: "d1-8", day: 1, time: "17:00", tag: "normal", title: "신사이바시 → 도톤보리 이동", desc: "지하철", mapQuery: "Shinsaibashi Station", remark: "" },
  { id: "d1-9", day: 1, time: "18:00", tag: "food", title: "저녁식사 (도톤보리)", desc: "식당 미정, 현지에서 즉흥 결정", mapQuery: "Dotonbori", remark: "시간 추정치" },
  { id: "d1-10", day: 1, time: "19:30", tag: "sight", title: "도톤보리 구경", desc: "글리코상 등", mapQuery: "Glico Man Sign", remark: "시간 추정치" },

  { id: "d2-1", day: 2, time: "07:40", tag: "normal", title: "버스 탑승 (도톤보리 츠루동탄 소에몬초점 앞)", desc: "교토버스투어 집합", mapQuery: "Tsurutontan Soemoncho", remark: "" },
  { id: "d2-2", day: 2, time: "08:00", tag: "normal", title: "버스 출발", desc: "", mapQuery: "", remark: "" },
  { id: "d2-3", day: 2, time: "09:00", tag: "sight", title: "나라 사슴공원 + 동대사", desc: "09:00~10:40", mapQuery: "Nara Park", remark: "" },
  { id: "d2-4", day: 2, time: "12:00", tag: "sight", title: "아라시야마", desc: "12:00~14:40", mapQuery: "Arashiyama", remark: "" },
  { id: "d2-5", day: 2, time: "15:20", tag: "sight", title: "청수사", desc: "15:20~17:00", mapQuery: "Kiyomizu-dera", remark: "" },
  { id: "d2-6", day: 2, time: "18:00", tag: "normal", title: "닛폰바시 하차", desc: "", mapQuery: "Nippombashi Station", remark: "" },
  { id: "d2-7", day: 2, time: "18:30", tag: "food", title: "저녁식사 (도톤보리 또는 우메다)", desc: "식당 미정, 현지에서 즉흥 결정", mapQuery: "", remark: "시간 추정치" },
  { id: "d2-8", day: 2, time: "21:00", tag: "normal", title: "숙소 복귀", desc: "", mapQuery: "Toyoko Inn Osaka Yodoyabashi-eki Minami", remark: "예상 시간" },

  { id: "d3-1", day: 3, time: "07:30", tag: "normal", title: "숙소 → USJ 이동", desc: "택시 약 20분 또는 지하철 약 40분", mapQuery: "Universal Studios Japan", remark: "08:30 오픈 전 도착 목표, 시간 추정치" },
  { id: "d3-2", day: 3, time: "08:30", tag: "theme", title: "USJ 입장", desc: "익스프레스 패스 사용", mapQuery: "Universal Studios Japan", remark: "" },
  { id: "d3-3", day: 3, time: "시간무관", tag: "theme", title: "플라잉 다이너소어", desc: "익스프레스 패스", mapQuery: "The Flying Dinosaur Universal Studios Japan", remark: "예약 시간 지정 없음" },
  { id: "d3-4", day: 3, time: "10:00", tag: "theme", title: "미니언 메이헴", desc: "익스프레스 패스, 10:00~10:30", mapQuery: "Despicable Me Minion Mayhem Universal Studios Japan", remark: "" },
  { id: "d3-5", day: 3, time: "12:20", tag: "theme", title: "슈퍼 마리오 닌텐도 월드", desc: "익스프레스 패스, 12:20~13:20", mapQuery: "Super Nintendo World Universal Studios Japan", remark: "" },
  { id: "d3-6", day: 3, time: "12:20", tag: "theme", title: "마리오카트: 쿠파의 도전장", desc: "익스프레스 패스, 12:20~12:50", mapQuery: "Mario Kart Koopa's Challenge Universal Studios Japan", remark: "닌텐도월드 내" },
  { id: "d3-7", day: 3, time: "12:50", tag: "theme", title: "동키콩의 크레이지 트램카", desc: "익스프레스 패스, 12:50~13:20", mapQuery: "Mine Cart Madness Universal Studios Japan", remark: "닌텐도월드 내" },
  { id: "d3-8", day: 3, time: "시간무관", tag: "theme", title: "해리포터 포비든 저니", desc: "익스프레스 패스", mapQuery: "Harry Potter and the Forbidden Journey Universal Studios Japan", remark: "예약 시간 지정 없음" },
  { id: "d3-9", day: 3, time: "18:00", tag: "theme", title: "할로윈 이벤트", desc: "저녁에 잠깐 관람 예정", mapQuery: "Universal Studios Japan", remark: "" },
  { id: "d3-10", day: 3, time: "19:30", tag: "normal", title: "USJ 퇴장", desc: "할로윈 이벤트 관람 후 퇴장", mapQuery: "Universal Studios Japan", remark: "" },
  { id: "d3-11", day: 3, time: "20:00", tag: "food", title: "저녁식사 (우메다)", desc: "식당 미정, 현지에서 즉흥 결정", mapQuery: "Umeda", remark: "시간 추정치" },
  { id: "d3-12", day: 3, time: "21:30", tag: "normal", title: "숙소 복귀", desc: "", mapQuery: "Toyoko Inn Osaka Yodoyabashi-eki Minami", remark: "예상 시간" },

  { id: "d4-1", day: 4, time: "10:00", tag: "normal", title: "숙소 체크아웃", desc: "", mapQuery: "Toyoko Inn Osaka Yodoyabashi-eki Minami", remark: "" },
  { id: "d4-2", day: 4, time: "10:15", tag: "normal", title: "짐 보관 (난카이난바 또는 난바역 코인라커)", desc: "정확한 위치 미정", mapQuery: "Nankai Namba Station", remark: "" },
  { id: "d4-3", day: 4, time: "10:30", tag: "sight", title: "오사카성 주변 + 요미우리TV 코난 거리", desc: "", mapQuery: "Osaka Castle", remark: "" },
  { id: "d4-4", day: 4, time: "12:30", tag: "food", title: "점심", desc: "식당 미정, 현지에서 즉흥 결정", mapQuery: "", remark: "시간 추정치" },
  { id: "d4-5", day: 4, time: "13:30", tag: "shop", title: "난바/도톤보리 쇼핑 및 시내 구경", desc: "남은 쇼핑 마무리", mapQuery: "Namba", remark: "시간 추정치" },
  { id: "d4-6", day: 4, time: "15:00", tag: "normal", title: "난카이난바 이동 (짐 찾기)", desc: "", mapQuery: "Nankai Namba Station", remark: "16:00 라피트 탑승 전 도착 목표" },
  { id: "d4-7", day: 4, time: "16:00", tag: "normal", title: "난카이난바 → 간사이공항 (라피트 α29호)", desc: "3호차 21·22번, 16:00→16:41 예약완료", mapQuery: "Nankai Namba Station", remark: "" },
  { id: "d4-8", day: 4, time: "19:00", tag: "normal", title: "✈️ 간사이공항 → 김해공항 (7C1354)", desc: "19:00 출발 → 20:35 도착", mapQuery: "Kansai International Airport", remark: "" },
];

// 체크리스트 탭 "참고정보" 섹션에 노출되는 항목 (탭하면 고정 카드 팝업이 열림)
const REFERENCE_ITEMS = [
  { id: "ref-japanese-phrases", title: "🗣️ 자주 쓰는 일본어" },
  { id: "ref-shopping-list", title: "🛒 쇼핑리스트" },
  { id: "ref-food-list", title: "🥩 야끼니꾸 부위 사전" },
  { id: "ref-shopping-stores", title: "🛍️ 쇼핑 추천 매장" },
  { id: "ref-airport-station", title: "✈️ 간사이 공항 ↔ 난바역 이동" },
];

// "자주쓰는 일본어" 카드에 노출되는 표현 목록 (category별로 묶어 표시)
// 필드: category(그룹명, 이모지 포함) / ko(한국어) / ja(일본어) / pron(한글 발음)
// 예: { category: "🙋 인사·기본", ko: "감사합니다", ja: "ありがとうございます", pron: "아리가토 고자이마스" }
const JAPANESE_PHRASES = [
  { category: "🙋 인사·기본", ko: "안녕하세요", ja: "こんにちは", pron: "콘니치와" },
  { category: "🙋 인사·기본", ko: "감사합니다", ja: "ありがとうございます", pron: "아리가토 고자이마스" },
  { category: "🙋 인사·기본", ko: "죄송합니다/실례합니다", ja: "すみません", pron: "스미마센" },
  { category: "🙋 인사·기본", ko: "네", ja: "はい", pron: "하이" },
  { category: "🙋 인사·기본", ko: "아니요", ja: "いいえ", pron: "이이에" },
  { category: "🙋 인사·기본", ko: "괜찮아요", ja: "大丈夫です", pron: "다이죠부데스" },
  { category: "🙋 인사·기본", ko: "일본어 잘 못해요", ja: "日本語はあまり話せません", pron: "니혼고와 아마리 하나세마센" },
  { category: "🍜 식당·주문", ko: "이거 주세요", ja: "これください", pron: "코레 쿠다사이" },
  { category: "🍜 식당·주문", ko: "맛있어요", ja: "おいしいです", pron: "오이시이데스" },
  { category: "🍜 식당·주문", ko: "계산해주세요", ja: "お会計お願いします", pron: "오카이케이 오네가이시마스" },
  { category: "🍜 식당·주문", ko: "물 주세요", ja: "お水ください", pron: "오미즈 쿠다사이" },
  { category: "🍜 식당·주문", ko: "추천 메뉴가 뭐예요?", ja: "おすすめは何ですか", pron: "오스스메와 난데스카" },
  { category: "🛍️ 쇼핑", ko: "이거 얼마예요?", ja: "これいくらですか", pron: "코레 이쿠라데스카" },
  { category: "🛍️ 쇼핑", ko: "세일해요?", ja: "セール中ですか", pron: "세-루츄-데스카" },
  { category: "🛍️ 쇼핑", ko: "면세 되나요?", ja: "免税できますか", pron: "멘제이 데키마스카" },
  { category: "🛍️ 쇼핑", ko: "카드 되나요?", ja: "カード使えますか", pron: "카-도 츠카에마스카" },
  { category: "🛍️ 쇼핑", ko: "짐 맡길 수 있나요?", ja: "荷物を預けられますか", pron: "니모츠오 아즈케라레마스카" },
  { category: "🛍️ 쇼핑", ko: "현금만 되나요?", ja: "現金のみですか", pron: "겐킨노미데스카" },
  { category: "🛍️ 쇼핑", ko: "분할결제 되나요?", ja: "分割払いできますか", pron: "분카츠바라이 데키마스카" },
  { category: "🛍️ 쇼핑", ko: "사진 찍어도 되나요?", ja: "写真を撮ってもいいですか", pron: "샤신오 톳테모 이이데스카" },
  { category: "🚉 길찾기·교통", ko: "○○역 어디예요?", ja: "○○駅はどこですか", pron: "○○에키와 도코데스카" },
  { category: "🚉 길찾기·교통", ko: "여기까지 가주세요(택시)", ja: "ここまでお願いします", pron: "코코마데 오네가이시마스" },
  { category: "🚉 길찾기·교통", ko: "화장실 어디예요?", ja: "トイレはどこですか", pron: "토이레와 도코데스카" },
  { category: "🚨 긴급", ko: "도와주세요", ja: "助けてください", pron: "타스케테 쿠다사이" },
  { category: "🚨 긴급", ko: "한국어 하시는 분 있나요?", ja: "韓国語できる方いますか", pron: "캉코쿠고 데키루 카타 이마스카" },
];

// ---------------- 참고정보: 쇼핑 추천 매장 (표) ----------------
// 필드명은 다른 여행에서도 그대로 재사용 가능하도록 통일함: name/area/hours/recommend/mapQuery
// (image 필드는 2026-07-26 결정으로 제거됨 — 매장 사진은 소싱하지 않는다. changelog 참고)
// 일정별 활용
// 9/21 신사이바시: 위스키 + 신사이바시 쇼핑 + 돈키
// 9/22 닛폰바시: 코난/애니메이션 굿즈
// 9/23 USJ: 코난 콜라보 굿즈
// 9/24 우메다: 피크민 + 닌텐도 + 마지막 쇼핑
// hours는 2026년 9월 15일 기준 확인값이며, 방문 전 공식 채널 재확인 권장
const SHOPPING_STORES = [
  { name: "다이마루 신사이바시점", area: "신사이바시", hours: "10:00~20:00", recommend: "닌텐도 오사카, 명품관, 식품관, 택스프리 카운터(본관 9층)", mapQuery: "다이마루 신사이바시" },
  { name: "신사이바시 PARCO", area: "신사이바시", hours: "10:00~20:00 (지하 식당가는 ~21:00, 일부 층 상이)", recommend: "포켓몬센터 오사카 굿즈, 일본 패션·잡화·콜라보 상품 탐색", mapQuery: "신사이바시 파르코" },
  { name: "신사이바시스지 상점가", area: "신사이바시", hours: "점포별 상이", recommend: "일본 패션, 잡화, 생활용품, 드럭스토어 등 다양한 쇼핑", mapQuery: "신사이바시스지 상점가" },
  { name: "Whisky Bank Osaka", area: "신사이바시", hours: "12:30~21:30", recommend: "히비키·하쿠슈 등 재패니즈 위스키 탐색, 위스키 전문점", mapQuery: "Whisky Bank Osaka" },
  { name: "愛華貿易株式会社", area: "미나미센바·신사이바시", hours: "10:00~22:00", recommend: "재패니즈 위스키 전문점, 히비키·하쿠슈 등 프리미엄 위스키 탐색", mapQuery: "愛華貿易株式会社 大阪" },
  { name: "リカーマウンテン 東心斎橋店", area: "히가시신사이바시", hours: "17:00~04:00", recommend: "재패니즈 위스키·주류 폭넓게 탐색, 늦은 시간 방문 가능", mapQuery: "リカーマウンテン 東心斎橋店" },
  { name: "돈키호테 도톤보리점", area: "도톤보리", hours: "24시간", recommend: "과자·화장품 면세쇼핑, 생활용품·여행 기념품 보충 쇼핑, 7층 면세 카운터", mapQuery: "돈키호테 도톤보리점" },
  { name: "다카시마야 오사카점", area: "난바", hours: "10:00~20:00", recommend: "일본 로컬 브랜드, 식품관, 난바 다이닝 메종(7~9층)", mapQuery: "다카시마야 오사카점" },
  { name: "KINGRAM LIQUOR namba", area: "난바", hours: "10:30~19:00", recommend: "위스키·주류 판매점, 난바 일정에서 추가 탐색용", mapQuery: "KINGRAM LIQUOR namba" },
  { name: "애니메이트 오사카 일본바시", area: "닛폰바시", hours: "평일 11:00~20:00 / 주말·공휴일 10:00~20:00", recommend: "코난 등 애니메이션 굿즈, 만화, 캐릭터 상품, 트레이딩 굿즈", mapQuery: "애니메이트 오사카 일본바시" },
  { name: "만다라케 그랜드카오스", area: "닛폰바시", hours: "12:00~20:00", recommend: "중고·희귀 애니메이션 굿즈, 오래된 코난 굿즈 탐색", mapQuery: "만다라케 그랜드카오스 오사카" },
  { name: "UNIVERSAL STUDIOS JAPAN", area: "USJ", hours: "당일 운영시간 확인", recommend: "명탐정 코난×백 투 더 퓨처 25주년 콜라보 굿즈, USJ 한정 상품", mapQuery: "유니버설 스튜디오 재팬" },
  { name: "한큐백화점 우메다 본점", area: "우메다", hours: "10:00~20:00", recommend: "지하 식품관 디저트, 프리미엄 브랜드관", mapQuery: "한큐백화점 우메다 본점" },
  { name: "Nintendo OSAKA", area: "우메다·LUCUA", hours: "10:00~20:00", recommend: "피크민 공식 굿즈, 닌텐도 한정 상품, 게임 캐릭터 굿즈", mapQuery: "Nintendo OSAKA" },
  { name: "요도바시 카메라 멀티미디어 우메다", area: "우메다", hours: "09:30~22:00", recommend: "전자제품, 여행용품, 충전기·케이블, 카메라·생활가전", mapQuery: "요도바시 카메라 멀티미디어 우메다" },
];

// ---------------- 참고정보: 쇼핑리스트 / 꼭 먹어야 할 음식 공통 데이터 구조 ----------------
// group: 그룹 제목(이모지 포함) / items: { title, desc(한줄 설명), mapQuery } 배열
// 이 구조는 쇼핑리스트·음식 카드가 공유하며, 다른 여행 데이터로도 그대로 재사용 가능함
const SHOPPING_LIST = [
  {
    group: "🌱 피크민",
    items: [
      { title: "피크민 마스코트", desc: "Nintendo OSAKA 공식 피크민 굿즈, 여행 기념으로 가장 추천", mapQuery: "Nintendo OSAKA" },
      { title: "피크민 인형", desc: "빨강·노랑·파랑 등 다양한 피크민을 고를 수 있는 대표 굿즈", mapQuery: "Nintendo OSAKA" },
      { title: "피크민 키홀더", desc: "부피가 작아 여행 기념품으로 좋음", mapQuery: "Nintendo OSAKA" },
      { title: "피크민 스티커", desc: "가격 부담이 적고 여행 기록용으로 활용하기 좋은 굿즈", mapQuery: "Nintendo OSAKA" },
      { title: "피크민 미니토트", desc: "실용성과 피크민 굿즈를 함께 챙길 수 있는 상품", mapQuery: "Nintendo OSAKA" },
      { title: "피크민 문구·생활잡화", desc: "클리어파일, 배지, 클립, 포스트잇 등 일본 공식 스토어 상품 탐색", mapQuery: "Nintendo OSAKA" },
    ],
  },
  {
    group: "🕵️‍♀️ 코난",
    items: [
      { title: "USJ 코난×백 투 더 퓨처 굿즈", desc: "2026년 USJ 25주년 기념 콜라보, 9/9부터 판매", mapQuery: "ユニバーサル・スタジオ・ジャパン" },
      { title: "코난 캐릭터 굿즈", desc: "아크릴스탠드·키링·뱃지 등 애니메이트에서 탐색", mapQuery: "애니메이트 오사카 일본바시" },
      { title: "코난 중고·레어 굿즈", desc: "과거 상품이나 현재 일반 매장에서 찾기 어려운 굿즈 탐색", mapQuery: "만다라케 그랜드카오스 오사카" },
      { title: "코난 오사카성 본진 굿즈", desc: "2026 오사카성 SPECIAL SHOP 현장 판매는 종료, 온라인 판매만 9/30까지 진행", mapQuery: "MIRAIZA大阪城" },
    ],
  },
  {
    group: "🥃 재패니즈 위스키",
    items: [
      { title: "히비키 JAPANESE HARMONY", desc: "700ml 공식 희망소매가격 8,000엔(세전), 면세 기준 약 8,000엔이면 매우 좋은 구매", mapQuery: "Whisky Bank Osaka" },
      { title: "하쿠슈", desc: "700ml 공식 희망소매가격 16,000엔(세전), 시중 프리미엄 여부를 반드시 확인", mapQuery: "愛華貿易株式会社 大阪" },
      { title: "야마자키", desc: "일본 대표 싱글몰트, 가격이 정가에 가까울 때 우선 고려", mapQuery: "リカーマウンテン 東心斎橋店" },
      { title: "치타", desc: "히비키·하쿠슈보다 접근성이 좋은 산토리 위스키", mapQuery: "Whisky Bank Osaka" },
      { title: "니카 위스키", desc: "일본 위스키 입문용 및 선물용으로 탐색", mapQuery: "KINGRAM LIQUOR namba" },
    ],
  },
  {
    group: "🥃 위스키 구매 팁",
    items: [
      { title: "면세", desc: "외국인 여행자는 조건 충족 시 주류도 면세 가능. 같은 매장·같은 날 소비품 세전 5,000엔 이상 50만엔 이하가 기본 기준", mapQuery: "돈키호테 도톤보리점" },
      { title: "히비키 가격 기준", desc: "700ml 공식 희망소매가격은 세전 8,000엔. 세금 포함 8,800엔 전후면 좋은 가격", mapQuery: "Whisky Bank Osaka" },
      { title: "하쿠슈 가격 기준", desc: "700ml 공식 희망소매가격은 세전 16,000엔. 세금 포함 17,600엔 전후면 좋은 가격", mapQuery: "愛華貿易株式会社 大阪" },
      { title: "구매 전 확인", desc: "인기 위스키는 정가보다 높은 가격에 판매될 수 있으므로 가격표 확인 후 구매", mapQuery: "リカーマウンテン 東心斎橋店" },
    ],
  },
  {
    group: "🍫 일본 한정 먹거리",
    items: [
      { title: "지역 한정 과자", desc: "한국에서 쉽게 구하기 어려운 일본 지역·기간 한정 과자", mapQuery: "돈키호테 도톤보리점" },
      { title: "말차 과자", desc: "일본 여행 기념으로 좋은 말차 초콜릿·쿠키·웨하스", mapQuery: "돈키호테 도톤보리점" },
      { title: "일본 조미료", desc: "후리카케·소스·육수 등 일본에서 다양하게 구할 수 있는 식재료", mapQuery: "돈키호테 도톤보리점" },
    ],
  },
  {
    group: "🧴 일본 생활·뷰티",
    items: [
      { title: "일본 한정 화장품", desc: "한국에서도 판매되는 제품보다 일본 현지 한정·신제품 위주로 구매", mapQuery: "돈키호테 도톤보리점" },
      { title: "일본 선크림", desc: "아넷사·비오레 등 일본 인기 제품은 한국 판매가와 비교 후 구매", mapQuery: "돈키호테 도톤보리점" },
      { title: "일본 생활용품", desc: "파스·입욕제·여행용품 등 일본에서 종류가 다양한 제품", mapQuery: "돈키호테 도톤보리점" },
    ],
  },
  {
    group: "🎁 오사카 기념품",
    items: [
      { title: "오사카 한정 과자", desc: "오사카 지역 한정 패키지 위주로 선택", mapQuery: "돈키호테 도톤보리점" },
      { title: "포켓몬센터 오사카", desc: "포켓몬 공식 굿즈샵, 신사이바시 PARCO 내 위치", mapQuery: "포켓몬센터 오사카 파르코" },
      { title: "오사카 캐릭터 굿즈", desc: "일본에서만 만나기 쉬운 지역·캐릭터 콜라보 상품", mapQuery: "PARCO 신사이바시" },
    ],
  },
];

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

// ---------------- 참고정보: 야끼니꾸 부위 사전 ----------------
// FOOD_LIST(group/items 공통 구조) 대신 야끼니꾸 부위 전용 구조로 채움.
// 부위 사전: jp(일본어 메뉴명) / kr(한국어 대응 명칭) / texture(식감·특징)
const YAKINIKU_MEAT = [
  // 소고기
  { jp: "カルビ", kr: "갈비살", texture: "지방감 있고 부드러움, 고소함" },
  { jp: "上カルビ", kr: "상갈비", texture: "마블링 풍부, 매우 부드럽고 고소함" },
  { jp: "特上カルビ", kr: "특상갈비", texture: "마블링 매우 풍부, 진하고 부드러움" },

  { jp: "ロース", kr: "등심", texture: "살코기 중심, 부드럽고 담백함" },
  { jp: "上ロース", kr: "상등심", texture: "부드럽고 육향이 좋음" },
  { jp: "特上ロース", kr: "특상등심", texture: "마블링과 육향이 좋고 매우 부드러움" },

  { jp: "ハラミ", kr: "안창살", texture: "육향이 진하고 부드러움, 적당한 지방감" },
  { jp: "上ハラミ", kr: "상안창살", texture: "육향 진하고 부드러우며 육즙 풍부함" },
  { jp: "サガリ", kr: "토시살 계열", texture: "하라미와 비슷하며 담백하고 부드러움" },

  { jp: "ミスジ", kr: "부채살", texture: "부드럽고 육즙이 많음, 적당한 지방감" },
  { jp: "カイノミ", kr: "토시살·플랩 계열", texture: "갈비와 가까운 진한 육향, 부드러움" },
  { jp: "イチボ", kr: "우둔살·뒷다리 계열", texture: "살코기감과 적당한 지방, 육향이 좋음" },
  { jp: "ランプ", kr: "우둔·설도 계열", texture: "담백하고 탄탄한 살코기, 육향이 좋음" },
  { jp: "マルシン", kr: "우둔 안쪽 부위", texture: "담백하고 부드러운 살코기" },

  { jp: "ヒレ", kr: "안심", texture: "지방이 적고 매우 부드러움, 담백함" },
  { jp: "シャトーブリアン", kr: "샤토브리앙", texture: "안심 중에서도 매우 부드럽고 담백함" },

  { jp: "ザブトン", kr: "살치살 계열", texture: "마블링 풍부, 부드럽고 고소함" },
  { jp: "カタロース", kr: "목심·어깨 등심 계열", texture: "육향이 진하고 적당히 탄탄함" },

  // 우설
  { jp: "タン", kr: "우설", texture: "쫄깃하고 담백함" },
  { jp: "上タン", kr: "상우설", texture: "일반 우설보다 부드럽고 육즙이 풍부함" },
  { jp: "厚切りタン", kr: "두툼한 우설", texture: "두껍고 쫄깃하며 육즙 풍부함" },
  { jp: "タン元", kr: "우설 뿌리", texture: "우설 중 지방감이 많고 매우 부드러움" },
  { jp: "タン先", kr: "우설 끝부분", texture: "탄탄하고 쫄깃한 식감" },
];

const YAKINIKU_HORUMON = [
  { jp: "ホルモン", kr: "소 내장류", texture: "부위에 따라 다르며 대체로 쫄깃하고 고소함" },
  { jp: "マルチョウ", kr: "소창·곱창", texture: "지방이 많고 매우 고소하며 탱글탱글함" },
  { jp: "シマチョウ", kr: "대창 계열", texture: "쫄깃하고 지방감 풍부함" },
  { jp: "ミノ", kr: "양", texture: "꼬들꼬들하고 오독오독함, 담백함" },
  { jp: "上ミノ", kr: "특수 양", texture: "일반 미노보다 두툼하고 부드러우면서 꼬들함" },
  { jp: "ハツ", kr: "소 심장", texture: "탄탄하고 쫄깃함, 담백함" },
  { jp: "ハツモト", kr: "심장 대동맥 주변", texture: "오독오독하고 탄탄함" },
  { jp: "レバー", kr: "간", texture: "부드럽고 촉촉하며 진한 풍미" },
  { jp: "センマイ", kr: "천엽", texture: "얇고 꼬들꼬들하며 담백함" },
  { jp: "ギアラ", kr: "소 위 4번째 부위", texture: "쫄깃하고 지방감 있으며 고소함" },
  { jp: "コブクロ", kr: "자궁", texture: "꼬들꼬들하고 탄탄함" },
  { jp: "シビレ", kr: "췌장·흉선", texture: "부드럽고 크리미하며 고소함" },
  { jp: "テッポウ", kr: "직장", texture: "두툼하고 쫄깃하며 씹는 맛이 강함" },
  { jp: "ハチノス", kr: "벌집위", texture: "오돌오돌하고 탄탄함" },
];

const YAKINIKU_PORK = [
  { jp: "豚カルビ", kr: "돼지갈비", texture: "지방감 있고 부드러움, 고소함" },
  { jp: "豚トロ", kr: "돼지목덜미살", texture: "지방이 많고 탱글탱글하며 고소함" },
  { jp: "豚バラ", kr: "삼겹살", texture: "지방과 살코기가 층층이 있어 고소하고 부드러움" },
  { jp: "豚ロース", kr: "돼지등심", texture: "살코기 중심, 담백하고 탄탄함" },
  { jp: "豚ハラミ", kr: "돼지 안창살", texture: "육향이 진하고 쫄깃함" },
  { jp: "豚タン", kr: "돼지 우설", texture: "쫄깃하고 담백함" },
  { jp: "豚ホルモン", kr: "돼지 내장", texture: "부위에 따라 다르며 쫄깃하고 고소함" },
];

const YAKINIKU_CHICKEN = [
  { jp: "鶏もも", kr: "닭다리살", texture: "부드럽고 육즙이 많음" },
  { jp: "鶏むね", kr: "닭가슴살", texture: "담백하고 비교적 탄탄함" },
  { jp: "せせり", kr: "닭목살", texture: "쫄깃하고 지방감 있어 고소함" },
  { jp: "やげん軟骨", kr: "닭 연골", texture: "오독오독하고 담백함" },
  { jp: "ぼんじり", kr: "닭꼬리살", texture: "지방이 많고 탱글탱글하며 고소함" },
];

// 메뉴판 수식어·용어: jp(표기) / kr(한국어) / meaning(의미)
const YAKINIKU_MODIFIERS = [
  { jp: "上", kr: "상급", meaning: "해당 부위의 상급 부위" },
  { jp: "特上", kr: "특상", meaning: "해당 부위의 특상급" },
  { jp: "極上", kr: "최상급", meaning: "최상급을 강조하는 표현" },

  { jp: "厚切り", kr: "두꺼운", meaning: "두껍게 썬 스타일" },
  { jp: "薄切り", kr: "얇은", meaning: "얇게 썬 스타일" },

  { jp: "塩", kr: "소금", meaning: "소금 간" },
  { jp: "タレ", kr: "양념", meaning: "간장 계열 등의 양념" },
  { jp: "味噌", kr: "미소", meaning: "미소 양념" },
  { jp: "ネギ", kr: "파", meaning: "파를 곁들임" },
  { jp: "ネギ塩", kr: "파소금", meaning: "파와 소금 양념" },

  { jp: "盛り合わせ", kr: "모둠", meaning: "여러 부위를 한 접시에 구성" },
  { jp: "食べ比べ", kr: "비교 모둠", meaning: "여러 부위를 비교해서 먹는 구성" },
  { jp: "切り落とし", kr: "자투리·절단육", meaning: "여러 부위에서 잘라낸 고기" },
];
