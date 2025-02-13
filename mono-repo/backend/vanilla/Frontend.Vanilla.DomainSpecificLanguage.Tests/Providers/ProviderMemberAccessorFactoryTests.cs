using System;
using System.Reflection;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Compilation;
using Frontend.Vanilla.DomainSpecificLanguage.Providers;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers;

public class ProviderMemberAccessorFactoryTests
{
    private IProviderMemberAccessorFactory target;
    private Mock<IFooProvider> provider;
    private ExecutionMode mode;

    public ProviderMemberAccessorFactoryTests()
    {
        target = new ProviderMemberAccessorFactory();
        provider = new Mock<IFooProvider>();
        mode = TestExecutionMode.Get();
    }

    public interface IFooProvider
    {
        int Calculate(int x, string y);
        Task<string> CalculateAsync(ExecutionMode mode);

        void Action();
        Task ActionAsync(ExecutionMode mode, int x, string y);
    }

    [Fact]
    public async Task ShouldCreateCorrectly_IfSyncFunc()
    {
        var method = typeof(IFooProvider).GetRequired<MethodInfo>(nameof(IFooProvider.Calculate));
        provider.Setup(p => p.Calculate(11, "aa")).Returns(66);

        // Act
        var accessor = target.Create(method, provider.Object);

        (await accessor(mode, new object[] { 11, "aa" })).Should().Be(66);
    }

    [Fact]
    public async Task ShouldCreateCorrectly_IfAsyncFunc()
    {
        var method = typeof(IFooProvider).GetRequired<MethodInfo>(nameof(IFooProvider.CalculateAsync));
        provider.Setup(p => p.CalculateAsync(mode)).ReturnsAsync("bb");

        // Act
        var accessor = target.Create(method, provider.Object);

        (await accessor(mode, Array.Empty<object>())).Should().Be("bb");
    }

    [Fact]
    public async Task ShouldCreateCorrectly_IfSyncAction()
    {
        var method = typeof(IFooProvider).GetRequired<MethodInfo>(nameof(IFooProvider.Action));

        // Act
        var accessor = target.Create(method, provider.Object);

        (await accessor(mode, Array.Empty<object>())).Should().Be(VoidDslResult.Singleton);
        provider.Verify(p => p.Action(), Times.Once);
    }

    [Fact]
    public async Task ShouldCreateCorrectly_IfAsyncAction()
    {
        var method = typeof(IFooProvider).GetRequired<MethodInfo>(nameof(IFooProvider.ActionAsync));

        // Act
        var accessor = target.Create(method, provider.Object);

        (await accessor(mode, new object[] { 11, "aa" })).Should().Be(VoidDslResult.Singleton);
        provider.Verify(p => p.ActionAsync(mode, 11, "aa"), Times.Once);
    }
}
