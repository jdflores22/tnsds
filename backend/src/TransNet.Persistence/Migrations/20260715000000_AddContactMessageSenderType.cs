using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TransNet.Persistence.Migrations
{
    public partial class AddContactMessageSenderType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SenderType",
                table: "ContactMessages",
                type: "longtext",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SenderType",
                table: "ContactMessages");
        }
    }
}
