#nullable enable

using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Common.SecurityQuestions;

internal interface ISecurityQuestionsServiceClient
{
    Task<IReadOnlyList<SecurityQuestion>> GetAsync(ExecutionMode mode);
}

internal class SecurityQuestionsServiceClient(IGetDataServiceClient getDataServiceClient) : ISecurityQuestionsServiceClient
{
    public Task<IReadOnlyList<SecurityQuestion>> GetAsync(ExecutionMode mode)
    {
        var url = new UriBuilder()
            .AppendPathSegment(PosApiServiceNames.CommonData)
            .AppendPathSegment("SecurityQuestions")
            .AppendTrailingSlash() // According to PosAPI contract
            .AddQueryParameters(("lang", CultureInfo.CurrentCulture.Name))
            .GetRelativeUri();

        return getDataServiceClient.GetAsync<SecurityQuestionResponse, IReadOnlyList<SecurityQuestion>>(mode, PosApiDataType.Static, url);
    }
}
