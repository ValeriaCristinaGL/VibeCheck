using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace VibeCheckAPI_Dotnet8.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Emocoes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Titulo = table.Column<string>(type: "text", nullable: false),
                    Emoji = table.Column<string>(type: "text", nullable: false),
                    ValorNumerico = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Emocoes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Avaliacoes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Codigo = table.Column<string>(type: "text", nullable: false),
                    TipoAvaliacao = table.Column<int>(type: "integer", nullable: false),
                    DataCriacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DataExpiracao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Ativa = table.Column<bool>(type: "boolean", nullable: false),
                    TurmaId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Avaliacoes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RegistrosEmocionais",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DataRegistro = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    AvaliacaoId = table.Column<int>(type: "integer", nullable: false),
                    AlunoId = table.Column<int>(type: "integer", nullable: true),
                    EmocaoId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RegistrosEmocionais", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RegistrosEmocionais_Avaliacoes_AvaliacaoId",
                        column: x => x.AvaliacaoId,
                        principalTable: "Avaliacoes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RegistrosEmocionais_Emocoes_EmocaoId",
                        column: x => x.EmocaoId,
                        principalTable: "Emocoes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Turmas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nome = table.Column<string>(type: "text", nullable: false),
                    ProfessorId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Turmas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Email = table.Column<string>(type: "character varying(450)", nullable: false),
                    Nome = table.Column<string>(type: "text", nullable: false),
                    GoogleId = table.Column<string>(type: "character varying(450)", nullable: false),
                    TipoUsuario = table.Column<string>(type: "character varying(13)", maxLength: 13, nullable: false),
                    TurmaId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Usuarios_Turmas_TurmaId",
                        column: x => x.TurmaId,
                        principalTable: "Turmas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Emocoes",
                columns: new[] { "Id", "Emoji", "Titulo", "ValorNumerico" },
                values: new object[,]
                {
                    { 1, "😠", "Irritado", 1 },
                    { 2, "😢", "Triste", 2 },
                    { 3, "😰", "Ansioso", 3 },
                    { 4, "😞", "Desmotivado", 4 },
                    { 5, "😐", "Indiferente", 5 },
                    { 6, "😮", "Surpreso", 6 },
                    { 7, "😊", "Feliz", 7 },
                    { 8, "😄", "Muito Feliz", 8 },
                    { 9, "😍", "Apaixonado", 9 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Avaliacoes_TurmaId",
                table: "Avaliacoes",
                column: "TurmaId");

            migrationBuilder.CreateIndex(
                name: "IX_Emocoes_ValorNumerico",
                table: "Emocoes",
                column: "ValorNumerico",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RegistrosEmocionais_AlunoId",
                table: "RegistrosEmocionais",
                column: "AlunoId");

            migrationBuilder.CreateIndex(
                name: "IX_RegistrosEmocionais_AvaliacaoId",
                table: "RegistrosEmocionais",
                column: "AvaliacaoId");

            migrationBuilder.CreateIndex(
                name: "IX_RegistrosEmocionais_EmocaoId",
                table: "RegistrosEmocionais",
                column: "EmocaoId");

            migrationBuilder.CreateIndex(
                name: "IX_Turmas_ProfessorId",
                table: "Turmas",
                column: "ProfessorId");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Email",
                table: "Usuarios",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_GoogleId",
                table: "Usuarios",
                column: "GoogleId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_TurmaId",
                table: "Usuarios",
                column: "TurmaId");

            migrationBuilder.AddForeignKey(
                name: "FK_Avaliacoes_Turmas_TurmaId",
                table: "Avaliacoes",
                column: "TurmaId",
                principalTable: "Turmas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RegistrosEmocionais_Usuarios_AlunoId",
                table: "RegistrosEmocionais",
                column: "AlunoId",
                principalTable: "Usuarios",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Turmas_Usuarios_ProfessorId",
                table: "Turmas",
                column: "ProfessorId",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Usuarios_Turmas_TurmaId",
                table: "Usuarios");

            migrationBuilder.DropTable(
                name: "RegistrosEmocionais");

            migrationBuilder.DropTable(
                name: "Avaliacoes");

            migrationBuilder.DropTable(
                name: "Emocoes");

            migrationBuilder.DropTable(
                name: "Turmas");

            migrationBuilder.DropTable(
                name: "Usuarios");
        }
    }
}
