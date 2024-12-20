import Container from '../components/container'
import Messages from '../components/messages'
import { Message } from '../interface'

const userMsg: Message = {
  text: 'Can you show me some examples of different Markdown blocks?',
  user: true
}

const exMsg: Message = {
  text: 'Certainly! Here are short examples of different Markdown blocks that OpenAI API responses can generate:\n\n1. **Code Block**: Used for displaying code snippets.\n    ```python\n    def hello_world():\n        print("Hello, world!")\n    ```\n\n2. **Blockquote**: Used for quoting text.\n    > This is a blockquote example.\n\n3. **Unordered List**: Used for lists without a particular order.\n    - Item 1\n    - Item 2\n    - Item 3\n\n4. **Ordered List**: Used for lists with a specific order.\n    1. First item\n    2. Second item\n    3. Third item\n\n5. **Table**: Used for displaying tabular data.\n    | Header 1 | Header 2 |\n    |----------|----------|\n    | Row 1 Col 1 | Row 1 Col 2 |\n    | Row 2 Col 1 | Row 2 Col 2 |\n\n6. **Heading**: Used for section headings, from level 1 to level 6.\n    # Heading 1\n    ## Heading 2\n    ### Heading 3\n\n7. **Horizontal Rule**: Used for creating a thematic break.\n\n    ---\n    \n8. **Inline Code**: Used for inline code within a sentence.\n    Here is some inline code: `print("Hello, world!")`.\n\nThese blocks help format and structure text in a clear and organized way.',
  user: false
}

const exMsgs = [userMsg, exMsg]

export default function Home() {
  const messages = exMsgs

  return (
    <div className='overflow-y-auto h-full w-full'>
      <Container>
        <Messages messages={messages} />
      </Container>
    </div>
  )
}
