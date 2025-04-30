# 🔐 Axiom – Real-time Collaborative Encrypted Workspace

**Axiom** is a real-time, end-to-end encrypted collaboration tool built for developers, teams, and creators who value privacy, speed, and control. Every action is synchronized instantly using WebSockets, and your data is encrypted client-side—ensuring only you and your collaborators can access it.

![Axiom logo](./axiom.svg)

## ⚡ Features

- 🔒 End-to-end encryption with public/private & symmetric key cryptography
- 🔄 Real-time collaboration using WebSockets
- 🧠 Collaborative workspace with text editing, messaging, and asset sharing
- 🧩 Role-based access control and authentication
- 📦 Fully containerized via Docker for local and cloud deployment
- ✅ Built from scratch using cutting-edge tools and clean architecture

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, TailwindCSS, Lucide Icons
- **Backend**: Node.js, WebSockets (via `next-ws`, `socket.io`), JWT Auth
- **Database**: PostgreSQL, Prisma ORM
- **Security**: RSA-OAEP + AES-GCM Encryption (Web Crypto API)
- **Infrastructure**: Docker, GitHub Actions, Cloud Provider TBD

## 🔐 Encryption Toolkit

We use a hybrid encryption model:

- RSA-OAEP (2048-bit) for key exchange
- AES-GCM (256-bit) for data at rest and in motion
- Built-in support for generating and managing keys on the client side

_See `/lib` for full implementation of:_

- RSA key generation
- Symmetric key encryption/decryption
- Secure data handling using base64 buffers

## 🧪 Installation

1. **Clone the repository:**

```bash
git clone https://github.com/mishodzuliashvili/axiom.git
cd axiom
```

2. **Install dependencies:**

```bash
pnpm install
```

3. **Setup your database:**

```bash
pnpm prisma migrate deploy
```

4. **Configure environment variables:**

```bash
cp .env.example .env
# Fill in the required credentials in `.env`
```

5. **Run the development server:**

```bash
pnpm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) to explore Axiom.

## 👨‍💻 Team

- [Misho Dzuliashvili](https://github.com/mishodzuliashvili) – Full Stack Engineer
- [Luka Trapaidze](https://github.com/I-Bumblebee) – Frontend & UI/UX
- [Luka Oniani](https://github.com/lukabatoni) – Backend & Infra Engineer

## 🚧 Roadmap

- [ ] Collaborative document and whiteboard views
- [ ] Offline-first capability with local caching
- [ ] GitHub integration
- [ ] Mobile UI enhancements

## ⚖️ Responsibility

While we strive to maintain high-quality and secure code, this project is provided as is without any warranties or guarantees. The authors are not responsible for any damages, losses, or issues arising from the use or misuse of this software. Use it at your own risk.

## ⚠️ Disclaimer of Misuse

This software is intended for legal and ethical use only. The authors and contributors strictly prohibit the use of this project for any illegal activities.
We do not assume any responsibility for unlawful use of this project. Any misuse is solely the responsibility of the individual or organization involved.

## 🤝 Contributing

We welcome your input and pull requests! Please open an issue to suggest improvements, or fork and contribute.

## 📝 License

This project is proprietary. All rights reserved. Please contact the authors for access or licensing inquiries.
