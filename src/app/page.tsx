import Container from '../components/container'
import Messages from '../components/messages'
import { Message } from '../interface'

const exMsgs: Message[] = [
  {
    text: 'Can you show me some examples of different Markdown blocks?',
    user: true
  },
  {
    text: 'Certainly! Here are short examples of different Markdown blocks that OpenAI API responses can generate:\n\n1. **Code Block**: Used for displaying code snippets.\n    ```python\n    def hello_world():\n        print("Hello, world!")\n    ```\n\n2. **Blockquote**: Used for quoting text.\n    > This is a blockquote example.\n\n3. **Unordered List**: Used for lists without a particular order.\n    - Item 1\n    - Item 2\n    - Item 3\n\n4. **Ordered List**: Used for lists with a specific order.\n    1. First item\n    2. Second item\n    3. Third item\n\n5. **Table**: Used for displaying tabular data.\n    | Header 1 | Header 2 |\n    |----------|----------|\n    | Row 1 Col 1 | Row 1 Col 2 |\n    | Row 2 Col 1 | Row 2 Col 2 |\n\n6. **Heading**: Used for section headings, from level 1 to level 6.\n    # Heading 1\n    ## Heading 2\n    ### Heading 3\n\n7. **Horizontal Rule**: Used for creating a thematic break.\n\n    ---\n    \n8. **Inline Code**: Used for inline code within a sentence.\n  Here is some inline code: `print("Hello, world!")`.\n\n9. **Inline LaTeX Math:** \\(e^{i\\pi} + 1 = 0\\) (use `\\(`) and $e^{i\\pi} + 1 = 0$ (use `$`).\n\n 10. **Block LaTeX Math:**\n\n $$\n\n \\int_0^\\infty e^{-x^2} \\, dx = \\frac{\\sqrt{\\pi}}{2}\n $$ \n \n\nThese blocks help format and structure text in a clear and organized way.',
    user: false
  },
  {
    text: 'Can you show me some examples of different Markdown blocks?',
    user: true
  }
  // ,
  // {
  //   text: 'Sure! Here you go:\n\n1. **Code Block**: \n   ```markdown\n   ```\n   def hello_world():\n       print("Hello, world!")\n   ```\n   ```\n\n2. **Quote Block**:\n   ```markdown\n   > This is a blockquote in Markdown.\n   ```\n\n3. **List Item**:\n   - Ordered List:\n     ```markdown\n     1. First item\n     2. Second item\n     ```\n   - Unordered List:\n     ```markdown\n     - First item\n     - Second item\n     ```\n\n4. **Heading**:\n   ```markdown\n   # Heading Level 1\n   ## Heading Level 2\n   ### Heading Level 3\n   ```\n\n5. **Horizontal Rule**:\n   ```markdown\n   ---\n   ```\n\n6. **Image**:\n   ```markdown\n   ![Alt text](https://example.com/image.jpg)\n   ```\n\n7. **Link**:\n   ```markdown\n   [OpenAI](https://www.openai.com)\n   ```\n\n8. **Table**:\n   ```markdown\n   | Header 1 | Header 2 |\n   |----------|----------|\n   | Row 1    | Data 1   |\n   | Row 2    | Data 2   |\n   ```\n\n9. **Inline Code**:\n   ```markdown\n   Here is some `inline code`.\n   ```\n\nThese examples cover the typical types of Markdown blocks you can generate using OpenAI\'s API capabilities.',
  //   user: false
  // }
  // ,
  // {
  //   text: 'Certainly! Below are examples of various markdown blocks that can be used and rendered by OpenAI:\n\n1. **Code Block:**\n\n   ```markdown\n   ```\n   def hello_world():\n       print("Hello, world!")\n   ```\n   ```\n\n   Result:\n\n   ```python\n   def hello_world():\n       print("Hello, world!")\n   ```\n\n2. **Inline Code:**\n\n   ``markdown\n   Use `git status` to check the state of your repository.\n   ``\n\n   Result:\n\n   Use `git status` to check the state of your repository.\n\n3. **Bold Text:**\n\n   ```markdown\n   **This is bold text**\n   ```\n\n   Result:\n\n   **This is bold text**\n\n4. **Italic Text:**\n\n   ```markdown\n   *This is italic text*\n   ```\n\n   Result:\n\n   *This is italic text*\n\n5. **Strikethrough Text:**\n\n   ```markdown\n   ~~This text is strikethrough~~\n   ```\n\n   Result:\n\n   ~~This text is strikethrough~~\n\n6. **Blockquote:**\n\n   ```markdown\n   > This is a blockquote.\n   ```\n\n   Result:\n\n   > This is a blockquote.\n\n7. **Unordered List:**\n\n   ```markdown\n   - Item 1\n   - Item 2\n   - Item 3\n   ```\n\n   Result:\n\n   - Item 1\n   - Item 2\n   - Item 3\n\n8. **Ordered List:**\n\n   ```markdown\n   1. First\n   2. Second\n   3. Third\n   ```\n\n   Result:\n\n   1. First\n   2. Second\n   3. Third\n\n9. **Heading:**\n\n   ```markdown\n   # Heading 1\n   ## Heading 2\n   ### Heading 3\n   ```\n\n   Result:\n\n   # Heading 1\n   ## Heading 2\n   ### Heading 3\n\n10. **Link:**\n\n    ```markdown\n    [OpenAI](https://www.openai.com)\n    ```\n\n    Result:\n\n    [OpenAI](https://www.openai.com)\n\n11. **Image:**\n\n    ```markdown\n    ![Alt text](https://example.com/image.jpg)\n    ```\n\n    Result:\n\n    ![Alt text](https://example.com/image.jpg)\n\n12. **Horizontal Rule:**\n\n    ```markdown\n    ---\n    ```\n\n    Result:\n\n    ---\n\n13. **Tables:**\n\n    ```markdown\n    | Header 1 | Header 2 |\n    | -------- | -------- |\n    | Cell 1   | Cell 2   |\n    | Cell 3   | Cell 4   |\n    ```\n\n    Result:\n\n    | Header 1 | Header 2 |\n    | -------- | -------- |\n    | Cell 1   | Cell 2   |\n    | Cell 3   | Cell 4   |\n\n14. **Inline LaTeX Math:**\n\n    ```markdown\n    This is an inline equation: \\( E = mc^2 \\)\n    ```\n\n    Result:\n\n    This is an inline equation: \\( E = mc^2 \\)\n\n15. **Block LaTeX Math:**\n\n    ```markdown\n    $$ \n    a^2 + b^2 = c^2 \n    $$\n    ```\n\n    Result:\n\n    $$ \n    a^2 + b^2 = c^2 \n    $$\n\nThese examples cover the basic markdown and LaTeX types that can be rendered by the OpenAI system.',
  //   user: false
  // }
]

export default function Home() {
  const messages = exMsgs

  return (
    <div className="overflow-y-auto h-full w-full">
      <Container>
        <Messages messages={messages} />
      </Container>
    </div>
  )
}
