using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.TestWeb.Features.ClientConfigProviders;

public class PublicPageClientConfigurationProvider(IContentService contentService) : LambdaClientConfigProvider("m2PlaygroundPublicPages", async cancellationToken =>
    (await contentService.GetChildrenAsync<IPMBasePage>(PlaygroundPlugin.ContentRoot + "/PublicPages",
        cancellationToken))
    .Select(p => new TestPageInfo
    {
        Url = "en/p/" + p.Metadata.Id.ItemName,
        Title = p.PageTitle.WhiteSpaceToNull() ?? p.Metadata.Id.ItemName,
        Description = p.PageDescription,
    }))
{
    public class TestPageInfo
    {
        public string Url { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
    }
}
