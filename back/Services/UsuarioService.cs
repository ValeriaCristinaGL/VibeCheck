using Microsoft.EntityFrameworkCore;
using VibeCheckAPI_Dotnet8.Data.Context;
using VibeCheckAPI_Dotnet8.DTOs;
using VibeCheckAPI_Dotnet8.Models;
using VibeCheckAPI_Dotnet8.Repositories;

namespace VibeCheckAPI_Dotnet8.Services;

public interface IUsuarioService
{
    Task<UsuarioResponseDTO> RegistrarUsuarioAsync(string googleId, string email, string nome);
}

public class UsuarioService : IUsuarioService
{
    private readonly IUnitOfWork _uow;
    private readonly IElegibilidadeService _elegibilidadeService;

    public UsuarioService(IUnitOfWork uow, IElegibilidadeService elegibilidadeService)
    {
        _uow = uow;
        _elegibilidadeService = elegibilidadeService;
    }

    public async Task<UsuarioResponseDTO> RegistrarUsuarioAsync(string googleId, string email, string nome)
    {
        var usuarioExistente = await _uow.UsuarioRepository.ObterAsync(u => u.GoogleId == googleId);
        if (usuarioExistente != null)
        {
            return new UsuarioResponseDTO
            {
                Id = usuarioExistente.Id,
                GoogleId = usuarioExistente.GoogleId,
                Email = usuarioExistente.Email,
                Nome = usuarioExistente.Nome,
            };
        }

        var elegivelParaProfessor = await _elegibilidadeService.verificarElegibilidadeProfessor(email);

        if (elegivelParaProfessor)
        {
            var novoUsuario = new Professor
            {
                GoogleId = googleId,
                Email = email,
                Nome = nome,
            };

            _uow.UsuarioRepository.Criar(novoUsuario);
            await _uow.CommitAsync();

            return new UsuarioResponseDTO
            {
                Id = novoUsuario.Id,
                GoogleId = novoUsuario.GoogleId,
                Email = novoUsuario.Email,
                Nome = novoUsuario.Nome,
            };

        }
        else
        {
            var novoUsuario = new Aluno
            {
                GoogleId = googleId,
                Email = email,
                Nome = nome,
            };

            _uow.UsuarioRepository.Criar(novoUsuario);
            await _uow.CommitAsync();

            return new UsuarioResponseDTO
            {
                Id = novoUsuario.Id,
                GoogleId = novoUsuario.GoogleId,
                Email = novoUsuario.Email,
                Nome = novoUsuario.Nome,
            };
        }
    }


}
