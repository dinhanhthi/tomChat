import { v4 as uuidv4 } from 'uuid'
import PageChat from '../components/page-chat'

export default function Home() {
  const chatId = uuidv4()

  return <PageChat chatId={chatId} />
}
