using FluentAssertions;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using System.Threading.Tasks;
using Xunit;
using Frontend.Vanilla.Features.Clock;

namespace Frontend.Vanilla.Features.Tests.Clock
{
    public class ClockClientConfigProviderTests : ClientConfigProviderTestsBase
    {
        private readonly Mock<IClockConfiguration> clockConfiguration;

        public ClockClientConfigProviderTests()
        {
            clockConfiguration = new Mock<IClockConfiguration>();

            clockConfiguration.SetupGet(o => o.DateTimeFormat).Returns("mediumTime");
            clockConfiguration.SetupGet(o => o.SlotName).Returns(string.Empty);
            clockConfiguration.SetupGet(o => o.UseWithTimeZone).Returns(false);
            Target = new ClockClientConfigProvider(clockConfiguration.Object);
        }

        [Fact]
        public async Task GetClientConfiguration_ReturnsConfig()
        {
            var config = await Target_GetConfigAsync();

            config["dateTimeFormat"].Should().Be("mediumTime");
            config["slotName"].Should().Be(string.Empty);
            config["useWithTimeZone"].Should().Be(false);
        }
    }
}
