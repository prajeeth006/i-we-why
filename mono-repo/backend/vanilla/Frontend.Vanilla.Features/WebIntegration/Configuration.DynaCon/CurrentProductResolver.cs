using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.WebIntegration.Core.Labels;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;

/// <summary>
/// Resolver current product based on host path and fallback to DynaCon product in case header absent.
/// </summary>
internal interface ICurrentProductResolver
{
    /// <summary>
    /// Current hosting Product (legacy, should be deleted once single domain migration is done) specific for non single domain.
    /// </summary>
    TrimmedRequiredString ProductLegacy { get; }

    /// <summary>
    /// Current hosting Product resolved correctly for single domain.
    /// </summary>
    TrimmedRequiredString Product { get; }
}

internal sealed class CurrentProductResolver(IDynaConParameterExtractor dynaConParameterExtractor, ISingleDomainHostPathResolver singleDomainHostPathResolver, IHttpContextAccessor httpContextAccessor)
    : ICurrentProductResolver
{
    public const string HostAppProduct = "host-app";

    public TrimmedRequiredString ProductLegacy
    {
        get
        {
            var product = httpContextAccessor.HttpContext?.Request.Headers[HttpHeaders.XFromProduct].ToString();

            return product.IsNullOrEmpty() ? dynaConParameterExtractor.Product : product;
        }
    }

    public TrimmedRequiredString Product
    {
        get
        {
            var httpContext = httpContextAccessor.HttpContext;
            if (httpContext is null)
                return dynaConParameterExtractor.Product;

            var fromProduct = httpContext.Request.Headers[HttpHeaders.XFromProduct].ToString();
            if (fromProduct != HostAppProduct && dynaConParameterExtractor.Product != HostAppProduct) // TODO: remove when single domain migration is over
                return fromProduct.IsNullOrEmpty() ? dynaConParameterExtractor.Product : fromProduct;

            return singleDomainHostPathResolver.ResolveProduct(httpContext);
        }
    }
}
