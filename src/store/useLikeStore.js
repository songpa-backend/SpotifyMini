import { likeApi } from '@/app/api/likeApi';
import { create } from "zustand";

export const useLikeStore = create((set, get) => ({
    favorites: [],
    isLoading: false,

    fetchFavorites: async (userId) => {
        set({ isLoading: true }); 

        try {
            const res = await likeApi.getFavorites(userId);
            const detailedFavorites = res.data.results?.likes || [];
            
            set({ favorites: detailedFavorites, isLoading: false });
        } catch (error) {
            console.error("좋아요 목록 로드 실패: ", error);
            set({ isLoading: false });
        }
    },

    toggleLike: async (userId, music) => {
        const { favorites } = get();
        const musicId = music.music_id || music.musicId;

        const existingLike = favorites.find(f => f.musicId === musicId && f.userId === userId);

        if (existingLike) {
            try {
                await likeApi.deleteLike(existingLike.likeId);
                set({
                    favorites: favorites.filter(f => f.likeId !== existingLike.likeId)
                })
            } catch (error) {
                console.error("좋아요 취소 실패: ", error);
            }
        } else {
            try {
                const res = await likeApi.addLike({ userId, musicId });

                if (res.data.status === 200 && res.data.results?.like) {
                    const serverLikeData = res.data.results.like;
                    const newFavoriteItem = {
                        ...music,                         // 기존 노래 정보(musicTitle, artist 등) 유지
                        musicId: Number(musicId),  
                        userId: Number(userId),
                        likeId: Number(serverLikeData.likeId) // 완벽하게 매핑 완료!
                    };
                        
                    set((state) => ({ 
                        favorites: [...state.favorites, newFavoriteItem] 
                    }));
                }
            } catch (error) {
                console.error("좋아요 추가 실패: ", error);
            }
        }
    },

    clearAllLikes: async () => {
        const { favorites } = get();
        if (favorites.length === 0) return;

        try {
            const deletePromises = favorites.map(f => likeApi.deleteLike(f.likeId));
            const responses = await Promise.all(deletePromises);
            const isAllSuccess = responses.every(res => res.data.status === 200);

            if (isAllSuccess) {
            set({ favorites: [] });
            } else {
            alert("일부 좋아요 해제에 실패했습니다. 목록을 새로고침 합니다.");
            }
            
        } catch (error) {
            console.error('좋아요 전체 해제 실패: ', error);
            
            if (error.response?.data?.message) {
            alert(error.response.data.message);
            } else {
            alert("좋아요 전체 해제 중 오류가 발생했습니다.");
            }
        }
    }

}))