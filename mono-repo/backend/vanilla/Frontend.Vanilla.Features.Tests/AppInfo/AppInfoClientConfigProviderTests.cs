using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.AppInfo;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.ServiceClients.Services.Common;
using Frontend.Vanilla.ServiceClients.Services.Common.ClientInfo;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.AppInfo;

public class AppInfoClientConfigProviderTests
{
    private IClientConfigProvider target;
    private Mock<IPosApiCommonService> posApiCommonService;
    private CancellationToken ct;

    public AppInfoClientConfigProviderTests()
    {
        posApiCommonService = new Mock<IPosApiCommonService>();
        target = new AppInfoClientConfigProvider(posApiCommonService.Object);
        ct = TestCancellationToken.Get();
    }

    [Fact]
    public void Name_Test()
        => target.Name.Should().Be("vnAppInfo");

    [Fact]
    public async Task GetClientConfiguration_Test()
    {
        posApiCommonService.Setup(s => s.GetClientInformationAsync(ct)).ReturnsAsync(new ClientInformation(
            brandId: "bwin",
            productId: "Sports",
            channelId: "web",
            frontendId: "XYZ"));

        // Act
        var result = await target.GetClientConfigAsync(ct);

        result.Should().BeEquivalentTo(new
        {
            brand = "bwin",
            product = "Sports",
            channel = "web",
            frontend = "XYZ",
        });
    }
}
