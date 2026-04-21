import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";

const SERVER = "https://psk-backend-production.up.railway.app";

// ── Design tokens ──────────────────────────────────────────────
const T = {
  cream:   "#f5f0ea",
  sand:    "#ede5d8",
  border:  "#d9cfc4",
  muted:   "#9c8472",
  body:    "#6b5542",
  dark:    "#2c1f14",
  darker:  "#1e1410",
  panel:   "#3a2a1c",
  panelBorder: "#3d2c1e",
  gold:    "#c4a882",
};

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Noto+Sans+TC:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Noto Sans TC', sans-serif; background: ${T.cream}; color: ${T.dark}; overflow-x: hidden; }
  button { font-family: inherit; cursor: pointer; }
  a { text-decoration: none; }
  @keyframes float {
    0%, 100% { transform: translateY(0); opacity: 0.4; }
    50%       { transform: translateY(-10px); opacity: 0.8; }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

// ── Shared sub-components ──────────────────────────────────────
const SectionEyebrow = ({ children }) => (
  <p style={{ fontSize: "0.58rem", letterSpacing: "0.5em", textTransform: "uppercase", color: T.muted, marginBottom: "0.6rem" }}>
    {children}
  </p>
);

const SectionTitle = ({ children }) => (
  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem,3.5vw,2.4rem)", fontWeight: 300, color: T.dark, lineHeight: 1.15 }}>
    {children}
  </h2>
);

const Divider = () => (
  <div style={{ width: 40, height: 1, background: T.gold, margin: "1.2rem 0 2.8rem" }} />
);

// ── Tube SVG ───────────────────────────────────────────────────
function TubeSVG({ fill, textFill = "#3a2a1c", w = 48, h = 122, showNew = false }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {showNew && <text x="2" y="20" fill={T.gold} fontSize="7" fontWeight="bold" fontFamily="sans-serif">NEW</text>}
      <rect x={w * 0.33} y="6" width={w * 0.34} height="5" rx="2" fill={T.muted} />
      <rect x={w * 0.22} y="11" width={w * 0.56} height={h * 0.72} rx="8" fill={fill} />
      <text x={w / 2} y={h * 0.5} textAnchor="middle" fill={textFill} fontSize="5" fontFamily="serif" letterSpacing="1.2">PSK</text>
      <text x={w / 2} y={h * 0.76} textAnchor="middle" fill={textFill} fontSize="6" fontWeight="bold" fontFamily="sans-serif">50+</text>
      <rect x={w * 0.33} y={h * 0.81} width={w * 0.34} height={h * 0.13} rx="2" fill={T.panelBorder} />
    </svg>
  );
}

// ── Products data ──────────────────────────────────────────────
const products = [
  { id: 1, name: "N01 明亮色", shade: "Light Beige", tag: "暢銷 · Bestseller", skin: "適合中性或白皙肌膚，自然提亮，不泛白不厚重。", fill: "#c4a882", swatch: "#dfc4a0", textFill: "#3a2a1c", bgGrad: "linear-gradient(160deg,#e8d8c4,#f0e4d0)" },
  { id: 2, name: "N02 自然色", shade: "Nature Beige", tag: "熱銷 · Popular",   skin: "適合自然或偏黃肌膚，打造無瑕裸妝感，遮蓋暗沉與毛孔。", fill: "#b89a7e", swatch: "#b89a7e", textFill: "#f5f0ea", bgGrad: "linear-gradient(160deg,#dbc8b0,#e8d8c4)" },
  { id: 3, name: "N03 健康色", shade: "Light Bronze",  tag: "戶外首選 · Outdoor", skin: "適合戶外活動或偏深膚色，自然健康色調，修飾均勻膚色。", fill: "#9a7855", swatch: "#9a7855", textFill: "#f5f0ea", bgGrad: "linear-gradient(160deg,#c8a880,#d8bc98)" },
  { id: 4, name: "白色款",    shade: "Sunscreen",     tag: "新品 · New Arrival", skin: "適合各種膚色及暗沉肌，無色妝前打底，與任何底妝完美疊用。", fill: "#e8e0d4", swatch: "#e0d8cc", textFill: "#3a2a1c", bgGrad: "linear-gradient(160deg,#ece8e2,#f5f2ee)", isNew: true },
];

