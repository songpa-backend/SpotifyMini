const BASE_URL = "http://localhost:3001";
const MUSIC_API_URL = `${BASE_URL}/musics`;
const COMMENT_API_URL = `${BASE_URL}/comments`;

export const musicApi = {

    async getMusics() {
        try{
            //1. 서버에 요청을 보낸다.
            const res = await fetch(MUSIC_API_URL);
            console.log(res);
            //2. 서버가 응답은 했지만, 상태가 200이 아닌 경우(예 : 404 Not Found)
            if(!res.ok){
                throw new Error(`서버 에러 발생! 상태 코드:${response.status}`);
            }
            //3. 정상적으로 데이터를 받아왔을 때 
            return await res.json();
        }catch(error){
            //4. 에러가 났을 때(서버가 꺼져있거나, 인터넷이 끊겼거나)
            console.log("음악 데이터를 가져오는데 실패 했습니다.",error);
            //화면이 터지지 않게 빈배열 반환
            return [];
        }
    },

    getMusicDetail: async (musicId) => {
        const API_URL = `${MUSIC_API_URL}/${musicId}`;
        try {
            const response = await fetch(API_URL);
            
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            
            const data = await response.json();
            return { data };
        } catch (error) {
            console.error(error);
        }
    },

    getComment: async (userId, musicId) => {
        const API_URL = `${COMMENT_API_URL}?userId=${userId}&musicId=${musicId}`;
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            const data = await response.json();
            return { data }; // 상세페이지의 res.data와 맞춤
        } catch (error) {
            console.error("메모 로드 실패:", error);
            return { data: [] };
        }
    },

    saveComment: async (commentData) => {
        try {
            const response = await fetch(COMMENT_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...commentData,
                    musicId: Number(commentData.musicId),
                    userId: Number(commentData.userId)
                })
            });
            const data = await response.json();
            return { data };
        } catch (error) {
            console.error("메모 저장 실패:", error);
        }
    },

    // 5. 메모 수정하기 (PATCH)
    updateComment: async (commentId, content) => {
        try {
            const response = await fetch(`${COMMENT_API_URL}/${commentId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
            });
            const data = await response.json();
            return { data };
        } catch (error) {
            console.error("메모 수정 실패:", error);
        }
    }

}