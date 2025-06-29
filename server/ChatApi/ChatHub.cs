using Microsoft.AspNetCore.SignalR;
using ChatApi.Data;
using ChatApi.Models;

public class ChatHub : Hub
{
    private readonly AppDbContext _db;
    public ChatHub(AppDbContext db) => _db = db;

    public async Task Send(string user, string message)
    {
        // 1. 寫入資料庫
        var msg = new ChatMessage { User = user, Content = message };
        _db.Messages.Add(msg);
        await _db.SaveChangesAsync();

        // 2. 廣播給所有 Client（含剛存入時的時間戳）
        await Clients.All.SendAsync("Receive", user, message, msg.SentAt);
    }
}