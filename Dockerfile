FROM node:22.13.1-bookworm

# ✅ Lighthouse CLI
RUN npm install -g lighthouse

# ✅ 必要なパッケージ
RUN apt update && apt install -y wget curl gnupg2 ca-certificates dbus

# ✅ Chrome の GPG キーとリポジトリ
RUN mkdir -p /etc/apt/keyrings && \
    curl -fsSL https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /etc/apt/keyrings/google-chrome.gpg && \
    chmod a+r /etc/apt/keyrings/google-chrome.gpg

RUN echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/google-chrome.gpg] http://dl.google.com/linux/chrome/deb/ stable main" \
    > /etc/apt/sources.list.d/google-chrome.list

# ✅ Chrome のインストール
RUN apt update && apt install -y --no-install-recommends google-chrome-stable || \
    (curl -fsSL https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -o /tmp/chrome.deb && \
    dpkg -i /tmp/chrome.deb || apt --fix-broken install -y && rm /tmp/chrome.deb)

# ✅ 最新 npm
RUN npm install -g npm

# ✅ node ユーザーとして動かす
USER node

# ✅ 環境変数
ENV CHROME_PATH="/opt/google/chrome/google-chrome"
ENV NODE_ENV production

# ✅ 作業ディレクトリ
WORKDIR /home/node/app

# ✅ アプリのコードをコピーしてビルド・起動
COPY . .
RUN npm install
RUN npm run build

# ✅ アプリの起動
CMD ["node", "dist/index.js"]
