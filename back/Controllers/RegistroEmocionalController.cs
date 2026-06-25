using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using VibeCheckAPI_Dotnet8.DTOs;
using VibeCheckAPI_Dotnet8.Services;

namespace VibeCheckAPI_Dotnet8.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegistroEmocionalController : ControllerBase
    {
        private readonly IRegistroEmocionalService _registroService;
        public RegistroEmocionalController(IRegistroEmocionalService registroService)
        {
            _registroService = registroService;
        }

        private string? GetGoogleSub() => User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");

        [HttpPost("registrar")]
        [Authorize(Policy = "ApenasAluno")]
        public async Task<ActionResult<RegistroEmocionalDTO>> RegistrarEmocao([FromQuery] string codigo, [FromQuery] int valorEmocao)
        {
            var alunoGoogleId = GetGoogleSub();
            if (alunoGoogleId is null) return Unauthorized();

            var registro = await _registroService.RegistrarEmocaoAsync(alunoGoogleId, codigo, valorEmocao);

            var dto = new RegistroEmocionalDTO
            {
                Turma = registro.Avaliacao!.Turma!.Nome,
                Tipo = registro.Avaliacao!.TipoAvaliacao.ToString(),
                Emocao = registro.Emocao!.ValorNumerico,
                Data = registro.Avaliacao!.DataCriacao.ToString("O")
            };

            return Ok(dto);
        }
    }
}