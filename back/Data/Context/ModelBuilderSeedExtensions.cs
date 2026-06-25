using Microsoft.EntityFrameworkCore;
using VibeCheckAPI_Dotnet8.Models;

namespace VibeCheckAPI_Dotnet8.Data.Context
{
    public static class ModelBuilderSeedExtensions
    {
        public static void SeedBaseline(this ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Emocao>().HasData(
                new Emocao { Id = 1, Titulo = "Irritado", Emoji = "😠", ValorNumerico = 1 },
                new Emocao { Id = 2, Titulo = "Triste", Emoji = "😢", ValorNumerico = 2 },
                new Emocao { Id = 3, Titulo = "Ansioso", Emoji = "😰", ValorNumerico = 3 },
                new Emocao { Id = 4, Titulo = "Desmotivado", Emoji = "😞", ValorNumerico = 4 },
                new Emocao { Id = 5, Titulo = "Indiferente", Emoji = "😐", ValorNumerico = 5 },
                new Emocao { Id = 6, Titulo = "Surpreso", Emoji = "😮", ValorNumerico = 6 },
                new Emocao { Id = 7, Titulo = "Feliz", Emoji = "😊", ValorNumerico = 7 },
                new Emocao { Id = 8, Titulo = "Muito Feliz", Emoji = "😄", ValorNumerico = 8 },
                new Emocao { Id = 9, Titulo = "Apaixonado", Emoji = "😍", ValorNumerico = 9 }
            );
        }
    }
}
