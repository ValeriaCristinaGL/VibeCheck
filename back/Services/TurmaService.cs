using Microsoft.EntityFrameworkCore;
using VibeCheckAPI_Dotnet8.Data.Context;
using VibeCheckAPI_Dotnet8.DTOs;
using VibeCheckAPI_Dotnet8.Models;
using VibeCheckAPI_Dotnet8.Repositories;

namespace VibeCheckAPI_Dotnet8.Services;

public interface ITurmaService
{
    Task<IEnumerable<TurmaDTO>> ListarTurmasProfessorAsync(string googleId);
    Task AtualizarNomeTurmaAsync(long id, string novoNome);
    Task ExcluirTurmaAsync(long id);
}


public class TurmaService : ITurmaService
{
    private readonly IUnitOfWork _uow;

    public TurmaService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<IEnumerable<TurmaDTO>> ListarTurmasProfessorAsync(string googleId)
    {
        var turmas = await _uow.TurmaRepository
            .ObterTodosAsync(t => t.Professor!.GoogleId == googleId);

        return turmas.Select(t => new TurmaDTO { Id = t.Id, Nome = t.Nome });
    }

    public async Task AtualizarNomeTurmaAsync(long id, string novoNome)
    {
        var turma = await _uow.TurmaRepository.ObterAsync(t => t.Id == id) ?? throw new KeyNotFoundException("Turma não encontrada.");
        turma.Nome = novoNome;
        _uow.TurmaRepository.Atualizar(turma);
        await _uow.CommitAsync();
    }

    public async Task ExcluirTurmaAsync(long id)
    {
        var turma = await _uow.TurmaRepository.ObterAsync(t => t.Id == id) ?? throw new KeyNotFoundException("Turma não encontrada.");
        _uow.TurmaRepository.Remover(turma);
        await _uow.CommitAsync();
    }
}
