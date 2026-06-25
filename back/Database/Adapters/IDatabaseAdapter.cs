namespace VibeCheckAPI_Dotnet8.Database.Adapters
{
    public interface IDatabaseAdapter
    {
        Task<bool> TestarConexaoAsync(CancellationToken cancellationToken = default);
    }
}
