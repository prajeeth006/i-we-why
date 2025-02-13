#nullable enable
using FluentAssertions;
using Frontend.Vanilla.Core.Abstractions;
using Frontend.Vanilla.Features.Hosting;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Hosting;

public class HostingPlatformResolverTests
{
    private readonly Mock<IEnvironment> environment = new ();

    [Theory]
    [InlineData(null, HostingPlatform.Windows)]
    [InlineData("", HostingPlatform.Windows)]
    [InlineData("giberish", HostingPlatform.Windows)]
    [InlineData("AKS", HostingPlatform.AKS)]
    [InlineData("EKS", HostingPlatform.EKS)]
    internal void GetCurrentRawValue_ShouldMapCorrectly(string? hostingPlatformEnvVariableValue, HostingPlatform expected)
    {
        environment.Setup(p => p.GetEnvironmentVariable(HostingPlatformResolver.HostingPlatformEnvVariableName)).Returns(hostingPlatformEnvVariableValue);

        var target = new HostingPlatformResolver(environment.Object);

        target.Current.Should().Be(expected);
    }
}
