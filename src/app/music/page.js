'use client'
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMusicStore } from "../store/useMusicStore";

export default function Music() {

    const { musics, fetchMusics } = useMusicStore();

    useEffect( ()=>{ 
        fetchMusics(); 
    }, [fetchMusics]);

    const [serachValue, setSearchValue] = useState('');    
    const onClickHandler = () => {
        console.log(`검색: ${serachValue}`);
        //검색 기능 구현중...
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
         {musics?.map(music => (
            <li key={music.id}><Link href={""}>[♡]</Link><b>{music.title} - {music.artist} <Link href={""}>(상세보기 &gt;)</Link></b></li>
        ))}
      </ul>

      <div style={{color:'white', background: 'black', textAlign: 'center'}} >♡ = 좋아요 안함 / ♥ = 좋아요</div>

    </>
  );
}
