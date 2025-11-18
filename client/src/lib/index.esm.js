class BaseAPI {
  constructor(config, encryptionService) {
    this.baseUrl = config.baseUrl;
    this.encryptionService = encryptionService;
    this.httpConfig = config.http;
  }

  async _makeRequest(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      this.httpConfig.timeout
    );

    let lastError;

    for (let attempt = 0; attempt <= this.httpConfig.retries; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            "Content-Type": "application/json",
            ...this.httpConfig.headers,
            ...options.headers,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          // Don't retry on client errors (4xx) except 408 (Timeout) and 429 (Too Many Requests)
          if (
            response.status >= 400 &&
            response.status < 500 &&
            response.status !== 408 &&
            response.status !== 429
          ) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
      } catch (error) {
        lastError = error;

        // Don't retry if it's an abort error (timeout)
        if (error.name === "AbortError") {
          throw new Error(`Request timeout after ${this.httpConfig.timeout}ms`);
        }

        // Don't retry on certain network errors
        // if (this._isNonRetryableError(error)) {
        //   throw new Error(`Non-retryable error: ${error.message}`);
        // }

        // Don't retry on last attempt
        if (attempt === this.httpConfig.retries) {
          break;
        }

        // Wait before retrying
        if (this.httpConfig.retryDelay > 0) {
          await new Promise((resolve) =>
            setTimeout(resolve, this.httpConfig.retryDelay)
          );
        }
      }
    }

    throw new Error(
      `Request failed after ${this.httpConfig.retries + 1} attempts: ${
        lastError.message
      }`
    );
  }

  // Identify non-retryable errors
  _isNonRetryableError(error) {
    const nonRetryableErrors = [
      "SyntaxError",
      "TypeError",
      "RangeError",
      "ReferenceError",
    ];

    return nonRetryableErrors.some(
      (errorType) =>
        error.name === errorType || error.message.includes("Invalid")
    );
  }

  async _makeEncryptedRequest(endpoint, body, method = 'POST') {
    const salt = this.encryptionService.config.salt;
    let requestBody;
    let responseHandler;

    if (this.encryptionService.config.enable) {
      requestBody = this.encryptionService.encryptRequestPayload(body, salt);
      responseHandler = async (response) => {
        const responseData = await response.text();
        return this.encryptionService.decryptResponse(responseData, salt);
      };
    } else {
      // Send plain JSON object when encryption is disabled
      requestBody = JSON.stringify(body);
      responseHandler = async (response) => await response.json();
    }

    const response = await this._makeRequest(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });

    return await responseHandler(response);
  }
}

class SessionAPI extends BaseAPI {
  async create(sessionData) {
    const body = {
      user_id: sessionData.userId,
      group_alias: sessionData.groupAlias,
      session_id: sessionData.sessionId,
      email_id: sessionData.emailId,
      app_name: sessionData.appName,
      app_code: sessionData.appCode,
      first_name: sessionData.firstName,
      last_name: sessionData.lastName,
      state: sessionData.state || {},
    };

    // Convert user_id to number if backend expects number
    if (body.user_id && typeof body.user_id === 'string') {
      body.user_id = parseInt(body.user_id, 10);
    }

    return await this._makeEncryptedRequest('/sessions/create', body, 'POST');
  }

  async delete(sessionData) {
    const body = {
      user_id: sessionData.userId,
      group_alias: sessionData.groupAlias,
      session_id: sessionData.sessionId,
      app_name: sessionData.appName,
      app_code: sessionData.appCode,
    };

    return await this._makeEncryptedRequest('/sessions/delete', body, 'DELETE');
  }

}

class CompletionsAPI extends BaseAPI {
  async send(messageData) {
    // Match the exact structure from your working curl
    const body = {
      app_name: messageData.appName,
      user_id: messageData.userId,
      app_code: messageData.appCode,
      session_id: messageData.sessionId,
      new_message: {
        role: "user",
        parts: [{ text: messageData.message }],
      },
    };

    // Ensure user_id is string for completions endpoint
    if (body.user_id && typeof body.user_id === 'number') {
      body.user_id = body.user_id.toString();
    }

    return await this._makeEncryptedRequest('/run', body, 'POST');
  }
}