const features = [
  { num: "01", title: "純物理高係數防曬",       desc: "SPF50+ PA++++，UVA/UVB 雙重全波段保護，以純礦物物理性防曬劑阻隔紫外線，肌膚零負擔。" },
  { num: "02", title: "底妝 × 遮瑕 × 防曬一瓶搞定", desc: "潤色修飾粗毛孔、暗沉不均，打造自然零瑕服貼底妝，省去繁複妝前步驟。" },
  { num: "03", title: "帛琉海洋友善認證",       desc: "符合全球目前最嚴格的帛琉海洋保護友善規範，不添加對珊瑚礁有害成分。" },
  { num: "04", title: "敏感肌首選配方",         desc: "無添加酒精、香料、香精及令人疑慮的防腐劑，敏感肌、孕婦、醫美術後皆可安心使用。" },
  { num: "05", title: "輕盈不泛白不黏膩",       desc: "歷時三年技術突破，超輕盈清透質地，零油感，快速推勻不悶，純物理防曬首次實現不泛白體驗。" },
  { num: "06", title: "保濕控油雙效合一",       desc: "添加長效鎖水成分深層保濕，有效抑制皮脂分泌，改善出油問題，全天維持清爽妝感。" },
];

const ingredients = [
  { name: "海藻抑油淨因子", trade: "Phlorogin® BG PF",    desc: "有效抑制皮脂分泌，改善皮脂分泌紊亂，深層長效保濕，讓肌膚全天清爽不泛油光。" },
  { name: "肌膚防護因子",   trade: "RonaCare® AP",        desc: "高端智慧型護膚材料，強化長效 UVA/UVB 隔離，讓防護力更持久穩定。" },
  { name: "鎖水磁石",       trade: "Pentavitin®",         desc: "深層長效鎖水，模擬肌膚天然保濕機制，讓肌膚保持水潤不乾燥。" },
  { name: "澳洲塔斯曼尼亞胡椒莓", trade: "Tazman Pepper™ AF", desc: "天然抗氧化與抗發炎特性，舒緩日曬後不適，穩定肌膚狀態。" },
];

// ── Navbar ─────────────────────────────────────────────────────
function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const solid = scrolled || !isHome;
  const navStyle = {
    position: "fixed", top: 0, width: "100%", zIndex: 100,
    padding: "1.2rem 2.5rem",
    display: "flex", justifyContent: "space-between", alignItems: "center",
    background: solid ? "rgba(245,240,234,0.97)" : "transparent",
    borderBottom: solid ? `1px solid ${T.border}` : "none",
    backdropFilter: "blur(12px)",
    transition: "all 0.4s ease",
  };

  const linkColor = (path) => ({
    color: location.pathname === path ? T.gold : (solid ? T.body : "rgba(245,240,234,0.8)"),
    fontSize: "0.72rem", letterSpacing: "0.2em",
    fontWeight: location.pathname === path ? 500 : 400,
    transition: "color 0.3s",
  });

  const logoColor = solid ? T.dark : T.cream;

  return (
    <nav style={navStyle}>
      <Link to="/">
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 300, letterSpacing: "0.25em", color: logoColor, transition: "color 0.4s" }}>PSK</div>
        <div style={{ fontSize: "0.48rem", letterSpacing: "0.5em", textTransform: "uppercase", color: solid ? T.gold : "rgba(245,240,234,0.6)", marginTop: -4, transition: "color 0.4s" }}>深海美肌專家</div>
      </Link>
      <ul style={{ display: "flex", gap: "2.5rem", listStyle: "none" }}>
        {[{ to: "/", label: "首頁" }, { to: "/efficiency", label: "極效省時" }, { to: "/ocean", label: "海洋友善" }].map(({ to, label }) => (
          <li key={to}><Link to={to} style={linkColor(to)}>{label}</Link></li>
        ))}
      </ul>
    </nav>
  );
}

