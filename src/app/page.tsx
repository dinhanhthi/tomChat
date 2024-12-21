import Messages from '../components/messages'
import { Message } from '../interface'

const exMsgs: Message[] = [
  {
    text: 'Math inline equation',
    user: true
  },
  {
    text: '**Inline LaTeX Math:** \\(e^{i\\pi} + 1 = 0\\) (use `\\(`) and $e^{i\\pi} + 1 = 0$ (use `$`).',
    user: false
  },
  {
    text: 'Math display block equation',
    user: true
  },
  {
    text: '**Block LaTeX Math:**\n\n $$\n\n \\int_0^\\infty e^{-x^2} \\, dx = \\frac{\\sqrt{\\pi}}{2}\n $$ \n\n And use `\\[ ... \\]` to display math equations in block format. \n\n\\[\nE = mc^2\n\\]\n\n',
    user: false
  },
  {
    text: 'Can you show me some examples of different Markdown blocks?',
    user: true
  },
  {
    text: 'Certainly! $4 to buy Here are short examples of different Markdown blocks that OpenAI API responses can generate:\n\n1. **Code Block**: Used for displaying code snippets.\n    ```python\n    def hello_world():\n        print("Hello, world!")\n    ```\n\n2. **Blockquote**: Used for quoting text.\n    > This is a blockquote example.\n\n3. **Unordered List**: Used for lists without a particular order.\n    - Item 1\n    - Item 2\n    - Item 3\n\n4. **Ordered List**: Used for lists with a specific order.\n    1. First item\n    2. Second item\n    3. Third item\n\n5. **Table**: Used for displaying tabular data.\n    | Header 1 | Header 2 |\n    |----------|----------|\n    | Row 1 Col 1 | Row 1 Col 2 |\n    | Row 2 Col 1 | Row 2 Col 2 |\n\n6. **Heading**: Used for section headings, from level 1 to level 6.\n    # Heading 1\n    ## Heading 2\n    ### Heading 3\n\n7. **Horizontal Rule**: Used for creating a thematic break.\n\n    ---\n    \n8. **Inline Code**: Used for inline code within a sentence.\n  Here is some inline code: `print("Hello, world!")`.\n\n9. **Inline LaTeX Math:** \\(e^{i\\pi} + 1 = 0\\) (use `\\(`) and $e^{i\\pi} + 1 = 0$ (use `$`).\n\n 10. **Block LaTeX Math:**\n\n $$\n\n \\int_0^\\infty e^{-x^2} \\, dx = \\frac{\\sqrt{\\pi}}{2}\n $$ \n\n These blocks help format and structure text in a clear and organized way.',
    user: false
  },
  {
    text: 'Can you show me some examples of different Markdown blocks?',
    user: true
  },
  {
    text: "Certainly! When you want to display a math equation in block format using LaTeX, you can enclose it with `\\[ ... \\]`. Here's an example of a block display math equation using this notation:\n\n\\[\nE = mc^2\n\\]\n\nThis equation represents Einstein's famous mass-energy equivalence formula, where \\( E \\) is energy, \\( m \\) is mass, and \\( c \\) is the speed of light in a vacuum.",
    user: false
  }
]

export default function Home() {
  const messages = exMsgs

  return <Messages messages={messages} />
}
