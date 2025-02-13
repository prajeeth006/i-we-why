using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.App;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.Products;
using Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

#pragma warning disable 618

namespace Frontend.Vanilla.Features.Tests.ClientConfig;

public class ClientConfigMergerTests
{
    private readonly IClientConfigProvider provider1;
    private IClientConfigProvider provider2;
    private readonly IClientConfigProvider microComponentProvider;
    private readonly Mock<IClientConfigMergeExecutor> executor;
    private readonly Mock<IInternalRequestEvaluator> internalRequestEvaluator;

    private readonly CancellationToken ct;
    private readonly Dictionary<string, object> configFromExecutor;

    public ClientConfigMergerTests()
    {
        provider1 = Mock.Of<IClientConfigProvider>(p => p.Name == new Identifier("config1"));
        provider2 = Mock.Of<IClientConfigProvider>(p => p.Name == new Identifier("config2"));
        microComponentProvider =
            Mock.Of<IClientConfigProvider>(p => p.Name == new Identifier("config3") && p.Type == ClientConfigType.Lazy);
        executor = new Mock<IClientConfigMergeExecutor>();
        internalRequestEvaluator = new Mock<IInternalRequestEvaluator>();

        ct = TestCancellationToken.Get();
        configFromExecutor = new Dictionary<string, object>();

        executor.SetupWithAnyArgs(e => e.ExecuteAsync(null, default))
            .Callback<IEnumerable<IClientConfigProvider>,
                CancellationToken>((p, _) => p.ToList()) // Enumerate providers
            .ReturnsAsync(configFromExecutor);
    }

    private IClientConfigMerger GetTarget()
        => new ClientConfigMerger(
            [provider1, provider2, microComponentProvider],
            executor.Object,
            internalRequestEvaluator.Object);

    [Fact]
    public async Task ShouldGetConfigurationFromAllProviders()
    {
        var config = await GetTarget().GetMergedConfigAsync(ct); // Act

        config.Should().BeSameAs(configFromExecutor);
        executor.Verify(e => e.ExecuteAsync(It.Is<IEnumerable<IClientConfigProvider>>(p => VerifyProviders(p)), ct));
    }

    private bool VerifyProviders(IEnumerable<IClientConfigProvider> providers)
    {
        var list = providers.ToList();

        // micro components provider is missing here!
        return list.Count == 2 && list[0] == provider1 && list[1] == provider2;
    }

    [Fact]
    public async Task ShouldGetConfigurationFromSpecifiedProviders()
    {
        var config = await GetTarget().GetMergedConfigForAsync(new[] { "config2" }, ct); // Act

        config.Should().BeSameAs(configFromExecutor);
        executor.Verify(e => e.ExecuteAsync(new[] { provider2 }, ct));
    }

    [Fact]
    public async Task ShouldGetConfigurationFromMicroComponentProvidersByName()
    {
        var config = await GetTarget().GetMergedConfigForAsync(new[] { "config3" }, ct); // Act

        config.Should().BeSameAs(configFromExecutor);
        executor.Verify(e => e.ExecuteAsync(new[] { microComponentProvider }, ct));
    }

    [Fact]
    public void ShouldThrow_IfProviderDoesntExistAndInternalRequest()
    {
        internalRequestEvaluator.Setup(x => x.IsInternal()).Returns(true);

        var target = GetTarget();

        Func<Task> act = () => target.GetMergedConfigForAsync(new[] { "m2Bla" }, ct);

        act.Should().ThrowAsync<ClientConfigException>().WithMessage(
            $"There is no registered {typeof(IClientConfigProvider)} with requested {nameof(IClientConfigProvider.Name)} 'm2Bla'. Available ones: 'config1', 'config2', 'config3'.");
    }

    [Fact]
    public void ShouldThrow_IfProviderDoesntExistAndExternalRequest()
    {
        internalRequestEvaluator.Setup(x => x.IsInternal()).Returns(false);

        var target = GetTarget();

        Func<Task> act = () => target.GetMergedConfigForAsync(new[] { "m2Bla" }, ct);

        act.Should().ThrowAsync<ClientConfigException>().WithMessage(
            $"There is no registered {typeof(IClientConfigProvider)} with requested {nameof(IClientConfigProvider.Name)}.");
    }

    [Fact]
    public void ShouldThrow_IfProviderNameConflict()
    {
        provider2 = Mock.Of<IClientConfigProvider>(p => p.Name == new Identifier("config1"));
        new Func<object>(GetTarget).Should().Throw<ArgumentException>()
            .Which.Message.Should().Be("An item with the same key has already been added. Key: config1");
    }
}
