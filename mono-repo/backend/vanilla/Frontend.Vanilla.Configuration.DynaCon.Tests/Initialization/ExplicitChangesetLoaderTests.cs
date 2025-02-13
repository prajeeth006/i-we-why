using System;
using Bwin.DynaCon.Api.Contracts.V1;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.A_Changeset;
using Frontend.Vanilla.Configuration.DynaCon.Initialization;
using Frontend.Vanilla.Configuration.DynaCon.RestService;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Initialization;

public sealed class ExplicitChangesetLoaderTests
{
    private Mock<IInitialChangesetLoader> inner;
    private DynaConEngineSettingsBuilder settings;
    private Mock<IConfigurationRestService> restService;
    private Mock<IChangesetDeserializer> deserializer;
    private Mock<IConfigurationServiceUrls> urlBuilder;
    private VariationContextHierarchy ctxHierarchy;

    private ConfigurationResponse configDto;
    private IConfigurationSnapshot innerSnapshot;
    private const long TestId = 2667;

    public ExplicitChangesetLoaderTests()
    {
        inner = new Mock<IInitialChangesetLoader>();
        settings = TestSettings.GetBuilder(s => s.ExplicitChangesetId = TestId);
        restService = new Mock<IConfigurationRestService>();
        deserializer = new Mock<IChangesetDeserializer>();
        urlBuilder = new Mock<IConfigurationServiceUrls>();
        ctxHierarchy = TestCtxHierarchy.Get();

        configDto = TestConfigDto.Create();
        inner.Setup(i => i.GetConfiguration(It.IsAny<bool>())).Returns(innerSnapshot = Mock.Of<IConfigurationSnapshot>());
    }

    private IInitialChangesetLoader GetTarget()
        => new ExplicitChangesetLoader(inner.Object, settings.Build(), restService.Object, deserializer.Object, urlBuilder.Object, ctxHierarchy.AsCurrent());

    [Fact]
    public void ShouldLoadExplicitChangeset()
    {
        var changeset = Mock.Of<IValidChangeset>();
        restService.Setup(s => s.GetConfiguration(TestId)).Returns(configDto);
        deserializer.Setup(d => d.Deserialize(configDto, ctxHierarchy, ConfigurationSource.Service)).Returns(changeset);

        var snapshot = GetTarget().GetConfiguration(); // Act

        snapshot.Should().BeEquivalentTo(new ConfigurationSnapshot(changeset));
        inner.Verify(i => i.GetConfiguration(It.IsAny<bool>()), Times.Never);
    }

    public enum Failure
    {
        /// <summary>
        /// ConfigurationRequest
        /// </summary>
        ConfigurationRequest,

        /// <summary>
        /// Deserialization
        /// </summary>
        Deserialization,
    }

    [Theory, EnumData(typeof(Failure))]
    public void ShouldRethrowErrors(Failure failure)
    {
        object ex = new Exception("Error");
        restService.Setup(s => s.GetConfiguration(TestId)).ThrowsOrReturns(failure == Failure.ConfigurationRequest ? ex : configDto);
        deserializer.Setup(d => d.Deserialize(configDto, ctxHierarchy, ConfigurationSource.Service))
            .ThrowsOrReturns(failure == Failure.Deserialization ? ex : Mock.Of<IValidChangeset>());
        urlBuilder.Setup(b => b.Changeset(TestId)).Returns(new HttpUri("http://dynacon/changesets/2667"));
        var target = GetTarget();

        Func<object> act = () => target.GetConfiguration();

        act.Should().Throw().WithMessage($"Failed loading explicitly configured changeset #{TestId} from http://dynacon/changesets/2667")
            .Which.InnerException.Should().BeSameAs(ex);
        inner.Verify(i => i.GetConfiguration(It.IsAny<bool>()), Times.Never);
    }

    [Fact]
    public void ShouldLoadFromInner_IfExplicitChangesetNotConfigured()
    {
        settings.ExplicitChangesetId = null;

        var snapshot = GetTarget().GetConfiguration(); // Act

        snapshot.Should().BeSameAs(innerSnapshot);
        restService.VerifyWithAnyArgs(s => s.GetConfiguration(default), Times.Never());
    }
}
