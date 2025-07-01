using Microsoft.AspNetCore.SignalR;
using ChatApi.Data;
using ChatApi.Models;

public class ChatHub : Hub
{
    private readonly AppDbContext _db;
    public ChatHub(AppDbContext db) => _db = db;

public async Task Send(string user, string message, int? replyToId)
{
    // ★ 如果指定回覆，檢查是否存在
    ChatMessage? parent = null;
    if (replyToId.HasValue)
    {
        parent = await _db.Messages.FindAsync(replyToId.Value);
        if (parent == null) replyToId = null;      // 安全回退
    }

    var msg = new ChatMessage {
        User     = user,
        Content  = message,
        ReplyToId = replyToId
    };
    _db.Messages.Add(msg);
    await _db.SaveChangesAsync();

    // 廣播 (含 id / replyToId / 時間戳)
    await Clients.All.SendAsync("Receive",
        msg.Id, user, message, msg.SentAt, replyToId);
}

    public async Task Recall(int id)
    {
        var msg = await _db.Messages.FindAsync(id);
        if (msg == null) return;

        msg.IsRecall = true;
        await _db.SaveChangesAsync();
        await Clients.All.SendAsync("Recall", id);
    }
}