namespace VibeCheckAPI_Dotnet8.Models
{
    public abstract class Usuario
    {
        public int Id { get; set; }
        public required string Email { get; set; }
        public required string Nome { get; set; }
        public required string GoogleId { get; set; }
    }
}