'use client'
import { useLikeStore } from "@/store/useLikeStore";
import { useMusicStore } from "@/store/useMusicStore";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from './page.module.css';

export default function Music() {
  const { musics, fetchMusics } = useMusicStore();
  const [searchValue, setSearchValue] = useState('');
  const { fetchFavorites, toggleLike, isLoading: likeLoading } = useLikeStore()
  
  const userId = 1; // 임시 데이터

  const favorites = useLikeStore((state) => state.favorites);

  useEffect(() => {
    fetchMusics();
    fetchFavorites(userId);
  }, [fetchMusics]);

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

  //[전체곡 목록] 버튼 클릭 시 초기화
  const resetSearch = () => {
    setSearchValue('');
    setIsSearched(false);
    setSearchedMusics([]);
  };

  if (likeLoading) {
    return <div>데이터 로딩 중... 잠시만 기다려 주세요!</div>;
  }

  return (
    <>
      <div className={styles.container}>
        {/* 네비게이션 */}
        <div className={styles.nav}>
          <div className={styles.navList}>
            <span onClick={resetSearch}
              className={styles.allList}
            >
              <b>[전체곡]</b></span>
            <Link href={"/likes"} className={styles.navList}>
              <b>[&gt;&gt;&gt; 내 좋아요 목록]</b>
            </Link></div>
        </div>

      </div>

      {/* 검색창 */}
      <div className={styles.searchArea}>
        <div className={styles.searchInputWrapper}>
          [검색 :
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
            className={styles.searchInput}
          />
          ]
          <button onClick={onClickHandler} className={styles.searchBtn}>검색</button>
        </div>
      </div>
      {/* 곡 목록 */}
      <div className={styles.listArea}>
        <div className={styles.listDivider}></div>
        <div className={styles.listTitle}>곡 목록</div>
        <ul className={styles.musicList}>
          {
            (isSearched && searchValue && searchedMusics.length === 0) ?
              //검색 결과가 없을 때 (검색어 있고, 검색 결과가 없음)
              <li className={styles.emptyMessage} > 찾으시는 곡이 없어요.🥺 다른 단어로 검색해보세요. </li>
              :
              //보여줄 목록이 하나라도 있으면 표시
              (searchedMusics.length > 0 ? searchedMusics : musics)?.map(music => {
                const liked = favorites.some(f => String(f.musicId) === String(music.id));
                return (
                  <li key={music.id} className={styles.musicItem}>
                    <button
                      onClick={() => toggleLike(userId, music.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer'
                      }}
                    >
                      [{liked ? "♥" : "♡"}]
                    </button>
                    <p><b>{music.title} - {music.artist}</b></p>
                    <b><Link href={`/music/${music.id}`} className={styles.detailLink}>(상세보기 &gt;)</Link></b>
                  </li>
                );
              })
          }
        </ul>
        <div className={styles.listDivider}></div>
      </div>
    </>
  );
}
