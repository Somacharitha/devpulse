import { useState, useEffect, useRef } from 'react';
import './Auth.css';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  // ── Particle canvas ──────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 55 }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      r:  Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      a:  Math.random(),
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width)  p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,232,122,${p.a * 0.35})`;
        ctx.fill();
      });

      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 90) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(0,232,122,${0.06 * (1 - d / 90)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // ── Submit ───────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isLogin ? 'login' : 'register';
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/${endpoint}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        }
      );
      const data = await response.json();
      if (!response.ok) { alert(data.message); return; }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.reload();
    } catch (err) {
      console.log(err);
      alert('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <canvas ref={canvasRef} className="auth-canvas" />
      <div className="auth-glow-orb" />

      <div className="auth-badge">
        <span className="badge-dot" />
        System Online
      </div>

      <div className="auth-card">

        {/* ── LEFT ── */}
        <div className="auth-left">
          <div className="auth-left-inner">

            <div className="auth-logo-row">
              <div className="logo-sq">D</div>
              <span className="logo-text">Dev<em>Pulse</em></span>
            </div>

            <div className="terminal-line">github_analytics.init()</div>

            <h1 className="auth-headline">
              Your code.<br />
              Your <span className="g">metrics.</span><br />
              Amplified.
            </h1>

            <p className="auth-tagline">
              Real-time GitHub analytics for developers who ship fast and grow faster.
            </p>

            <div className="code-snippet">
              <span className="cm">{'// live dashboard'}</span><br />
              <span className="ck">const</span>{' pulse '}
              <span className="cm">=</span>{' '}
              <span className="cs">DevPulse</span>
              <span className="cm">.</span>
              <span className="cn">connect</span>(<br />
              &nbsp;&nbsp;<span className="cs">"your_username"</span><br />
              );<span className="cursor" />
            </div>

          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="auth-right">
          <form className="auth-form" onSubmit={handleSubmit}>

            <div className="auth-form-head">
              <h2>
                {isLogin
                  ? <>Welcome <span>back.</span></>
                  : <>Get <span>started.</span></>
                }
              </h2>
              <p>
                {isLogin
                  ? 'Sign in to your account'
                  : 'Create your DevPulse account'
                }
              </p>
            </div>

            {!isLogin && (
              <div className="field-group name-field">
                <label>Full Name</label>
                <input
                  type="text"
                  className="auth-input"
                  placeholder="your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="field-group">
              <label>Email</label>
              <input
                type="email"
                className="auth-input"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label>Password</label>
              <input
                type="password"
                className="auth-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="auth-btn"
              disabled={loading}
            >
              <span className="btn-shimmer" />
              {loading
                ? 'Please wait...'
                : isLogin ? 'Sign In →' : 'Create Account →'
              }
            </button>

            <div className="auth-divider"><span>or</span></div>

            <p className="auth-switch">
              {isLogin ? (
                <>No account?{' '}
                  <span onClick={() => setIsLogin(false)}>Register for free</span>
                </>
              ) : (
                <>Already have one?{' '}
                  <span onClick={() => setIsLogin(true)}>Sign in</span>
                </>
              )}
            </p>

          </form>
        </div>

      </div>
    </div>
  );
}

export default Auth;
