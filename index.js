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

// 가사 검색 API 엔드포인트
app.get('/artist/:artist/title/:title', async (req, res) => {
    let artist = req.params.artist;
    let title = req.params.title;

    try {
        const response = await axios.get(`https://api.lyrics.ovh/v1/${artist}/${title}`);

        if (response.data.lyrics) {
            res.send(`${artist}의 ${title} 가사\n\n${response.data.lyrics}`);
        } else {
            res.send(`가사를 찾을 수 없습니다. 다른 노래 제목을 시도해 주세요.`);
        }
    } catch (error) {
        res.status(500).send('가사 가져오기 실패. 외부 서비스에 문제가 있을 수 있습니다.');
    }
});

// Billboard Hot 100 데이터 제공 엔드포인트
app.get('/billchart', async (req, res) => {
    try {
        const response = await axios.get('https://raw.githubusercontent.com/KoreanThinker/billboard-json/main/billboard-hot-100/recent.json');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'API 호출에 실패했습니다.' });
    }
});

// ✅ Billboard Artist 100 데이터 제공 엔드포인트 (추가된 부분)
app.get('/billartist', async (req, res) => {
    try {
        const response = await axios.get('https://raw.githubusercontent.com/KoreanThinker/billboard-json/main/billboard-artist-100/recent.json');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'API 호출에 실패했습니다.' });
    }
});
