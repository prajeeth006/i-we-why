using System.Net.Http;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.Account.ValidateEmailVerificationCode;

internal interface IValidateEmailVerificationCodeServiceClient
{
    Task ValidateEmailVerificationCodeAsync(ExecutionMode mode, string code);
}

internal sealed class ValidateEmailVerificationCodeServiceClient(IPosApiRestClient restClient) : IValidateEmailVerificationCodeServiceClient
{
    public Task ValidateEmailVerificationCodeAsync(ExecutionMode mode, string code)
        => restClient.ExecuteAsync(mode, new PosApiRestRequest(PosApiEndpoint.Account.ValidateEmailVerificationCode)
        {
            Content = new ValidateEmailVerificationCodeRequest
            {
                EncryptedCode = code,
            },
            Method = HttpMethod.Post,
        });
}
