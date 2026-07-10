using TransNet.Application.DTOs.Auth;

namespace TransNet.Application.Interfaces;

public interface IJwtTokenService
{
    string GenerateAccessToken(UserDto user);
    string GenerateRefreshToken();
    string HashRefreshToken(string refreshToken);
    bool ValidateRefreshToken(string refreshToken, string storedHash);
}
