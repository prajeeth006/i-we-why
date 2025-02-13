using System.Linq;
using System.Net.Http;
using FluentAssertions;
using Frontend.Vanilla.Features.Diagnostics.HealthPages.Api;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Diagnostics.HealthPages.Api;

public class DiagnosticApiRoutesProviderTests
{
    private IDiagnosticApiRoutesProvider target;
    private Mock<IDiagnosticApiController> controller1;
    private Mock<IDiagnosticApiController> controller2;
    private Mock<IDiagnosticApiControllerExecutor> executor;

    public DiagnosticApiRoutesProviderTests()
    {
        controller1 = new Mock<IDiagnosticApiController>();
        controller2 = new Mock<IDiagnosticApiController>();
        executor = new Mock<IDiagnosticApiControllerExecutor>();
        target = new DiagnosticApiRoutesProvider(new[] { controller1.Object, controller2.Object }, executor.Object);
    }

    [Fact]
    public void ShouldListAllRoutes()
    {
        controller1.Setup(c => c.GetRoute()).Returns(new DiagnosticsRoute(HttpMethod.Get, "/api/data/{id}"));
        controller2.Setup(c => c.GetRoute()).Returns(new DiagnosticsRoute(HttpMethod.Post, "/api/{first}/{second?}/{third?}"));

        // Act
        var routes = target.GetRoutes().ToList();

        routes.Should().HaveCount(4);
        routes[0].UrlPattern.Should().Be("/api/data/{id}");
        routes[0].HttpMethods.Should().Equal("GET");
        routes[1].UrlPattern.Should().Be("/api/{first}");
        routes[1].HttpMethods.Should().Equal("POST");
        routes[2].UrlPattern.Should().Be("/api/{first}/{second}");
        routes[2].HttpMethods.Should().Equal("POST");
        routes[3].UrlPattern.Should().Be("/api/{first}/{second}/{third}");
        routes[3].HttpMethods.Should().Equal("POST");

        executor.VerifyNoOtherCalls();
        VerifyExecuteFunc(0, controller1);
        VerifyExecuteFunc(1, controller2);
        VerifyExecuteFunc(2, controller2);
        VerifyExecuteFunc(3, controller2);

        void VerifyExecuteFunc(int i, Mock<IDiagnosticApiController> ctrl)
        {
            routes[i].ExecuteAsync();
            executor.Verify(e => e.ExecuteAsync(ctrl.Object));
            executor.VerifyNoOtherCalls();
        }
    }
}
