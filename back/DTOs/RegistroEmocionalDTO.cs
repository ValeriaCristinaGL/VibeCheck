namespace VibeCheckAPI_Dotnet8.DTOs;

public class RegistroEmocionalDTO
{
    public required string Turma { get; set; }
    public required string Tipo { get; set; }
    public required int Emocao { get; set; }
    public required string Data { get; set; }
}
