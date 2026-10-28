import { useCallback, useEffect, useState } from 'react';

/** 질문 카드에 올린 답변. 서버가 없는 정적 사이트라 브라우저 localStorage에 보관한다. */
export type PostedAnswer = { id: string; who: string; date: string; text: string; helpful: number };

const KEY = 'ai-board.answers.v1';

type Store = Record<string, PostedAnswer[]>;

function read(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Store) : {};
  } catch {
    return {};
  }
}

function write(store: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    /* private mode 등 저장 불가 환경은 무시 */
  }
}

export function todayLabel() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}.${mm}.${dd}`;
}

export function useAnswers(questionId: string) {
  const [answers, setAnswers] = useState<PostedAnswer[]>([]);

  useEffect(() => {
    setAnswers(read()[questionId] ?? []);
  }, [questionId]);

  const add = useCallback(
    (who: string, text: string) => {
      const next: PostedAnswer = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, who: who.trim(), date: todayLabel(), text: text.trim(), helpful: 0 };
      const store = read();
      store[questionId] = [...(store[questionId] ?? []), next];
      write(store);
      setAnswers(store[questionId]);
    },
    [questionId],
  );

  const remove = useCallback(
    (id: string) => {
      const store = read();
      store[questionId] = (store[questionId] ?? []).filter((a) => a.id !== id);
      write(store);
      setAnswers(store[questionId]);
    },
    [questionId],
  );

  const helpful = useCallback(
    (id: string) => {
      const store = read();
      store[questionId] = (store[questionId] ?? []).map((a) => (a.id === id ? { ...a, helpful: a.helpful + 1 } : a));
      write(store);
      setAnswers(store[questionId]);
    },
    [questionId],
  );

  return { answers, add, remove, helpful };
}
