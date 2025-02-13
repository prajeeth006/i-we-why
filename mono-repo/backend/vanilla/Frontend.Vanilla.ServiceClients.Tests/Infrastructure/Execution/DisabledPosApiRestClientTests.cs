using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.Execution;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Infrastructure.Execution;

public class DisabledPosApiRestClientTests
{
    private PosApiRestClientBase target;
    private readonly Mock<IPosApiRestClient> inner;
    private readonly Mock<IServiceClientsConfiguration> serviceClientConfiguration;
    private readonly TestLogger<DisabledPosApiRestClient> testLogger;

    private PosApiRestRequest inputPosApiRequest;
    private ExecutionMode mode;

    public DisabledPosApiRestClientTests()
    {
        inner = new Mock<IPosApiRestClient>();
        serviceClientConfiguration = new Mock<IServiceClientsConfiguration>();
        testLogger = new TestLogger<DisabledPosApiRestClient>();

        target = new DisabledPosApiRestClient(serviceClientConfiguration.Object, inner.Object, testLogger);

        inputPosApiRequest = new PosApiRestRequest(new PathRelativeUri("Service.svc/Method"));
        mode = TestExecutionMode.Get();
        serviceClientConfiguration.Setup(c => c.EndpointsV2).Returns(new Dictionary<Regex, EndpointConfig>
        {
            {
                new Regex("Service.svc/Bank", RegexOptions.IgnoreCase | RegexOptions.CultureInvariant),
                new EndpointConfig
                {
                    Disabled = true,
                    DefaultValue = new
                    {
                        Name = "Severin",
                    },
                }
            },
            {
                new Regex("Service.svc/Info", RegexOptions.IgnoreCase | RegexOptions.CultureInvariant),
                new EndpointConfig
                {
                    Disabled = true,
                }
            },
        });
    }

    [Fact]
    public async Task ShouldExecuteNoResultInner_IfNoConfigMatch()
    {
        await target.ExecuteAsync(mode, inputPosApiRequest);

        inner.Verify(c => c.ExecuteAsync(mode, inputPosApiRequest));
    }

    [Fact]
    public async Task ShouldExecuteNoResultInner_IfConfigMatchButDisabledSetToFalse()
    {
        inputPosApiRequest = new PosApiRestRequest(new PathRelativeUri("Service.svc/Info"));
        serviceClientConfiguration.Setup(c => c.EndpointsV2).Returns(new Dictionary<Regex, EndpointConfig>
        {
            {
                new Regex("Service.svc/Info"),
                new EndpointConfig
                {
                    Disabled = false,
                }
            },
        });
        await target.ExecuteAsync(mode, inputPosApiRequest);

        inner.Verify(c => c.ExecuteAsync(mode, inputPosApiRequest));
    }

    [Fact]
    public async Task ShouldNotExecuteNoResultInner_IfConfigMatch()
    {
        inputPosApiRequest = new PosApiRestRequest(new PathRelativeUri("Service.svc/Info"));
        await target.ExecuteAsync(mode, inputPosApiRequest);

        inner.Verify(c => c.ExecuteAsync(mode, inputPosApiRequest), Times.Never);
    }

    [Fact]
    public async Task ShouldExecuteInner_InNoConfigMatch()
    {
        await target.ExecuteAsync<PosApiRestClientTests.Person>(mode, inputPosApiRequest);

        inner.Verify(c => c.ExecuteAsync<PosApiRestClientTests.Person>(mode, inputPosApiRequest));
    }

    [Fact]
    public async Task ShouldExecuteInner_IfConfigMatchButDisabledSetToFalse()
    {
        inputPosApiRequest = new PosApiRestRequest(new PathRelativeUri("Service.svc/Bank"));
        serviceClientConfiguration.Setup(c => c.EndpointsV2).Returns(new Dictionary<Regex, EndpointConfig>
        {
            {
                new Regex("Service.svc/Bank"),
                new EndpointConfig
                {
                    Disabled = false,
                }
            },
        });
        await target.ExecuteAsync<PosApiRestClientTests.Person>(mode, inputPosApiRequest);

        inner.Verify(c => c.ExecuteAsync<PosApiRestClientTests.Person>(mode, inputPosApiRequest));
    }

    [Fact]
    public async Task ShouldReturnDefaultFromConfig_InConfigMatch()
    {
        inputPosApiRequest = new PosApiRestRequest(new PathRelativeUri("Service.svc/Bank"));
        var result = await target.ExecuteAsync<PosApiRestClientTests.Person>(mode, inputPosApiRequest);

        result.Should().BeOfType<PosApiRestClientTests.Person>().Which.Name.Should().Be("Severin");

        inner.Verify(c => c.ExecuteAsync<PosApiRestClientTests.Person>(mode, inputPosApiRequest), Times.Never);
    }

    [Fact]
    public async Task ShouldReturnDefaultFromConstructor_InConfigMatchAndNoDefaultValue()
    {
        inputPosApiRequest = new PosApiRestRequest(new PathRelativeUri("Service.svc/Bank"));
        serviceClientConfiguration.Setup(c => c.EndpointsV2).Returns(new Dictionary<Regex, EndpointConfig>
        {
            {
                new Regex("Service.svc/Bank", RegexOptions.IgnoreCase | RegexOptions.CultureInvariant),
                new EndpointConfig
                {
                    Disabled = true,
                }
            },
        });
        var result = await target.ExecuteAsync<PosApiRestClientTests.Person>(mode, inputPosApiRequest);

        result.Should().BeOfType<PosApiRestClientTests.Person>().Which.Name.Should().BeNull();

        inner.Verify(c => c.ExecuteAsync<PosApiRestClientTests.Person>(mode, inputPosApiRequest), Times.Never);
    }

    [Fact]
    public async Task ShouldThrow_InConfigMatchAndNoDefaultValueAndDefaultConstructor()
    {
        inputPosApiRequest = new PosApiRestRequest(new PathRelativeUri("Service.svc/Bank"));
        serviceClientConfiguration.Setup(c => c.EndpointsV2).Returns(new Dictionary<Regex, EndpointConfig>
        {
            {
                new Regex("Service.svc/Bank", RegexOptions.IgnoreCase | RegexOptions.CultureInvariant),
                new EndpointConfig
                {
                    Disabled = true,
                }
            },
        });
        Func<Task> act = () => target.ExecuteAsync<Player>(mode, inputPosApiRequest);

        var ex = (await act.Should().ThrowAsync<Exception>()).Which;
        ex.Message.Should().Contain("Cannot dynamically ");
        testLogger.Logged.Single().Verify(LogLevel.Error, ex, ("endpoint", "Service.svc/Bank"));
    }

    private class Player
    {
        public Player(string name, int level)
        {
            Name = name;
            Level = level;
        }

        public string Name { get; set; }
        public int Level { get; set; }
    }
}
