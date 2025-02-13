using System;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Frontend.Vanilla.Configuration.DynaCon.Reporting.PartialReporters;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Testing.FluentAssertions;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Reporting.PartialReporters;

public class VariationContextReporterTests : PartialConfigurationReporterTestsBase
{
    private Mock<IDynamicVariationContextResolver> dynamicContextResolver;

    internal override void Setup(out Func<DynaConEngineSettings, IPartialConfigurationReporter> getTarget)
    {
        var staticContext = new StaticVariationContext(("label", "bwin.com"), ("env", "cern"));
        dynamicContextResolver = new Mock<IDynamicVariationContextResolver>();
        getTarget = s => new VariationContextReporter(staticContext, dynamicContextResolver.Object);
    }

    [Fact]
    public void ShouldResolveContext()
    {
        var ex = new Exception("Oups");
        var changeset = Snapshot.Object.ActiveChangeset;
        dynamicContextResolver.SetupGet(r => r.ProviderNames).Returns(new TrimmedRequiredString[] { "Success 1", "Failed", "Success 2" });
        dynamicContextResolver.Setup(r => r.Resolve("Success 1", changeset)).Returns("Value 1");
        dynamicContextResolver.Setup(r => r.Resolve("Failed", changeset)).Throws(ex);
        dynamicContextResolver.Setup(r => r.Resolve("Success 2", changeset)).Returns("Value 2");

        FillReport(); // Act

        Report.VariationContextForThisRequest.Should().HaveCount(5)
            .And.Contain("Success 1", "Value 1")
            .And.Contain("Success 2", "Value 2")
            .And.Contain("label", "bwin.com")
            .And.Contain("env", "cern")
            .And.ContainKey("Failed")
            .WhoseValue.Value.Should().ContainAll(typeof(VariationContextReporter.EvaluationException), ex);
    }
}
