using FluentAssertions;
using Frontend.Vanilla.Testing.FluentAssertions;
using Newtonsoft.Json;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.AcceptanceTests;

public class SerializationAcceptanceTests : AcceptanceTestsBase
{
    [Fact]
    public void ShouldDeserializeFromString_AndSerializeToDiagnosticInfo()
    {
        var settings = new JsonSerializerSettings { Converters = { JsonConverter } };

        // Act 1
        var expr = JsonConvert.DeserializeObject<IDslExpression<decimal>>("'User.  VisitCount'", settings);

        UserDslProvider.Setup(p => p.GetVisitCount()).Returns(66);
        expr.Evaluate().Should().Be(66m);

        // Act 2
        var json = JsonConvert.SerializeObject(expr);

        json.Should().BeJson(@"{
                OriginalExpression: 'User.  VisitCount',
                ActualOptimizedExpression: 'User.VisitCount',
                ResultType: 'System.Decimal'
            }");
    }
}
