namespace VibeCheckAPI_Dotnet8.Models
{
    public class RegistroEmocional
    {
        public int Id { get; set; }
        public DateTime DataRegistro { get; set; } = DateTime.UtcNow;

        public int AvaliacaoId { get; set; }
        public Avaliacao? Avaliacao { get; set; }

        public int? AlunoId { get; set; }
        public Aluno? Aluno { get; set; }

        public int? EmocaoId { get; set; }
        public Emocao? Emocao { get; set; }
    }
}