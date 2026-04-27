import { create } from "zustand";
import { musicApi } from "../app/api/MusicApi";

export const useMusicStore = create( (set)=> ({
    // 1. 상태 (State): 기존 useState([]) 역할
    musics: [],

    // 2. 액션 (Action): 기존 useEffect 안에 있던 데이터 가져오기 로직
    async fetchMusics(){
        try{
            const data = await musicApi.getMusics();
            set({musics:data}); 
        }catch(error){
            console.log("스토어에서 데이터 가져오기 실패",error);
            set({musics:[]});
        }
    }

}))