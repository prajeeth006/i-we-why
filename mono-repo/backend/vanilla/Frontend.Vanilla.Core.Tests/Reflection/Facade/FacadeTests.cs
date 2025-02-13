using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Reflection.Facade;
using Frontend.Vanilla.Core.Reflection.Proxy;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Reflection.Facade;

public class FacadeTests
{
    [Fact]
    public async Task ShouldGenerateClassCorrectly()
    {
        var type = RoslynProxy.GenerateClasses(new[] { new FacadeProxyBuilder(typeof(ISimpleFoo)) }).Single();

        var ct = TestCancellationToken.Get();
        var delegated1 = new Mock<IDelegatedFoo>();
        var delegated2 = new Mock<IDelegatedFoo2>();
        var foo = (ISimpleFoo)Activator.CreateInstance(type, delegated2.Object, delegated1.Object);

        delegated1.Setup(d => d.GetWhatever("pp")).Returns("rr");
        delegated1.Setup(d => d.GetData(ExecutionMode.Sync, 11)).ReturnsAsync("sync res");
        delegated1.Setup(d => d.GetData(ExecutionMode.Async(ct), 11)).ReturnsAsync("async res");
        delegated2.SetupProperty(d => d.Length, 666);

        foo.Count.Should().Be(666);
        foo.Count = 777;
        delegated2.Object.Length.Should().Be(777);
        foo.GetContent("pp").Should().Be("rr");
        (await foo.GetDataAsync(11, ct)).Should().Be("async res");
        foo.GetData(11).Should().Be("sync res");
    }
}

public interface ISimpleFoo
{
    [DelegateTo(typeof(IDelegatedFoo), nameof(IDelegatedFoo.GetWhatever))]
    object GetContent(string path);

    [DelegateTo(typeof(IDelegatedFoo), nameof(IDelegatedFoo.GetData))]
    Task<object> GetDataAsync(int id, CancellationToken cancellationToken);

    [DelegateTo(typeof(IDelegatedFoo), nameof(IDelegatedFoo.GetData))]
    object GetData(int id);

    [DelegateTo(typeof(IDelegatedFoo2), nameof(IDelegatedFoo2.Length))]
    int Count { get; set; }
}

public interface IDelegatedFoo
{
    object GetWhatever(string path);

    Task<object> GetData(ExecutionMode mode, int id);
}

public interface IDelegatedFoo2
{
    int Length { get; set; }
}
