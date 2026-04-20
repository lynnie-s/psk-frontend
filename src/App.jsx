import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";

const SERVER = "https://psk-backend-production.up.railway.app";

const products = [
  { id: 1, name: "深海防護 SPF50+", subtitle: "輕透水感配方", price: "NT$980", spf: "SPF50+ PA++++", desc: "深海珊瑚萃取，輕盈不泛白，防曬同時補充肌膚水分。", color: "#0e7fa8", accent: "#b3e6f5", tag: "暢銷" },
  { id: 2, name: "海洋礦物隔離霜", subtitle: "全天候防護", price: "NT$1,280", spf: "SPF50 PA+++", desc: "富含海洋礦物質，打造完美妝前底，修飾膚色零負擔。", color: "#1a5f7a", accent: "#c8f0e8", tag: "新品" },
  { id: 3, name: "珊瑚礁修護防曬", subtitle: "夜間修復雙效", price: "NT$1,480", spf: "SPF30 PA++", desc: "珊瑚活萃修復日間傷害，白天防護晚上保養。", color: "#0a4a6e", accent: "#ffe8d6", tag: "熱銷" },
  { id: 4, name: "清透氣墊防曬", subtitle: "隨身攜帶補擦", price: "NT$760", spf: "SPF50 PA++++", desc: "氣墊設計隨時補擦，如海浪般輕盈，妝容不受影響。", color: "#155e75", accent: "#e0f7fa", tag: "便攜" },
];

