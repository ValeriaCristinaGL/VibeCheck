using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VibeCheckAPI_Dotnet8.DTOs;
using VibeCheckAPI_Dotnet8.Services;
using VibeCheckAPI_Dotnet8.Repositories;

namespace VibeCheckAPI_Dotnet8.Controllers;

[ApiController]
[Route("")]
public class EmocaoController : ControllerBase
{
    private readonly IRegistroEmocionalService _registroService;
    private readonly IUnitOfWork _uow;

    public EmocaoController(IRegistroEmocionalService registroService, IUnitOfWork uow)
    {
        _registroService = registroService;
        _uow = uow;
    }

    private string? GetGoogleSub() => User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");

    [HttpGet("emocoes")]
    [Authorize(Policy = "ApenasAutenticado")]
    public async Task<ActionResult<IEnumerable<EmocaoDTO>>> ListarEmocoes()
    {
        var emocoes = await _uow.EmocaoRepository.ObterTodosAsync(e => true);
        var emocoesDTO = emocoes.Select(e => new EmocaoDTO
        {
            Id = e.Id,
            Titulo = e.Titulo,
            Emoji = e.Emoji,
            ValorNumerico = e.ValorNumerico
        });
        return Ok(emocoesDTO);
    }
}
