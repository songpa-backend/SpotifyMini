'use client'
import { useLikeStore } from "@/store/useLikeStore";
import Link from "next/link";
import { useEffect } from "react";

export default function LikesPage() {
  const { favorites, fetchFavorites, toggleLike, isLoading } = useLikeStore();

  const userId = 1;

  useEffect(() => {
    if (userId) {
      fetchFavorites(userId);
    }
  }, [fetchFavorites, userId]);

  if (isLoading && favorites.length === 0) {
    return <div>좋아요 목록을 불러오는 중입니다... 🎧</div>;
  }

  return (
    <div>
      <h1>❤️ 좋아요한 곡 목록 </h1>
      <Link href="/">
        &larr; 홈
      </Link>
      {favorites.length === 0 ? (
        <p>좋아요를 누른 노래가 없어요!</p>
      ) : (
        <ul>
            {favorites.map((fav) => {
                const liked = true;

                if (!fav.music) return null;

                return (
                <li key={fav.id}>
                    <button 
                        onClick={() => toggleLike(fav.userId, fav.music.id)}
                        style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer'
                        }}>
                    [{liked ? "♥" : "♡"}]
                    </button>

                    <b>
                        {fav.music.title} - {fav.music.artist}
                        <Link href={`/music/${fav.music.id}`}>(상세보기 &gt;)</Link>
                    </b>
                </li>
                );
                })}
        </ul>
      )}
    </div>
  );
}