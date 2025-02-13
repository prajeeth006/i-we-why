using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Account.Password;

internal interface IPasswordServiceClient : IFreshUserDataServiceClient<PasswordValidation> { }

internal sealed class PasswordServiceClient(IPosApiRestClient restClient)
    : FreshUserDataServiceClient<PasswordValidation, PasswordValidation>(restClient), IPasswordServiceClient
{
    public override PathRelativeUri DataUrl => PosApiEndpoint.Account.PasswordValidationRequired;
}
