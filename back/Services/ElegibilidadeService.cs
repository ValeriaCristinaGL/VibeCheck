using System.Text.RegularExpressions;
using Microsoft.Extensions.Options;

public class ElegibilidadeProfessorOptions
{
    public List<string>? Emails { get; set; }
    public List<string>? Domains { get; set; }
    public List<string>? Contains { get; set; }
}

public interface IElegibilidadeService
{
    Task<bool> verificarElegibilidadeProfessor(string email);
}

public class ElegibilidadeService : IElegibilidadeService
{
    private readonly ElegibilidadeProfessorOptions _options;

    public ElegibilidadeService(IOptions<ElegibilidadeProfessorOptions> options)
    {
        _options = options.Value;
    }

    public Task<bool> verificarElegibilidadeProfessor(string email)
    {
        email = email.Trim().ToLowerInvariant();

        if (_options.Emails?.Any(e => string.Equals(e.Trim().ToLowerInvariant(), email, StringComparison.OrdinalIgnoreCase)) == true)
            return Task.FromResult(true);

        if (_options.Domains?.Any(d => email.EndsWith("@" + d.Trim().ToLowerInvariant())) == true)
            return Task.FromResult(true);

        if (_options.Contains?.Any(c => email.Contains(c.Trim(), StringComparison.InvariantCultureIgnoreCase)) == true)
            return Task.FromResult(true);

        return Task.FromResult(false);
    }
}
