'use client'
import { useLikeStore } from "@/store/useLikeStore";
import { useMusicStore } from "@/store/useMusicStore";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Music() {

    const { musics, fetchMusics } = useMusicStore();
    const { fetchFavorites, toggleLike, isLoading: likeLoading } = useLikeStore()
    const userId = 1; // 임시 데이터

    const favorites = useLikeStore((state) => state.favorites);

    useEffect(() => {
      fetchMusics();
      fetchFavorites(userId);
    }, []);

    const [serachValue, setSearchValue] = useState('');    
    const onClickHandler = () => {
        console.log(`검색: ${serachValue}`);
        //검색 기능 구현중...
    }

    if (likeLoading) {
      return <div>데이터 로딩 중... 잠시만 기다려 주세요!</div>;
    } 

  return (
    <> 
      <div><Link href={""}>[전체곡]</Link> <Link href={""}>[&gt;&gt;&gt; 내 좋아요 목록]</Link></div>
      <div>[검색창:
            <input type="search"
                   name="musicName"
                   value={serachValue}
                   onChange={ (e)=> setSearchValue(e.target.value) }
                   placeholder="곡명 또는 가수명"     
            />]
            <button onClick={onClickHandler} >검색</button>
      </div>
      <div>곡 목록</div>
      <ul>
         {musics?.map(music => {
          const liked = favorites.some(f => String(f.musicId) === String(music.id));
          return (
            <li key={music.id}>
              <button 
                onClick={() => toggleLike(userId, music.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer'
                }}>
                [{liked ? "♥" : "♡"}]
              </button>
              <b>{music.title} - {music.artist}
                <Link href={""}>(상세보기 &gt;)</Link>
              </b>
            </li>
          )})}
      </ul>

      <div style={{color:'white', background: 'black', textAlign: 'center'}} >♡ = 좋아요 안함 / ♥ = 좋아요</div>

    </>
  );
}
