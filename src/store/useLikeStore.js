import { axios } from "axios";
import { create } from "zustand";

const API_URL = 'http://localhost:3001';

const useLikeStore = create((set) => ({
    favorites: [],
    isLoading: false,

    fetchFavorites: async (userId) => {
        set({ loading: true });

        try {
            const res = await axios.get(`${API_URL}/favorites?userId=${userId}&_expand=music`);
            set({ favorite: res.data, isLoading: false })
        } catch (error) {
            console.error("좋아요 목록 로드 실패: ", error);
            set({ isLoading: false });
        }
    },

    toggleLike: async (userId, musicId) => {
        const { favoirtes } = get();

        const existingLike = favoirtes.find(f => f.musicId === musicId && f.userId === userId);

        if (existingLike) {

            try {
                await axios.delete(`${API}/favorites/${existingLike.id}`);
                set({
                    favoirtes: favoirtes.filter(f => f.id !== existingLike.id)
                })
            } catch (error) {
                console.error("좋아요 취소 실패: ", error);
            }
        } else {
            try {
                const response = await axios.post(`${API_URL}/favorites`, { userId, musicId });
                set({
                    favoirtes: [...favoirtes, response.data]
                })
            } catch (error) {
                console.error("좋아요 추가 실패: ", error);
            }
        }
    },

    clearAllFavorites: async (userId) => {
        const { favoirtes } = get();
        try {
            const deletePromises = favoirtes.map(f => axios.delete(`${API_URL}/favorites/${f.id}`));
            await Promise.all(deletePromises);
            set({ favoirtes: [] });
        } catch (error) {
            console.error('좋아요 전체 해제 실패: ', error);
        }
    },
    
    isLike: (musicId) => {
        return get().favoirtes.some(f => f.musicId === musicId);
    }

}))