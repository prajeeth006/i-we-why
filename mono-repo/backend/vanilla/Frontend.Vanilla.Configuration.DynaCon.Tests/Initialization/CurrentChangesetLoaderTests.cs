using System;
using System.Linq;
using Bwin.DynaCon.Api.Contracts.V1;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.A_Changeset;
using Frontend.Vanilla.Configuration.DynaCon.Initialization;
using Frontend.Vanilla.Configuration.DynaCon.Reporting.PartialReporters;
using Frontend.Vanilla.Configuration.DynaCon.RestService;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Initialization;

public sealed class CurrentChangesetLoaderTests : IDisposable
{
    private readonly IInitialChangesetLoader target;
    private readonly Mock<IConfigurationRestService> restService;
    private readonly Mock<IChangesetDeserializer> deserializer;
    private readonly VariationContextHierarchy ctxHierarchy;
    private readonly TestLogger<CurrentChangesetLoader> log;
    private readonly ConfigurationResponse configDto;
    private int restRequestCount;

    public CurrentChangesetLoaderTests()
    {
        var urlBuilder = new Mock<IConfigurationServiceUrls>();
        restService = new Mock<IConfigurationRestService>();
        deserializer = new Mock<IChangesetDeserializer>();
        ctxHierarchy = TestCtxHierarchy.Get();
        log = new TestLogger<CurrentChangesetLoader>();
        target = new CurrentChangesetLoader(restService.Object, deserializer.Object, urlBuilder.Object, ctxHierarchy.AsCurrent(), log);

        restRequestCount = 0;
        configDto = TestConfigDto.Create();
        restService.Setup(s => s.GetCurrentConfiguration(It.IsAny<bool>())).Returns(configDto).Callback(() => restRequestCount++);
        urlBuilder.SetupGet(b => b.CurrentChangeset).Returns(new HttpUri("http://dynacon/current"));
    }

    public void Dispose()
        => restRequestCount.Should().BeLessOrEqualTo(ServiceCallsReporter.CallCountForError,
            "So that the reporter can catch failed initial HTTP request which e.g. can explain why fallback is used.");

    [Fact]
    public void ShouldGetConfigFromService()
    {
        var changeset = Mock.Of<IValidChangeset>(c => c.Dto == configDto);
        deserializer.Setup(d => d.Deserialize(configDto, ctxHierarchy, ConfigurationSource.Service)).Returns(changeset);

        // Act
        var snapshot = target.GetConfiguration();

        snapshot.Should().BeEquivalentTo(new ConfigurationSnapshot(changeset));
    }

    [Fact]
    public void ShouldThrow_IfNetworkError()
    {
        var networkEx = new Exception("Network error");
        restService.Setup(s => s.GetCurrentConfiguration(It.IsAny<bool>())).Throws(networkEx);

        var ex = RunFailedTest_GetException(); // Act

        ex.InnerException.Should().BeSameAs(networkEx);
        ex.FailedChangeset.Should().BeNull();
        log.Logged.Single().Verify(LogLevel.Critical, ex, ("UrlsCurrentChangeset", new HttpUri("http://dynacon/current")));
    }

    [Fact]
    public void ShouldThrow_IfFailedDeserializingConfig()
    {
        var changeset = Mock.Of<IFailedChangeset>(c => c.Errors == new[] { new Exception() });
        var deserializationEx = new ChangesetDeserializationException("Invalid config", changeset);
        deserializer.Setup(d => d.Deserialize(configDto, ctxHierarchy, ConfigurationSource.Service)).Throws(deserializationEx);

        var ex = RunFailedTest_GetException(); // Act

        ex.InnerException.Should().BeSameAs(deserializationEx);
        ex.FailedChangeset.Should().BeSameAs(changeset);
        log.Logged.Single().Verify(LogLevel.Critical, ex, ("UrlsCurrentChangeset", new HttpUri("http://dynacon/current")));
    }

    private ConfigurationLoadException RunFailedTest_GetException()
        => new Func<object>(() => target.GetConfiguration())
            .Should().Throw<ConfigurationLoadException>()
            .WithMessage("Failed loading current configuration fetched from: http://dynacon/current")
            .Which;
}
