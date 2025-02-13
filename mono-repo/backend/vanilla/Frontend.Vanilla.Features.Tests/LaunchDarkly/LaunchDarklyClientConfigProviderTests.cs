using FluentAssertions;
using Frontend.Vanilla.Features.LaunchDarkly;
using Frontend.Vanilla.Features.LoginDuration;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.LaunchDarkly
{
    public class LaunchDarklyClientConfigProviderTests : ClientConfigProviderTestsBase
    {
        private readonly Mock<ILaunchDarklyConfiguration> launchDarklyConfigurationMock;

        public LaunchDarklyClientConfigProviderTests()
        {
            launchDarklyConfigurationMock = new Mock<ILaunchDarklyConfiguration>();

            Target = new LaunchDarklyClientConfigProvider(launchDarklyConfigurationMock.Object);
        }

        [Fact]
        public void ShouldHaveCorrectName()
        {
            Target.Name.Should().Be("vnLaunchDarkly");
        }

        [Fact]
        public async Task GetClientConfiguration_ShouldReturnLaunchDarklyConfig()
        {
            var options = new LDOptions(string.Empty, true, true, string.Empty, string.Empty, string.Empty, true, true, true, true, true, true, new[] { "", "" }, true, 1, 1, 1, true, 1, string.Empty, string.Empty);

            launchDarklyConfigurationMock.SetupGet(n => n.ClientId).Returns("client-id");
            launchDarklyConfigurationMock.SetupGet(n => n.ClientConfigurationOptions).Returns(options);

            var config = await Target_GetConfigAsync();

            config["options"].Should().Be(options);
            config["clientId"].Should().Be("client-id");
        }
    }
}
