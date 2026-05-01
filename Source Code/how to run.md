
#### 1. Clone the Repository

```bash
git clone <repository-url>
cd eyra
```

#### 2. Backend Setup

```bash
cd backend

# Create .env file with required environment variables
cat > .env << EOF
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret-key>
GOOGLE_API_KEY=<your-google-generative-ai-key>
EOF

# Install dependencies
npm install

# Start the development server
npm start
```

The backend will be available at `http://localhost:5000`.

#### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Add emailjs browser dependency (for test result emails)
npm install @emailjs/browser

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`.

#### 4. Run Both Simultaneously

From the root directory:

```bash
npm run dev
```

This runs both frontend and backend concurrently in development mode.

---