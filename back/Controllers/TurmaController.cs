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
    [Authorize(Policy = "ApenasProfessor")]
    public class TurmaController : ControllerBase
    {
        private readonly ITurmaService _turmaService;
        public TurmaController(ITurmaService turmaService)
        {
            _turmaService = turmaService;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditarTurma([FromRoute] long id, [FromBody] string novoNome)
        {
            await _turmaService.AtualizarNomeTurmaAsync(id, novoNome);
            return Ok("Nome da turma atualizado com sucesso.");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> ExcluirTurma([FromRoute] long id)
        {
            await _turmaService.ExcluirTurmaAsync(id);
            return Ok("Turma excluída com sucesso.");
        }
    }
}