**前端**：React 19 + Vite + Tailwind 4  
**後端**：ASP.NET Core 8 + SignalR + Entity Framework Core (SQLite)

即時渲染的多人文字聊天室實作，包含回覆與收回訊息功能。  
訊息資料會同步寫入本機 `chat.db`（SQLite），並透過 WebSocket (SignalR) 廣播到所有瀏覽器分頁。  
可以開啟一個新分頁與一個無痕模式的新分頁，模擬兩名使用者對談。  
(使用者名稱會記錄在localstorage內，所以不開無痕模式去開兩個分頁的話會視為同一個人)  

# Getting Started

# 1. 前置
pnpm install  

dotnet tool install --global dotnet-ef  

# 2. 產生 / 更新資料庫
cd server/ChatApi  

dotnet ef database update  

# 3. 執行
前端執行 pnpm dev  

後端執行 dotnet run  

# 環境變數
VITE_API_BASE – 前端連線的後端 URL（預設 http://localhost:5111）  