class EncryptionService {
  constructor(config) {
    this.config = config;
  }

  /**
   * Encodes a UTF-8 string to Base64.
   * This function is conditionally enabled based on config.base64Encode.
   */
  base64Encode(str) {
    if (!this.config.base64Encode) return str;
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode(parseInt(p1, 16));
        }));
  }

  /**
   * Decodes a Base64 string to a UTF-8 string.
   * This function is conditionally enabled based on config.base64Encode.
   */
  base64Decode(str) {
    if (!this.config.base64Encode) return str;
    try {
      return decodeURIComponent(atob(str).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    } catch (e) {
      console.error("Base64 decoding failed, returning original string:", e);
      return str; // Return original string if decoding fails
    }
  }

  /**
   * Encrypts an input string using a simple XOR cipher with a given salt.
   * This function is conditionally enabled based on config.enable.
   */
  encrypt(input, salt) {
    if (!this.config.enable) return input;

    let result = "";
    for (let i = 0; i < input.length; i++) {
      result += String.fromCharCode(
        input.charCodeAt(i) ^ salt.charCodeAt(i % salt.length)
      );
    }
    return result;
  }

  /**
   * Decrypts an input string using a simple XOR cipher with a given salt.
   * This function is conditionally enabled based on config.enable.
   */
  decrypt(input, salt) {
    if (!this.config.enable) return input;

    let result = "";
    for (let i = 0; i < input.length; i++) {
      result += String.fromCharCode(
        input.charCodeAt(i) ^ salt.charCodeAt(i % salt.length)
      );
    }
    return result;
  }

  /**
   * Encrypts a request payload.
   * This method handles message text base64 encoding and then XOR encryption (if enabled and salt is provided).
   */
  encryptRequestPayload(payload, salt) {
    // Clone payload to avoid modifying original
    let processedPayload = JSON.parse(JSON.stringify(payload));

    // Base64 encode message text if it exists (like working code)
    if (processedPayload.new_message && 
        processedPayload.new_message.parts && 
        processedPayload.new_message.parts.length > 0 &&
        processedPayload.new_message.parts[0].text) {
      
      const originalText = processedPayload.new_message.parts[0].text;
      processedPayload.new_message.parts[0].text = btoa(encodeURIComponent(originalText).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
          return String.fromCharCode(parseInt(p1, 16));
        }));
    }

    // Convert to JSON string
    let jsonString = JSON.stringify(processedPayload);

    // Apply XOR encryption if enabled
    if (this.config.enable && salt) {
      try {
        jsonString = this.encrypt(jsonString, salt);
      } catch (error) {
        console.error("Error encrypting payload:", error);
      }
    }
    return jsonString;
  }

  /**
   * Decrypts a response.
   * This method applies XOR decryption (if enabled and salt is provided) and then Base64 decoding (if enabled).
   * It attempts to parse the final decrypted string as JSON.
   */
  decryptResponse(response, salt) {
    let decryptedResponse = response;

    if (this.config.enable && salt && typeof response === "string") {
      try {
        decryptedResponse = this.decrypt(response, salt);
      } catch (error) {
        console.error("Error decrypting response:", error);
        return response; // Return original if decryption fails
      }
    }

    if (this.config.base64Encode && typeof decryptedResponse === "string") {
      try {
        decryptedResponse = this.base64Decode(decryptedResponse);
      } catch (error) {
        console.error("Error base64 decoding response:", error);
        return decryptedResponse; // Return partially decrypted if base64 fails
      }
    }

    try {
      return JSON.parse(decryptedResponse);
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      return decryptedResponse; // Return as string if JSON parsing fails
    }
  }
}

