**前端**：React 19 + Vite + Tailwind 4  
**後端**：ASP.NET Core 8 + SignalR + Entity Framework Core (SQLite)

即時渲染的聊天室範例。  
訊息資料會同步寫入本機 `chat.db`（SQLite），並透過 WebSocket (SignalR) 廣播到所有瀏覽器分頁。

Getting Started

# 1. 前置
pnpm install
dotnet tool install --global dotnet-ef

# 2. 產生 / 更新資料庫
cd server/ChatApi
dotnet ef database update

# 3. 執行
前端執行 pnpm dev
後端執行 dotnet run