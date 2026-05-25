"use client";
import React, { useState } from "react";

type HotelCardProps = {
  name:        string | any;
  url?:        string | any;
  price:       string | any;
  rating:      number | any;
  description: string | any;
  onClick?:    () => void;
  image?:      string | any;
  issmall?:    boolean;
};

const HotelCard: React.FC<HotelCardProps> = ({
  name, price, rating, description, url, image, issmall,
}) => {
  const [imgError, setImgError] = useState(false);
  const stars  = Math.min(5, Math.max(0, Math.floor(Number(rating) || 0)));
  const hasUrl = url && url !== "N/A";
  const w      = issmall ? "170px" : "240px";
  const h      = issmall ? "230px" : "300px";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        .hc-root {
          position:     relative;
          width:        ${w};
          height:       ${h};
          border-radius:18px;
          overflow:     hidden;
          flex-shrink:  0;
          cursor:       ${hasUrl ? "pointer" : "default"};
          font-family:  'DM Sans', sans-serif;
          transform:    translateY(0) scale(1);
          transition:   transform 0.4s cubic-bezier(0.34,1.56,0.64,1),
                        box-shadow 0.4s ease;
          box-shadow:   0 4px 20px rgba(0,0,0,0.18);
        }
        .hc-root:hover {
          transform:  translateY(-7px) scale(1.025);
          box-shadow: 0 22px 55px rgba(0,0,0,0.35);
        }
        .hc-bg {
          position:   absolute;
          inset:      0;
          width:      100%;
          height:     100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        .hc-root:hover .hc-bg { transform: scale(1.09); }
        .hc-placeholder {
          position:        absolute;
          inset:           0;
          display:         flex;
          align-items:     center;
          justify-content: center;
          background:      linear-gradient(145deg,#1a1a2e 0%,#16213e 55%,#0f3460 100%);
          font-size:       40px;
        }
        .hc-overlay {
          position:   absolute;
          inset:      0;
          background: linear-gradient(to top,
            rgba(0,0,0,0.93) 0%,
            rgba(0,0,0,0.48) 45%,
            rgba(0,0,0,0.08) 100%);
          transition: background 0.4s ease;
        }
        .hc-root:hover .hc-overlay {
          background: linear-gradient(to top,
            rgba(0,0,0,0.97) 0%,
            rgba(0,0,0,0.62) 52%,
            rgba(0,0,0,0.14) 100%);
        }
        .hc-badge {
          position:       absolute;
          top:            12px;
          right:          12px;
          background:     rgba(255,255,255,0.11);
          backdrop-filter:blur(12px);
          -webkit-backdrop-filter:blur(12px);
          border:         1px solid rgba(255,255,255,0.22);
          color:          #fff;
          font-size:      10px;
          font-weight:    500;
          letter-spacing: 0.4px;
          padding:        3px 10px;
          border-radius:  20px;
        }
        .hc-content {
          position:       absolute;
          bottom:         0;
          left:           0;
          right:          0;
          padding:        ${issmall ? "12px" : "16px"};
          display:        flex;
          flex-direction: column;
          gap:            ${issmall ? "5px" : "7px"};
        }
        .hc-stars { display:flex; gap:2px; }
        .hc-star {
          font-size:   ${issmall ? "9px" : "11px"};
          line-height: 1;
          transition:  transform 0.2s ease;
        }
        .hc-root:hover .hc-star-on { transform:scale(1.25); }
        .hc-name {
          margin:      0;
          font-family: 'DM Serif Display', serif;
          font-size:   ${issmall ? "13px" : "16px"};
          font-weight: 400;
          color:       #fff;
          line-height: 1.25;
          display:     -webkit-box;
          -webkit-line-clamp:2;
          -webkit-box-orient:vertical;
          overflow:    hidden;
          text-shadow: 0 1px 8px rgba(0,0,0,0.5);
        }
        .hc-price {
          font-size:     ${issmall ? "10px" : "12px"};
          font-weight:   300;
          color:         rgba(255,255,255,0.65);
          letter-spacing:0.1px;
        }
        .hc-price strong {
          font-weight: 500;
          color:       #7dd3fc;
        }
        .hc-btn {
          width:          100%;
          padding:        ${issmall ? "5px 0" : "8px 0"};
          background:     rgba(255,255,255,0.09);
          backdrop-filter:blur(8px);
          -webkit-backdrop-filter:blur(8px);
          border:         1px solid rgba(255,255,255,0.22);
          border-radius:  10px;
          color:          #fff;
          font-family:    'DM Sans', sans-serif;
          font-size:      ${issmall ? "9px" : "11px"};
          font-weight:    500;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor:         pointer;
          transition:     background 0.22s ease, border-color 0.22s ease,
                          transform 0.18s ease;
          margin-top:     ${issmall ? "2px" : "4px"};
        }
        .hc-btn:hover {
          background:   rgba(14,165,233,0.28);
          border-color: rgba(125,211,252,0.55);
          transform:    translateY(-1px);
        }
        .hc-btn:active { transform:translateY(0); }
        /* Shine sweep */
        .hc-root::after {
          content:        '';
          position:       absolute;
          top:            0;
          left:           -80%;
          width:          50%;
          height:         100%;
          background:     linear-gradient(to right,
            rgba(255,255,255,0)    0%,
            rgba(255,255,255,0.07) 50%,
            rgba(255,255,255,0)    100%);
          transform:      skewX(-18deg);
          pointer-events: none;
          transition:     left 0s;
        }
        .hc-root:hover::after {
          left:       130%;
          transition: left 0.5s ease;
        }
      `}</style>

      <div
        className="hc-root"
        onClick={() => hasUrl && window.open(url, "_blank")}
      >
        {image && !imgError ? (
          <img
            className="hc-bg"
            src={image}
            alt={name}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="hc-placeholder">🏨</div>
        )}

        <div className="hc-overlay" />

        {price && price !== "N/A" && (
          <div className="hc-badge">{price}</div>
        )}

        <div className="hc-content">

          <div className="hc-stars">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`hc-star ${i < stars ? "hc-star-on" : ""}`}
                style={{ color: i < stars ? "#f59e0b" : "rgba(255,255,255,0.22)" }}
              >★</span>
            ))}
          </div>

          <p className="hc-name">{name}</p>

          {price && price !== "N/A" && (
            <p className="hc-price">From <strong>{price}</strong> / night</p>
          )}

          {hasUrl && (
            <button
              className="hc-btn"
              onClick={(e) => { e.stopPropagation(); window.open(url, "_blank"); }}
            >
              Reserve
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default HotelCard;