function validateConfig(config) {
  if (!config.baseUrl) {
    throw new Error('baseUrl is required in configuration');
  }
  
  if (config.encryption?.enable && !config.encryption.salt) {
    throw new Error('Encryption salt is required when encryption is enabled');
  }
  
  // Validate HTTP config
  if (config.http) {
    if (config.http.timeout && typeof config.http.timeout !== 'number') {
      throw new Error('HTTP timeout must be a number');
    }
    
    if (config.http.retries && typeof config.http.retries !== 'number') {
      throw new Error('HTTP retries must be a number');
    }
    
    if (config.http.retryDelay && typeof config.http.retryDelay !== 'number') {
      throw new Error('HTTP retryDelay must be a number');
    }
    
    if (config.http.headers && typeof config.http.headers !== 'object') {
      throw new Error('HTTP headers must be an object');
    }
  }
  
  // Validate session config
  if (config.session) {
    if (config.session.storage && !['sessionStorage', 'localStorage'].includes(config.session.storage)) {
      throw new Error('Session storage must be either "sessionStorage" or "localStorage"');
    }
    
    if (config.session.heartbeat && typeof config.session.heartbeat !== 'number') {
      throw new Error('Session heartbeat must be a number');
    }
  }
}

function generateContextualSessionId(userId, groupAlias, appCode) {
  const tabSessionId = generateUUID();
  return `${userId}-${groupAlias}-${appCode}-${tabSessionId}`;
}

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

class ChatClient {
  constructor(config) {
    validateConfig(config);
    
    // Merge with defaults
    this.config = {
      baseUrl: config.baseUrl,
      encryption: config.encryption || { enable: false },
      http: {
        timeout: 30000,
        retries: 3,
        retryDelay: 2000,
        headers: {},
        ...config.http
      },
      session: {
        autoReconnect: true,
        storage: 'sessionStorage',
        ...config.session
      },
      ...config
    };
    
    this.encryptionService = new EncryptionService(this.config.encryption);
    this.sessionAPI = new SessionAPI(this.config, this.encryptionService);
    this.completionsAPI = new CompletionsAPI(this.config, this.encryptionService);
    
    this.sessions = new Map();
    this.reconnectTimeouts = new Map();
    this.reconnectAttempts = new Map(); // 🆕 Track reconnect attempts per session
    this.storage = this._getStorageAdapter();
  }

  _getStorageAdapter() {
    const storageType = this.config.session.storage;
    
    if (typeof window === 'undefined') {
      // Node.js environment - mock storage
      return {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {}
      };
    }
    
    if (storageType === 'localStorage') {
      return localStorage;
    }
    
    return sessionStorage; // default
  }

  async initializeSession(userId, groupAlias, appCode, appName, userData = {}) {
    const sessionId = generateContextualSessionId(userId, groupAlias, appCode);
    
    const sessionConfig = {
      userId,
      groupAlias,
      appCode,
      appName,
      sessionId,
      ...userData
    };

    try {
      const response = await this.sessionAPI.create(sessionConfig);

      const session = {
        id: sessionId,
        userId,
        groupAlias,
        appCode,
        appName,
        createdAt: new Date(),
        lastActive: new Date(),
        isConnected: true,
        ...response
      };
      
      this.sessions.set(sessionId, session);

      // Reset reconnect attempts on successful session creation
      this.reconnectAttempts.set(sessionId, 0);
      
      // Save session to storage
      this._saveSessionToStorage(session);
      
      return session;
    } catch (error) {
      throw new Error(`Session initialization failed: ${error.message}`);
    }
  }

