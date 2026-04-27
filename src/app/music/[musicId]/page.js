'use client'

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLikeStore } from "@/store/useLikeStore";
import { musicApi } from "@/app/api/MusicApi";
import styles from "./details.module.css";

export default function MusicDetail() {
  const params = useParams(); // URL의 [musicId] 값을 가져옵니다
  const router = useRouter();
  const musicId = params.musicId;
  
  const [music, setMusic] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const { favorites, toggleLike, fetchFavorites } = useLikeStore();
  const userId = 1; // 테스트용 ID

  // 1. 곡 상세 정보 및 좋아요 목록 가져오기
    const fetchAllData = async () => {
        try {
            setIsLoading(true);

            const [musicRes, commentRes] = await Promise.all([
                musicApi.getMusicDetail(musicId),
                musicApi.getComment(userId, musicId)
            ]);

            setMusic(musicRes.data || musicRes);
            setComments(commentRes.data || []);

            await fetchFavorites(userId);
        } catch (error) {
            console.error("데이터 로드 실패", error);
        } finally {
            setIsLoading(false);
        }
    };

  useEffect(() => {
    if (musicId) fetchAllData();
  }, [musicId]);

  // 2. 좋아요 여부 확인
  const isLiked = favorites.some(f => String(f.musicId) === String(musicId));

  const handleSaveComment = async () => {
    if (!commentInput.trim()) return;
    try {
      await musicApi.saveComment({ userId, musicId, content: commentInput });
      setCommentInput(""); // 입력창 비우기
      await fetchAllData(); // 목록 새로고침!
      alert("댓글이 등록되었습니다! 📝");
    } catch (error) {
      alert("저장 실패 ㅠ");
    }
  };

  if (isLoading) return <div>곡 정보를 불러오는 중... 💿</div>;
  if (!music) return null;

  return (
    <div>
      <button onClick={() => router.back()} className={styles.backButton}>
        &larr; 뒤로가기
      </button>

      {/* 곡 정보 영역 */}
      <div className={styles.inputSection}>
        <h3 className={styles.sectionTitle}>상세정보</h3>
        <div className={styles.infoBar}>
            <span className={styles.infoItem}>제목: {music.title}</span>
            <span className={styles.infoItem}>가수: {music.artist}</span>
            <span className={styles.infoItem}>장르: {music.genre}</span>
            <span className={styles.infoItem}>길이: {music.duration}</span>
        </div>

        <div style={{ marginTop: '15px' }}>
            <button 
                className={styles.likeButton} 
                onClick={() => toggleLike(userId, music.id)}>
                [{isLiked ? "♥" : "♡"} 좋아요]
            </button>
        </div>
      </div>

      <div className={styles.inputSection}>
          <h3 className={styles.sectionTitle}>댓글</h3>
          <div className={styles.notebookContainer}>
            <span className={`${styles.bracket} ${styles.bracketLeft}`}>[</span>
            <span className={`${styles.bracket} ${styles.bracketRight}`}>]</span>

            {/* 1. 맨 윗줄: 입력 영역 */}
            <textarea
                className={styles.topInput}
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="댓글을 입력하세요."
            />

            <div>
                <button onClick={handleSaveComment} className={styles.saveButton}>
                    [ 저장하기 ]
                </button>
            </div>

            {/* 2. 아랫줄들: 등록된 댓글 목록 */}
            <div className={styles.commentList}>
                {comments.map((comment) => (
                <div key={comment.id} className={styles.commentLine}>
                    {comment.content}
                </div>
                ))}
            </div>
            </div>
        </div>
    </div>
  );
}