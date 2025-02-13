using System.Security.Claims;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Crm2;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class LoyalityProfileDslProviderTests
{
    private ILoyalityProfileDslProvider target;
    private Mock<ICrmServiceClient> crmServiceClient;
    private Mock<ICurrentUserAccessor> currentUserAccessor;
    private ExecutionMode mode;
    private ClaimsPrincipal user;

    public LoyalityProfileDslProviderTests()
    {
        currentUserAccessor = new Mock<ICurrentUserAccessor>();
        crmServiceClient = new Mock<ICrmServiceClient>();
        user = TestUser.Get();
        mode = TestExecutionMode.Get();
        currentUserAccessor.SetupGet(c => c.User).Returns(() => user);
        target = new LoyalityProfileDslProvider(crmServiceClient.Object, currentUserAccessor.Object);
    }

    [Fact]
    public async Task GetMlifeNoAsync_ShouldReturnDecimal()
    {
        var result = await target.GetMlifeNoAsync(mode);
        result.Should().Be(-1m);
    }

    [Fact]
    public async Task GetMlifeTierAsync_ShouldReturnString()
    {
        var result = await target.GetMlifeTierAsync(mode);
        result.Should().Be(string.Empty);
    }

    [Fact]
    public async Task GetMlifetierCredits_ShouldReturnDecimal()
    {
        var result = await target.GetMlifetierCreditsAsync(mode);
        result.Should().Be(-1m);
    }

    [Fact]
    public async Task GetMlifeTierDesc_ShouldReturnString()
    {
        var result = await target.GetMlifeTierDescAsync(mode);
        result.Should().Be(string.Empty);
    }
}
