namespace VibeCheckAPI_Dotnet8.Models
{
    public class Professor : Usuario
    {
        public ICollection<Turma>? Turmas { get; set; }
    }
}
