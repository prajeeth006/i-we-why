using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Features.LicenseInfo;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.LicenseInfo;

public class LicenseInfoServiceTests
{
    private ILicenseInfoService target;
    private Mock<ILicenseInfoConfiguration> configMock;

    public LicenseInfoServiceTests()
    {
        configMock = new Mock<ILicenseInfoConfiguration>();
        target = new LicenseInfoService(configMock.Object);
    }

    [Fact]
    public void ShouldReturnAvailableLicences()
    {
        var licenceInfo = new Dictionary<string, IReadOnlyList<string>> { ["A"] = new[] { "sports", "casino" } };
        configMock.SetupGet(o => o.LicenceInfo).Returns(licenceInfo);

        target.GetAvailableLicences("sports").Count.Should().Be(1);
    }
}
