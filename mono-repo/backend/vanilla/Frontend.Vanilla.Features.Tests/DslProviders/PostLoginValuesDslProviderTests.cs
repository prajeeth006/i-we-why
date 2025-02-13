using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.ServiceClients.Services;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class PostLoginValuesDslProviderTests
{
    [Fact]
    public void ShouldParseValuesCorrectly()
    {
        var claimsService = new Mock<IClaimsService>();
        IPostLoginValuesDslProvider target = new PostLoginValuesDslProvider(claimsService.Object);

        claimsService.Setup(x => x.GetPostLoginValues()).Returns(new Dictionary<string, object> { { "ShowKycDe", "True" }, { "ShowMcUpgrade", "False" } });

        // Act & assert
        target.ShowKycDe.Should().Be(true);
        target.ShowMcUpgrade.Should().Be(false);
    }
}
