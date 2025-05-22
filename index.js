import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { OpenAI } from 'openai'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

app.use(cors())
app.use(express.json())

// ✅ 루트 경로 테스트용
app.get('/', (req, res) => {
  res.send('✨ 에나타 타로 API가 정상 작동 중입니다!');
})

// ✅ 타로 카드 AI 해석 생성 엔드포인트
app.post('/generate', async (req, res) => {
  const { question, cards } = req.body

  try {
    const messages = [
      {
        role: 'system',
        content: `당신은 따뜻하고 믿음직한 타로 마스터입니다. 사용자의 질문과 카드 의미를 바탕으로,
맞춤법에 맞고 간결하며 쉽게 이해할 수 있도록 조언을 작성해주세요.
너무 추상적이지 않게, 직설적이고 명료하게 설명해주세요.`
      },
      {
        role: 'user',
        content: `질문: ${question}
카드 의미:
${cards.map(card => `- ${card.name}: ${card.meaning}`).join('\n')}`
      }
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7
    })

    const answer = completion.choices[0].message.content.trim()
    res.json({ result: answer })
  } catch (error) {
    console.error('OpenAI 오류:', error)
    res.status(500).json({ error: 'AI 응답 생성 실패' })
  }
})

// ✅ 서버 실행
app.listen(port, () => {
  console.log(`✅ 서버 실행 중! http://localhost:${port}`)
})
