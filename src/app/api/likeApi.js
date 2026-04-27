import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:3001', 
  headers: { 'Content-Type': 'application/json' }
});

export const likeApi = {
  // 좋아요 목록 가져오기
  getFavorites: (userId) => api.get(`/favorites?userId=${userId}`),
  
  // 좋아요 추가
  addLike: (data) => {
    return api.post('/favorites', { 
      userId: Number(data.userId), 
      musicId: Number(data.musicId)
    });
  },
  
  // 좋아요 삭제
  deleteLike: (id) => api.delete(`/favorites/${id}`)
};