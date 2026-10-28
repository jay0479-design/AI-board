import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container-page py-20 text-center">
      <p className="t-h1">페이지를 찾을 수 없어요</p>
      <Link to="/" className="mt-4 inline-block text-accent-blue-text underline">
        보드 소개로 돌아가기
      </Link>
    </div>
  );
}
