namespace VibeCheckAPI_Dotnet8.DTOs;

public class EmocaoDTO
{
    public int Id { get; set; }
    public required string Titulo { get; set; }
    public required string Emoji { get; set; }
    public int ValorNumerico { get; set; }
}
