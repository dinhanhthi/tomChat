import PageChat from '../../../components/page-chat'

export default async function SingleChatPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  return <PageChat chatId={id} />
}
