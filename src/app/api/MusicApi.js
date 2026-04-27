const BASE_URL = "http://localhost:3001";
const MUSIC_API_URL = `${BASE_URL}/musics`;

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
    }


}