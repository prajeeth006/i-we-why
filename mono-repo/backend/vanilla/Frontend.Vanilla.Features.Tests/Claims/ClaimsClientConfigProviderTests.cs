using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.Claims;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.ServiceClients.Security;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Claims;

public class ClaimsClientConfigProviderTests
{
    private IClientConfigProvider target;
    private Mock<ICurrentUserAccessor> currentUserAccessor;

    public ClaimsClientConfigProviderTests()
    {
        currentUserAccessor = new Mock<ICurrentUserAccessor>();
        target = new ClaimsClientConfigProvider(currentUserAccessor.Object);
    }

    [Fact]
    public async Task ShouldReturnAllNonEmptyClaims()
    {
        currentUserAccessor.SetupGet(a => a.User).Returns(new ClaimsPrincipal(new[]
        {
            new ClaimsIdentity(new[]
            {
                new Claim("Name", "James bond"),
                new Claim("Code", "007"),
            }),
            new ClaimsIdentity(new[]
            {
                new Claim("Chances", ""),
                new Claim("Mission", "Save the world"),
            }),
        }));

        // Act
        var config = await target.GetClientConfigAsync(TestContext.Current.CancellationToken);

        config.Should().BeEquivalentTo(new Dictionary<string, string>
        {
            { "Name", "James bond" },
            { "Code", "007" },
            { "Mission", "Save the world" },
        });
    }
}
