using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.Features.UserScrub;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class UserScrubDslProviderTests
{
    private IUserScrubDslProvider target;
    private Mock<IUserScrubService> userScrubService;
    private ExecutionMode mode;

    public UserScrubDslProviderTests()
    {
        userScrubService = new Mock<IUserScrubService>();
        target = new UserScrubDslProvider(userScrubService.Object);

        mode = TestExecutionMode.Get();
    }

    [Theory]
    [InlineData("casino", new[] { "sports", "casino" }, true)]
    [InlineData("poker", new[] { "sports", "casino" }, false)]
    public async Task ScrubbedForAsync_ShouldWork(string product, string[] products, bool expected)
    {
        userScrubService.Setup(p => p.ScrubbedForAsync(mode)).ReturnsAsync(products);

        var result = await target.IsScrubbedForAsync(mode, product); // Act

        result.Should().Be(expected);
    }
}
