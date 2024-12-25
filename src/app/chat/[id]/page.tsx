import PageChat from '../../../components/page-chat'

export default async function SingleChatPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  /* ###Thi */ console.log(`👉👉👉 id: `, id)

  return <PageChat chatId={id} />
}
