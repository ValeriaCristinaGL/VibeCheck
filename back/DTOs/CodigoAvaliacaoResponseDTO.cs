namespace VibeCheckAPI_Dotnet8.DTOs;

public class CodigoAvaliacaoResponseDTO
{
    public required string Codigo { get; set; }
    public required DateTime ExpiraEm { get; set; }
    public required string Tipo { get; set; } 
}
