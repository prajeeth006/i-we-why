using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using Bwin.DynaCon.Api.Contracts.V1;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Frontend.Vanilla.Core.Ioc;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Diagnostics.Contracts.Configuration;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests;

public sealed class CurrentConfigurationResolverTests
{
    private readonly ICurrentConfigurationResolver target;
    private readonly ICurrentContextAccessor currentContextAccessor;
    private readonly Mock<ICurrentChangesetResolver> currentChangesetResolverMock;
    private readonly Mock<IDynamicVariationContextResolver> varContextResolverMock;
    private readonly Mock<IValidChangeset> changesetMock;
    private static readonly object FooConfig = new object();
    private static readonly object FooSportsConfig = new object();
    private static readonly object FooMobileConfig = new object();
    private static readonly object BarConfig = new object();
    private static readonly object BarMobileCasinoConfig = new object();

    public CurrentConfigurationResolverTests()
    {
        currentContextAccessor = Mock.Of<ICurrentContextAccessor>(r => r.Items == new ConcurrentDictionary<object, Lazy<object>>());
        currentChangesetResolverMock = new Mock<ICurrentChangesetResolver>();
        varContextResolverMock = new Mock<IDynamicVariationContextResolver>();
        changesetMock = new Mock<IValidChangeset>();
        target = new CurrentConfigurationResolver(currentContextAccessor, currentChangesetResolverMock.Object, varContextResolverMock.Object);

        changesetMock.SetupGet(c => c.Features).Returns(new Dictionary<TrimmedRequiredString, FeatureConfigurationList>
        {
            ["Vanilla.Foo"] = new FeatureConfigurationList(new[]
            {
                new FeatureConfiguration(FooSportsConfig, TestVarCtx.Get(product: new[] { "poker", "sports" })),
                new FeatureConfiguration(FooMobileConfig, TestVarCtx.Get(channel: new[] { "mobile" })),
                new FeatureConfiguration(FooConfig, TestVarCtx.Get()),
            }),
            ["Vanilla.Bar"] = new FeatureConfigurationList(new[]
            {
                new FeatureConfiguration(BarMobileCasinoConfig, TestVarCtx.Get(product: new[] { "casino" }, channel: new[] { "vr", "mobile" })),
                new FeatureConfiguration(BarConfig, TestVarCtx.Get()),
            }),
        });
        changesetMock.SetupGet(c => c.Dto).Returns(new ConfigurationResponse(
            123,
            new DateTime(2001, 10, 22, 13, 45, 23, DateTimeKind.Utc),
            new Dictionary<string, IReadOnlyDictionary<string, KeyConfiguration>>
            {
                ["Vanilla.Foo"] = new Dictionary<string, KeyConfiguration>
                {
                    ["Bar"] = new KeyConfiguration("company", new[] { new ValueConfiguration("BWIN") }, (int)CriticalityLevel.Security),
                },
            }));
        currentChangesetResolverMock.Setup(c => c.Resolve()).Returns(changesetMock.Object);
    }

    public static readonly IEnumerable<object[]> VariationContextTestCases = new[]
    {
        new object[] { "sports", null, FooSportsConfig, 1 },
        new object[] { "SPORTS", null, FooSportsConfig, 1 },
        new object[] { "sports", "mobile", FooSportsConfig, 1 },
        new object[] { "sports", "desktop", FooSportsConfig, 1 },
        new object[] { null, "mobile", FooMobileConfig, 2 },
        new object[] { "casino", "mobile", FooMobileConfig, 2 },
        new object[] { null, null, FooConfig, 2 },
        new object[] { "casino", "desktop", FooConfig, 2 },
    };

    [Theory, MemberData(nameof(VariationContextTestCases))]
    public void ShouldResolveConfigForCurrentVariationContext(string product, string channel, object expectedConfig, int expectedVarCtxCallCount)
    {
        if (product != null) varContextResolverMock.Setup(r => r.Resolve("product", changesetMock.Object)).Returns(product);
        if (channel != null) varContextResolverMock.Setup(r => r.Resolve("channel", changesetMock.Object)).Returns(channel);

        var config = target.Resolve("Vanilla.Foo"); // Act

        config.Should().BeSameAs(expectedConfig);
        currentChangesetResolverMock.Verify(c => c.Resolve(), Times.Once);
        varContextResolverMock.VerifyWithAnyArgs(r => r.Resolve(null, null), Times.Exactly(expectedVarCtxCallCount));
        varContextResolverMock.Verify(r => r.Resolve(It.IsIn<TrimmedRequiredString>("product", "channel"), changesetMock.Object));
    }

    [Fact]
    public void ShouldCacheConfigInstancesInAppContext()
    {
        for (var i = 0; i < 10; i++)
            target.Resolve("Vanilla.Foo").Should().BeSameAs(FooConfig); // Act

        currentChangesetResolverMock.Verify(c => c.Resolve(), Times.Once);
        changesetMock.VerifyGet(c => c.Features, Times.Once);
        currentContextAccessor.Items.Keys.Single().Should().BeOfType<string>().Which.Should().Contain("vanilla.foo");
    }

    [Fact]
    public void ShouldNotCatch_IfDynamicContextResolverFails_BecauseWeCantGuaranteeRelevantConfig()
    {
        var ex = new Exception("Resolution error.");
        varContextResolverMock.SetupWithAnyArgs(r => r.Resolve(null, null)).Throws(ex);

        var act = () => target.Resolve("Vanilla.Foo");

        act.Should().Throw<Exception>().SameAs(ex);
    }

    [Fact]
    public void ShouldThrow_IfNoSuitableConfigFound()
    {
        changesetMock.SetupGet(c => c.Features).Returns(new Dictionary<TrimmedRequiredString, FeatureConfigurationList>
        {
            ["Vanilla.Foo"] = new FeatureConfigurationList(new[]
            {
                new FeatureConfiguration(FooMobileConfig, TestVarCtx.Get(channel: new[] { "mobile" })),
            }),
        });

        var act = () => target.Resolve("Vanilla.Foo");

        act.Should().Throw<InvalidOperationException>();
    }

    [Fact]
    public void ShouldRemoveSensitiveData_IfConfigContainsIt()
    {
        var config = target.Resolve("Vanilla.Foo", true); // Act

        config.Should().Be("Value removed due to sensitive data");
    }
}
