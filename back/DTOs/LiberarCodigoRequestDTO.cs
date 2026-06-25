namespace VibeCheckAPI_Dotnet8.DTOs;

public class LiberarCodigoRequestDTO
{
    public required string NomeTurma { get; set; }
    public int ValidadeSegundos { get; set; } = 1800;
}
