using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Client.Infrastructure;

public class ClientContentMappingTests
{
    private Mock<IClientContentMapper<IFoo, ClientFoo>> mapper;

    public ClientContentMappingTests()
        => mapper = new Mock<IClientContentMapper<IFoo, ClientFoo>>();

    public interface IFoo : IDocument { }

    public class ClientFoo : ClientDocument { }

    [Fact]
    public void ShouldCreateCorrectly()
    {
        var target = ClientContentMapping.Create(mapper.Object, isFinalType: false); // Act

        target.SourceType.Should().Be(typeof(IFoo));
        target.TargetType.Should().Be(typeof(ClientFoo));
        (target.CreateClientDocument == null).Should().BeTrue();
        target.MapperType.Should().Be(mapper.Object.GetType());
        target.MapAsync.Should().NotBeNull();
    }

    [Fact]
    public void CreateClientDocument_ShouldReturnNewInstance()
    {
        var target = ClientContentMapping.Create(mapper.Object, isFinalType: true);

        var result = target.CreateClientDocument(); // Act

        result.Should().BeOfType<ClientFoo>();
    }

    [Fact]
    public void MapAsync_ShouldDelegateToMapper()
    {
        var target = ClientContentMapping.Create(mapper.Object, isFinalType: false);
        var foo = Mock.Of<IFoo>();
        var clientFoo = new ClientFoo();
        var ctx = Mock.Of<IClientContentContext>();
        var mapTask = Task.FromResult(123);
        mapper.Setup(m => m.MapAsync(foo, clientFoo, ctx)).Returns(mapTask);

        var resultTask = target.MapAsync(foo, clientFoo, ctx); // Act

        resultTask.Should().BeSameAs(mapTask);
    }
}
