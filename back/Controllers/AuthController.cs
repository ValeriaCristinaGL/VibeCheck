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
    public class AuthController : ControllerBase
    {
        [HttpGet("login")]
        public IActionResult TriggerGoogleLogin()
        {
            return Challenge(new AuthenticationProperties
            {
                RedirectUri = "/api/auth/success"
            }, "Google");
        }

        [HttpGet("success")]
        [Authorize]
        public IActionResult LoginSuccess()
        {
            var user = HttpContext.User;

            // Verificar roles e redirecionar apropriadamente
            if (user.IsInRole("ROLE_PROFESSOR"))
            {
                return Redirect("http://localhost:3000/dashboard");
            }
            else if (user.IsInRole("ROLE_ALUNO"))
            {
                return Redirect("http://localhost:3000/check");
            }

            // Fallback para usuários sem role específico
            return Redirect("http://localhost:3000/");
        }

        [HttpPost("logout")]
        [Authorize(Policy = "ApenasAutenticado")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync();
            return Ok(new { message = "✅ Usuário fez logout." });
        }

        [HttpGet("")]
        [AllowAnonymous]
        public IActionResult PublicPage()
        {
            return Ok("Bem-vindo ao Vibe Check! Faça login para continuar via /login.");
        }

        [HttpGet("user/details")]
        [Authorize]
        public IActionResult GetUserDetails()
        {
            var user = HttpContext.User;
            if (user?.Identity == null || !user.Identity.IsAuthenticated)
            {
                return Unauthorized(new { error = "Usuário não autenticado" });
            }

            var name = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            var email = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var googleId = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            var roles = user.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value).ToList();

            var userDetails = new Dictionary<string, object>
            {
                { "name", name ?? string.Empty },
                { "email", email ?? string.Empty },
                { "googleId", googleId ?? string.Empty },
                { "roles", roles }
            };

            return Ok(userDetails);
        }
    }
}