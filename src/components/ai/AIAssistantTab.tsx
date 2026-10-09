import React, { useState, useRef, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import {
  Sparkles,
  Send,
  Trash2,
  Bot,
  User,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  Info,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const AIAssistantTab: React.FC = () => {
  const {
    aiMessages,
    sendAIMessage,
    clearAIChat,
    summary,
  } = usePortfolio();

  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedToolId, setExpandedToolId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedChips = [
    'What do I actually own?',
    'Do I have overlapping holdings?',
    'What is my largest sector exposure?',
    'What is a REIT and how is it different from an InvIT?',
    'What is my total portfolio value?',
    'How safe are my bonds?',
    'Explain my asset allocation',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, isProcessing]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isProcessing) return;

    setInputQuery('');
    setIsProcessing(true);

    // Simulate minor processing delay for conversational feel
    setTimeout(async () => {
      await sendAIMessage(textToSend);
      setIsProcessing(false);
    }, 450);
  };

  const toggleToolPayload = (msgId: string) => {
    setExpandedToolId((prev) => (prev === msgId ? null : msgId));
  };

  // Simple Markdown renderer for bold, lists, and headers
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-bold text-slate-900 text-sm mt-3 mb-1">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('• ') || line.startsWith('- ')) {
        const itemContent = line.substring(2);
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-slate-700 leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: parseBold(itemContent) }} />
          </li>
        );
      }
      if (line.startsWith('|')) {
        // Simple table row
        return (
          <div key={idx} className="font-mono text-[11px] text-slate-700 bg-slate-50 p-1 rounded">
            {line}
          </div>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p
          key={idx}
          className="text-xs text-slate-700 leading-relaxed mb-1"
          dangerouslySetInnerHTML={{ __html: parseBold(line) }}
        />
      );
    });
  };

  const parseBold = (str: string) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Disclaimer & Controlled Architecture Header */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-subtle">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block">
              Grounded Tool-Based Intelligence Architecture
            </span>
            <span className="text-[11px] text-slate-500">
              Zero hallucinated figures. All queries execute deterministic portfolio math tools.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <Badge variant="outline" size="sm">
            Educational Demo
          </Badge>
          <button
            onClick={clearAIChat}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Reset Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Chat Container */}
      <Card padding="none" className="min-h-[520px] flex flex-col justify-between">
        {/* Messages Stream */}
        <div className="p-4 sm:p-6 space-y-5 flex-1 overflow-y-auto max-h-[560px]">
          {aiMessages.map((msg) => {
            const isAI = msg.sender === 'assistant';

            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${isAI ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-sm ${
                    isAI
                      ? 'bg-gradient-to-tr from-teal-800 to-teal-600'
                      : 'bg-slate-800'
                  }`}
                >
                  {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl p-4 shadow-subtle border ${
                    isAI
                      ? 'bg-white border-slate-200/90 text-slate-800'
                      : 'bg-teal-700 border-teal-800 text-white'
                  }`}
                >
                  {/* Tool execution indicator for AI messages */}
                  {isAI && msg.toolUsed && (
                    <div className="mb-3 pb-2 border-b border-slate-100">
                      <button
                        onClick={() => toggleToolPayload(msg.id)}
                        className="flex items-center justify-between w-full text-[11px] font-mono text-teal-700 hover:text-teal-800 bg-teal-50/80 px-2.5 py-1 rounded-lg border border-teal-200/60"
                      >
                        <span className="flex items-center gap-1.5">
                          <Terminal className="w-3 h-3 text-teal-600" />
                          Tool: {msg.toolUsed}
                        </span>
                        {expandedToolId === msg.id ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>

                      {expandedToolId === msg.id && (
                        <pre className="mt-2 p-2 bg-slate-900 text-teal-300 rounded-lg text-[10px] overflow-x-auto font-mono">
                          {JSON.stringify(msg.toolData, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}

                  {/* Body Text */}
                  <div>
                    {isAI ? (
                      renderFormattedText(msg.text)
                    ) : (
                      <p className="text-xs text-white leading-relaxed font-medium">
                        {msg.text}
                      </p>
                    )}
                  </div>

                  {/* Suggested Follow-Ups */}
                  {isAI && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="mt-3.5 pt-3 border-t border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Suggested Follow-ups
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestedFollowUps.map((prompt, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(prompt)}
                            className="px-2.5 py-1 bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200/80 hover:border-teal-200 rounded-lg text-[11px] font-medium transition-all text-left"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <span
                    className={`text-[10px] mt-2 block text-right font-mono ${
                      isAI ? 'text-slate-400' : 'text-teal-200'
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            );
          })}

          {isProcessing && (
            <div className="flex gap-3.5 items-center text-slate-400 text-xs">
              <div className="w-8 h-8 rounded-xl bg-teal-700 text-white flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />
                <span>Executing grounded portfolio tool & structuring analytical answer...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input & Quick Chips Footer */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-200/80 space-y-3">
          {/* Quick Prompt Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 flex-shrink-0">
              <Sparkles className="w-3 h-3 text-teal-600" /> Prompts:
            </span>
            {suggestedChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="px-2.5 py-1 bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200/80 hover:border-teal-200 rounded-lg text-xs font-medium whitespace-nowrap transition-all shadow-subtle"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about your unified portfolio, duplicates, REITs, or sector exposure..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 placeholder:text-slate-400 shadow-sm"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isProcessing}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
};
