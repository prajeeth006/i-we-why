using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.Features.LicenseInfo;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class LicenseInfoDslProviderTests
{
    [Fact]
    public async Task ShallReturnCorrectValues()
    {
        var serviceMock = new Mock<ILicenseInfoServiceInternal>();
        ILicenseInfoDslProvider target = new LicenseInfoDslProvider(serviceMock.Object);

        serviceMock.Setup(p => p.GetLicenceComplianceAsync(default)).ReturnsAsync(new LicenseInfoModel { AcceptanceNeeded = true });

        // Act & assert
        (await target.GetAcceptanceNeededAsync(default)).Should().Be(true);
    }
}
