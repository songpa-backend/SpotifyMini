import { likeApi } from '@/app/api/likeApi';
import axios from 'axios';
import { create } from "zustand";

export const useLikeStore = create((set, get) => ({
    favorites: [],
    isLoading: false,

    fetchFavorites: async (userId) => {
        set({ loading: true });

        try {
            const res = await likeApi.getFavorites(userId);
            const favData = res.data;

            const detailedFavorites = await Promise.all(
            favData.map(async (fav) => {
                try {
                    const musicRes = await axios.get(`http://localhost:3001/musics/${fav.musicId}`);
                    return { ...fav, music: musicRes.data };
                } catch (err) {
                    console.error(`${fav.musicId}번 음악 정보 로드 실패`, err);
                    return { ...fav, music: null }; // 에러 시 음악 정보만 null 처리
                }
            }));

            set({ favorites: detailedFavorites, isLoading: false })
        } catch (error) {
            console.error("좋아요 목록 로드 실패: ", error);
            set({ isLoading: false });
        }
    },

    toggleLike: async (userId, musicId) => {
        const { favorites } = get();

        const existingLike = favorites.find(f => String(f.musicId) === String(musicId) && f.userId === userId);

        if (existingLike) {
            try {
                await likeApi.deleteLike(existingLike.id);
                set({
                    favorites: favorites.filter(f => f.id !== existingLike.id)
                })
            } catch (error) {
                console.error("좋아요 취소 실패: ", error);
            }
        } else {
            try {
                const res = await likeApi.addLike({ userId, musicId });
                set({
                    favorites: [...favorites, res.data]
                })
            } catch (error) {
                console.error("좋아요 추가 실패: ", error);
            }
        }
    },

    clearAllFavorites: async (userId) => {
        const { favorites } = get();
        try {
            const deletePromises = favorites.map(f => likeApi.deleteLike(f.id));
            await Promise.all(deletePromises);
            set({ favorites: [] });
        } catch (error) {
            console.error('좋아요 전체 해제 실패: ', error);
        }
    }

}))