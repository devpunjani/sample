# Arakoo Chat

A mobile-focused ChatGPT clone built with Next.js, featuring multiple AI models and a modern UI.

## Features

- 🤖 Multiple AI Models (Gemini, OpenAI)
- 📱 Mobile-First Design
- 🔒 Authentication with Auth0
- 💾 Data Storage with Supabase
- 🎨 Modern UI with Bootstrap
- 🔄 Real-time Chat Interface
- 🖼️ Image Generation Support

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Backend**: tRPC
- **Database**: Supabase
- **Authentication**: Auth0
- **UI**: Bootstrap
- **AI Models**:
  - Google Gemini
  - OpenAI GPT

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/arakoo-chat.git
   cd arakoo-chat
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file with the following variables:

   ```
   GEMINI_API_KEY=your_gemini_api_key
   OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   AUTH0_SECRET=your_auth0_secret
   AUTH0_BASE_URL=http://localhost:3000
   AUTH0_ISSUER_BASE_URL=your_auth0_issuer_url
   AUTH0_CLIENT_ID=your_auth0_client_id
   AUTH0_CLIENT_SECRET=your_auth0_client_secret
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Make sure to set up the following environment variables:

- `GEMINI_API_KEY`: Your Google Gemini API key
- `OPENAI_API_KEY`: Your OpenAI API key
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `AUTH0_SECRET`: Your Auth0 secret
- `AUTH0_BASE_URL`: Your application base URL
- `AUTH0_ISSUER_BASE_URL`: Your Auth0 issuer URL
- `AUTH0_CLIENT_ID`: Your Auth0 client ID
- `AUTH0_CLIENT_SECRET`: Your Auth0 client secret

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
