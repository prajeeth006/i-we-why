using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Infrastructure.GenericServiceClients;

public class FreshUserDataServiceClientTests : ServiceClientTestsBase
{
    private IFreshUserDataServiceClient<IFoo> target;
    private static readonly PathRelativeUri TestUrl = new PathRelativeUri("test");

    protected override void Setup()
        => target = new TestServiceClient(RestClient.Object);

    internal class TestServiceClient : FreshUserDataServiceClient<IFooDto, IFoo>
    {
        public TestServiceClient(IPosApiRestClient restClient)
            : base(restClient) { }

        public override PathRelativeUri DataUrl => TestUrl;
    }

    public interface IFoo { }

    internal interface IFooDto : IPosApiResponse<IFoo> { }

    [Fact]
    public async Task GetAsync_ShouldGetFromDataUrl()
    {
        var foo = Mock.Of<IFoo>();
        RestClientResult = Mock.Of<IFooDto>(d => d.GetData() == foo);

        // Act
        var result = await target.GetAsync(TestMode);

        result.Should().BeSameAs(foo);
        VerifyRestClient_ExecuteAsync(TestUrl.ToString(), authenticate: true, resultType: typeof(IFooDto));
    }
}
