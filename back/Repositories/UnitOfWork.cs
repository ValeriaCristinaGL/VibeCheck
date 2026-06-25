using VibeCheckAPI_Dotnet8.Data.Context;
using VibeCheckAPI_Dotnet8.Models;

namespace VibeCheckAPI_Dotnet8.Repositories
{

    public interface IUnitOfWork
    {
        IRepository<Usuario> UsuarioRepository { get; }
        IRepository<Professor> ProfessorRepository { get; }
        IRepository<Aluno> AlunoRepository { get; }
        IRepository<Turma> TurmaRepository { get; }
        IRepository<Avaliacao> AvaliacaoRepository { get; }
        IRepository<RegistroEmocional> RegistroEmocionalRepository { get; }
        IRepository<Emocao> EmocaoRepository { get; }

        Task CommitAsync();
    }

    public class UnitOfWork : IUnitOfWork, IDisposable
    {
        private readonly AppDbContext _context;

        private IRepository<Usuario>? _usuarioRepository;
        private IRepository<Professor>? _professorRepository;
        private IRepository<Aluno>? _alunoRepository;
        private IRepository<Turma>? _turmaRepository;
        private IRepository<Avaliacao>? _avaliacaoRepository;
        private IRepository<RegistroEmocional>? _registroEmocionalRepository;
        private IRepository<Emocao>? _emocaoRepository;

        public UnitOfWork(AppDbContext context)
        {
            _context = context;
        }

        public IRepository<Usuario> UsuarioRepository => _usuarioRepository ??= new Repository<Usuario>(_context);
        public IRepository<Professor> ProfessorRepository => _professorRepository ??= new Repository<Professor>(_context);
        public IRepository<Aluno> AlunoRepository => _alunoRepository ??= new Repository<Aluno>(_context);
        public IRepository<Turma> TurmaRepository => _turmaRepository ??= new Repository<Turma>(_context);
        public IRepository<Avaliacao> AvaliacaoRepository => _avaliacaoRepository ??= new Repository<Avaliacao>(_context);
        public IRepository<RegistroEmocional> RegistroEmocionalRepository => _registroEmocionalRepository ??= new Repository<RegistroEmocional>(_context);
        public IRepository<Emocao> EmocaoRepository => _emocaoRepository ??= new Repository<Emocao>(_context);

        public async Task CommitAsync()
        {
            await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
