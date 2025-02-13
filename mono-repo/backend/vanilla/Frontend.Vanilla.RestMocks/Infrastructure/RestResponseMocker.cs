using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.Diagnostics.Tracing;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.RestMocks.Infrastructure;

internal sealed class RestResponseMocker
{
    private readonly IReadOnlyList<RestMock> mocks;
    private readonly ITracingIdsProvider tracingIdsProvider;
    private readonly IHttpContextAccessor httpContextAccessor;
    private readonly ICookieHandler cookieHandler;

    public RestResponseMocker(
        IEnumerable<IRestMocker> mockers,
        ITracingIdsProvider tracingIdsProvider,
        IHttpContextAccessor httpContextAccessor,
        ICookieHandler cookieHandler)
    {
        mocks = mockers.SelectMany(m => m.GetMocks()).ToList();
        this.tracingIdsProvider = tracingIdsProvider;
        this.httpContextAccessor = httpContextAccessor;
        this.cookieHandler = cookieHandler;
    }

    internal RestResponse TryMockResponse(RestRequest request)
    {
        var context = new RestMockDelegateContext(httpContextAccessor.HttpContext, cookieHandler, request);
        var mockedResponse = mocks
            .Where(m => m.MatchIncomingRequestToThisApp(context) && m.MatchOutgoingRequestFromThisApp(context))
            .Select(m => m.GetMockedResponse(context))
            .LastOrDefault(); // One added last -> prevails

        if (mockedResponse == null && RestMocker.IsGoingToPosApi(request))
        {
            var ex = new Exception($"Failed request to {request.Url} Did you miss a mock?");

            // HttpContext.Current?.AddError(ex); // Add directly -> can't be caught -> fail fast
            throw ex;
        }

        RestLog.Add(httpContextAccessor.HttpContext, request, mockedResponse, tracingIdsProvider.GetTracingIds().CorrelationId);

        return mockedResponse;
    }
}
