using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Client.Mappers;
using Frontend.Vanilla.Content.Model;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Client.Mappers;

public class ClientPMBasePageMapperTests : ClientContentMapperTestsBase<IPMBasePage, ClientPMBasePage>
{
    [Fact]
    public async Task MapAsyncTest()
    {
        SourceDoc.SetupGet(s => s.Metadata.TemplateName).Returns("pmTest");
        SourceDoc.SetupGet(s => s.PageClass).Returns("ui-pm-test");
        SourceDoc.SetupGet(s => s.PageId).Returns("pmTestId");
        SourceDoc.SetupGet(s => s.PageTitle).Returns("Test Page");
        SourceDoc.SetupGet(s => s.PageDescription).Returns("This is a test page.");
        var pageMetaTags = SetupOptionalCollection(s => s.PageMetaTags);
        var parameters = SetupOptionalCollection(s => s.Parameters);

        await RunTest(new ClientPmBasePageMapper());

        TargetDoc.TemplateName.Should().Be("pmTest");
        TargetDoc.PageClass.Should().Be("client: ui-pm-test");
        TargetDoc.PageId.Should().Be("client: pmTestId");
        TargetDoc.PageTitle.Should().Be("client: Test Page");
        TargetDoc.PageDescription.Should().Be("client: This is a test page.");
        TargetDoc.PageMetaTags.Should().BeSameAs(pageMetaTags);
        TargetDoc.Parameters.Should().BeSameAs(parameters);
    }
}
