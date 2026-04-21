// Глобальное хранилище в localStorage

export interface ChatMessage {
  id: string;
  author: "client" | "admin";
  authorName: string;
  text: string;
  time: string;
}

export interface Order {
  id: string;
  nickname: string;
  product: string;
  description: string;
  deadline: string;
  tg: string;
  ds: string;
  vk: string;
  status: "new" | "in_progress" | "done" | "cancelled";
  createdAt: string;
  messages: ChatMessage[];
}

export interface Staff {
  id: string;
  nickname: string;
  password: string;
  role: string;
  works: number;
  experience: string;
  isOwner?: boolean;
}

export interface Review {
  id: string;
  nickname: string;
  text: string;
  rating: number;
  createdAt: string;
  approved: boolean;
  ip?: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  name: string;
  uploadedAt: string;
}

const STORAGE_KEYS = {
  orders: "pc_orders",
  staff: "pc_staff",
  reviews: "pc_reviews",
  gallery: "pc_gallery",
  clients: "pc_clients_count",
  currentUser: "pc_current_user",
};

// --- ORDERS ---
export function getOrders(): Order[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.orders) || "[]"); } catch { return []; }
}
export function saveOrders(orders: Order[]) {
  localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
}
export function addOrder(order: Omit<Order, "id" | "createdAt" | "messages" | "status">): Order {
  const orders = getOrders();
  const newOrder: Order = {
    ...order,
    id: Date.now().toString(),
    status: "new",
    createdAt: new Date().toLocaleString("ru-RU"),
    messages: [],
  };
  orders.unshift(newOrder);
  saveOrders(orders);
  incrementClients();
  return newOrder;
}
export function updateOrderStatus(id: string, status: Order["status"]) {
  const orders = getOrders();
  const idx = orders.findIndex(o => o.id === id);
  if (idx !== -1) { orders[idx].status = status; saveOrders(orders); }
}
export function deleteOrder(id: string) {
  const orders = getOrders().filter(o => o.id !== id);
  saveOrders(orders);
}
export function addMessageToOrder(orderId: string, msg: Omit<ChatMessage, "id" | "time">) {
  const orders = getOrders();
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx !== -1) {
    orders[idx].messages.push({
      ...msg,
      id: Date.now().toString(),
      time: new Date().toLocaleString("ru-RU"),
    });
    saveOrders(orders);
  }
}

// --- STAFF ---
export function getStaff(): Staff[] {
  const raw = localStorage.getItem(STORAGE_KEYS.staff);
  if (!raw) {
    const initial: Staff[] = [
      { id: "1", nickname: "xezze228", password: "ab030403042012", role: "Главный скинодел", works: 100, experience: "1 год", isOwner: true },
    ];
    localStorage.setItem(STORAGE_KEYS.staff, JSON.stringify(initial));
    return initial;
  }
  try { return JSON.parse(raw); } catch { return []; }
}
export function saveStaff(staff: Staff[]) {
  localStorage.setItem(STORAGE_KEYS.staff, JSON.stringify(staff));
}
export function addStaff(member: Omit<Staff, "id">) {
  const staff = getStaff();
  staff.push({ ...member, id: Date.now().toString() });
  saveStaff(staff);
}
export function removeStaff(id: string) {
  const staff = getStaff().filter(s => s.id !== id);
  saveStaff(staff);
}

// --- AUTH ---
export interface CurrentUser { nickname: string; isOwner: boolean; }
export function getCurrentUser(): CurrentUser | null {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.currentUser) || "null"); } catch { return null; }
}
export function loginUser(nickname: string, password: string): CurrentUser | null {
  const staff = getStaff();
  const member = staff.find(s => s.nickname === nickname && s.password === password);
  if (!member) return null;
  const user: CurrentUser = { nickname: member.nickname, isOwner: !!member.isOwner };
  localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(user));
  return user;
}
export function logoutUser() {
  localStorage.removeItem(STORAGE_KEYS.currentUser);
}

// --- REVIEWS ---
export function getReviews(): Review[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.reviews) || "[]"); } catch { return []; }
}
export function saveReviews(reviews: Review[]) {
  localStorage.setItem(STORAGE_KEYS.reviews, JSON.stringify(reviews));
}
export function addReview(review: Omit<Review, "id" | "createdAt" | "approved">, ip: string): Review | null {
  const reviews = getReviews();
  // Антиспам: не больше 1 отзыва с одного IP за 24ч
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const recentFromIp = reviews.filter(r => r.ip === ip && new Date(r.createdAt).getTime() > oneDayAgo);
  if (recentFromIp.length > 0) return null;
  const newReview: Review = {
    ...review,
    id: Date.now().toString(),
    createdAt: new Date().toLocaleString("ru-RU"),
    approved: false,
    ip,
  };
  reviews.unshift(newReview);
  saveReviews(reviews);
  return newReview;
}
export function approveReview(id: string) {
  const reviews = getReviews();
  const idx = reviews.findIndex(r => r.id === id);
  if (idx !== -1) { reviews[idx].approved = true; saveReviews(reviews); }
}
export function deleteReview(id: string) {
  saveReviews(getReviews().filter(r => r.id !== id));
}

// --- GALLERY ---
export function getGallery(): GalleryImage[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.gallery) || "[]"); } catch { return []; }
}
export function saveGallery(images: GalleryImage[]) {
  localStorage.setItem(STORAGE_KEYS.gallery, JSON.stringify(images));
}
export function addGalleryImage(img: Omit<GalleryImage, "id" | "uploadedAt">): GalleryImage {
  const gallery = getGallery();
  const newImg: GalleryImage = { ...img, id: Date.now().toString(), uploadedAt: new Date().toLocaleString("ru-RU") };
  gallery.unshift(newImg);
  saveGallery(gallery);
  return newImg;
}
export function deleteGalleryImage(id: string) {
  saveGallery(getGallery().filter(i => i.id !== id));
}

// --- CLIENTS COUNT ---
export function getClientsCount(): number {
  const val = localStorage.getItem(STORAGE_KEYS.clients);
  return val ? parseInt(val) : 100;
}
export function incrementClients() {
  localStorage.setItem(STORAGE_KEYS.clients, String(getClientsCount() + 1));
}
