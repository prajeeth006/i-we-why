using System.Runtime.CompilerServices;

// Required by Moq and Castle.Core in order to mock/create internals
[assembly: InternalsVisibleTo("DynamicProxyGenAssembly2")]
[assembly: InternalsVisibleTo("Frontend.Vanilla.RoslynProxy")]

// Expose internals within Vanilla, don't make them public to keep flexibility to change anytime without breaking changes, ordered alphabetically
[assembly: InternalsVisibleTo("Frontend.Vanilla.Caching.Hekaton")]
[assembly: InternalsVisibleTo("Frontend.Vanilla.Caching.Hekaton.Tests")]
[assembly: InternalsVisibleTo("Frontend.Vanilla.Store")]
[assembly: InternalsVisibleTo("Frontend.Vanilla.Store.Tests")]
[assembly: InternalsVisibleTo("Frontend.Vanilla.Configuration.DynaCon")]
[assembly: InternalsVisibleTo("Frontend.Vanilla.Configuration.DynaCon.Tests")]
[assembly: InternalsVisibleTo("Frontend.Vanilla.Content")]
[assembly: InternalsVisibleTo("Frontend.Vanilla.Content.Tests")]
[assembly: InternalsVisibleTo("Frontend.Vanilla.Core")]
[assembly: InternalsVisibleTo("Frontend.Vanilla.Core.Tests")]
[assembly: InternalsVisibleTo("Frontend.Vanilla.DomainSpecificLanguage")]
[assembly: InternalsVisibleTo("Frontend.Vanilla.DomainSpecificLanguage.Tests")]
[assembly: InternalsVisibleTo("Frontend.Vanilla.ServiceClients")]
[assembly: InternalsVisibleTo("Frontend.Vanilla.ServiceClients.Tests")]
[assembly: InternalsVisibleTo("Frontend.Vanilla.Features")]
[assembly: InternalsVisibleTo("Frontend.Vanilla.Features.Tests")]
[assembly: InternalsVisibleTo("Frontend.Vanilla.Testing")]
[assembly: InternalsVisibleTo("Frontend.Vanilla.Content.SitecoreTemplateGenerator")]
[assembly: InternalsVisibleTo("Frontend.Vanilla.RestMocks")]
[assembly: InternalsVisibleTo("Frontend.SharedFeatures.Api")]
[assembly: InternalsVisibleTo("Frontend.SharedFeatures.Api.Tests")]
[assembly: InternalsVisibleTo("Frontend.Host")]
[assembly: InternalsVisibleTo("Frontend.Host.Tests")]
[assembly: InternalsVisibleTo("Frontend.Host.App")]
[assembly: InternalsVisibleTo("Frontend.Vanilla.IntegrationTests")]

// Exposed for easier testing in TestWeb
[assembly: InternalsVisibleTo("Frontend.TestWeb")]
[assembly: InternalsVisibleTo("Frontend.TestWeb.Host")]
