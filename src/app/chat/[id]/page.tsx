import PageChat from '../../../components/page-chat'

export default async function SingleChatPage(props: { params: Promise<{ id: string }> }) {
  const { id: chatId } = await props.params
  return <PageChat chatId={chatId} />
}
