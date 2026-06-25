using Microsoft.EntityFrameworkCore;
using VibeCheckAPI_Dotnet8.Data.Context;

namespace VibeCheckAPI_Dotnet8.Database.Adapters
{
    public class PostgresDatabaseAdapter : IDatabaseAdapter
    {
        private readonly AppDbContext _dbContext;

        public PostgresDatabaseAdapter(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<bool> TestarConexaoAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                return await _dbContext.Database.CanConnectAsync(cancellationToken);
            }
            catch
            {
                return false;
            }
        }
    }
}
