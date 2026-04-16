import React, { useState, useRef, useEffect } from "react";
import { apiService } from "../services/apiService";
import { speechService } from "../utils/speechService";
import electronicsImg from "../assets/electronics.png";
import recyclablesImg from "../assets/Recyclables.png";
import organicImg from "../assets/organic.png";

export default function Predict() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [quality, setQuality] = useState(null);
  const [overrideQuality, setOverrideQuality] = useState(false);
  const [categories, setCategories] = useState([]);
  const [feedbackLabel, setFeedbackLabel] = useState("");
  const [feedbackNote, setFeedbackNote] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [batchFiles, setBatchFiles] = useState([]);
  const [batchResults, setBatchResults] = useState([]);
  const [batchLoading, setBatchLoading] = useState(false);
  const [modelInfo, setModelInfo] = useState(null);
  const [modelError, setModelError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const batchInputRef = useRef(null);

  const QUEUE_KEY = "ecovision-offline-queue";

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await apiService.getCategories();
        setCategories(data.categories || []);
      } catch {
        setCategories([]);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const fetchModelInfo = async () => {
      try {
        const info = await apiService.getModelInfo();
        setModelInfo(info);
        setModelError(null);
      } catch {
        setModelError("Model status unavailable.");
      }
    };
    fetchModelInfo();
  }, []);

  useEffect(() => {
    if (!image) {
      setQuality(null);
      setOverrideQuality(false);
      return;
    }
    runQualityCheck(image);
  }, [image]);

  useEffect(() => {
    const interval = setInterval(() => {
      flushOfflineQueue();
    }, 15000);
    flushOfflineQueue();
    return () => clearInterval(interval);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setError(null);
      setFeedbackSent(false);
      setFeedbackLabel("");
      setFeedbackNote("");
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePredict = async () => {
    if (!image) {
      setError("Please upload an image first");
      return;
    }

    if (modelInfo && !modelInfo.loaded) {
      setError("Model is not loaded on the server. Please check backend model files.");
      return;
    }

    if (quality?.blocked && !overrideQuality) {
      setError("Image quality is too low. Please retake or override to proceed.");
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const result = await apiService.predictWaste(image);
      if (result.error) {
        setError(result.error);
      } else {
        setPrediction(result);
      }
    } catch (err) {
      setError("Backend unreachable. Saved for offline retry.");
      await queueOfflinePrediction(image, "upload");
    } finally {
      setLoading(false);
    }
  };

  const handleStartCamera = async () => {
    try {
      setCameraError(null);
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch (err) {
      setCameraError(
        err.name === "NotAllowedError"
          ? "Camera permission denied. Please enable camera access in your browser settings."
          : err.name === "NotFoundError"
          ? "No camera found on this device."
          : "Unable to access camera. Please check permissions."
      );
    }
  };

  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, 224, 224);

      canvasRef.current.toBlob((blob) => {
        const file = new File([blob], "camera.jpg", { type: "image/jpeg" });
        setImage(file);

        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(blob);

        if (videoRef.current.srcObject) {
          videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        }
        setCameraActive(false);
      });
    }
  };

  const handleStopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setCameraActive(false);
  };

  const handleClear = () => {
    setImage(null);
    setPreview(null);
    setPrediction(null);
    setError(null);
    setCameraError(null);
    setQuality(null);
    setOverrideQuality(false);
    setFeedbackSent(false);
    setFeedbackLabel("");
    setFeedbackNote("");
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setCameraActive(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleBatchUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setBatchFiles(files);
    setBatchResults([]);
  };

  const handleBatchPredict = async () => {
    if (batchFiles.length === 0) return;
    setBatchLoading(true);
    setBatchResults([]);
    const results = [];

    for (const file of batchFiles) {
      try {
        const res = await apiService.predictWaste(file);
        results.push({
          name: file.name,
          prediction: res.prediction,
          confidence: res.confidence,
          top_predictions: res.top_predictions || []
        });
      } catch {
        results.push({ name: file.name, error: "Queued (offline)" });
        await queueOfflinePrediction(file, "upload");
      }
    }

    setBatchResults(results);
    setBatchLoading(false);
  };

  const exportBatchCSV = () => {
    if (batchResults.length === 0) return;
    const headers = ["file", "prediction", "confidence", "top_1", "top_2", "top_3"];
    const rows = batchResults.map((r) => [
      r.name,
      r.prediction || "",
      r.confidence || "",
      r.top_predictions?.[0]?.class || "",
      r.top_predictions?.[1]?.class || "",
      r.top_predictions?.[2]?.class || ""
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "eco_vision_batch_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const getBinInfo = (category) => {
    const info = {
      Plastic: { bin: "Blue Bin", why: "Clean recyclables", tips: "Rinse, dry, and flatten if possible." },
      Metal: { bin: "Blue Bin", why: "Recyclable metal", tips: "Rinse and crush cans to save space." },
      Glass: { bin: "Glass Bin", why: "Separate glass stream", tips: "Remove lids and avoid broken shards." },
      Paper: { bin: "Paper Bin", why: "Paper recycling", tips: "Keep dry and oil-free." },
      Cardboard: { bin: "Paper Bin", why: "Fiber recycling", tips: "Flatten boxes and keep dry." },
      Organic: { bin: "Green Bin", why: "Compost stream", tips: "Separate food scraps from packaging." },
      Battery: { bin: "E-Waste Drop-off", why: "Hazardous material", tips: "Never place in regular bins." },
      Keyboard: { bin: "E-Waste Drop-off", why: "Electronic device", tips: "Use certified recycling centers." },
      Mobile: { bin: "E-Waste Drop-off", why: "Electronic device", tips: "Use take-back programs." },
      Mouse: { bin: "E-Waste Drop-off", why: "Electronic device", tips: "Drop at collection points." },
      Printer: { bin: "E-Waste Drop-off", why: "Electronic device", tips: "Check manufacturer recycling." },
      Television: { bin: "E-Waste Drop-off", why: "Large electronics", tips: "Requires authorized handling." },
      Microwave: { bin: "E-Waste Drop-off", why: "Appliance waste", tips: "Handle with special care." },
      "Washing Machine": { bin: "Bulk Pickup", why: "Large appliance", tips: "Arrange municipal pickup." },
      PCB: { bin: "E-Waste Drop-off", why: "Hazardous components", tips: "Use certified recyclers." },
      Player: { bin: "E-Waste Drop-off", why: "Electronic device", tips: "Recycle with electronics." },
      trash: { bin: "Black Bin", why: "Non-recyclable", tips: "Bag properly and seal." }
    };
    return info[category] || { bin: "Check Local Rules", why: "Mixed material", tips: "Follow municipal guidance." };
  };

  const getExplainability = (category) => {
    const reasons = {
      Plastic: ["texture looks smooth", "high reflectivity", "typical bottle shapes"],
      Glass: ["transparent surface", "sharp edges", "glassy reflections"],
      Metal: ["shiny highlights", "rigid edges", "can-like contours"],
      Paper: ["fibrous texture", "flat surfaces", "matte finish"],
      Organic: ["irregular shapes", "natural textures", "soft colors"],
      Battery: ["cylindrical shape", "metal ends", "label markings"],
      Television: ["large flat panel", "dark screen region", "bezel outline"],
      Microwave: ["boxy form", "door panel", "vent patterns"]
    };
    return reasons[category] || ["overall shape", "surface texture", "color profile"];
  };

  const runQualityCheck = async (file) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onloadend = () => {
      img.src = reader.result;
    };
    reader.readAsDataURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 224;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;

      let sum = 0;
      const gray = new Float32Array(size * size);
      for (let i = 0, j = 0; i < data.length; i += 4, j++) {
        const g = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        gray[j] = g;
        sum += g;
      }
      const brightness = sum / (size * size);

      const lap = (idx) => {
        const x = idx % size;
        const y = Math.floor(idx / size);
        if (x === 0 || y === 0 || x === size - 1 || y === size - 1) return 0;
        const center = gray[idx];
        return (
          gray[idx - size] + gray[idx + size] + gray[idx - 1] + gray[idx + 1] - 4 * center
        );
      };

      let varianceSum = 0;
      for (let i = 0; i < gray.length; i++) {
        const v = lap(i);
        varianceSum += v * v;
      }
      const blurScore = varianceSum / gray.length;

      const isDark = brightness < 70;
      const isBlurry = blurScore < 80;

      setQuality({ brightness: Math.round(brightness), blurScore: Math.round(blurScore), isDark, isBlurry, blocked: isDark || isBlurry });
    };
  };

  const queueOfflinePrediction = async (file, source) => {
    const reader = new FileReader();
    const dataUrl = await new Promise((resolve) => {
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
    const item = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      filename: file.name,
      dataUrl,
      source,
      queuedAt: new Date().toISOString()
    };
    const existing = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
    const next = [item, ...existing].slice(0, 8);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(next));
  };

  const flushOfflineQueue = async () => {
    if (!navigator.onLine) return;
    const existing = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
    if (existing.length === 0) return;

    const remaining = [];
    for (const item of existing) {
      try {
        const blob = await fetch(item.dataUrl).then((r) => r.blob());
        const file = new File([blob], item.filename || "queued.jpg", { type: blob.type || "image/jpeg" });
        await apiService.predictWaste(file);
      } catch {
        remaining.push(item);
      }
    }
    localStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
  };

  const handleFeedbackSubmit = async () => {
    if (!prediction || !feedbackLabel) return;
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prediction_id: prediction.prediction_id,
          image_id: prediction.image_id,
          predicted_category: prediction.prediction,
          corrected_category: feedbackLabel,
          confidence: prediction.confidence ? Number(prediction.confidence) / 100 : null,
          notes: feedbackNote
        })
      });
      setFeedbackSent(true);
    } catch {
      setError("Unable to save feedback right now.");
    }
  };

  const getDisposalTips = (category) => {
    const tips = {
      Plastic: "♻️ Rinse and place in recyclables. Keep plastic bags separate.",
      Metal: "♻️ Crush cans if possible. Aluminum and steel cans are highly recyclable.",
      Glass: "♻️ Place in separate container. Remove caps/lids first.",
      Paper: "♻️ Keep dry. Break down boxes to save space.",
      Cardboard: "♻️ Flatten boxes. Keep away from water and rain.",
      Organic: "🌱 Use for composting. Great for garden or compost bin.",
      Battery: "⚠️ Store safely. Take to special battery recycling center.",
      Trash: "🗑️ General waste. Ensure proper segregation before disposal.",
      Keyboard: "♻️ Electronic waste. Take to e-waste collection center.",
      Mobile: "♻️ Contains valuable materials. Go to certified e-waste recycler.",
      Mouse: "♻️ Electronic waste. Check local e-waste programs.",
      Printer: "♻️ Large electronic waste. Contact manufacturer for recycling.",
      Television: "⚠️ Large electronics. Must go to specialized e-waste facility.",
      Microwave: "⚠️ Hazardous. Needs special handling at e-waste facility.",
      "Washing Machine": "⚠️ Large appliance. Contact municipal waste management.",
      PCB: "⚠️ Hazardous. Must go to certified e-waste recycler.",
      Player: "♻️ Electronic device. Standard e-waste recycling process.",
    };
    return tips[category] || "Please dispose responsibly.";
  };

  return (
    <div className="predict-container">
      <div className="predict-header">
        <h1 className="gradient-text">Waste Classifier</h1>
        <p>Intelligent material recognition for a sustainable future</p>
      </div>

      <div className="model-banner">
        <div>
          <span className="model-label">Model Status</span>
          <h3>{modelInfo?.loaded ? "Loaded" : "Not Loaded"}</h3>
          {modelError && <p className="model-note">{modelError}</p>}
          {!modelError && modelInfo && (
            <p className="model-note">Classes: {modelInfo.class_count} · Source: {modelInfo.model_path || "-"}</p>
          )}
        </div>
        <span className={`model-chip ${modelInfo?.loaded ? "ok" : "warn"}`}>
          {modelInfo?.loaded ? "Ready" : "Fix Required"}
        </span>
      </div>

      <div className="predict-main-card premium-card">
        {!preview && !loading && !prediction && !cameraActive && !cameraError && (
          <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
            <div className="upload-icon-wrapper">
              <span className="icon">▲</span>
            </div>
            <h2>Upload Waste Image</h2>
            <p>Drag and drop your photo here or <span className="browse-text">browse files</span></p>
            <div className="upload-actions">
              <button 
                onClick={(e) => { e.stopPropagation(); handleStartCamera(); }} 
                className="predict-btn secondary"
              >
                📷 Use Camera
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </div>
        )}

        {cameraError && (
          <div className="camera-error-view">
            <div className="error-card">
              <div className="error-icon">📷</div>
              <h3>Camera Access Issue</h3>
              <p className="error-message">{cameraError}</p>
              <div className="error-actions">
                <button 
                  onClick={handleStartCamera} 
                  className="predict-btn primary"
                >
                  🔄 Retry Camera
                </button>
                <button 
                  onClick={() => setCameraError(null)} 
                  className="predict-btn secondary"
                >
                  📂 Upload File Instead
                </button>
              </div>
            </div>
          </div>
        )}

        {cameraActive && (
          <div className="camera-view">
            <video ref={videoRef} autoPlay playsInline className="video-stream" />
            <canvas ref={canvasRef} style={{ display: "none" }} width={224} height={224} />
            <div className="camera-controls">
              <button onClick={handleCapturePhoto} className="predict-btn primary large">📸 Capture Photo</button>
              <button onClick={handleStopCamera} className="predict-btn danger">✕ Cancel</button>
            </div>
          </div>
        )}

        {(preview || loading || error) && (
          <div className="preview-view">
            {error && <div className="error-badge">❌ {error}</div>}
            {preview && (
              <div className="preview-container">
                <img src={preview} alt="Waste preview" className="preview-img" />
                {quality && (
                  <div className={`quality-banner ${quality.blocked ? "blocked" : "ok"}`}>
                    <div>
                      <strong>Quality Check:</strong> Brightness {quality.brightness}/255, Blur score {quality.blurScore}
                    </div>
                    {quality.blocked ? (
                      <div className="quality-actions">
                        <span className="quality-warning">Low quality detected (blurry or dark).</span>
                        <button className="predict-btn secondary" onClick={() => setOverrideQuality(true)}>
                          Proceed Anyway
                        </button>
                      </div>
                    ) : (
                      <span className="quality-good">Looks good for prediction.</span>
                    )}
                  </div>
                )}
                <div className="preview-actions">
                  <button 
                    onClick={handlePredict} 
                    disabled={loading} 
                    className="predict-btn primary large"
                  >
                    {loading ? "⏳ Analyzing..." : "🚀 Analyze Material"}
                  </button>
                  <button onClick={handleClear} className="predict-btn text">New Image</button>
                </div>
              </div>
            )}
            {loading && (
              <div className="loader-overlay">
                <div className="scanner"></div>
                <p>Decoding material composition...</p>
              </div>
            )}
          </div>
        )}

        {prediction && !loading && (
          <div className="results-view">
            <div className="result-main">
              <div className="result-category-shell">
                <span className="result-label">Identified Material</span>
                <h2 className="result-category">{prediction.prediction}</h2>
              </div>
              <div className="result-voice-actions">
                <button
                  className="predict-btn secondary"
                  onClick={() =>
                    speechService.speak(
                      `Predicted ${prediction.prediction} with ${Number(prediction.confidence).toFixed(1)} percent confidence.`
                    )
                  }
                >
                  🔊 Explain Prediction
                </button>
                <button
                  className="predict-btn secondary"
                  onClick={() => speechService.speak(getDisposalTips(prediction.prediction))}
                >
                  🔊 Read Tips
                </button>
              </div>
              <div className="confidence-section">
                <div className="confidence-header">
                  <span>Confidence Score</span>
                  <span>{Number(prediction.confidence).toFixed(1)}%</span>
                </div>
                <div className="confidence-track">
                  <div 
                    className="confidence-fill" 
                    style={{ width: `${prediction.confidence}%` }}
                  />
                </div>
              </div>

              {prediction.warning && (
                <div className="warning-banner">
                  <span className="warning-icon">⚠️</span>
                  <span className="warning-text">{prediction.warning_message}</span>
                </div>
              )}
            </div>

            {prediction.warning && (
              <div className="report-error-section premium-card">
                <h3>🚨 Report This Prediction</h3>
                <p style={{ color: '#ff6b6b', fontWeight: 'bold', marginBottom: '12px' }}>
                  This prediction has LOW confidence. Please help us improve by reporting the correct label.
                </p>
                <div className="feedback-row">
                  <select
                    value={feedbackLabel}
                    onChange={(e) => setFeedbackLabel(e.target.value)}
                  >
                    <option value="">🔴 Select CORRECT label</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Optional note (e.g., looks like plastic)"
                    value={feedbackNote}
                    onChange={(e) => setFeedbackNote(e.target.value)}
                  />
                  <button
                    className="predict-btn primary"
                    onClick={handleFeedbackSubmit}
                    disabled={!feedbackLabel || feedbackSent}
                    style={{ backgroundColor: '#ff6b6b', fontSize: '14px', fontWeight: 'bold' }}
                  >
                    {feedbackSent ? "✅ Error Reported!" : "🔴 Report Error"}
                  </button>
                </div>
              </div>
            )}

            <div className="result-details">
              <div className="tips-box">
                <h3>♻️ Disposal Guide</h3>
                <p>{getDisposalTips(prediction.prediction)}</p>
              </div>
              <div className="top-preds">
                <h3>Alternative Probabilities</h3>
                <div className="preds-list">
                  {prediction.top_predictions.slice(0, 3).map((pred, i) => (
                    <div key={i} className="pred-item">
                      <span className="pred-name">{pred.class}</span>
                      <span className="pred-val">
                        {pred.confidence > 1
                          ? `${pred.confidence.toFixed(0)}%`
                          : `${(pred.confidence * 100).toFixed(0)}%`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="smart-bin premium-card">
              <div className="smart-bin-header">
                <h3>🗑️ Smart Bin Decision</h3>
                <span className="bin-chip">{getBinInfo(prediction.prediction).bin}</span>
              </div>
              <p className="bin-why">Why: {getBinInfo(prediction.prediction).why}</p>
              <p className="bin-tip">Tip: {getBinInfo(prediction.prediction).tips}</p>
            </div>

            <div className="explain-grid">
              {getExplainability(prediction.prediction).map((reason, idx) => (
                <div key={idx} className="explain-card premium-card">
                  <h4>Clue {idx + 1}</h4>
                  <p>{reason}</p>
                </div>
              ))}
            </div>

            <div className="feedback-box premium-card">
              <h3>Was this correct?</h3>
              <p>Help improve the model by correcting the label.</p>
              <div className="feedback-row">
                <select
                  value={feedbackLabel}
                  onChange={(e) => setFeedbackLabel(e.target.value)}
                >
                  <option value="">Select correct label</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Optional note (e.g., broken glass)"
                  value={feedbackNote}
                  onChange={(e) => setFeedbackNote(e.target.value)}
                />
                <button
                  className="predict-btn primary"
                  onClick={handleFeedbackSubmit}
                  disabled={!feedbackLabel || feedbackSent}
                >
                  {feedbackSent ? "Thanks!" : "Submit"}
                </button>
              </div>
            </div>

            <div className="result-reset">
              <button onClick={handleClear} className="predict-btn primary">Analyze Another</button>
            </div>
          </div>
        )}
      </div>

      <section className="batch-section premium-card">
        <div className="batch-header">
          <h2>Batch Processing</h2>
          <p>Upload multiple images and export results to CSV.</p>
        </div>
        <div className="batch-actions">
          <button
            className="predict-btn secondary"
            onClick={() => batchInputRef.current?.click()}
          >
            📂 Select Images
          </button>
          <button
            className="predict-btn primary"
            onClick={handleBatchPredict}
            disabled={batchLoading || batchFiles.length === 0}
          >
            {batchLoading ? "Processing..." : "Run Batch"}
          </button>
          <button
            className="predict-btn text"
            onClick={exportBatchCSV}
            disabled={batchResults.length === 0}
          >
            ⬇️ Export CSV
          </button>
          <input
            ref={batchInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleBatchUpload}
            style={{ display: "none" }}
          />
        </div>

        {batchFiles.length > 0 && (
          <div className="batch-summary">
            {batchFiles.length} file(s) ready for batch prediction.
          </div>
        )}

        {batchResults.length > 0 && (
          <div className="batch-table">
            <div className="batch-row batch-header-row">
              <span>File</span>
              <span>Prediction</span>
              <span>Confidence</span>
            </div>
            {batchResults.map((r, i) => (
              <div key={i} className="batch-row">
                <span>{r.name}</span>
                <span>{r.prediction || r.error}</span>
                <span>{r.confidence ? `${Number(r.confidence).toFixed(1)}%` : "-"}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="predict-examples">
        <h2 className="section-title">Common Categories</h2>
        <div className="example-grid">
          {[
            { img: electronicsImg, title: "Electronics", desc: "Keyboards, mobiles, PCBs" },
            { img: organicImg, title: "Organic", desc: "Food waste, plant materials" },
            { img: recyclablesImg, title: "Recyclables", desc: "Plastic, metal, glass" }
          ].map((item, i) => (
            <div key={i} className="example-item premium-card">
              <img src={item.img} alt={item.title} />
              <div className="example-info">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .predict-container {
          max-width: 1000px;
          margin: 0 auto;
          animation: fadeInUp 0.8s ease-out;
        }

        .predict-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        .predict-header h1 {
          font-size: 3rem;
          margin-bottom: 0.5rem;
        }
        .predict-header p {
          color: var(--text-muted);
          font-size: 1.1rem;
        }

        .model-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          padding: 1.2rem 1.5rem;
          border-radius: 16px;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.2);
          margin-bottom: 2rem;
        }
        .model-label {
          display: block;
          font-size: 0.75rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--text-muted);
          font-weight: 700;
        }
        .model-banner h3 {
          margin: 0.4rem 0;
        }
        .model-note {
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        .model-chip {
          padding: 0.35rem 0.9rem;
          border-radius: 999px;
          font-weight: 700;
          font-size: 0.8rem;
          background: rgba(148, 163, 184, 0.2);
          color: var(--text-main);
        }
        .model-chip.ok {
          background: rgba(16, 185, 129, 0.18);
          color: var(--primary-dark);
        }
        .model-chip.warn {
          background: rgba(248, 113, 113, 0.18);
          color: var(--error-dark);
        }
        [data-theme="dark"] .model-chip.warn {
          color: var(--error-dark);
        }

        .predict-main-card {
          padding: 3rem;
          min-height: 400px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .upload-zone {
          text-align: center;
          padding: 4rem 2rem;
          border: 2px dashed rgba(16, 185, 129, 0.2);
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .upload-zone:hover {
          background: rgba(16, 185, 129, 0.05);
          border-color: var(--primary);
        }

        .upload-icon-wrapper {
          width: 80px;
          height: 80px;
          background: rgba(16, 185, 129, 0.1);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          margin: 0 auto 1.5rem;
          font-size: 2rem;
        }

        .browse-text {
          color: var(--primary);
          font-weight: 700;
          text-decoration: underline;
        }

        .upload-actions {
          margin-top: 2rem;
        }

        .predict-btn {
          padding: 0.8rem 2rem;
          border-radius: 100px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          font-family: inherit;
        }
        .predict-btn.primary {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
          box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2);
        }
        .predict-btn.secondary {
          background: white;
          color: var(--text-main);
          border: 1px solid rgba(0,0,0,0.1);
        }
        .predict-btn.danger {
          background: #ef4444;
          color: white;
        }
        .predict-btn.text {
          background: transparent;
          color: var(--text-muted);
        }
        .predict-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1);
        }
        .predict-btn.large {
          padding: 1rem 2.5rem;
          font-size: 1.1rem;
          width: 100%;
          max-width: 300px;
        }

        .camera-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          padding: 2rem 0;
        }
        .camera-controls {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          width: 100%;
          padding: 1.5rem;
          background: rgba(16, 185, 129, 0.05);
          border-radius: 16px;
          border: 1px solid rgba(16, 185, 129, 0.15);
        }
        .camera-controls .predict-btn {
          min-width: 150px;
        }
        .camera-controls .predict-btn.primary {
          flex: 1;
          max-width: 300px;
        }
        .video-stream {
          width: 100%;
          max-width: 500px;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .camera-error-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          padding: 2rem;
        }
        .error-card {
          text-align: center;
          padding: 2.5rem 2rem;
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(251, 146, 60, 0.08));
          border: 2px solid rgba(239, 68, 68, 0.25);
          border-radius: 20px;
          max-width: 500px;
          animation: slideInDown 0.5s ease-out;
        }
        .error-icon {
          font-size: 3.5rem;
          margin-bottom: 1rem;
          display: block;
        }
        .error-card h3 {
          color: #dc2626;
          font-size: 1.5rem;
          margin-bottom: 0.8rem;
        }
        .error-message {
          color: #991b1b;
          font-weight: 500;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
        }
        .error-actions {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }
        .error-actions .predict-btn {
          width: 100%;
        }

        .preview-view {
          text-align: center;
        }
        .preview-img {
          max-width: 100%;
          max-height: 400px;
          border-radius: 20px;
          margin-bottom: 2rem;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .quality-banner {
          margin: 0 auto 1.5rem;
          padding: 0.8rem 1.2rem;
          border-radius: 14px;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.2);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-width: 600px;
        }
        .quality-banner.blocked {
          background: rgba(239, 68, 68, 0.08);
          border-color: rgba(239, 68, 68, 0.25);
        }
        .quality-warning {
          color: var(--error-dark);
          font-weight: 600;
        }
        [data-theme="dark"] .quality-warning {
          color: var(--error-dark);
        }
        .quality-good {
          color: var(--success-dark);
          font-weight: 600;
        }
        [data-theme="dark"] .quality-good {
          color: var(--success-dark);
        }
        .quality-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .results-view {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }
        .result-main {
          text-align: center;
        }
        .result-voice-actions {
          margin: 1rem 0 1.5rem;
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .result-label {
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--primary);
        }
        .result-category {
          font-size: 3rem;
          font-weight: 800;
          margin: 0.5rem 0 1.5rem;
        }

        .confidence-section {
          max-width: 400px;
          margin: 0 auto;
        }
        .confidence-header {
          display: flex;
          justify-content: space-between;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: var(--text-muted);
        }
        .confidence-track {
          height: 12px;
          background: var(--glass-border);
          border-radius: 100px;
          overflow: hidden;
        }
        .confidence-fill {
          height: 100%;
          background: linear-gradient(to right, var(--primary), var(--secondary));
          border-radius: 100px;
          animation: slideInLeft 1s ease-out;
        }

        .result-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        .tips-box {
          background: rgba(16, 185, 129, 0.05);
          padding: 1.5rem;
          border-radius: 20px;
          border: 1px solid rgba(16, 185, 129, 0.1);
        }
        .tips-box h3 {
          margin-bottom: 0.75rem;
          color: var(--primary-dark);
        }

        .top-preds h3 {
          font-size: 1rem;
          margin-bottom: 1rem;
          color: var(--text-muted);
        }
        .preds-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .pred-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid #f1f5f9;
          font-weight: 600;
        }

        .result-reset {
          text-align: center;
        }

        .smart-bin {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .smart-bin-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .bin-chip {
          background: rgba(16, 185, 129, 0.12);
          color: var(--primary-dark);
          padding: 0.3rem 0.8rem;
          border-radius: 999px;
          font-weight: 700;
        }
        .bin-why {
          color: var(--text-muted);
        }
        .bin-tip {
          font-weight: 600;
        }

        .explain-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
        }
        .explain-card {
          padding: 1rem;
        }
        .explain-card h4 {
          margin-bottom: 0.4rem;
          font-size: 0.95rem;
        }

        .feedback-box {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }
        .feedback-row {
          display: grid;
          grid-template-columns: 180px 1fr 140px;
          gap: 0.8rem;
        }
        .feedback-row select,
        .feedback-row input {
          padding: 0.7rem 0.9rem;
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.1);
          font-family: inherit;
          background: var(--input-bg);
          color: var(--text-main);
        }
        [data-theme="dark"] .feedback-row select,
        [data-theme="dark"] .feedback-row input {
          background: var(--input-bg);
          border-color: rgba(255,255,255,0.1);
          color: var(--text-main);
        }

        .batch-section {
          margin-top: 2.5rem;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .batch-header h2 {
          margin-bottom: 0.4rem;
        }
        .batch-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .batch-summary {
          color: var(--text-muted);
        }
        .batch-table {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .batch-row {
          display: grid;
          grid-template-columns: 1.2fr 1fr 0.6fr;
          gap: 1rem;
          padding: 0.6rem 0.8rem;
          border-radius: 12px;
          background: var(--card-bg);
        }
        .batch-header-row {
          font-weight: 700;
          background: rgba(16, 185, 129, 0.1);
        }

        .predict-examples {
          margin-top: 5rem;
        }
        .section-title {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 2.5rem;
          text-align: center;
        }
        .example-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2.5rem;
        }
        .example-item {
          overflow: hidden;
          padding: 0;
        }
        .example-item img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }
        .example-info {
          padding: 1.5rem;
        }
        .example-info h3 {
          margin-bottom: 0.5rem;
          color: var(--primary-dark);
        }
        .example-info p {
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .warning-banner {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.2rem 1.5rem;
          background: rgba(239, 68, 68, 0.08);
          border: 2px solid rgba(239, 68, 68, 0.4);
          border-radius: 14px;
          margin-top: 1.5rem;
          animation: slideInDown 0.5s ease-out;
        }
        .warning-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }
        .warning-text {
          color: var(--error-dark);
          font-weight: 600;
          line-height: 1.4;
        }
        [data-theme="dark"] .warning-text {
          color: var(--error-dark);
        }

        .report-error-section {
          padding: 2rem !important;
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(251, 146, 60, 0.08)) !important;
          border: 2px solid rgba(239, 68, 68, 0.25) !important;
          margin: 2rem 0 !important;
          animation: slideInDown 0.5s ease-out;
        }
        .report-error-section h3 {
          color: var(--error-light) !important;
          font-weight: 800 !important;
          margin-bottom: 1rem !important;
          font-size: 1.3rem !important;
        }
        [data-theme="dark"] .report-error-section h3 {
          color: var(--error-light) !important;
        }
        .report-error-section .feedback-row {
          grid-template-columns: 200px 1fr 160px;
        }

        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInLeft {
          from { width: 0; }
          to { width: 100%; }
        }

        @media (max-width: 768px) {
          .predict-main-card { padding: 1.5rem; }
          .result-details { grid-template-columns: 1fr; }
          .result-category { font-size: 2rem; }
          .feedback-row { grid-template-columns: 1fr; }
          .report-error-section .feedback-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
