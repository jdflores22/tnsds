using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TransNet.Persistence.Migrations
{
    public partial class AddProductHomepageRow : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "HomepageRow",
                table: "SoftwareProducts",
                type: "int",
                nullable: false,
                defaultValue: 1);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "HomepageRow", table: "SoftwareProducts");
        }
    }
}
