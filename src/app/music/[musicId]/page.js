'use client'

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLikeStore } from "@/store/useLikeStore";
import { musicApi } from "@/app/api/MusicApi";

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
      {/* 뒤로가기 버튼 */}
      <button onClick={() => router.back()}>
        &larr; 뒤로가기
      </button>

      {/* 곡 정보 영역 */}
      <div>
        <div>
            <p><b>제목:</b> {music.title}</p>
            <p><b>가수:</b> {music.artist}</p>
            <p><b>장르:</b> {music.genre}</p>
            <p><b>길이:</b> {music.duration}</p>
          </div>
        <button onClick={() => toggleLike(userId, music.id)}>
          {isLiked ? "♥" : "♡"}
        </button>
      </div>

      <div>
          <h3>댓글</h3>
          <div>
            <textarea 
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              rows={3}
              placeholder="댓글을 입력하세요..."
            />
          </div>
        </div>

      <div>
          <div>
            {comments.length === 0 ? (
              <p>작성된 코멘트가 없습니다.</p>
            ) : (
              comments.slice().reverse().map((c) => (
                <div key={c.id}>
                  {c.content}
                </div>
              ))
            )}
          </div>
          <div>
            <button onClick={handleSaveComment}>
              [ 저장하기 ]
            </button>
          </div>
        </div>

        <div>
        -------------------------------------------<br />
        ♡ = 좋아요 안함 / ♥ = 좋아요<br />
        -------------------------------------------
      </div>

      {/* 홈으로 이동 */}
      <div>
        <Link href="/" >
          전체 목록 보기
        </Link>
      </div>
    </div>
  );
}