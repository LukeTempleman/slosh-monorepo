/**
 * Debug utility to test API connectivity
 */

import { manufacturerApi } from "./apiClient";
import { batchService } from "./batchService";

export const debugAPI = async () => {
  console.log("🔍 API Debug Start");
  
  // 1. Check token
  const token = manufacturerApi.getAuthToken();
  console.log("🔑 Auth token:", token ? "✅ Present" : "❌ Missing");
  
  // 2. Check axios instance
  const instance = manufacturerApi.getAxiosInstance();
  console.log("📦 Axios instance:", instance ? "✅ OK" : "❌ Missing");
  console.log("📝 Request headers:", instance.defaults.headers.common);
  
  // 3. Try to fetch batches
  console.log("🔄 Attempting to fetch batches...");
  try {
    const response = await batchService.getBatches({ limit: 5, offset: 0 });
    console.log("✅ Batches fetched:", response?.data.length || 0, "items");
    return response;
  } catch (error) {
    console.error("❌ Error fetching batches:", error);
    return null;
  }
};

export const debugLogin = async (username: string, password: string) => {
  console.log("🔐 Debug Login Start");
  
  try {
    const response = await manufacturerApi.login({ username, password });
    console.log("✅ Login response:", response);
    
    if (response.data?.access_token) {
      manufacturerApi.setAuthToken(response.data.access_token);
      console.log("✅ Token set successfully");
      
      // Try fetching batches
      const batches = await debugAPI();
      return { success: true, batches };
    } else {
      console.error("❌ No token in response");
      return { success: false };
    }
  } catch (error) {
    console.error("❌ Login error:", error);
    return { success: false, error };
  }
};
