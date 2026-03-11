'use client';

import { useState, useEffect, useRef } from 'react';

type Props = { slug: string };

export default function AIArtistInsights({ slug }: Props) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);
  const readerRef = useRef<ReadableStreamDefaultReader | null>(null);

  useEffect(() => {
    return () => {
      readerRef.current?.cancel();
    };
  }, []);

  async function loadInsights() {
    setStarted(true);
    setLoading(true);
    setText('');
    setError('');
    setDone(false);

    try {
      const res = await fetch(`/api/ai/insights?slug=${encodeURIComponent(slug)}`);

      if (!res.ok) {
        setError('Analyse IA indisponible.');
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setError('Stream indisponible.');
        return;
      }

      readerRef.current = reader;
      const decoder = new TextDecoder();

      while (true) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;

        const chunk = decoder.decode(value, { stream: true });

        // Parse SSE format from Anthropic
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                setText((prev) => prev + parsed.delta.text);
              }
            } catch {
              // Non-JSON line, skip
            }
          }
        }
      }

      setDone(true);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError('Connexion interrompue.');
    } finally {
      setLoading(false);
    }
  }

  // Render markdown-like text with bold
  function renderText(raw: string) {
    const lines = raw.split('\n');
    return lines.map((line, i) => {
      // Bold **text**
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      const rendered = parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={j} className="text-amber-400 font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={j}>{part}</span>;
      });
      return (
        <span key={i}>
          {rendered}
          {i < lines.length - 1 && '\n'}
        </span>
      );
    });
  }

  if (!started) {
    return (
      <button
        onClick={loadInsights}
        className="w-full flex items-center justify-center gap-3 py-4 bg-amber-500/5 border border-amber-500/20 hover:bg-amber-500/10 hover:border-amber-500/40 rounded-xl transition-all group"
      >
        <svg
          className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
          />
        </svg>
        <span className="text-amber-400 font-medium text-sm">
          Analyser avec l&apos;IA
        </span>
      </button>
    );
  }

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
            />
          </svg>
          <span className="text-zinc-300 text-sm font-medium">Analyse IA</span>
          {loading && (
            <span className="flex gap-0.5 ml-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1 h-1 bg-amber-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </span>
          )}
        </div>
        <span className="text-xs text-zinc-600">Claude AI</span>
      </div>

      {/* Content */}
      <div className="p-4">
        {error ? (
          <p className="text-zinc-500 text-sm">{error}</p>
        ) : (
          <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">
            {renderText(text)}
            {loading && (
              <span className="inline-block w-0.5 h-4 bg-amber-400 ml-0.5 animate-pulse align-text-bottom" />
            )}
          </p>
        )}

        {done && (
          <button
            onClick={loadInsights}
            className="mt-4 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            Régénérer l&apos;analyse
          </button>
        )}
      </div>
    </div>
  );
}
