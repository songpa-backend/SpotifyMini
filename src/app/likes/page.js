'use client'
import { useLikeStore } from "@/store/useLikeStore";
import Link from "next/link";
import { useEffect } from "react";
import styles from "./likes.module.css";

export default function LikesPage() {
  const { favorites, fetchFavorites, toggleLike, clearAllLikes, isLoading } = useLikeStore();

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
      <Link className={styles.homeButton} href="/">[홈]</Link>
      <h2 style={{ textAlign: 'center', marginBottom: '15px' }}>❤️ 좋아요한 곡 목록 </h2>
      <div className={styles.listSection}>
        {favorites.length === 0 ? (
          <p>좋아요를 누른 노래가 없어요!</p>
        ) : (
          <ul className={styles.musicList}>
            {favorites.map((fav) => {
              const liked = true;
              
              if (!fav.music) return null;
              
              return (
                <li key={fav.id} className={styles.listItem}>
                  <div className={styles.itemTitle}>
                    <button 
                      className={styles.likeButton}
                      onClick={() => toggleLike(fav.userId, fav.music.id)}
                    >
                      [{liked ? "♥" : "♡"}]
                      </button>
                      {fav.music.title} - {fav.music.artist}
                      <Link href={`/music/${fav.music.id}`}>(상세보기 &gt;)</Link>
                    </div>
                  </li>
                  );
                  })}
          </ul>
        )}

        <div className={styles.buttonSection}>
            <button 
              className={styles.clearButton}
              onClick={() => {
                if(confirm("정말로 모든 좋아요를 해제하시겠습니까?")) {
                  clearAllLikes();
                }
              }}
            >
              [좋아요 전체 해제]
            </button>
          </div>
        </div>
    </div>

    
  );
}