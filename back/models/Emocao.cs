namespace VibeCheckAPI_Dotnet8.Models
{
    public class Emocao
    {
        public int Id { get; set; }
        public required string Titulo { get; set; }
        public required string Emoji { get; set; }
        public required int ValorNumerico { get; set; }
        public ICollection<RegistroEmocional>? RegistrosEmocionais { get; set; }
    }
}