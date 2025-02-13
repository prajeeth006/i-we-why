using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Account.Password;

internal sealed class PasswordValidation(bool validationRequired = false) : IPosApiResponse<PasswordValidation>
{
    public bool ValidationRequired { get; } = validationRequired;

    PasswordValidation IPosApiResponse<PasswordValidation>.GetData() => this;
}
