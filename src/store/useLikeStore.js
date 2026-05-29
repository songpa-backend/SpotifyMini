import { likeApi } from '@/app/api/likeApi';
import { create } from "zustand";

export const useLikeStore = create((set, get) => ({
    favorites: [],
    isLoading: false,

    fetchFavorites: async (userId) => {
        set({ isLoading: true }); 

        try {
            const res = await likeApi.getFavorites(userId);
            const detailedFavorites = res.data;
            
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
                
                if (res.data.success) {
                const newFavoriteItem = {
                    ...music,
                    musicId: Number(musicId),  
                    userId: Number(userId),
                    likeId: Number(res.data.likeId)
                };
                set((state) => ({ favorites: [...state.favorites, newFavoriteItem] }));}
            } catch (error) {
                console.error("좋아요 추가 실패: ", error);
            }
        }
    },

    clearAllLikes: async () => {
        const { favorites } = get();
        
        try {
            const deletePromises = favorites.map(f => likeApi.deleteLike(f.likeId));
            await Promise.all(deletePromises);
            set({ favorites: [] });
        } catch (error) {
            console.error('좋아요 전체 해제 실패: ', error);
        }
    }

}))