// ============================================
// CERVEAU CIBLE — Storage Service
// Uses window.storage API for persistence
// ============================================

const storage = {
  async set(key, data) {
    await window.storage.set(key, JSON.stringify(data));
  },

  async get(key) {
    try {
      const result = await window.storage.get(key);
      if (result && result.value) {
        return JSON.parse(result.value);
      }
      return null;
    } catch {
      return null;
    }
  },

  async delete(key) {
    await window.storage.delete(key);
  },

  async list(prefix) {
    const results = await window.storage.list(prefix);
    return results || [];
  },

  // Profile helpers
  async getProfileList() {
    return (await this.get('profiles:list')) || [];
  },

  async saveProfileList(list) {
    await this.set('profiles:list', list);
  },

  async getProfile(id) {
    return await this.get(`profiles:${id}`);
  },

  async saveProfile(id, data) {
    await this.set(`profiles:${id}`, data);
  },

  async deleteProfile(id) {
    await this.delete(`profiles:${id}`);
    await this.delete(`research:${id}`);
    await this.delete(`neuroprofil:${id}`);
    await this.delete(`ua:${id}`);
    // Remove from list
    const list = await this.getProfileList();
    await this.saveProfileList(list.filter(pid => pid !== id));
  },

  async getResearch(id) {
    return await this.get(`research:${id}`);
  },

  async saveResearch(id, data) {
    await this.set(`research:${id}`, data);
  },

  async getNeuroProfil(id) {
    return await this.get(`neuroprofil:${id}`);
  },

  async saveNeuroProfil(id, data) {
    await this.set(`neuroprofil:${id}`, data);
  },

  async getUA(id) {
    return await this.get(`ua:${id}`);
  },

  async saveUA(id, data) {
    await this.set(`ua:${id}`, data);
  },

  async getConversation(profileId, type) {
    return (await this.get(`conversations:${profileId}:${type}`)) || [];
  },

  async saveConversation(profileId, type, messages) {
    await this.set(`conversations:${profileId}:${type}`, messages);
  },

  async getApiKey() {
    return await this.get('settings:apiKey');
  },

  async saveApiKey(key) {
    await this.set('settings:apiKey', key);
  },

  async getModel() {
    return (await this.get('settings:model')) || 'claude-sonnet-4-20250514';
  },

  async saveModel(model) {
    await this.set('settings:model', model);
  }
};

export default storage;
