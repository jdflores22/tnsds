using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TransNet.Persistence.Migrations
{
    public partial class AddContactMessageCompanyName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CompanyName",
                table: "ContactMessages",
                type: "longtext",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompanyName",
                table: "ContactMessages");
        }
    }
}
