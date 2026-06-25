using Microsoft.EntityFrameworkCore;
using VibeCheckAPI_Dotnet8.Data.Context;
using System.Security.Claims;
using VibeCheckAPI_Dotnet8.Services;
using VibeCheckAPI_Dotnet8.Repositories;
using VibeCheckAPI_Dotnet8.Database.Adapters;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configuração de CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:8080")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Configuração de banco via Adapter (Postgres / SqlServer)
var dbProvider = builder.Configuration["DatabaseProvider"] ?? "Postgres";

if (dbProvider.Equals("SqlServer", StringComparison.OrdinalIgnoreCase))
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("SqlServerConnection")));

    builder.Services.AddScoped<IDatabaseAdapter, SqlServerDatabaseAdapter>();
}
else // Postgres como padrão
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

    builder.Services.AddScoped<IDatabaseAdapter, PostgresDatabaseAdapter>();
}

// Serviços de domínio
builder.Services.AddScoped<IRegistroEmocionalService, RegistroEmocionalService>();
builder.Services.AddSingleton<IElegibilidadeService, ElegibilidadeService>();
builder.Services.AddScoped<IAvaliacaoService, AvaliacaoService>();
builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<ITurmaService, TurmaService>();

builder.Services.Configure<ElegibilidadeProfessorOptions>(builder.Configuration.GetSection("Authorization:Professores"));

builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Configuração de autenticação OAuth2 com Google
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = "Cookies";
    options.DefaultChallengeScheme = "Google";
})
.AddCookie("Cookies")
.AddGoogle("Google", options =>
{
    options.ClientId = builder.Configuration["Authentication:Google:ClientId"] ?? "";
    options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"] ?? "";
    options.CallbackPath = "/signin-google";

    options.Scope.Add("profile");
    options.Scope.Add("email");

    options.Events.OnCreatingTicket = async context =>
    {
        var email = context.Principal?.FindFirst(ClaimTypes.Email)?.Value;
        var nome = context.Principal?.FindFirst(ClaimTypes.Name)?.Value ?? email ?? "Usuário";
        var googleId = context.Principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? context.Principal?.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(googleId) || context.Principal?.Identity is not ClaimsIdentity identity)
            return;

        // Role
        var elegibilidadeService = context.HttpContext.RequestServices.GetRequiredService<IElegibilidadeService>();
        var elegivelParaProfessor = await elegibilidadeService.verificarElegibilidadeProfessor(email);
        identity.AddClaim(new Claim(ClaimTypes.Role, elegivelParaProfessor ? "ROLE_PROFESSOR" : "ROLE_ALUNO"));

        // Registro automático no banco
        using var scope = context.HttpContext.RequestServices.CreateScope();
        var usuarioService = scope.ServiceProvider.GetRequiredService<IUsuarioService>();
        await usuarioService.RegistrarUsuarioAsync(googleId, email, nome);
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("ApenasProfessor", policy => policy.RequireRole("ROLE_PROFESSOR"));
    options.AddPolicy("ApenasAluno", policy => policy.RequireRole("ROLE_ALUNO"));
    options.AddPolicy("ApenasAutenticado", policy => policy.RequireAuthenticatedUser());
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();