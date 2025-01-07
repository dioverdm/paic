# LumeAI: Cutting-Edge AI-Powered Chat Application

LumeAI is a state-of-the-art chat application built with Next.js, featuring multiple AI model support and advanced conversation capabilities.

![LumeAI Logo](https://www.lumeai.xyz/og.png)

## Features

- Seamless integration with multiple AI providers (OpenAI, Anthropic, OpenRouter)
- Advanced memory system for contextual conversations
- Dynamic system prompts and conversation settings
- Web search capabilities with Google Custom Search integration
- Web page content fetching and processing
- Real-time conversation title generation
- Adjustable context length and token limits
- Temperature and Top-P parameter controls
- Secure API key encryption
- Modern, responsive interface
- Dark mode support

## Available Tools

LumeAI comes with several built-in tools that enhance the chat experience:

- **Remember Information**: Stores essential information like user preferences and key decisions
- **Title Generation**: Automatically creates concise, contextual titles for conversations
- **Date/Time**: Provides current date and time in ISO format
- **Hacker News**: Retrieves top stories from Hacker News
- **Calculator**: Performs basic mathematical calculations
- **Web Search**: Integration with Google Custom Search (requires API key)
- **Web Scraping**: Extracts content from web pages (requires Firecrawl API key)
- **Bing Search**: Alternative web search using Bing API (requires API key)

## Prerequisites

- Node.js (v16 or later)
- pnpm (v8 or later)
- API keys for your chosen providers:
  - OpenAI
  - Anthropic
  - OpenRouter
- Google API key and Custom Search Engine ID (for web search)
- Environment variables for encryption and system prompts

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/c-w-d-harshit/lume-ai-v2.git
   ```

2. Change to the project directory:

   ```bash
   cd lume-ai-v2
   ```

3. Install the dependencies:

   ```bash
   pnpm install
   ```

4. Set up your environment variables:
   Create a `.env.local` file with:

   ```env
   ENCRYPTION_SECRET_KEY=your_encryption_key
   SYSTEM_PROMPT={"SYSTEM_PROMPT":"your_default_system_prompt"}
   GOOGLE_API_KEY=your_google_api_key
   GOOGLE_CX=your_google_custom_search_id
   ```

5. Run the development server:

   ```bash
   pnpm dev
   ```

## Usage

1. Configure your API keys in the settings panel
2. Select your preferred AI provider and model
3. Adjust conversation settings like context length and temperature
4. Start chatting with advanced features like web search and memory

## Contributing

We welcome contributions! Please feel free to submit pull requests or open issues for any bugs or feature requests.

## License

LumeAI is open-source software licensed under the [MIT License](LICENSE).

## Contact

For questions or feedback, reach out to [cwd.harshit911@gmail.com](mailto:cwd.harshit911@gmail.com).
