using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TransNet.Application.Common;
using TransNet.Application.Interfaces;

namespace TransNet.API.Controllers;

[ApiController]
[Route(ApiConstants.ApiRoute)]
public class UploadController : ControllerBase
{
    private readonly IFileStorageService _fileStorage;

    public UploadController(IFileStorageService fileStorage) => _fileStorage = fileStorage;

    [HttpPost]
    [Authorize(Roles = ApiConstants.AdminRoles)]
    [RequestSizeLimit(10 * 1024 * 1024)]
    public async Task<ActionResult<ApiResponse<object>>> Upload([FromForm] IFormFile file, [FromQuery] string folder = "uploads")
    {
        if (file is null || file.Length == 0)
            return BadRequest(ApiResponse<object>.Fail("No file provided"));

        await using var stream = file.OpenReadStream();
        var path = await _fileStorage.SaveFileAsync(stream, file.FileName, folder);
        return Ok(ApiResponse<object>.Ok(new { url = path, fileName = file.FileName }));
    }
}