// ── VideoUploadBox ─────────────────────────────────────────────
function VideoUploadBox({ title, description, challengeTag }) {
  const [videoFile, setVideoFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [uploaderName, setUploaderName] = useState("");
  const [email, setEmail] = useState("");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const inputStyle = {
    width: "100%", padding: "0.65rem 0.85rem",
    border: `1px solid ${T.border}`, borderRadius: 0,
    fontSize: "0.875rem", background: T.cream,
    color: T.dark, outline: "none",
    fontFamily: "inherit",
  };

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
    <div style={{ background: T.cream, padding: "3rem", border: `1px solid ${T.border}`, marginTop: "3rem" }}>
      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", fontWeight: 400, color: T.dark, marginBottom: "0.5rem" }}>{title}</h3>
      <p style={{ color: T.body, fontSize: "0.88rem", lineHeight: 1.8, marginBottom: "2rem" }}>{description}</p>

      {status === "success" ? (
        <div style={{ padding: "2rem", background: T.sand, color: T.body, textAlign: "center", fontWeight: 500, letterSpacing: "0.05em" }}>
          影片上傳成功！感謝參與 {challengeTag} 挑戰，審核後將發送購物金至您的信箱。
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
            <div>
              <label style={{ fontSize: "0.7rem", color: T.muted, display: "block", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>姓名 *</label>
              <input type="text" value={uploaderName} onChange={e => setUploaderName(e.target.value)} placeholder="請輸入您的姓名" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: "0.7rem", color: T.muted, display: "block", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>信箱（接收購物金）</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={inputStyle} />
            </div>
          </div>

          <div style={{ border: `1px dashed ${T.border}`, padding: "3rem", textAlign: "center", background: T.sand, position: "relative", cursor: "pointer" }}>
            <p style={{ color: videoFile ? T.gold : T.muted, fontSize: "0.85rem" }}>
              {videoFile ? `${videoFile.name}  (${(videoFile.size / 1e6).toFixed(1)} MB)` : "點擊或拖曳實測影片至此處 (MP4/MOV)"}
            </p>
            <input type="file" accept="video/*" onChange={e => setVideoFile(e.target.files[0])} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
          </div>

          {status === "uploading" && (
            <div style={{ marginTop: "1rem" }}>
              <div style={{ height: 4, background: T.border, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: T.gold, transition: "width 0.3s" }} />
              </div>
              <p style={{ fontSize: "0.75rem", color: T.muted, marginTop: "0.5rem", textAlign: "center" }}>上傳中… {progress}%</p>
            </div>
          )}

          {errorMsg && (
            <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", background: "#fee2e2", color: "#dc2626", fontSize: "0.85rem" }}>
              {errorMsg}
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!videoFile || status === "uploading"}
            style={{
              width: "100%", marginTop: "1.5rem", padding: "1rem",
              border: "none", background: videoFile ? T.dark : T.border,
              color: videoFile ? T.cream : T.muted,
              fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.2em",
              cursor: videoFile ? "pointer" : "not-allowed", transition: "all 0.3s",
            }}
          >
            {status === "uploading" ? `上傳中… ${progress}%` : "確認上傳影片"}
          </button>
        </>
      )}
    </div>
  );
}

// ── HomePage ───────────────────────────────────────────────────
function HomePage() {
  const [hovered, setHovered] = useState(null);

  return (
    <div>
      {/* HERO */}
      <section style={{ background: T.dark, display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "100vh" }}>
        <div style={{ padding: "clamp(4rem,8vw,6rem) clamp(2rem,4vw,3.5rem)", display: "flex", flexDirection: "column", justifyContent: "center", borderRight: `1px solid ${T.panelBorder}` }}>
          <p style={{ fontSize: "0.58rem", letterSpacing: "0.55em", textTransform: "uppercase", color: T.muted, marginBottom: "1.5rem" }}>
            Pure Physical Sunscreen · SPF50+
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.8rem,5vw,4rem)", fontWeight: 300, lineHeight: 1.08, color: T.cream, marginBottom: "1.8rem" }}>
            純物理<br />全能潤色<br /><em style={{ fontStyle: "italic", color: T.gold }}>隔離霜</em>
          </h1>

          {/* HIGHLIGHT PILL */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.7rem",
            background: T.gold, color: T.dark,
            fontSize: "0.95rem", fontWeight: 500, letterSpacing: "0.08em",
            padding: "0.65rem 1.3rem", marginBottom: "1.8rem", alignSelf: "flex-start",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.dark, flexShrink: 0 }} />
            底妝 × 遮瑕 × 防曬　一瓶搞定
          </div>

          <p style={{ fontSize: "0.82rem", color: "rgba(245,240,234,0.6)", lineHeight: 2, marginBottom: "2.5rem", maxWidth: 360 }}>
            無酒精、無香精，符合帛琉全球最嚴格海洋保護規範。<br />敏感肌、醫美術後皆適用。
          </p>
          <button style={{ display: "inline-block", padding: "0.75rem 2rem", border: `1px solid ${T.gold}`, color: T.gold, fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", background: "transparent", alignSelf: "flex-start", transition: "all 0.3s" }}
            onMouseEnter={e => { e.currentTarget.style.background = T.gold; e.currentTarget.style.color = T.dark; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.gold; }}>
            立即選購
          </button>
        </div>

        {/* HERO TUBES */}
        <div style={{ background: T.panel, display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 2rem" }}>
          <div style={{ display: "flex", gap: "1.2rem", alignItems: "flex-end" }}>
            {[
              { fill: "#c4a882", label: "N01 明亮", h: 118, tF: "#3a2a1c" },
              { fill: "#b89a7e", label: "N02 自然", h: 140, tF: "#f5f0ea", offset: true },
              { fill: "#9a7855", label: "N03 健康", h: 118, tF: "#f5f0ea" },
              { fill: "#e8e0d4", label: "白色 NEW", h: 140, tF: "#3a2a1c", isNew: true, offset: true },
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", marginBottom: t.offset ? 18 : 0 }}>
                <TubeSVG fill={t.fill} textFill={t.tF} w={t.offset ? 50 : 44} h={t.h} showNew={t.isNew} />
                <span style={{ fontSize: "0.5rem", letterSpacing: "0.1em", color: T.muted, textAlign: "center" }}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES BAR */}
      <div style={{ background: T.dark, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, backgroundColor: T.panelBorder }}>
        {[
          { title: "SPF50+ PA++++",    desc: "純物理 UVA/UVB 全波段防護" },
          { title: "海洋友善認證",     desc: "符合帛琉最嚴格海洋保護規範" },
          { title: "無酒精 · 無香精", desc: "敏感肌、孕婦、醫美術後適用" },
          { title: "底妝三合一",       desc: "防曬 · 遮瑕 · 潤色 · 修飾毛孔" },
        ].map((f, i) => (
          <div key={i} style={{ background: T.dark, padding: "1.4rem 1.5rem" }}>
            <div style={{ fontSize: "0.68rem", letterSpacing: "0.12em", color: T.gold, marginBottom: "0.3rem" }}>{f.title}</div>
            <div style={{ fontSize: "0.68rem", color: "rgba(245,240,234,0.5)", lineHeight: 1.6 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* PRODUCTS */}
      <section style={{ padding: "5rem 2.5rem", background: T.cream }}>
        <SectionEyebrow>Product Collection</SectionEyebrow>
        <SectionTitle>訂製亞洲色號，<br /><strong style={{ fontWeight: 600 }}>選出你的命定色</strong></SectionTitle>
        <Divider />
        <div style={{ display: "inline-block", background: T.sand, color: T.body, fontSize: "0.6rem", letterSpacing: "0.3em", padding: "0.3rem 0.8rem", marginBottom: "2rem" }}>
          四款色調 · 全膚色適用
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1.5, background: T.border }}>
          {products.map((p) => (
            <div key={p.id}
              style={{ background: hovered === p.id ? T.sand : T.cream, padding: "2rem 1.6rem", display: "flex", flexDirection: "column", transition: "background 0.3s", cursor: "pointer" }}
              onMouseEnter={() => setHovered(p.id)} onMouseLeave={() => setHovered(null)}>
              <div style={{ width: "100%", aspectRatio: "3/4.2", background: p.bgGrad, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", position: "relative", overflow: "hidden" }}>
                {p.isNew && <div style={{ position: "absolute", top: "0.6rem", right: "0.6rem", background: T.dark, color: T.gold, fontSize: "0.48rem", letterSpacing: "0.2em", padding: "0.2rem 0.45rem" }}>NEW</div>}
                <TubeSVG fill={p.fill} textFill={p.textFill} w={48} h={122} />
                <div style={{ position: "absolute", bottom: "0.8rem", left: "50%", transform: "translateX(-50%)", width: 36, height: 6, borderRadius: 3, background: p.swatch }} />
              </div>
              <p style={{ fontSize: "0.52rem", letterSpacing: "0.3em", textTransform: "uppercase", color: T.muted, marginBottom: "0.4rem" }}>{p.tag}</p>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 400, color: T.dark, marginBottom: "0.2rem" }}>{p.name}</h3>
              <p style={{ fontSize: "0.65rem", color: T.muted, fontStyle: "italic", marginBottom: "0.5rem" }}>{p.shade}</p>
              <p style={{ fontSize: "0.75rem", color: T.body, lineHeight: 1.8, flex: 1, marginBottom: "1.2rem" }}>{p.skin}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${T.border}`, paddingTop: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "0.65rem", color: "#b0a090", textDecoration: "line-through" }}>NT$750</span>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 300, color: T.dark }}>NT$499</span>
                </div>
                <button style={{ fontSize: "0.55rem", letterSpacing: "0.12em", color: T.muted, border: `1px solid ${T.gold}`, padding: "0.35rem 0.7rem", background: "transparent", transition: "all 0.3s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = T.dark; e.currentTarget.style.color = T.cream; e.currentTarget.style.borderColor = T.dark; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.muted; e.currentTarget.style.borderColor = T.gold; }}>
                  加入購物車
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCT FEATURES */}
      <section style={{ padding: "5rem 2.5rem", background: T.sand }}>
        <SectionEyebrow>Product Features</SectionEyebrow>
        <SectionTitle>六大核心優勢，<br /><strong style={{ fontWeight: 600 }}>為妳的肌膚而生</strong></SectionTitle>
        <Divider />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1.5, background: T.border }}>
          {features.map((f) => (
            <div key={f.num} style={{ background: T.sand, padding: "2rem 1.8rem" }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 300, color: T.gold, marginBottom: "0.4rem" }}>{f.num}</div>
              <div style={{ fontSize: "0.85rem", fontWeight: 500, color: T.dark, marginBottom: "0.5rem" }}>{f.title}</div>
              <div style={{ fontSize: "0.75rem", color: T.body, lineHeight: 1.8 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* INGREDIENTS */}
      <section style={{ padding: "5rem 2.5rem", background: T.dark }}>
        <SectionEyebrow><span style={{ color: T.muted }}>Key Ingredients</span></SectionEyebrow>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem,3vw,2.2rem)", fontWeight: 300, color: T.cream, lineHeight: 1.15, marginTop: "0.4rem" }}>明星成分解析</h2>
        <Divider />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 1.5, background: T.panelBorder }}>
          {ingredients.map((ing) => (
            <div key={ing.name} style={{ background: T.dark, padding: "1.8rem" }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: T.gold, marginBottom: "0.3rem" }}>{ing.name}</div>
              <div style={{ fontSize: "0.6rem", color: T.muted, letterSpacing: "0.1em", marginBottom: "0.6rem" }}>{ing.trade}</div>
              <div style={{ fontSize: "0.75rem", color: "rgba(245,240,234,0.55)", lineHeight: 1.7 }}>{ing.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: T.sand }}>
        <div style={{ background: T.dark, minHeight: 420, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="220" height="260" viewBox="0 0 220 260">
            <circle cx="110" cy="120" r="85" fill="none" stroke={T.panelBorder} strokeWidth="1" />
            <circle cx="110" cy="120" r="54" fill="rgba(196,168,130,0.06)" stroke={T.gold} strokeWidth="0.5" />
            <text x="110" y="114" textAnchor="middle" fill={T.cream} fontSize="28" fontFamily="Cormorant Garamond,serif" fontWeight="300" letterSpacing="4">PSK</text>
            <text x="110" y="132" textAnchor="middle" fill={T.gold} fontSize="7" fontFamily="sans-serif" letterSpacing="3">DEEP SEA SKINCARE</text>
            <text x="110" y="218" textAnchor="middle" fill="rgba(245,240,234,0.18)" fontSize="9" fontFamily="Cormorant Garamond,serif" letterSpacing="5">SINCE 2021</text>
          </svg>
        </div>
        <div style={{ padding: "5rem 3.5rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <SectionEyebrow>Our Story</SectionEyebrow>
          <SectionTitle>簡單保養，<br /><strong style={{ fontWeight: 600 }}>自然美妝</strong></SectionTitle>
          <Divider />
          <p style={{ fontSize: "0.82rem", color: T.body, lineHeight: 2, marginBottom: "1rem" }}>
            PSK 深海美肌專家以「簡單保養、自然美妝」為核心理念，歷時三年研發突破，打造出兼具最高防護力與輕盈質地的純物理防曬霜。
          </p>
          <p style={{ fontSize: "0.82rem", color: T.body, lineHeight: 2 }}>
            不添加防腐劑、酒精、香精，通過多項國際認證，是敏感肌、醫美術後及孕婦的溫柔首選。
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", border: `1px solid ${T.border}`, marginTop: "2rem" }}>
            {[{ num: "3年", label: "研發時程" }, { num: "SPF50+", label: "最高防護等級" }, { num: "98%", label: "顧客好評率" }, { num: "0", label: "動物測試" }].map((s, i) => (
              <div key={i} style={{ padding: "1.1rem 1.4rem", borderRight: i % 2 === 0 ? `1px solid ${T.border}` : "none", borderBottom: i < 2 ? `1px solid ${T.border}` : "none" }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.9rem", fontWeight: 300, color: T.dark }}>{s.num}</div>
                <div style={{ fontSize: "0.62rem", color: T.muted, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ── EfficiencyPage ─────────────────────────────────────────────
function EfficiencyPage() {
  const [timer, setTimer] = useState(600);
  useEffect(() => {
    const int = setInterval(() => setTimer(p => p > 0 ? p - 1 : 600), 1000);
    return () => clearInterval(int);
  }, []);
  const fmt = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div style={{ background: T.sand, minHeight: "100vh", padding: "8rem 2.5rem 5rem" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <SectionEyebrow>Efficiency Expert</SectionEyebrow>
        <SectionTitle>極效省時專區</SectionTitle>
        <Divider />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "4rem", alignItems: "center" }}>
          <div style={{ background: T.cream, border: `1px solid ${T.border}`, width: 280, height: 280, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", margin: "0 auto" }}>
            <span style={{ fontSize: "0.7rem", color: T.muted, letterSpacing: "0.2em", marginBottom: "0.8rem" }}>早晨出門倒數</span>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "4rem", fontWeight: 300, color: T.dark, lineHeight: 1 }}>{fmt(timer)}</div>
          </div>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 300, color: T.dark, marginBottom: "1rem" }}>取代繁瑣，一抹即出門</h2>
            <p style={{ fontSize: "0.88rem", color: T.body, lineHeight: 2 }}>
              我們了解上班族女性早晨僅有 5–10 分鐘的準備時間。<br />
              PSK 二合一防曬能完美取代「防曬 + 底妝」的繁瑣步驟。<br /><br />
              <strong>質地清爽、快速推勻不黏膩</strong>，直接回應您對質地的高標準要求。
            </p>
          </div>
        </div>
        <VideoUploadBox title="發起挑戰：妳的 5 分鐘出門神技" description="妳也是省時戰神嗎？上傳妳使用 PSK 防曬「一抹即出門」的短影片，過審即贈 $500 購物金！" challengeTag="#PSK五分鐘戰神" />
      </div>
    </div>
  );
}

// ── OceanPage ──────────────────────────────────────────────────
function OceanPage() {
  return (
    <div style={{ background: T.dark, minHeight: "100vh", padding: "8rem 2.5rem 5rem", color: T.cream }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <p style={{ fontSize: "0.58rem", letterSpacing: "0.5em", textTransform: "uppercase", color: T.gold, marginBottom: "0.6rem" }}>Ocean Friendly</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 300, color: T.cream }}>海洋友善專區</h1>
        <div style={{ width: 40, height: 1, background: T.gold, margin: "1.2rem 0 3rem" }} />

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "4rem" }}>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 300, color: T.gold, marginBottom: "1.5rem" }}>我們對海洋的承諾</h2>
            <p style={{ fontSize: "0.88rem", color: "rgba(245,240,234,0.75)", lineHeight: 2 }}>
              PSK 全系列防曬不添加任何對珊瑚有害的化學成分。結合「成分溫和」與「環境永續」，是我們最堅定的承諾。
            </p>
          </div>
          <div style={{ background: "rgba(255,255,255,0.04)", padding: "2rem", border: `1px solid rgba(255,255,255,0.08)` }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 400, marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: `1px solid rgba(255,255,255,0.1)` }}>成分紅綠燈</h3>
            {[
              { ok: true,  text: "礦物物理防曬劑（安全首選）" },
              { ok: true,  text: "深海珊瑚活萃（天然修護）" },
              { ok: false, text: "二苯甲酮 Oxybenzone（珊瑚殺手）" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: "1rem", opacity: item.ok ? 1 : 0.45 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.ok ? "#6ee7b7" : "#f87171", marginRight: "1rem", flexShrink: 0 }} />
                <span style={{ fontSize: "0.88rem", textDecoration: item.ok ? "none" : "line-through" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <VideoUploadBox title="發起挑戰：帶 PSK 去看海" description="上傳妳帶著 PSK 防曬在海邊、潛水或水上活動的短影片，證明我們對肌膚與海洋都很溫柔！" challengeTag="#PSK海洋大使" />
      </div>
    </div>
  );
}

// ── App root ───────────────────────────────────────────────────
export default function PSKApp() {
  return (
    <Router>
      <style>{globalStyles}</style>
      <Navbar />
      <Routes>
        <Route path="/"           element={<HomePage />} />
        <Route path="/efficiency" element={<EfficiencyPage />} />
        <Route path="/ocean"      element={<OceanPage />} />
      </Routes>
      <footer style={{ background: T.darker, color: "rgba(245,240,234,0.3)", padding: "2rem", textAlign: "center", fontSize: "0.72rem", letterSpacing: "0.1em" }}>
        © 2026 PSK 深海美肌專家 · All rights reserved
      </footer>
    </Router>
  );
}
