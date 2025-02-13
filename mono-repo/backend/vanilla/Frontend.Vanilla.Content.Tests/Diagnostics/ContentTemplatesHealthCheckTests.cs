using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Diagnostics;
using Frontend.Vanilla.Content.Templates;
using Frontend.Vanilla.Content.Templates.DataSources;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Moq.Language.Flow;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Diagnostics;

public class ContentTemplatesHealthCheckTests
{
    private IHealthCheck target;
    private Mock<IReflectionTemplatesSource> reflectionTemplatesSource;
    private Mock<ISitecoreServiceTemplatesSource> sitecoreServiceTemplatesSource;
    private Mock<IContentTemplatesComparer> comparer;

    private CancellationToken ct;
    private IReadOnlyList<SitecoreTemplate> sitecoreTemplates;
    private IReadOnlyList<SitecoreTemplate> localTemplates;

    public ContentTemplatesHealthCheckTests()
    {
        reflectionTemplatesSource = new Mock<IReflectionTemplatesSource>();
        sitecoreServiceTemplatesSource = new Mock<ISitecoreServiceTemplatesSource>();
        comparer = new Mock<IContentTemplatesComparer>();
        target = new ContentTemplatesHealthCheck(reflectionTemplatesSource.Object, sitecoreServiceTemplatesSource.Object, comparer.Object);

        ct = TestCancellationToken.Get();
        sitecoreTemplates = new[] { new SitecoreTemplate("Template1", "Source1", Array.Empty<SitecoreTemplate>(), Array.Empty<SitecoreTemplateField>()) };
        localTemplates = new[] { new SitecoreTemplate("Template2", "Source2", Array.Empty<SitecoreTemplate>(), Array.Empty<SitecoreTemplateField>()) };

        SetupSitecoreTemplates().ReturnsAsync(sitecoreTemplates);
        reflectionTemplatesSource.SetupGet(s => s.Templates).Returns(localTemplates);
        SetupTemplateComparison((false, "Warn 1"), (false, "Warn 2"));
    }

    private IReturnsThrows<ISitecoreServiceTemplatesSource, Task<IReadOnlyList<SitecoreTemplate>>> SetupSitecoreTemplates()
        => sitecoreServiceTemplatesSource.Setup(s => s.GetTemplatesAsync(ExecutionMode.Async(ct), It.IsNotNull<Action<string>>(), false))
            .Callback<ExecutionMode, Action<string>, bool>((m, t, v) => t("Trace Msg"));

    private void SetupTemplateComparison(params (bool, string)[] differences)
        => comparer.Setup(c => c.Compare(localTemplates, sitecoreTemplates)).Returns(differences);

    [Fact]
    public void Metadata_ShouldReturnValidObject()
        => target.Metadata.Should().NotBeNull().And.BeSameAs(target.Metadata, "should be singleton");

    [Fact]
    public async Task ShouldPass_IfNoCriticalDifferences()
        => await RunAndExpect(error: null);

    private async Task RunAndExpect(string[] error)
    {
        var result = await target.ExecuteAsync(ct); // Act

        ((IEnumerable<string>)result.Error).Should().Equal(error);
        dynamic details = result.Details;
        ((IEnumerable<string>)details.SitecoreServiceTrace).Should().Equal("Trace Msg");
        ((IEnumerable<string>)details.Warnings).Should().Equal("Warn 1", "Warn 2");
    }

    [Fact]
    public async Task ShouldFail_IfSitecoreFails()
    {
        var ex = new Exception("Sitecore error");
        SetupSitecoreTemplates().ThrowsAsync(ex);

        var result = await target.ExecuteAsync(ct); // Act

        result.Error.Should().BeSameAs(ex);
        ((IEnumerable<string>)result.Details).Should().Equal("Trace Msg");
    }

    [Fact]
    public async Task ShouldFail_IfCriticalDifferences()
    {
        SetupTemplateComparison((true, "Error 1"), (false, "Warn 1"), (true, "Error 2"), (false, "Warn 2"));

        await RunAndExpect(new[] { "Error 1", "Error 2" }); // Act
    }
}
