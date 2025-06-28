using Microsoft.AspNetCore.SignalR;

public class ChatHub : Hub
{
    //前端可以呼叫 conn.invoke("Send", user, msg)
    public async Task Send(string user, string message)
        => await Clients.All.SendAsync("Receive", user, message);
}