using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using VibeCheckAPI_Dotnet8.Repositories;
using VibeCheckAPI_Dotnet8.Services;
using VibeCheckAPI_Dotnet8.DTOs;

namespace VibeCheckAPI_Dotnet8.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AvaliacaoController : ControllerBase
    {
        private readonly IAvaliacaoService _avaliacaoService;
        private readonly ITurmaService _turmaService;
        private readonly IRegistroEmocionalService _registroService;

        public AvaliacaoController(IAvaliacaoService avaliacaoService, ITurmaService turmaService, IRegistroEmocionalService registroService)
        {
            _avaliacaoService = avaliacaoService;
            _turmaService = turmaService;
            _registroService = registroService;
        }

        private string? GetGoogleSub() => User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");

        [HttpPost("liberar-checkin")]
        [Authorize(Policy = "ApenasProfessor")]
        public async Task<ActionResult<CodigoAvaliacaoResponseDTO>> LiberarCheckin([FromBody] LiberarCodigoRequestDTO request)
        {
            var googleId = GetGoogleSub();
            if (googleId is null) return Unauthorized();
            
            var dto = await _avaliacaoService.GerarCodigoCheckinAsync(googleId, request.NomeTurma, request.ValidadeSegundos);
            return Ok(dto);
        }

        [HttpPost("liberar-checkout")]
        [Authorize(Policy = "ApenasProfessor")]
        public async Task<ActionResult<CodigoAvaliacaoResponseDTO>> LiberarCheckout([FromBody] LiberarCodigoRequestDTO request)
        {
            var googleId = GetGoogleSub();
            if (googleId is null) return Unauthorized();
            var dto = await _avaliacaoService.GerarCodigoCheckoutAsync(googleId, request.NomeTurma, request.ValidadeSegundos);
            return Ok(dto);
        }

        [HttpGet("turmas")]
        [Authorize(Policy = "ApenasProfessor")]
        public async Task<ActionResult<IEnumerable<TurmaDTO>>> ListarTurmas()
        {
            var googleId = GetGoogleSub();
            if (googleId is null) return Unauthorized();
            var turmas = await _turmaService.ListarTurmasProfessorAsync(googleId);
            return Ok(turmas);
        }

        [HttpGet("verificar-codigo")]
        [Authorize(Policy = "ApenasAluno")]
        public async Task<ActionResult<VerificarCodigoResponseDTO>> VerificarCodigo(string codigo)
        {
            var resultado = await _avaliacaoService.VerificarCodigoAsync(codigo);
            return Ok(resultado);
        }

        [HttpGet("dashboard")]
        [Authorize(Policy = "ApenasProfessor")]
        public async Task<ActionResult<IEnumerable<RegistroEmocionalDTO>>> Dashboard()
        {
            var dados = await _registroService.GetDashboardAsync();
            return Ok(dados);
        }
    }
}