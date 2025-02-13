using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.UserScrub;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.UserScrub;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.UserScrub;

public class UserScrubControllerTests
{
    private readonly UserScrubController target;
    private readonly Mock<IUserScrubService> userScrubService;
    private readonly CancellationToken ct;
    private readonly ExecutionMode mode;

    public UserScrubControllerTests()
    {
        userScrubService = new Mock<IUserScrubService>();
        target = new UserScrubController(userScrubService.Object);

        ct = new CancellationTokenSource().Token;
        mode = ExecutionMode.Async(ct);
    }

    [Fact]
    public async Task Get_ShouldWork()
    {
        var products = new List<string> { "sports", "casino" };
        // Setup
        userScrubService.Setup(u => u.ScrubbedForAsync(mode)).ReturnsAsync(products);
        // Act
        var result = (OkObjectResult)await target.Get(ct);

        // Assert
        result.Value.Should().BeEquivalentTo(new { products });
    }
}
