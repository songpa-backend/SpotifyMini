'use client'
import { useLikeStore } from "@/store/useLikeStore";
import { useMusicStore } from "@/store/useMusicStore";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Music() {
  const { musics, fetchMusics } = useMusicStore();
  const [searchValue, setSearchValue] = useState('');
  const { fetchFavorites, toggleLike, isLoading: likeLoading } = useLikeStore()
  
  const userId = 1; // 임시 데이터

  const favorites = useLikeStore((state) => state.favorites);

  useEffect(() => {
    fetchMusics();
    fetchFavorites(userId);
  }, []);

  const [searchedMusics, setSearchedMusics] = useState([]);
  const [isSearched, setIsSearched] = useState(false); //검색 버튼 클릭 여부

  const onClickHandler = () => {
    console.log(`검색: ${searchValue}`);
    if (!searchValue.trim()) { //검색어가 공백이 아닐때
      setIsSearched(false); //검색 한적 없음
      setSearchedMusics([]); //검색결과 빈배열
      return;
    }
    //검색 결과와 맞는 결과 searchValue에 추가       
    const results = musics.filter(music => (music.title.toLowerCase().includes(searchValue.toLowerCase())) ||
      (music.artist.toLowerCase().includes(searchValue.toLowerCase())));
    setSearchedMusics(results);
    setIsSearched(true); //검색 한적 있음으로 바꿈
    console.log(searchedMusics);
  }

  if (likeLoading) {
    return <div>데이터 로딩 중... 잠시만 기다려 주세요!</div>;
  } 

  return (
    <> 
      <div><Link href={""}>[전체곡]</Link> <Link href={"/likes"}>[&gt;&gt;&gt; 내 좋아요 목록]</Link></div>
      <div>[검색창:
        <input type="search"
          name="musicName"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            if (e.target.value === "") { setIsSearched(false); } //검색창이 완전히 비었을 때만 전체 목록을 보여줌
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onClickHandler();
            }
          }}
          placeholder="곡명 또는 가수명"

        />]
        <button onClick={onClickHandler} >검색</button>
      </div>

      <div>곡 목록</div>
      <ul>{
         (isSearched && searchValue && searchedMusics.length === 0) ?
         //검색 결과가 없을 때 (검색어 있고, 검색 결과가 없음)
         <li style={{ color: 'gray' }} > 찾으시는 곡이 없어요.🥺 다른 단어로 검색해보세요. </li>
         :
         //보여줄 목록이 하나라도 있으면 표시
        (searchedMusics.length > 0 ? searchedMusics : musics)?.map(music => {
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
                  <Link href={""}>(상세보기 &gt;)</Link></b>
              </li>
            )})}
      </ul>

      <div style={{ color: 'white', background: 'black', textAlign: 'center' }} >♡ = 좋아요 안함 / ♥ = 좋아요</div>

    </>
  );
}