function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const navBg = scrolled || !isHome ? "rgba(255,255,255,0.95)" : "transparent";
  const textColor = scrolled || !isHome ? "#0a3547" : "#fff";
  const shadow = scrolled || !isHome ? "0 4px 20px rgba(0,0,0,0.05)" : "none";
  const linkStyle = (path) => ({
    color: location.pathname === path ? "#0e7fa8" : textColor,
    textDecoration: "none", fontSize: "0.85rem",
    fontWeight: location.pathname === path ? "700" : "500",
    letterSpacing: "0.1em", transition: "color 0.3s"
  });
  return (
    <nav style={{ position: "fixed", top: 0, width: "100%", zIndex: 100, padding: "1.2rem 3rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: navBg, backdropFilter: "blur(10px)", boxShadow: shadow, transition: "all 0.3s ease" }}>
      <Link to="/" style={{ textDecoration: "none" }}>
        <div style={{ fontSize: "1.8rem", fontWeight: "700", letterSpacing: "0.2em", color: textColor }}>PSK</div>
        <div style={{ fontSize: "0.55rem", letterSpacing: "0.4em", color: isHome && !scrolled ? "rgba(255,255,255,0.8)" : "#0e7fa8", marginTop: "-2px" }}>OCEAN SKINCARE</div>
      </Link>
      <ul style={{ display: "flex", gap: "2.5rem", listStyle: "none", margin: 0 }}>
        <li><Link to="/" style={linkStyle("/")}>首頁</Link></li>
        <li><Link to="/efficiency" style={linkStyle("/efficiency")}>極效省時</Link></li>
        <li><Link to="/ocean" style={linkStyle("/ocean")}>海洋友善</Link></li>
      </ul>
    </nav>
  );
}

function VideoUploadBox({ title, description, challengeTag }) {
  const [videoFile, setVideoFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [uploaderName, setUploaderName] = useState("");
  const [email, setEmail] = useState("");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const handleUpload = async () => {
    if (!videoFile) return;
    if (!uploaderName.trim()) { setErrorMsg("請填寫姓名"); return; }
    setErrorMsg(""); setStatus("uploading"); setProgress(0);
    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("challengeTag", challengeTag);
    formData.append("uploaderName", uploaderName);
    formData.append("email", email);
    try {
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${SERVER}/api/upload`);
        xhr.upload.onprogress = (e) => { if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100)); };
        xhr.onload = () => {
          try {
            const res = JSON.parse(xhr.responseText);
            if (xhr.status === 200 && res.success) resolve();
            else reject(new Error(res.error || "上傳失敗"));
          } catch { reject(new Error("伺服器回應錯誤")); }
        };
        xhr.onerror = () => reject(new Error("網路連線失敗，請確認伺服器已啟動"));
        xhr.send(formData);
      });
      setStatus("success");
    } catch (err) { setStatus("error"); setErrorMsg(err.message); }
  };

  return (
    <div style={{ background: "#fff", padding: "3rem", borderRadius: "12px", boxShadow: "0 10px 40px rgba(10,53,71,0.06)", marginTop: "3rem" }}>
      <h3 style={{ fontSize: "1.5rem", color: "#0a3547", marginBottom: "0.5rem" }}>{title}</h3>
      <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "2rem" }}>{description}</p>
      {status === "success" ? (
        <div style={{ padding: "2rem", background: "#ecfdf5", color: "#059669", borderRadius: "8px", textAlign: "center", fontWeight: "bold" }}>
          🎉 影片上傳成功！感謝參與 {challengeTag} 挑戰，審核後將發送購物金至您的信箱！
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
            <div>
              <label style={{ fontSize: "0.78rem", color: "#64748b", display: "block", marginBottom: "0.4rem" }}>姓名 *</label>
              <input type="text" value={uploaderName} onChange={e => setUploaderName(e.target.value)} placeholder="請輸入您的姓名" style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1.5px solid #e2e8f0", borderRadius: "6px", fontSize: "0.875rem", outline: "none" }} />
            </div>
            <div>
              <label style={{ fontSize: "0.78rem", color: "#64748b", display: "block", marginBottom: "0.4rem" }}>信箱（接收購物金）</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1.5px solid #e2e8f0", borderRadius: "6px", fontSize: "0.875rem", outline: "none" }} />
            </div>
          </div>
          <div style={{ border: "2px dashed #94a3b8", padding: "3rem", borderRadius: "8px", textAlign: "center", background: "#f8fafc", position: "relative", cursor: "pointer" }}>
            <p style={{ color: videoFile ? "#0e7fa8" : "#64748b", fontWeight: videoFile ? "bold" : "normal" }}>
              {videoFile ? `📄 ${videoFile.name} (${(videoFile.size/1e6).toFixed(1)} MB)` : "點擊或拖曳實測影片至此處 (MP4/MOV)"}
            </p>
            <input type="file" accept="video/*" onChange={e => setVideoFile(e.target.files[0])} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
          </div>
          {status === "uploading" && (
            <div style={{ marginTop: "1rem" }}>
              <div style={{ height: "6px", background: "#e2e8f0", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #0e7fa8, #22d3ee)", transition: "width 0.3s" }} />
              </div>
              <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.5rem", textAlign: "center" }}>上傳中… {progress}%</p>
            </div>
          )}
          {errorMsg && (
            <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", background: "#fee2e2", color: "#dc2626", borderRadius: "6px", fontSize: "0.875rem" }}>⚠️ {errorMsg}</div>
          )}
          <button onClick={handleUpload} disabled={!videoFile || status === "uploading"} style={{ width: "100%", marginTop: "1.5rem", padding: "1rem", border: "none", borderRadius: "6px", background: videoFile ? "#0e7fa8" : "#cbd5e1", color: "#fff", fontSize: "1rem", fontWeight: "bold", cursor: videoFile ? "pointer" : "not-allowed" }}>
            {status === "uploading" ? `影片傳輸中… ${progress}%` : "確認上傳影片"}
          </button>
        </>
      )}
    </div>
  );
}

function HomePage() {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [waveOffset, setWaveOffset] = useState(0);
  useEffect(() => {
    let frame;
    const animate = () => { setWaveOffset((p) => (p + 0.4) % 360); frame = requestAnimationFrame(animate); };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);
  const wave1 = `M0,60 C120,${30 + Math.sin((waveOffset * Math.PI) / 180) * 20},240,${80 + Math.cos((waveOffset * Math.PI) / 180) * 15},360,55 C480,${30 + Math.sin(((waveOffset + 60) * Math.PI) / 180) * 20},600,${80 + Math.cos(((waveOffset + 60) * Math.PI) / 180) * 15},720,55 L720,120 L0,120 Z`;
  const wave2 = `M0,70 C90,${50 + Math.cos((waveOffset * Math.PI) / 180) * 15},180,${90 + Math.sin((waveOffset * Math.PI) / 180) * 20},360,65 C540,${45 + Math.cos(((waveOffset + 90) * Math.PI) / 180) * 18},630,${85 + Math.sin(((waveOffset + 90) * Math.PI) / 180) * 12},720,70 L720,120 L0,120 Z`;
  return (
    <div>
      <section style={{ height: "100vh", background: "linear-gradient(160deg, #0a3547 0%, #0e7fa8 45%, #22d3ee 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        {[...Array(12)].map((_, i) => (
          <div key={i} style={{ position: "absolute", width: "4px", height: "4px", borderRadius: "50%", background: "rgba(125,211,252,0.5)", left: `${8 + i * 7.5}%`, bottom: `${15 + Math.sin(i * 0.8) * 8}%`, animation: `float ${2 + (i % 3)}s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }} />
        ))}
        <div style={{ textAlign: "center", color: "#fff", position: "relative", zIndex: 2 }}>
          <p style={{ fontSize: "0.7rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: "1.5rem" }}>The Ocean-Inspired Defense</p>
          <h1 style={{ fontSize: "clamp(3rem, 7vw, 6rem)", fontWeight: "300", lineHeight: 1.05, marginBottom: "0.3rem", letterSpacing: "0.05em" }}>海洋守護 <span style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)", fontWeight: "700", letterSpacing: "0.3em", color: "#7dd3fc", display: "block" }}>PSK</span> 防曬系列</h1>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.75)", marginTop: "1.5rem", letterSpacing: "0.1em", lineHeight: 1.8 }}>汲取深海精華 · 全天候守護肌膚 · 輕盈如海浪</p>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "120px" }}>
          <svg viewBox="0 0 720 120" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <path d={wave2} fill="rgba(240,249,255,0.4)" /><path d={wave1} fill="#f0f9ff" />
          </svg>
        </div>
      </section>

      <section style={{ background: "#f0f9ff", padding: "6rem 2.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "#0e7fa8", marginBottom: "0.75rem" }}>Product Collection</p>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: "300", lineHeight: 1.15, color: "#0a3547", marginBottom: "1rem" }}>精選防曬<br /><em style={{ fontStyle: "normal", fontWeight: "bold", color: "#0e7fa8" }}>海洋系列</em></h2>
          <div style={{ width: "60px", height: "2px", background: "linear-gradient(90deg, #0e7fa8, #22d3ee)", margin: "1.5rem 0 3rem" }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
            {products.map((p) => (
              <div key={p.id} style={{ background: "#fff", border: "1px solid rgba(14,127,168,0.1)", padding: "2rem", cursor: "pointer", transition: "all 0.4s ease", transform: hoveredProduct === p.id ? "translateY(-8px)" : "translateY(0)", boxShadow: hoveredProduct === p.id ? "0 20px 60px rgba(14,127,168,0.15)" : "0 2px 20px rgba(14,127,168,0.05)", position: "relative", overflow: "hidden" }} onMouseEnter={() => setHoveredProduct(p.id)} onMouseLeave={() => setHoveredProduct(null)}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${p.color}, ${p.color}88)` }} />
                <div style={{ width: "100%", height: "140px", background: `linear-gradient(135deg, ${p.accent} 0%, ${p.color}15 100%)`, marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="60" height="110" viewBox="0 0 60 110">
                    <rect x="20" y="8" width="20" height="8" rx="3" fill={p.color} opacity="0.6" />
                    <rect x="15" y="16" width="30" height="80" rx="8" fill={p.color} opacity="0.8" />
                    <text x="30" y="65" textAnchor="middle" fill="white" fontSize="8" fontFamily="Georgia" opacity="0.9">PSK</text>
                  </svg>
                </div>
                <span style={{ display: "inline-block", padding: "0.2rem 0.7rem", background: p.color + "22", color: p.color, fontSize: "0.6rem", letterSpacing: "0.3em", marginBottom: "1rem" }}>{p.tag}</span>
                <h3 style={{ fontSize: "1.3rem", fontWeight: "600", color: "#0a3547", marginBottom: "0.25rem" }}>{p.name}</h3>
                <p style={{ fontSize: "0.75rem", color: "#0e7fa8", marginBottom: "0.75rem" }}>{p.subtitle}</p>
                <p style={{ fontSize: "0.65rem", color: "#64748b", marginBottom: "0.75rem" }}>{p.spf}</p>
                <p style={{ fontSize: "0.88rem", color: "#475569", lineHeight: 1.8, marginBottom: "1.5rem" }}>{p.desc}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "1.5rem", fontWeight: "600", color: "#0a3547" }}>{p.price}</span>
                  <button style={{ padding: "0.5rem 1.2rem", background: p.color, border: "none", color: "#fff", fontSize: "0.7rem", cursor: "pointer" }}>加入購物車</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#fff", padding: "6rem 2.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
          <div style={{ height: "480px", background: "linear-gradient(160deg, #e0f7fa, #0e7fa8)", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="100%" height="100%" viewBox="0 0 400 480" style={{ position: "absolute", inset: 0 }}>
              <circle cx="200" cy="200" r="160" fill="rgba(14,127,168,0.1)" />
              <circle cx="200" cy="200" r="80" fill="rgba(14,127,168,0.3)" />
              <text x="200" y="195" textAnchor="middle" fontSize="28" fontFamily="Georgia" fill="#0a3547" fontWeight="600">PSK</text>
              <text x="200" y="220" textAnchor="middle" fontSize="10" fontFamily="Georgia" fill="#0e7fa8" letterSpacing="4">OCEAN SKINCARE</text>
            </svg>
          </div>
          <div>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.5em", color: "#0e7fa8", marginBottom: "0.75rem" }}>Our Story</p>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: "300", color: "#0a3547", marginBottom: "1rem" }}>源於海洋，<br /><em style={{ fontStyle: "normal", fontWeight: "bold", color: "#0e7fa8" }}>守護妳的肌膚</em></h2>
            <div style={{ width: "60px", height: "2px", background: "linear-gradient(90deg, #0e7fa8, #22d3ee)", margin: "1.5rem 0 3rem" }} />
            <p style={{ fontSize: "0.95rem", color: "#475569", lineHeight: 2, marginBottom: "1rem" }}>PSK 誕生於對海洋的深刻敬畏。我們相信，海洋蘊藏著肌膚最需要的一切——純淨、滋養與守護的力量。</p>
            <p style={{ fontSize: "0.95rem", color: "#475569", lineHeight: 2 }}>每一瓶 PSK 防曬品，都提取自嚴選的深海活性成分，結合最新防曬科技，為您打造如海浪般輕盈、如礁石般堅韌的全面防護。</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "2.5rem" }}>
              {[{ num: "10+", label: "年研發經驗" }, { num: "SPF50+", label: "最高防護等級" }, { num: "98%", label: "顧客滿意度" }, { num: "0", label: "動物測試" }].map((s, i) => (
                <div key={i} style={{ padding: "1.5rem", background: "#f0f9ff", borderLeft: "3px solid #0e7fa8" }}>
                  <div style={{ fontSize: "2.2rem", fontWeight: "700", color: "#0e7fa8", lineHeight: 1 }}>{s.num}</div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.3rem" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function EfficiencyPage() {
  const [timer, setTimer] = useState(600);
  useEffect(() => {
    const int = setInterval(() => setTimer(p => p > 0 ? p - 1 : 600), 1000);
    return () => clearInterval(int);
  }, []);
  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  return (
    <div style={{ background: "#e0f2fe", minHeight: "100vh", padding: "8rem 2rem 5rem" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <p style={{ color: "#0e7fa8", letterSpacing: "0.2em", fontWeight: "bold" }}>Efficiency Expert</p>
        <h1 style={{ fontSize: "3rem", color: "#0a3547", marginTop: "0.5rem" }}>極效省時專區</h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "4rem", marginTop: "4rem", alignItems: "center" }}>
          <div style={{ background: "#fff", borderRadius: "50%", width: "300px", height: "300px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.08)", margin: "0 auto" }}>
            <span style={{ fontSize: "1rem", color: "#64748b" }}>早晨出門倒數</span>
            <div style={{ fontSize: "4.5rem", fontWeight: "700", color: "#0e7fa8", lineHeight: 1 }}>{formatTime(timer)}</div>
          </div>
          <div>
            <h2 style={{ fontSize: "2rem", color: "#0a3547", marginBottom: "1rem" }}>取代繁瑣，一抹即出門</h2>
            <p style={{ fontSize: "1.05rem", color: "#475569", lineHeight: 1.8 }}>我們了解上班族女性早晨僅有 5-10 分鐘的準備時間。PSK 二合一防曬能完美取代「防曬+底妝」的繁瑣步驟。<br /><br /><b>質地清爽、快速推勻不黏膩</b>，直接回應您對質地的高標準要求。</p>
          </div>
        </div>
        <VideoUploadBox title="⏱️ 發起挑戰：妳的 5 分鐘出門神技" description="妳也是省時戰神嗎？上傳妳使用 PSK 防曬「一抹即出門」的短影片，過審即贈 $500 購物金！" challengeTag="#PSK五分鐘戰神" />
      </div>
    </div>
  );
}

function OceanPage() {
  return (
    <div style={{ background: "#0a3547", minHeight: "100vh", padding: "8rem 2rem 5rem", color: "#fff" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <p style={{ color: "#7dd3fc", letterSpacing: "0.2em", fontWeight: "bold" }}>Ocean Friendly</p>
        <h1 style={{ fontSize: "3rem", marginTop: "0.5rem" }}>海洋友善專區</h1>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "4rem", marginTop: "4rem" }}>
          <div>
            <h2 style={{ fontSize: "2rem", color: "#7dd3fc", marginBottom: "1.5rem" }}>我們對海洋的承諾</h2>
            <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.9 }}>PSK 全系列防曬不添加任何對珊瑚有害的化學成分。結合「成分溫和」與「環境永續」，是我們最堅定的承諾。</p>
          </div>
          <div style={{ background: "rgba(255,255,255,0.05)", padding: "2rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <h3 style={{ fontSize: "1.3rem", marginBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.2)", paddingBottom: "1rem" }}>成分紅綠燈</h3>
            {[{ color: "#10b981", text: "礦物物理防曬劑 (安全首選)", strike: false }, { color: "#10b981", text: "深海珊瑚活萃 (天然修護)", strike: false }, { color: "#ef4444", text: "二苯甲酮 Oxybenzone (珊瑚殺手)", strike: true }].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: "1rem", opacity: item.strike ? 0.5 : 1 }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: item.color, marginRight: "1rem", flexShrink: 0 }} />
                <span style={{ fontSize: "0.95rem", textDecoration: item.strike ? "line-through" : "none" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <VideoUploadBox title="🌊 發起挑戰：帶 PSK 去看海" description="上傳妳帶著 PSK 防曬在海邊、潛水或水上活動的短影片，證明我們對肌膚與海洋都很溫柔！" challengeTag="#PSK海洋大使" />
      </div>
    </div>
  );
}

export default function PSKApp() {
  return (
    <Router>
      <div style={{ fontFamily: "'Cormorant Garamond', 'Noto Sans TC', sans-serif" }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/efficiency" element={<EfficiencyPage />} />
          <Route path="/ocean" element={<OceanPage />} />
        </Routes>
        <footer style={{ background: "#06222e", color: "rgba(255,255,255,0.5)", padding: "3rem 2rem", textAlign: "center", fontSize: "0.85rem" }}>
          <p>© 2026 PSK Ocean Skincare. All rights reserved.</p>
        </footer>
        <style>{`
          @keyframes float { 0%, 100% { transform: translateY(0px); opacity: 0.5; } 50% { transform: translateY(-12px); opacity: 0.9; } }
          button:hover { opacity: 0.88; }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { overflow-x: hidden; }
        `}</style>
      </div>
    </Router>
  );
}
