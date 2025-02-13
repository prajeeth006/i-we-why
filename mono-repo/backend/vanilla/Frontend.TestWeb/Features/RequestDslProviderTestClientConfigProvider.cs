using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.TestWeb.Features;

public class RequestDslProviderTestData(IRequestDslProvider requestDslProvider, IQueryStringDslProvider queryStringDslProvider)
{
    public string RequestAbsoluteUri { get; } = requestDslProvider.AbsoluteUri;
    public string QueryStringTest { get; } = queryStringDslProvider.Get("test");
}

public class RequestDslProviderTestClientConfigProvider(Func<RequestDslProviderTestData> getTestData)
    : LambdaClientConfigProvider("requestDslProviderTestData", getTestData) { }
