namespace VibeCheckAPI_Dotnet8.DTOs;

public class UsuarioResponseDTO
{
    public int Id { get; set; }
    public required string Email { get; set; }
    public required string Nome { get; set; }
    public required string GoogleId { get; set; }
}
