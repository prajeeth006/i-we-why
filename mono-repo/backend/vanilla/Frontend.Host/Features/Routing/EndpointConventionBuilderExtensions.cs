using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Builder;

namespace Frontend.Host.Features.Routing;

/// <summary>Convenient endpoint enrichment methods.</summary>
public static class EndpointConventionBuilderExtensions
{
    /// <summary>Specifies that route is used for serving of Public Pages.</summary>
    public static TBuilder ServesPublicPages<TBuilder>(this TBuilder builder, string path)
        where TBuilder : IEndpointConventionBuilder
    {
        builder.Add(endpointBuilder => { endpointBuilder.Metadata.Add(new ServesPublicPagesAttribute(path)); });

        return builder;
    }

    /// <summary>Specifies that route is serving html document.</summary>
    public static TBuilder ServesHtmlDocument<TBuilder>(this TBuilder builder)
        where TBuilder : IEndpointConventionBuilder
    {
        builder.Add(endpointBuilder => { endpointBuilder.Metadata.Add(new ServesHtmlDocumentAttribute()); });

        return builder;
    }
}
