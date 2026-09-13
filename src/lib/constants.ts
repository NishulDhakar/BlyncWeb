export const APP_PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=co.lynde.bfwhv";

export const APP_STORE_URL = APP_PLAY_STORE_URL;

/** Hiring-company logos scraped into /public/scraped — used in the marquee. */
export const COMPANY_LOGOS: { src: string; name: string }[] = [
  { src: "/scraped/logo-img14.png", name: "TCS" },
  { src: "/scraped/logo-img05.png", name: "Infosys" },
  { src: "/scraped/logo-img08.png", name: "Accenture" },
  { src: "/scraped/logo-img01.png", name: "Capgemini" },
  { src: "/scraped/logo-img02.png", name: "Cognizant" },
  { src: "/scraped/logo-img03.png", name: "Tech Mahindra" },
  { src: "/scraped/logo-img04.png", name: "Mindtree" },
  { src: "/scraped/logo-img06.png", name: "Deloitte" },
  { src: "/scraped/logo-img07.png", name: "J.P. Morgan" },
  { src: "/scraped/logo-img09.png", name: "Goldman Sachs" },
  { src: "/scraped/logo-img10.png", name: "EY" },
  { src: "/scraped/logo-img15.png", name: "KPMG" },
  { src: "/scraped/logo-img13.png", name: "Salesforce" },
  { src: "/scraped/logo-img12.png", name: "GreyB" },
];

export type Course = {
  slug: string;
  title: string;
  image: string;
  category: "Full Prep" | "Company-Specific" | "Mock Tests" | "Mentorship";
  tagline: string;
  bullets: string[];
  price: number;
  mrp: number;
  rating: number;
  learners: string;
  badge?: string;
  featured?: boolean;
};

