using TransNet.Application.Common;

namespace TransNet.Tests;

public class SlugHelperTests
{
    [Theory]
    [InlineData("Custom Software Development", "custom-software-development")]
    [InlineData("  DevOps  ", "devops")]
    [InlineData("API Integration & More!", "api-integration-more")]
    public void GenerateSlug_ProducesExpectedOutput(string input, string expected)
    {
        var result = SlugHelper.Generate(input);
        Assert.Equal(expected, result);
    }
}
