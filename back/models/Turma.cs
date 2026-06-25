namespace VibeCheckAPI_Dotnet8.Models
{
    public class Turma
    {
        public int Id { get; set; }
        public required string Nome { get; set; }
        public ICollection<Aluno>? Alunos { get; set; }
        public ICollection<Avaliacao>? Avaliacoes { get; set; }

        public int ProfessorId { get; set; }
        public Professor? Professor { get; set; }
    }
}