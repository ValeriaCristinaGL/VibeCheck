
using VibeCheckAPI_Dotnet8.Models;
using Microsoft.EntityFrameworkCore;

namespace VibeCheckAPI_Dotnet8.Data.Context
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Aluno> Alunos { get; set; }
        public DbSet<Professor> Professores { get; set; }
        public DbSet<Turma> Turmas { get; set; }
        public DbSet<Avaliacao> Avaliacoes { get; set; }
        public DbSet<Emocao> Emocoes { get; set; }
        public DbSet<RegistroEmocional> RegistrosEmocionais { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.Email).IsUnique();
            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.GoogleId).IsUnique();

            modelBuilder.Entity<Usuario>()
                .HasDiscriminator<string>("TipoUsuario")
                .HasValue<Aluno>("Aluno")
                .HasValue<Professor>("Professor");

            modelBuilder.Entity<Turma>()
                .HasOne(t => t.Professor)
                .WithMany(p => p.Turmas!)
                .HasForeignKey(t => t.ProfessorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Aluno>()
                .HasOne(a => a.Turma)
                .WithMany(t => t.Alunos!)
                .HasForeignKey(a => a.TurmaId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Avaliacao>()
                .HasOne(a => a.Turma)
                .WithMany(t => t.Avaliacoes!)
                .HasForeignKey(a => a.TurmaId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Emocao>()
                .HasIndex(e => e.ValorNumerico).IsUnique();

            modelBuilder.Entity<RegistroEmocional>()
                .HasOne(r => r.Emocao)
                .WithMany(e => e.RegistrosEmocionais!)
                .HasForeignKey(r => r.EmocaoId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RegistroEmocional>()
                .HasOne(r => r.Avaliacao)
                .WithMany(a => a.RegistrosEmocionais!)
                .HasForeignKey(r => r.AvaliacaoId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.SeedBaseline();
        }
    }
}