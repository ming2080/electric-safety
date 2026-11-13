import React, { useState } from 'react';
import { 
  User, Lock, Zap, ArrowRight, Sparkles, Cpu, Radio, Eye, EyeOff 
} from 'lucide-react';
import { UserRole } from '../types';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      if (username === 'admin' || username === 'supervisor' || username === 'inspector' || username === 'root') {
        const role: UserRole = username === 'supervisor' ? 'supervisor' : username === 'inspector' ? 'inspector' : 'admin';
        onLogin(role);
      } else {
        setError('用户名或密码错误，请检查输入');
      }
    }, 500);
  };


  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#050b14] text-slate-100 font-sans overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      
      {/* ===================== LEFT SIDE: Power & Energy Visual Section (左侧电力画面) ===================== */}
      <div className="relative w-full lg:w-7/12 min-h-[460px] lg:min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-hidden border-b lg:border-b-0 lg:border-r border-cyan-500/20 bg-gradient-to-br from-[#061224] via-[#081832] to-[#040914]">
        
        {/* Subtle Cyber Grid Background */}
        <div 
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(6, 182, 212, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(6, 182, 212, 0.12) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Dynamic Glow Orbs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[28rem] h-[28rem] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none" />

        {/* High-Fidelity Power Grid Transmission & Substation SVG Illustration */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          <svg className="w-full h-full min-w-[700px] opacity-80" viewBox="0 0 900 800" fill="none" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Sky and Terrain Gradients */}
              <linearGradient id="skyGrad" x1="450" y1="0" x2="450" y2="800" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0b2447" stopOpacity="0.4" />
                <stop offset="60%" stopColor="#051429" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#020813" stopOpacity="1" />
              </linearGradient>

              {/* Laser Electric Line Gradients */}
              <linearGradient id="electricGlow" x1="0" y1="0" x2="900" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#22d3ee" stopOpacity="1" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0.8" />
              </linearGradient>

              <linearGradient id="pylonGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#1e3a5f" stopOpacity="0.4" />
              </linearGradient>

              <radialGradient id="nodePulse" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="1" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Distant Mountain Range */}
            <path d="M-50 560 Q 150 490 320 530 T 680 500 T 980 540 L 980 800 L -50 800 Z" fill="#040e1e" opacity="0.6" />
            <path d="M-50 590 Q 200 540 450 570 T 950 550 L 950 800 L -50 800 Z" fill="#030a17" opacity="0.9" />

            {/* Distant Wind Turbines */}
            <g opacity="0.45" stroke="#38bdf8" strokeWidth="1.5">
              {/* Wind Turbine 1 */}
              <line x1="160" y1="520" x2="160" y2="440" strokeWidth="2" />
              <circle cx="160" cy="440" r="3" fill="#38bdf8" />
              <line x1="160" y1="440" x2="135" y2="425" />
              <line x1="160" y1="440" x2="185" y2="425" />
              <line x1="160" y1="440" x2="160" y2="470" />

              {/* Wind Turbine 2 */}
              <line x1="240" y1="540" x2="240" y2="470" strokeWidth="1.5" />
              <circle cx="240" cy="470" r="2.5" fill="#38bdf8" />
              <line x1="240" y1="470" x2="220" y2="455" />
              <line x1="240" y1="470" x2="260" y2="455" />
              <line x1="240" y1="470" x2="240" y2="495" />

              {/* Wind Turbine 3 */}
              <line x1="720" y1="530" x2="720" y2="450" strokeWidth="2" />
              <circle cx="720" cy="450" r="3" fill="#38bdf8" />
              <line x1="720" y1="450" x2="695" y2="435" />
              <line x1="720" y1="450" x2="745" y2="435" />
              <line x1="720" y1="450" x2="720" y2="480" />
            </g>

            {/* Solar Panel Array Grids (光伏矩阵) */}
            <g opacity="0.5" stroke="#0ea5e9" strokeWidth="1" fill="#07203d">
              <polygon points="50,620 180,620 160,670 20,670" />
              <polygon points="190,620 320,620 300,670 170,670" />
              <polygon points="330,620 460,620 440,670 310,670" />
              {/* Solar cell lines */}
              <line x1="85" y1="620" x2="55" y2="670" stroke="#0284c7" />
              <line x1="120" y1="620" x2="90" y2="670" stroke="#0284c7" />
              <line x1="155" y1="620" x2="125" y2="670" stroke="#0284c7" />
              <line x1="225" y1="620" x2="195" y2="670" stroke="#0284c7" />
              <line x1="260" y1="620" x2="230" y2="670" stroke="#0284c7" />
              <line x1="295" y1="620" x2="265" y2="670" stroke="#0284c7" />
              <line x1="365" y1="620" x2="335" y2="670" stroke="#0284c7" />
              <line x1="400" y1="620" x2="370" y2="670" stroke="#0284c7" />
            </g>

            {/* Smart Substation Transformers & Busbars (智能变电站) */}
            <g opacity="0.75" stroke="#38bdf8" strokeWidth="1.5">
              {/* Substation Buildings */}
              <rect x="520" y="580" width="130" height="70" fill="#06182c" rx="4" />
              <line x1="520" y1="600" x2="650" y2="600" strokeDasharray="3 3" />
              <rect x="670" y="590" width="160" height="60" fill="#06182c" rx="4" />

              {/* Transformer Coils */}
              <circle cx="560" cy="550" r="16" fill="none" stroke="#38bdf8" strokeWidth="2" />
              <circle cx="585" cy="550" r="16" fill="none" stroke="#38bdf8" strokeWidth="2" />
              <line x1="572" y1="534" x2="572" y2="500" stroke="#22d3ee" strokeWidth="2" />
              <circle cx="572" cy="500" r="4" fill="#22d3ee" />

              <circle cx="730" cy="560" r="14" fill="none" stroke="#38bdf8" strokeWidth="2" />
              <circle cx="752" cy="560" r="14" fill="none" stroke="#38bdf8" strokeWidth="2" />
              <line x1="741" y1="546" x2="741" y2="510" stroke="#22d3ee" strokeWidth="2" />
              <circle cx="741" cy="510" r="4" fill="#22d3ee" />
            </g>

            {/* Main Center UHV Transmission Tower (特高压铁塔) */}
            <g stroke="url(#pylonGrad)" strokeWidth="2" fill="none" opacity="0.95">
              {/* Central Large Pylon */}
              {/* Outer Legs */}
              <line x1="400" y1="720" x2="435" y2="280" strokeWidth="2.5" />
              <line x1="480" y1="720" x2="445" y2="280" strokeWidth="2.5" />
              {/* Upper Mast */}
              <line x1="435" y1="280" x2="440" y2="150" strokeWidth="2.5" />
              <line x1="445" y1="280" x2="440" y2="150" strokeWidth="2.5" />
              {/* Crossarms */}
              {/* Top Crossarm */}
              <line x1="370" y1="220" x2="510" y2="220" strokeWidth="3" stroke="#38bdf8" />
              <line x1="390" y1="190" x2="490" y2="190" strokeWidth="2" stroke="#38bdf8" />
              {/* Lower Crossarm */}
              <line x1="340" y1="310" x2="540" y2="310" strokeWidth="3.5" stroke="#38bdf8" />
              <line x1="360" y1="280" x2="520" y2="280" strokeWidth="2" stroke="#38bdf8" />
              {/* Lattice Internal Bracing */}
              <line x1="400" y1="720" x2="445" y2="640" strokeWidth="1.2" />
              <line x1="480" y1="720" x2="435" y2="640" strokeWidth="1.2" />
              <line x1="410" y1="640" x2="470" y2="640" strokeWidth="1.5" />
              <line x1="410" y1="640" x2="445" y2="540" strokeWidth="1.2" />
              <line x1="470" y1="640" x2="435" y2="540" strokeWidth="1.2" />
              <line x1="420" y1="540" x2="460" y2="540" strokeWidth="1.5" />
              <line x1="420" y1="540" x2="445" y2="440" strokeWidth="1.2" />
              <line x1="460" y1="540" x2="435" y2="440" strokeWidth="1.2" />
              <line x1="425" y1="440" x2="455" y2="440" strokeWidth="1.5" />
              <line x1="425" y1="440" x2="445" y2="340" strokeWidth="1.2" />
              <line x1="455" y1="440" x2="435" y2="340" strokeWidth="1.2" />
              {/* Insulator Strings (悬式绝缘子串) */}
              <line x1="370" y1="220" x2="370" y2="245" stroke="#f59e0b" strokeWidth="3" strokeDasharray="3 2" />
              <line x1="510" y1="220" x2="510" y2="245" stroke="#f59e0b" strokeWidth="3" strokeDasharray="3 2" />
              <line x1="340" y1="310" x2="340" y2="340" stroke="#f59e0b" strokeWidth="3" strokeDasharray="3 2" />
              <line x1="540" y1="310" x2="540" y2="340" stroke="#f59e0b" strokeWidth="3" strokeDasharray="3 2" />
            </g>

            {/* Left Distant Transmission Tower */}
            <g stroke="#0284c7" strokeWidth="1.5" fill="none" opacity="0.6">
              <line x1="80" y1="620" x2="105" y2="340" />
              <line x1="140" y1="620" x2="115" y2="340" />
              <line x1="105" y1="340" x2="110" y2="250" />
              <line x1="115" y1="340" x2="110" y2="250" />
              <line x1="60" y1="310" x2="160" y2="310" strokeWidth="2" />
              <line x1="40" y1="380" x2="180" y2="380" strokeWidth="2.5" />
            </g>

            {/* Right Distant Transmission Tower */}
            <g stroke="#0284c7" strokeWidth="1.5" fill="none" opacity="0.6">
              <line x1="770" y1="610" x2="795" y2="320" />
              <line x1="830" y1="610" x2="805" y2="320" />
              <line x1="795" y1="320" x2="800" y2="230" />
              <line x1="805" y1="320" x2="800" y2="230" />
              <line x1="750" y1="290" x2="850" y2="290" strokeWidth="2" />
              <line x1="730" y1="360" x2="870" y2="360" strokeWidth="2.5" />
            </g>

            {/* Glowing High Voltage Catenary Wires (超高压输电导线) */}
            <g stroke="url(#electricGlow)" fill="none">
              {/* Upper Wires */}
              <path d="M-50 210 Q 160 270, 370 245 T 750 310 T 980 270" strokeWidth="2" opacity="0.85" />
              <path d="M-50 270 Q 160 330, 370 250 T 750 315 T 980 280" strokeWidth="1.5" opacity="0.75" />
              {/* Lower Wires */}
              <path d="M-50 310 Q 160 400, 340 340 T 730 380 T 980 340" strokeWidth="2.5" opacity="0.9" />
              <path d="M-50 320 Q 240 430, 540 340 T 870 380 T 980 350" strokeWidth="2.2" opacity="0.9" />
              <path d="M-50 380 Q 240 470, 540 345 T 870 385 T 980 360" strokeWidth="1.8" opacity="0.8" />
            </g>

            {/* Glowing Energy Node Sparks & Telemetry Rings */}
            <circle cx="370" cy="245" r="5" fill="#38bdf8" className="animate-ping" style={{ animationDuration: '3s' }} />
            <circle cx="370" cy="245" r="3" fill="#ffffff" />
            <circle cx="510" cy="245" r="5" fill="#38bdf8" className="animate-ping" style={{ animationDuration: '4s' }} />
            <circle cx="510" cy="245" r="3" fill="#ffffff" />
            <circle cx="340" cy="340" r="6" fill="#22d3ee" className="animate-ping" style={{ animationDuration: '2.5s' }} />
            <circle cx="340" cy="340" r="3.5" fill="#ffffff" />
            <circle cx="540" cy="340" r="6" fill="#22d3ee" className="animate-ping" style={{ animationDuration: '3.5s' }} />
            <circle cx="540" cy="340" r="3.5" fill="#ffffff" />

            {/* Substation High-Voltage Inflow Nodes */}
            <circle cx="572" cy="500" r="8" fill="url(#nodePulse)" />
            <circle cx="741" cy="510" r="8" fill="url(#nodePulse)" />
          </svg>
        </div>

        {/* Top Header Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.6)] border border-cyan-400/40">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-wider text-white">国家电网</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-700/60 font-mono">
                  数字化智能调度中心
                </span>
              </div>
              <p className="text-[11px] text-cyan-400/80 font-mono tracking-wide">STATE GRID POWER DISPATCH & SAFETY PLATFORM</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-md text-xs font-mono text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>全网调度在线</span>
          </div>
        </div>

        {/* Center Main Presentation Headlines */}
        <div className="relative z-10 my-auto py-8 lg:py-0 max-w-xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-medium backdrop-blur-md shadow-lg shadow-cyan-950/50">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span>新一代源网荷储协同调控核心系统</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              数智电网 · 驭领未来
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
              构建覆盖全省特高压枢纽、虚拟电厂聚合、柔性负荷互动与市场化交易的一体化安全运行防线。
            </p>
          </div>

        </div>
      </div>


      {/* ===================== RIGHT SIDE: Modern Login Panel (右侧登录窗口) ===================== */}
      <div className="w-full lg:w-5/12 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-14 bg-gradient-to-b from-[#09152a] via-[#071120] to-[#040913] relative z-20">
        
        {/* Subtle Decorative Elements */}
        <div className="hidden lg:block absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none" />

        {/* Top Header Placeholder for Alignment */}
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono pb-2">
          <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>接入模式: 生产内网专线</span>
          </span>
          <span className="text-slate-500">v3.8.4-R</span>
        </div>

        {/* Main Login Form Container */}
        <div className="w-full max-w-md mx-auto my-auto space-y-7 py-4">
          
          {/* Form Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-medium">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>系统身份验证</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              电力安全隐患监管平台
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              请登录您的国家电网调度监察工作账号，以访问全景遥测与处置工单
            </p>
          </div>



          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-950/70 border border-red-500/60 rounded-xl text-red-200 text-xs flex items-center gap-2 animate-shake">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span>用户账号 (Username)</span>
                <span className="text-[10px] text-slate-500">支持角色代码: admin / supervisor / inspector</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入调度账号"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all font-mono"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span>登录密码 (Password)</span>
                <button
                  type="button"
                  onClick={() => alert('测试演示账号默认密码为: admin123')}
                  className="text-xs text-cyan-400 hover:underline cursor-pointer"
                >
                  忘记密码？
                </button>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入登录密码"
                  className="w-full pl-10 pr-10 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Protocol */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none hover:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-cyan-400 focus:ring-offset-slate-900 accent-cyan-500 cursor-pointer"
                />
                <span>保持登录状态 (7天)</span>
              </label>
              <span className="text-[11px] text-cyan-400/90 font-mono">SSL 256位加密链路</span>
            </div>

            {/* Login Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-5 bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-bold rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 text-sm tracking-wide mt-3"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>立即登录调度平台</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>


        </div>
      </div>

    </div>
  );
};
