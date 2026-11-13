import React, { useState } from 'react';
import { X, Bot, Sparkles, Send, ShieldAlert, Cpu } from 'lucide-react';
import { HazardItem } from '../types';

interface AiAssistantModalProps {
  hazards: HazardItem[];
  onClose: () => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ hazards, onClose }) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: '您好！我是电力安全隐患监管平台的 AI 智能专家。我可以帮您分析变电设备缺陷、评估电网过载风险、起草隐患整改通知书或解答电力安全规程（安规）。请问有什么我可以帮您的？'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (customPrompt?: string) => {
    const promptText = customPrompt || input;
    if (!promptText.trim() || isLoading) return;

    const newMessages = [...messages, { sender: 'user' as const, text: promptText }];
    setMessages(newMessages);
    if (!customPrompt) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          hazardData: { totalHazards: hazards.length, highRiskCount: hazards.filter(h => h.level === '重大隐患').length, hazards }
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMessages([...newMessages, { sender: 'ai', text: data.result }]);
      } else {
        setMessages([...newMessages, { sender: 'ai', text: `AI 分析遇到错误: ${data.error || '未知错误'}。请确保已在 AI Studio Secrets 中配置 GEMINI_API_KEY。` }]);
      }
    } catch (err: any) {
      setMessages([...newMessages, { sender: 'ai', text: `网络请求失败: ${err.message || '无法连接到后端 AI 代理'}。` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    '评估当前所有重大隐患的综合风险',
    '生成夏季高温大负荷下变压器防过载预案',
    '起草一份《输电线路外力破坏隐患整改通知书》',
    '变电站端子排发热的典型原因与消缺规范'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-[0_0_60px_rgba(6,182,212,0.3)] overflow-hidden text-slate-100 flex flex-col h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/90 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.6)] text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>电力安全 AI 智能诊断专家</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-[10px] text-cyan-300 font-normal">
                  Gemini 2.5 Flash
                </span>
              </h3>
              <p className="text-xs text-slate-400">实时分析电网缺陷、评估事故风险与生成消缺对策</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-950/60">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-cyan-950 border border-cyan-500/40 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                }`}
              >
                {msg.sender === 'user' ? <span className="text-xs font-bold">我</span> : <Cpu className="w-4 h-4" />}
              </div>
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-900/90 border border-slate-700/80 text-slate-200 rounded-tl-none shadow-md'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="px-4 py-3 bg-slate-900/90 border border-slate-700 rounded-2xl text-sm text-slate-400 animate-pulse">
                AI 正在深度检索电网安规库与隐患数据库进行专业诊断...
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="px-6 py-2 bg-slate-900/80 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] text-cyan-400 shrink-0 font-medium">快捷诊断:</span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              disabled={isLoading}
              className="px-3 py-1 rounded-full bg-slate-800 hover:bg-cyan-950/80 border border-slate-700 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-cyan-300 whitespace-nowrap transition-all cursor-pointer"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-900 border-t border-slate-700 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="输入您关于电力安全隐患、设备缺陷或安规的问题..."
            className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <span>发送</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
