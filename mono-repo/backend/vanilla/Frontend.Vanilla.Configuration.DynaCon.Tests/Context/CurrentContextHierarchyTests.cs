using System;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Configuration.DynaCon.FileFallback;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Context;

public class CurrentContextHierarchyTests
{
    private ICurrentContextHierarchyManager target;
    private Mock<IFallbackFile<VariationContextHierarchy>> fallbackFile;

    public CurrentContextHierarchyTests()
    {
        fallbackFile = new Mock<IFallbackFile<VariationContextHierarchy>>();
        target = new CurrentContextHierarchy(fallbackFile.Object);
    }

    [Theory]
    [InlineData(ConfigurationSource.Service, true, true)]
    [InlineData(ConfigurationSource.Service, false, false)]
    [InlineData(ConfigurationSource.FallbackFile, false, false)]
    [InlineData(ConfigurationSource.FallbackFile, true, false)]
    internal void ShouldStoreHierarchy(ConfigurationSource source, bool fallbackEnabled, bool expectedFallbackWrite)
    {
        fallbackFile.DefaultValue = fallbackEnabled ? DefaultValue.Mock : DefaultValue.Empty;
        var ctxHierarchy = TestCtxHierarchy.Get(source);

        // Act
        target.Set(ctxHierarchy);

        target.Value.Should().BeSameAs(ctxHierarchy);

        if (expectedFallbackWrite)
            fallbackFile.Verify(f => f.Handler.Write(target.Value), Times.Once);
        else
            fallbackFile.VerifyWithAnyArgs(f => f.Handler.Write(null), Times.Never);
    }

    [Fact]
    public void ShouldThrow_IfNoHierarchySet()
        => target.Invoking(t => t.Value).Should().Throw<InvalidOperationException>();
}
