using Microsoft.EntityFrameworkCore;
using VibeCheckAPI_Dotnet8.Data.Context;
using VibeCheckAPI_Dotnet8.DTOs;
using VibeCheckAPI_Dotnet8.Repositories;
using VibeCheckAPI_Dotnet8.Models;

namespace VibeCheckAPI_Dotnet8.Services;

public interface IRegistroEmocionalService
{
    Task<IEnumerable<RegistroEmocionalDTO>> GetDashboardAsync();
    Task<RegistroEmocional> RegistrarEmocaoAsync(string alunoGoogleId, string codigoAvaliacao, int emocaoId);
}

public class RegistroEmocionalService : IRegistroEmocionalService
{
    private readonly IUnitOfWork _uow;
    public RegistroEmocionalService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<IEnumerable<RegistroEmocionalDTO>> GetDashboardAsync()
    {
        // Exemplo simples: agrupar avaliações ativas por turma e tipo
        var registrosEmocionais = await _uow.RegistroEmocionalRepository
            .ObterTodosAsync(re => true, query => query
                .Include(re => re.Avaliacao)
                    .ThenInclude(a => a!.Turma)
                .Include(re => re.Emocao)
            );

        var registrosEmocionaisFormatados = registrosEmocionais
            .OrderBy(re => re.Avaliacao!.DataCriacao)
            .Select(re => new RegistroEmocionalDTO
            {
                Turma = re.Avaliacao!.Turma!.Nome,
                Tipo = re.Avaliacao!.TipoAvaliacao.ToString(),
                Data = re.Avaliacao!.DataCriacao.ToString("dd/MM/yyyy HH:mm"),
                Emocao = re.Emocao!.ValorNumerico
            }).ToList();

        return registrosEmocionaisFormatados;
    }

    public async Task<RegistroEmocional> RegistrarEmocaoAsync(string alunoGoogleId, string codigoAvaliacao, int valorEmocao)
    {
        var agora = DateTime.UtcNow;
        var avaliacao = await _uow.AvaliacaoRepository
            .ObterAsync(a => a.Codigo == codigoAvaliacao && a.Ativa && a.DataExpiracao > agora,
            include: q => q
                .Include(a => a.Turma)
        ) ?? throw new InvalidOperationException("Código de avaliação inválido ou expirado.");

        var aluno = await _uow.AlunoRepository
            .ObterAsync(a => a.GoogleId == alunoGoogleId) ?? throw new InvalidOperationException("Aluno não encontrado.");

        var emocao = await _uow.EmocaoRepository
            .ObterAsync(e => e.ValorNumerico == valorEmocao) ?? throw new InvalidOperationException("Emoção inválida.");

        if (aluno.TurmaId == null)
        {
            aluno.TurmaId = avaliacao.TurmaId;
            _uow.UsuarioRepository.Atualizar(aluno);
        }

        var registro = new RegistroEmocional
        {
            AlunoId = aluno.Id,
            AvaliacaoId = avaliacao.Id,
            EmocaoId = emocao.Id,
            DataRegistro = DateTime.UtcNow,
        };

        _uow.RegistroEmocionalRepository.Criar(registro);
        await _uow.CommitAsync();

        registro.Avaliacao = avaliacao;
        registro.Emocao = emocao;
        registro.Aluno = aluno;

        return registro;
    }
}