export const COURSES: Course[] = [
  {
    slug: "aarambh-1",
    title: "AARAMBH 1.0",
    image: "/scraped/AARAMBH1.0banner.jpeg",
    category: "Full Prep",
    tagline: "Fully recorded placement batch for 2026 & 2027 — aptitude to coding, mocks built in.",
    bullets: [
      "Aptitude + Verbal + Logical Reasoning",
      "Coding, SQL & DSA (zero to hero)",
      "Weekly mock tests + all-India rank",
      "E-books, practice sets & lifetime access",
      "Completion certificate",
    ],
    price: 1199,
    mrp: 1999,
    rating: 4.8,
    learners: "12,000+",
    badge: "Most Popular",
    featured: true,
  },
  {
    slug: "sankalp-9",
    title: "New Sankalp Batch 9.0",
    image: "/scraped/sankalp-7.0new.jpeg",
    category: "Full Prep",
    tagline: "One live batch with everything you need for the 2027 placement season.",
    bullets: [
      "150+ hrs live classes + recordings",
      "Quant, Logical & Verbal Ability",
      "DSA & coding with pseudocode",
      "Lakshya + topic-wise + company-wise mocks",
      "Resume & GD preparation",
    ],
    price: 1799,
    mrp: 2999,
    rating: 4.8,
    learners: "9,500+",
    badge: "Early Bird",
  },
  {
    slug: "tcs-nqt-lakshya",
    title: "TCS NQT Recorded + Lakshya Mock",
    image: "/scraped/TCS-RECORDED-Lakshya-mock-test.jpg",
    category: "Mock Tests",
    tagline: "Focused TCS NQT 2027 prep with the Lakshya mock series and 21-day challenge.",
    bullets: [
      "Daily one-shot recorded classes",
      "Advanced Aptitude, LR & Verbal",
      "DSA in C++, Java & Python",
      "Latest PYQs + 1000+ questions",
      "7 e-books with video solutions",
    ],
    price: 799,
    mrp: 1599,
    rating: 4.7,
    learners: "15,000+",
  },
  {
    slug: "sankalp-aptitude-live",
    title: "Sankalp Aptitude Batch (Live)",
    image: "/scraped/sankalp-aptitude-img01.jpg",
    category: "Full Prep",
    tagline: "Live + recorded aptitude preparation for every upcoming placement drive.",
    bullets: [
      "4 live classes every week",
      "500+ recorded videos",
      "Topic-wise + full-length mocks",
      "Interview & company-specific prep",
      "3 e-books included",
    ],
    price: 999,
    mrp: 1999,
    rating: 4.7,
    learners: "8,000+",
  },
  {
    slug: "infosys-prep",
    title: "Infosys Prep Course",
    image: "/scraped/infosys-prep01.jpg",
    category: "Company-Specific",
    tagline: "Complete preparation for Infosys SE, DSE & SP hiring — based on the latest pattern.",
    bullets: [
      "Latest Infosys pattern + PYQs",
      "Live + recorded classes",
      "Pseudocode + DSA coding",
      "Mock tests for DSE & SP roles",
      "7+ e-books, 1000+ questions",
    ],
    price: 999,
    mrp: 2999,
    rating: 4.7,
    learners: "6,200+",
    badge: "Early Bird",
  },
  {
    slug: "accenture-prep",
    title: "Accenture Updated Prep",
    image: "/scraped/accenture-img.jpg",
    category: "Company-Specific",
    tagline: "Real questions asked in Accenture hiring — cognitive, technical & coding.",
    bullets: [
      "Cognitive & communication assessment",
      "MS Office, Networking, Cloud & CS",
      "Backend, Frontend & SQL coding",
      "Lakshya mock test series",
      "Placement-focused strategy",
    ],
    price: 699,
    mrp: 1499,
    rating: 4.6,
    learners: "5,400+",
  },
  {
    slug: "cognizant-prep",
    title: "Cognizant Updated Prep",
    image: "/scraped/new-cognizant-img.jpg",
    category: "Company-Specific",
    tagline: "All-in-one preparation for Cognizant GenC & GenC Next hiring.",
    bullets: [
      "Communication round",
      "Aptitude & game-based assessment",
      "SQL zero to hero",
      "Coding — Java, Python & all clusters",
      "Technical mock test series",
    ],
    price: 699,
    mrp: 999,
    rating: 4.6,
    learners: "4,900+",
  },
  {
    slug: "capgemini-prep",
    title: "Capgemini Preparation",
    image: "/scraped/new-capgeminig-mg.jpg",
    category: "Company-Specific",
    tagline: "Complete preparation for Capgemini hiring, based on the latest pattern.",
    bullets: [
      "Technical pseudocode",
      "Previous-year & topic-wise questions",
      "Tips, tricks & shortcuts",
      "Full mock test series",
      "Expert guidance",
    ],
    price: 699,
    mrp: 1299,
    rating: 4.6,
    learners: "4,100+",
  },
  {
    slug: "one-on-one-interview",
    title: "1:1 Interview Preparation",
    image: "/scraped/1-1-interview-img.jpg",
    category: "Mentorship",
    tagline: "Personalised mock interviews and HR strategy that actually get you hired.",
    bullets: [
      "1:1 live mentorship sessions",
      "500+ real interview questions",
      "HR + coding round preparation",
      "SQL interview question series",
      "ATS-friendly resume guidance",
    ],
    price: 1499,
    mrp: 2999,
    rating: 4.9,
    learners: "2,300+",
    badge: "High Impact",
  },
];

export const COURSE_CATEGORIES = [
  "All",
  "Full Prep",
  "Company-Specific",
  "Mock Tests",
  "Mentorship",
] as const;

/** Curated set of achiever poster cards from /public/scraped. */
export const ACHIEVER_IMAGES: string[] = [
  "Campusmonk-Acheivers-1",
  "Campusmonk-Acheivers-3",
  "Campusmonk-Acheivers-5",
  "Campusmonk-Acheivers-7",
  "Campusmonk-Acheivers-9",
]
  .map((n) => `/scraped/${n}.jpeg`)
  .concat(
    [
      3, 5, 8, 11, 14, 19, 22, 27, 33, 38, 41, 45, 50, 54, 58, 63, 68, 72, 77,
      81, 85, 90, 95, 101, 106, 110, 114,
    ].map((n) => `/scraped/achievers-img${String(n).padStart(2, "0")}.png`),
  );

export const FACULTY = [
  {
    name: "Rachit Rastogi Sir",
    role: "Founder · Quant & Logical Reasoning",
    image: "/scraped/Rachit-sir-Founder.png",
  },
  {
    name: "Itika Lamba Ma'am",
    role: "DSA, Pseudocode & SQL",
    image: "/scraped/Itika-Maam.png",
  },
  {
    name: "Okesh Chhabra Sir",
    role: "Verbal Ability & Communication",
    image: "/scraped/Okesh-sir.png",
  },
  {
    name: "Vishal Chhabra Sir",
    role: "GD-PI & Interview Skills",
    image: "/scraped/Vishal-sir.png",
  },
];
