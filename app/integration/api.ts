export const BASE_URL = "http://127.0.0.1:8000";

export const API_ENDPOINTS = {
  CHAT_BASIC: `${BASE_URL}/chat-basic`,
  CHAT_ADVANCED: `${BASE_URL}/chat-advanced`,
  PDF_UPLOAD: `${BASE_URL}/pdf-upload`,
  CHAT_HISTORY_TITLES: `${BASE_URL}/chat-history/titles`,
  CHAT_HISTORY: `${BASE_URL}/chat-history`,
  HEALTH_ADVANCED: `${BASE_URL}/health/advanced`,
  SHARE_CHAT: `${BASE_URL}/share`,
  FETCH_SHARED: `${BASE_URL}/fetch`,
  UPDATE_CHAT_TITLE: `${BASE_URL}/chat-history/update-title`,
} as const;

export interface ChatRequest {
  extracted_text: string;
  question: string;
  chat_id?: string;
}

export interface ChatResponse {
  answer: string;
  chat_id: string;
  status: string;
}

export interface PdfUploadResponse {
  extracted_text: string;
}

export interface ChatHistoryTitle {
  chat_id: string;
  title: string;
  updated_at: string;
  created_at: string;
  chat_type: "basic" | "advanced" | "highlight";
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ChatHistory {
  chat_id: string;
  user_id: string;
  title: string;
  conversation: ChatMessage[];
}

export interface HealthCheckResponse {
  detail: {
    status: "healthy" | "unhealthy";
    error?: string;
    message?: string;
  };
}

export interface UpdateChatTitleRequest {
  chat_id: string;
  title: string;
}

export interface ShareChatRequest {
  chat_id: string;
}

export interface ShareChatResponse {
  share_id: string;
  message: string;
}

export interface SharedChatData extends ChatHistory {
  shared_at: string;
  shared_by: string;
} 