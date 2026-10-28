/** public/ 아래 정적 파일 경로를 배포 base(예: GitHub Pages의 /AI-board/)에 맞춰 돌려준다. */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}
