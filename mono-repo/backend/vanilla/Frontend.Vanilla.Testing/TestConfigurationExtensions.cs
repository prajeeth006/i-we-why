using Microsoft.Extensions.Configuration;
using Moq;

namespace Frontend.Vanilla.Testing;

internal static class TestConfigurationExtensions
{
    public static Mock<IConfiguration> WithConnectionStrings(this Mock<IConfiguration> configurationMock)
    {
        var configurationSectionMock = new Mock<IConfigurationSection>();
        configurationSectionMock.SetupGet(s => s["Redis"]).Returns("redis-connection-string");
        configurationSectionMock.SetupGet(s => s["Hekaton"]).Returns("hekaton-connection-string");
        configurationMock
            .Setup(c => c.GetSection("ConnectionStrings"))
            .Returns(configurationSectionMock.Object);

        return configurationMock;
    }
}
