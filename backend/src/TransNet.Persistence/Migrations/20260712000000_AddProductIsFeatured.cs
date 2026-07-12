using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TransNet.Persistence.Migrations
{
    public partial class AddProductIsFeatured : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsFeatured",
                table: "SoftwareProducts",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "IsFeatured", table: "SoftwareProducts");
        }
    }
}
