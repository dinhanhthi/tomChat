import PageChat from '../../../components/page-chat'

export default async function SingleChatPage(props: { params: Promise<{ id: string }> }) {
  return <PageChat />
}
