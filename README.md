# Lexi-Scan: Contract Compliance Analysis Tool

A modern web application for analyzing legal contracts against compliance checklists with real-time scanning and customizable rules.

## 🚀 Live Demo

- **Frontend**: [https://kennyxu17.github.io/lexi-scan/](https://kennyxu17.github.io/lexi-scan/)
- **Backend API**: Deploy to Render or your preferred hosting service

## 📋 Features

- **Contract Analysis**: Upload and analyze PDF contracts
- **Compliance Checklist**: Customizable rules with severity levels
- **Real-time Scanning**: Instant feedback on compliance issues
- **Template System**: Pre-built templates for different contract types
- **Export Reports**: Generate compliance reports
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Python, FastAPI, Docker
- **Deployment**: GitHub Pages (Frontend), Render (Backend)

## 🚀 Deployment

### Frontend (GitHub Pages)

1. **Configure Repository Settings**:
   - Go to your GitHub repository settings
   - Navigate to "Pages" section
   - Set source to "GitHub Actions"

2. **Update Environment Variables**:
   - Edit `.env.production` with your backend URL:
   ```
   VITE_API_URL=https://your-backend-app.onrender.com
   ```

3. **Deploy**:
   - Push to main branch
   - GitHub Actions will automatically build and deploy
   - Frontend will be available at: `https://kennyxu17.github.io/lexi-scan/`

### Backend (Render)

1. **Create Render Account** and connect your GitHub repository

2. **Deploy Backend**:
   - Create new Web Service on Render
   - Connect to your repository
   - Set build command: `docker build -t backend ./backend`
   - Set start command: `docker run -p 10000:8000 backend`
   - Add environment variables as needed

3. **Update CORS Settings**:
   - Ensure your backend allows requests from your GitHub Pages domain
   - Update CORS origins in your FastAPI application

## 🔧 Local Development

### Prerequisites
- Node.js 18+ or Bun
- Python 3.9+
- Docker (optional)

### Frontend Setup
```bash
# Install dependencies
bun install

# Start development server
bun run dev
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Docker Setup
```bash
docker-compose up --build
```

## 📁 Project Structure

```
lexi-scan/
├── src/
│   ├── components/        # React components
│   ├── pages/            # Application pages
│   ├── services/         # API services
│   ├── types/           # TypeScript definitions
│   └── data/            # Static data and templates
├── backend/             # Python FastAPI backend
├── .github/workflows/   # GitHub Actions
└── public/             # Static assets
```

## 🔐 Environment Variables

### Frontend (.env.production)
```
VITE_API_URL=https://your-backend-url.com
```

### Backend
Configure as needed for your hosting service (database URLs, API keys, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/67bcb3d8-7c96-4af5-bfdd-d961c7a3432c) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
