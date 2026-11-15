/**
 * OncoPredict API Client
 * Interfaces with the FastAPI ML backend on Render via Vercel reverse proxy.
 */

export const BACKEND_RENDER_URL = "https://ml-14-breast-cancer-api.onrender.com";

// Exact 30 features from the Wisconsin Diagnostic Breast Cancer dataset
export const FEATURE_NAMES = [
  "Mean Radius", "Mean Texture", "Mean Perimeter",
  "Mean Area", "Mean Smoothness", "Mean Compactness",
  "Mean Concavity", "Mean Concave Points", "Mean Symmetry",
  "Mean Fractal Dimension", "Radius Error", "Texture Error",
  "Perimeter Error", "Area Error", "Smoothness Error",
  "Compactness Error", "Concavity Error", "Concave Points Error",
  "Symmetry Error", "Fractal Dimension Error",
  "Worst Radius", "Worst Texture", "Worst Perimeter",
  "Worst Area", "Worst Smoothness", "Worst Compactness",
  "Worst Concavity", "Worst Concave Points",
  "Worst Symmetry", "Worst Fractal Dimension"
];

// Verified clinical sample vectors from dataset
export const SAMPLE_MALIGNANT = [
  17.99, 10.38, 122.8, 1001.0, 0.1184, 0.2776, 0.3001, 0.1471, 0.2419, 0.07871,
  1.095, 0.9053, 8.589, 153.4, 0.006399, 0.04904, 0.05373, 0.01587, 0.03003, 0.006193,
  25.38, 17.33, 184.6, 2019.0, 0.1622, 0.6656, 0.7119, 0.2654, 0.4601, 0.1189
];

export const SAMPLE_BENIGN = [
  13.54, 14.36, 87.46, 566.3, 0.09779, 0.08129, 0.06664, 0.04781, 0.1885, 0.05766,
  0.2699, 0.7886, 2.058, 23.56, 0.008462, 0.0146, 0.02387, 0.01315, 0.0198, 0.0023,
  15.11, 19.26, 99.7, 711.2, 0.144, 0.1773, 0.239, 0.1288, 0.2977, 0.07259
];

/**
 * Executes a request with primary /api proxy route and direct Render URL fallback.
 */
async function fetchWithFallback(path, options = {}) {
  try {
    const res = await fetch(`/api${path}`, options);
    // If the proxy responds with 404/405 (e.g. unexpected static route), try direct backend
    if (res.status === 404 || res.status === 405) {
      return await fetch(`${BACKEND_RENDER_URL}${path}`, options);
    }
    return res;
  } catch {
    return await fetch(`${BACKEND_RENDER_URL}${path}`, options);
  }
}

/**
 * Checks the status of the FastAPI backend.
 */
export async function checkBackendHealth() {
  try {
    const res = await fetchWithFallback("/health");
    if (res.ok) {
      const data = await res.json();
      return {
        status: data.status === "healthy" ? "online" : "degraded",
        modelLoaded: Boolean(data.model_loaded)
      };
    }
    return { status: "offline", modelLoaded: false };
  } catch {
    return { status: "offline", modelLoaded: false };
  }
}

/**
 * Sends 30 numerical features to the ML inference endpoint.
 */
export async function predictBreastCancer(numericFeatures) {
  if (!Array.isArray(numericFeatures) || numericFeatures.length !== 30) {
    throw new Error("Prediction requires exactly 30 numerical features.");
  }

  for (let i = 0; i < numericFeatures.length; i++) {
    if (!Number.isFinite(numericFeatures[i])) {
      throw new Error(`Feature #${i + 1} (${FEATURE_NAMES[i]}) must be a valid number.`);
    }
  }

  const response = await fetchWithFallback("/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      features: numericFeatures
    })
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorDetail = data && data.detail ? (typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail)) : "Inference request failed.";
    throw new Error(errorDetail);
  }

  return data;
}

/**
 * Prediction History Management (Persisted in browser localStorage)
 */
const HISTORY_KEY = "oncopredict_history";

export function getLocalPredictionHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePredictionToHistory(features, result) {
  try {
    const history = getLocalPredictionHistory();
    const newEntry = {
      id: "pred_" + Date.now(),
      timestamp: new Date().toISOString(),
      prediction: result.prediction,
      result: result.result,
      confidence: result.confidence,
      meanRadius: features[0],
      meanTexture: features[1],
      meanArea: features[3]
    };
    const updated = [newEntry, ...history].slice(0, 50); // keep recent 50
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function clearPredictionHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    // ignore
  }
}
