namespace VibeCheckAPI_Dotnet8.Models
{
    public class Aluno : Usuario
    {
        public int? TurmaId { get; set; }
        public Turma? Turma { get; set; }
    }
}
