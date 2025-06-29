using Microsoft.EntityFrameworkCore;
using ChatApi.Models;

namespace ChatApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<ChatMessage> Messages => Set<ChatMessage>();
}
