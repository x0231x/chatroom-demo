namespace ChatApi.Models;

public class ChatMessage
{
    public int      Id        { get; set; }
    public string   User      { get; set; } = string.Empty;
    public string   Content   { get; set; } = string.Empty;
    public DateTime SentAt    { get; set; } = DateTime.UtcNow;
    public bool     IsRecall  { get; set; } = false;

    public int?     ReplyToId { get; set; }
    public ChatMessage? ReplyTo { get; set; }  
}