import { API_ENDPOINTS, ChatRequest, ChatResponse, PdfUploadResponse, ChatHistoryTitle, ChatHistory, HealthCheckResponse, UpdateChatTitleRequest, ShareChatRequest, ShareChatResponse, SharedChatData } from "./api";
import { auth } from "@/lib/firebase";
import { getStoredToken, refreshStoredToken } from "@/lib/token-manager";

async function getAuthToken() {
  try {
    if (typeof window === "undefined") {
      return null;
    }

    // Get token from localStorage
    const storedToken = getStoredToken();
    if (!storedToken) {
      throw new Error("No stored token found");
    }

    return storedToken;
  } catch (error) {
    console.error("Error getting auth token:", error);
    throw error;
  }
}

export const updateChatTitle = async (chatId: string, title: string): Promise<void> => {
  const token = await getAuthToken();
  const requestBody: UpdateChatTitleRequest = {
    chat_id: chatId,
    title: title
  };

  const response = await fetch(API_ENDPOINTS.UPDATE_CHAT_TITLE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error("Failed to update chat title");
  }
};

export const sendChatMessage = async (
  message: string,
  extractedText: string,
  chatId: string | null,
  isAdvanced: boolean
): Promise<ChatResponse> => {
  const requestBody: ChatRequest = {
    extracted_text: extractedText,
    question: message,
    ...(chatId && { chat_id: chatId }),
  };

  const token = await getAuthToken();

  const response = await fetch(
    isAdvanced ? API_ENDPOINTS.CHAT_ADVANCED : API_ENDPOINTS.CHAT_BASIC,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to send chat message");
  }

  return response.json();
};

export const uploadPdf = async (file: File): Promise<PdfUploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  const token = await getAuthToken();

  const response = await fetch(API_ENDPOINTS.PDF_UPLOAD, {
    method: "POST",
    body: formData,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to upload PDF");
  }

  return response.json();
};

export const getChatHistoryTitles = async (): Promise<ChatHistoryTitle[]> => {
  try {
    const token = await getAuthToken();
    const response = await fetch(API_ENDPOINTS.CHAT_HISTORY_TITLES, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch chat history titles: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error in getChatHistoryTitles:", error);
    throw error;
  }
};

export const getChatHistory = async (chatId: string): Promise<ChatHistory> => {
  const token = await getAuthToken();
  const response = await fetch(`${API_ENDPOINTS.CHAT_HISTORY}/${chatId}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch chat history");
  }

  return response.json();
};

export const checkAdvancedServiceHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(API_ENDPOINTS.HEALTH_ADVANCED, {
      method: "GET",
      headers: {
        "accept": "application/json",
      },
    });

    if (!response.ok) {
      return false;
    }

    const data: HealthCheckResponse = await response.json();
    return data.detail.status === "healthy";
  } catch (error) {
    console.error("Error checking advanced service health:", error);
    return false;
  }
};

export const shareChat = async (chatId: string): Promise<ShareChatResponse> => {
  try {
    const token = await getAuthToken();
    const requestBody: ShareChatRequest = {
      chat_id: chatId
    };

    const response = await fetch(API_ENDPOINTS.SHARE_CHAT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error("Failed to share chat");
    }

    return response.json();
  } catch (error) {
    console.error("Error in shareChat:", error);
    throw error;
  }
};

export const fetchSharedChat = async (shareId: string): Promise<SharedChatData> => {
  try {
    const response = await fetch(`${API_ENDPOINTS.FETCH_SHARED}/${shareId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch shared chat");
    }

    return response.json();
  } catch (error) {
    console.error("Error in fetchSharedChat:", error);
    throw error;
  }
}; 