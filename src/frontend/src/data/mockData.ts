export type Category =
  | "Mohabbat"
  | "Dard"
  | "Zindagi"
  | "Dosti"
  | "Motivational";

export interface Poet {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
}

export interface Shayari {
  id: string;
  poetId: string;
  text: string;
  language: "urdu" | "hindi";
  category: Category;
  likes: number;
  liked: boolean;
  shares: number;
  tags: string[];
  createdAt: string;
}

export const poets: Poet[] = [
  {
    id: "1",
    name: "Mirza Ghalib Fan",
    handle: "@ghalib_fan",
    avatar: "/assets/generated/avatar-ghalib.dim_200x200.jpg",
    bio: "Ghazal lover. Heart full of dard. پیروِ غالب",
    followers: 12400,
    following: 340,
    posts: 87,
  },
  {
    id: "2",
    name: "Faiz Ahmad",
    handle: "@faiz_nazm",
    avatar: "/assets/generated/avatar-faiz.dim_200x200.jpg",
    bio: "انقلاب کا شاعر ۔ Rebel poet. Words that move mountains.",
    followers: 9800,
    following: 210,
    posts: 64,
  },
  {
    id: "3",
    name: "Parveen Shakir",
    handle: "@parveen_ink",
    avatar: "/assets/generated/avatar-parveen.dim_200x200.jpg",
    bio: "Poetry is my heartbeat. محبت کی شاعرہ",
    followers: 15600,
    following: 420,
    posts: 112,
  },
  {
    id: "4",
    name: "Sahir Ludhianvi",
    handle: "@sahir_ludhia",
    avatar: "/assets/generated/avatar-sahir.dim_200x200.jpg",
    bio: "Woh subah kabhi toh aayegi. فلسفی و شاعر",
    followers: 18200,
    following: 185,
    posts: 96,
  },
];

export const shayariList: Shayari[] = [
  {
    id: "1",
    poetId: "1",
    text: "دل کو تیری یاد ستاتی ہے ہر پل\nتجھ بن زندگی ادھوری لگتی ہے",
    language: "urdu",
    category: "Mohabbat",
    likes: 342,
    liked: false,
    shares: 56,
    tags: ["mohabbat", "yaad", "dil"],
    createdAt: "2026-03-20",
  },
  {
    id: "2",
    poetId: "2",
    text: "درد اتنا ہے دل میں\nآنسو بھی خشک ہو گئے",
    language: "urdu",
    category: "Dard",
    likes: 289,
    liked: false,
    shares: 41,
    tags: ["dard", "aansu", "dil"],
    createdAt: "2026-03-21",
  },
  {
    id: "3",
    poetId: "3",
    text: "زندگی ایک سفر ہے، منزل نہیں\nہر قدم پر نئی کہانی ہے",
    language: "urdu",
    category: "Zindagi",
    likes: 415,
    liked: false,
    shares: 73,
    tags: ["zindagi", "safar", "manzil"],
    createdAt: "2026-03-22",
  },
  {
    id: "4",
    poetId: "4",
    text: "دوستی وہ رشتہ ہے جو خون سے بھی گہرا ہوتا ہے\nسچا دوست خدا کی نعمت ہوتا ہے",
    language: "urdu",
    category: "Dosti",
    likes: 521,
    liked: false,
    shares: 88,
    tags: ["dosti", "yari", "rishta"],
    createdAt: "2026-03-23",
  },
  {
    id: "5",
    poetId: "1",
    text: "हर रात के बाद सवेरा होता है\nहर दर्द के बाद जीना होता है",
    language: "hindi",
    category: "Motivational",
    likes: 678,
    liked: false,
    shares: 112,
    tags: ["motivational", "hope", "zindagi"],
    createdAt: "2026-03-24",
  },
  {
    id: "6",
    poetId: "3",
    text: "तुम्हारी यादें दिल में बसी हैं\nजैसे रात में चाँद की रोशनी",
    language: "hindi",
    category: "Mohabbat",
    likes: 456,
    liked: false,
    shares: 65,
    tags: ["mohabbat", "yaad", "chand"],
    createdAt: "2026-03-25",
  },
  {
    id: "7",
    poetId: "2",
    text: "ज़िंदगी का हर लम्हा अनमोल है\nइसे खुशी से जियो, दिल खोल के",
    language: "hindi",
    category: "Zindagi",
    likes: 389,
    liked: false,
    shares: 59,
    tags: ["zindagi", "lamha", "khushi"],
    createdAt: "2026-03-26",
  },
  {
    id: "8",
    poetId: "4",
    text: "یہ جو دنیا ہے، یہاں ہر شخص اکیلا ہے\nپھر بھی ہم ایک دوسرے کو ڈھونڈتے ہیں",
    language: "urdu",
    category: "Dard",
    likes: 298,
    liked: false,
    shares: 47,
    tags: ["dard", "duniya", "akela"],
    createdAt: "2026-03-27",
  },
  {
    id: "9",
    poetId: "1",
    text: "दोस्त वो होता है जो मुसीबत में साथ दे\nखुशी में सभी होते हैं, दर्द में वो जो टूटे न",
    language: "hindi",
    category: "Dosti",
    likes: 502,
    liked: false,
    shares: 83,
    tags: ["dosti", "saath", "musibat"],
    createdAt: "2026-03-28",
  },
  {
    id: "10",
    poetId: "3",
    text: "उठो, बढ़ो, मंजिल पाओ\nहार मत मानो, जीत तुम्हारी है",
    language: "hindi",
    category: "Motivational",
    likes: 734,
    liked: false,
    shares: 124,
    tags: ["motivational", "jeet", "manzil"],
    createdAt: "2026-03-29",
  },
];

export const categoryColors: Record<Category, string> = {
  Mohabbat: "text-rose-400 bg-rose-400/10 border-rose-400/30",
  Dard: "text-purple-400 bg-purple-400/10 border-purple-400/30",
  Zindagi: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  Dosti: "text-sky-400 bg-sky-400/10 border-sky-400/30",
  Motivational: "text-gold bg-gold/10 border-gold/30",
};