  async sendMessage(sessionId, message, options = {}) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`No active session found for sessionId: ${sessionId}`);
    }

    const messageConfig = {
      userId: session.userId,
      sessionId: session.id,
      appName: session.appName,
      appCode: session.appCode,
      message: message,
      ...options
    };

    try {
      const response = await this.completionsAPI.send(messageConfig);
      
      // Update session activity
      session.lastActive = new Date();
      this._saveSessionToStorage(session);
      
      return this._handleStreamingResponse(response, options);
    } catch (error) {
      // Handle auto-reconnect for connection errors
      if (this._isConnectionError(error) && this.config.session.autoReconnect) {
        console.warn('Connection error, attempting to reconnect...');
        await this._handleReconnect(sessionId);
        
        // Retry the message after reconnection
        return await this.sendMessage(sessionId, message, options);
      }
      throw new Error(`Message sending failed: ${error.message}`);
    }
  }

  async closeSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    // Clear reconnect timeout
    this._clearReconnectTimeout(sessionId);
    this.reconnectAttempts.delete(sessionId); // Clean up attempts tracking

    try {
      await this.sessionAPI.delete({
        userId: session.userId,
        sessionId: session.id,
        groupAlias: session.groupAlias,
        appCode: session.appCode,
        appName: session.appName
      });
    } catch (error) {
      console.warn('Session deletion warning:', error.message);
    } finally {
      this.sessions.delete(sessionId);
      this._removeSessionFromStorage(sessionId);
    }
  }

  async _handleReconnect(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    let currentAttempts = this.reconnectAttempts.get(sessionId) || 0;
    const maxReconnectAttempts = this.config.http.retries || 3;

    if (currentAttempts >= maxReconnectAttempts) {
      console.warn(`Skipping reconnect for session ${sessionId} - max attempts reached`);
      return;
    }

    currentAttempts++;
    this.reconnectAttempts.set(sessionId, currentAttempts);

    console.log(`Attempting to reconnect session: ${sessionId} (Attempt ${currentAttempts}/${maxReconnectAttempts})`);

    try {
      // Attempt to reinitialize session using the scheduled reconnect logic
      await this._scheduleReconnect(sessionId, {
        userId: session.userId,
        groupAlias: session.groupAlias,
        appCode: session.appCode,
        appName: session.appName,
        sessionId: session.id,
        ...session
      }, currentAttempts);
      
      console.log('Session reconnected successfully');
      this.reconnectAttempts.set(sessionId, 0); // Reset attempts on success
    } catch (error) {
      console.error('Reconnection failed:', error);
      // The _scheduleReconnect already handles incrementing attempts and throwing on max.
      // No need to increment here again.
    }
  }

  async _scheduleReconnect(sessionId, sessionConfig, attempt) {
    const maxReconnectAttempts = this.config.http.retries || 3;
    
    // Check if we've exceeded max attempts
    if (attempt > maxReconnectAttempts) {
      console.error(`Max reconnect attempts (${maxReconnectAttempts}) exceeded for session: ${sessionId}`);
      this.reconnectAttempts.delete(sessionId);
      throw new Error(`Failed to establish session after ${maxReconnectAttempts} attempts`);
    }

    console.log(`Reconnect attempt ${attempt}/${maxReconnectAttempts} for session: ${sessionId}`);
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(async () => {
        try {
          const response = await this.sessionAPI.create(sessionConfig);
          
          resolve(response);
        } catch (error) {
          console.warn(`Reconnect attempt ${attempt} failed:`, error.message);
          
          try {
            // Recursive call with incremented attempt counter
            const response = await this._scheduleReconnect(sessionId, sessionConfig, attempt + 1);
            resolve(response);
          } catch (retryError) {
            reject(retryError);
          }
        }
      }, this.config.http.retryDelay);
      
      this.reconnectTimeouts.set(sessionId, timeout);
    });
  }


  _clearReconnectTimeout(sessionId) {
    const timeout = this.reconnectTimeouts.get(sessionId);
    if (timeout) {
      clearTimeout(timeout);
      this.reconnectTimeouts.delete(sessionId);
    }
  }

  _isConnectionError(error) {
    const connectionErrors = [
      'NETWORK_ERROR',
      'TIMEOUT',
      'FAILED_TO_FETCH',
      'NETWORK_REQUEST_FAILED'
    ];
    
    return connectionErrors.some(connectionError => 
      error.message.includes(connectionError) || 
      error.name === 'TypeError' // Often network errors
    );
  }

  _saveSessionToStorage(session) {
    const key = `chat_session_${session.id}`;
    try {
      this.storage.setItem(key, JSON.stringify({
        ...session,
        reconnectTimeout: undefined
      }));
    } catch (error) {
      console.warn('Failed to save session to storage:', error);
    }
  }

  _removeSessionFromStorage(sessionId) {
    const key = `chat_session_${sessionId}`;
    try {
      this.storage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove session from storage:', error);
    }
  }

  // Restore sessions from storage (useful after page refresh)
  restoreSessions() {
    if (typeof window === 'undefined') return [];
    
    const restoredSessions = [];
    const keys = Object.keys(this.storage);
    
    keys.forEach(key => {
      if (key.startsWith('chat_session_')) {
        try {
          const sessionData = JSON.parse(this.storage.getItem(key));
          this.sessions.set(sessionData.id, sessionData);
          restoredSessions.push(sessionData);
        } catch (error) {
          console.warn('Failed to restore session:', error);
        }
      }
    });
    
    return restoredSessions;
  }

  // Existing methods...
  _handleStreamingResponse(response, options) {
    if (options.stream) {
      return this._createStreamProcessor(response);
    }
    return this._processCompleteResponse(response);
  }

  _processCompleteResponse(response) {
    let finalReply = "Sorry, try again later.";
    
    for (const item of response) {
      if (item.content?.role === "model" && 
          Array.isArray(item.content.parts) && 
          item.content.parts.length > 0) {
        const lastPart = item.content.parts[item.content.parts.length - 1];
        if (lastPart.text) {
          finalReply = lastPart.text;
        }
      }
    }
    
    return finalReply;
  }

  getActiveSessions() {
    return Array.from(this.sessions.values());
  }

  getSession(sessionId) {
    return this.sessions.get(sessionId);
  }

  /**
   * Sends a query, automatically managing session creation and retrieval.
   * If a session exists in storage or is active, it will be used.
   * Otherwise, a new session will be initialized.
   *
   * @param {string} message - The user's query message.
   * @param {object} userData - User data required for session initialization if no session exists.
   *                            Must include userId, groupAlias, appCode, appName.
   * @param {object} options - Optional parameters for the sendMessage call (e.g., streaming).
   * @returns {Promise<string|ReadableStream>} The completion response from the chatbot.
   */
  async sendQuery(message, userData, options = {}) {
    let activeSession = null;

    // 1. Try to find an active session in memory
    if (this.sessions.size > 0) {
      // For simplicity, use the first active session if multiple exist.
      // A more robust implementation might require a specific sessionId or user context.
      activeSession = Array.from(this.sessions.values())[0];
    }

    // 2. If no active session, try to restore from storage
    if (!activeSession) {
      const restoredSessions = this.restoreSessions();
      if (restoredSessions.length > 0) {
        activeSession = restoredSessions[0];
        // Ensure the restored session is added to the in-memory map if not already there
        if (!this.sessions.has(activeSession.id)) {
          this.sessions.set(activeSession.id, activeSession);
        }
      }
    }

    // 3. If still no session, initialize a new one
    if (!activeSession) {
      if (!userData || !userData.userId || !userData.groupAlias || !userData.appCode || !userData.appName) {
        throw new Error('User data (userId, groupAlias, appCode, appName) is required to initialize a new session.');
      }
      activeSession = await this.initializeSession(
        userData.userId,
        userData.groupAlias,
        userData.appCode,
        userData.appName,
        userData
      );
    }

    // 4. Send the message using the active session
    return await this.sendMessage(activeSession.id, message, options);
  }
}

export { ChatClient, EncryptionService, ChatClient as default };
