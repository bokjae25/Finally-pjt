const express = require('express');
const axios = require('axios');
const cors = require('cors');  // CORS 미들웨어
const path = require('path');
const app = express();
const PORT = 3000;

// CORS 설정
app.use(cors());

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

// URL 경로에 가수와 노래 제목을 포함시키기
app.get('/artist/:artist/title/:title', async (req, res) => {
    let artist = req.params.artist;  // URL에서 'artist' 파라미터 받기
    let title = req.params.title;    // URL에서 'title' 파라미터 받기

    try {
        // 외부 API로부터 가사를 가져옵니다.
        const response = await axios.get(`https://api.lyrics.ovh/v1/${artist}/${title}`);
        
        // 가사를 가져오면 응답으로 반환
        if (response.data.lyrics) {
            res.send(`${artist}의 ${title} 가사입니다:\n\n${response.data.lyrics}`);
        } else {
            res.send(`가사를 찾을 수 없습니다. 다른 노래 제목을 시도해 주세요.`);
        }
    } catch (error) {
        res.status(500).send('가사 가져오기 실패. 외부 서비스에 문제가 있을 수 있습니다.');
    }
});

