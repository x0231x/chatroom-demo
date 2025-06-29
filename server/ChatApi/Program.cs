var builder = WebApplication.CreateBuilder(args); // 啟動 app 的建構器

// ----------服務註冊----------
builder.Services.AddCors(o =>
    o.AddDefaultPolicy(p => p
        .WithOrigins("http://localhost:5173") // 允許的前端網址
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()));

builder.Services.AddSignalR(); // 將SignalR加入builder

var app = builder.Build(); // 建立 app

// ----------中介軟體----------
app.UseCors(); // 啟用 CORS
// app.UseRouting(); 現在 MapHub 會自動幫你加的樣子

// ----------路由----------
app.MapHub<ChatHub>("/chat");
app.MapGet("/test", () => "測試");  //測試用 去 http://localhost:5111/test 看到測試這兩個字

app.Run();